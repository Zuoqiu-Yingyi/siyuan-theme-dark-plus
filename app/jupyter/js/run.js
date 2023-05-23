import {
    jupyter,
    queryBlock,
    getBlockAttrs,
    setBlockAttrs,
    insertBlock,
    appendBlock,
    updateBlock,
} from './api.js';
import {
    config,
    i18n,
} from './config.js';
import {
    custom,
    loadCustomJson,
} from './../../public/custom.js';
import {
    Queue,
    Output,
    timestampFormat,
    promptFormat,
    parseText,
    parseData,
    markdown2kramdown,
    workerInit,
} from './utils.js';

self.handlers = {
    setLang, // 设置语言
    getConf, // 获取配置
    runCell, // 运行单元格
    runCells, // 运行多个单元格
    restartKernel, // 重启内核
    closeConnection, // 关闭连接
    reloadCustomJson, // 重新加载配置
};

var lang;
var websockets = {
    // doc_id: { // 文档 ID
    //     ws: WebSocket, // WebSocket 对象
    //     kernel: {
    //         id: kernel_id, // 内核 ID
    //         name: kernel_name, // 内核名称
    //         language: kernel_language, // 内核语言
    //     },
    //     session: session_id, // 会话 ID
    //     username: username, // 工作空间用户名
    //     version: version, // 版本
    //     index: 0, // 索引
    //     messages: { // 消息集合
    //         msg_id: { // 消息 ID
    //             doc: doc_id, // 文档块 ID
    //             code: code_id, // 代码块 ID
    //             output: output_id, // 输出块 ID
    //             current: {
    //                 id: id, // 当前块 ID
    //                 markdown: markdown, // 当前内容
    //             },
    //             params: {
    //                 escaped: boolean, // 是否转义输出结果
    //                 cntrl: boolean, // 是否解析控制字符
    //             },
    //             index: int, // 消息序号
    //         },
    //     },
    //     flag: false, // 是否有待处理消息
    //     queue: new Queue(), // 接收的消息队列
    // },
};

/* 回复消息处理 */
async function messageHandle(msg_id, msg_type, message, websocket) {
    const message_info = websocket.messages[msg_id];
    let markdown; // 需要输出的消息
    let ial = {}; // 需要输出的 IAL
    if (!message_info) return;
    switch (msg_type) {
        case "status": // 状态信息
            {
                /* 更新内核状态 */
                const execution_state = message.content.execution_state;
                const doc_attrs = {
                    [config.jupyter.attrs.other.prompt]: promptFormat(
                        websocket.kernel.language,
                        websocket.kernel.display_name,
                        i18n(execution_state, lang),
                    )
                };
                await setBlockAttrs(message_info.doc, doc_attrs);

                /* 更新块序号状态与启动时间 */
                switch (execution_state) {
                    case 'busy':
                        {
                            const date = new Date(message.header.date);
                            const code_attrs = {
                                [config.jupyter.attrs.code.index]: '*',
                                [config.jupyter.attrs.code.time]: `${i18n('start', lang)}: ${date.format('yyyy-MM-dd hh:mm:ss')}`,
                            };
                            const output_attrs = { [config.jupyter.attrs.output.index]: '*' };

                            await setBlockAttrs(message_info.code, code_attrs);
                            await setBlockAttrs(message_info.output, output_attrs);
                        }
                        break;
                    case 'idle':
                        markdown = '---'; // 末尾分割线
                        break;
                    default:
                        break;
                }
            }
            break;
        case "stream": // 代码输出文本信息
            {
                const type = message.content.name;
                const text = message.content.text;
                switch (type) {
                    case "stdout":
                        break;
                    case "stderr":
                        ial.style = config.jupyter.style.error;
                        break;
                    default:
                        ial.style = config.jupyter.style.warning;
                        break;
                }
                markdown = text;
            }
            break;
        case "execute_result": // 代码运行结果
        case "display_data": // 代码输出展示信息
            {
                const data = message.content.data;
                markdown = await parseData(data, message_info.params);
            }
            break;
        case "error": // 代码输出错误信息
            {
                // const ename = message.content.ename;
                // const evalue = message.content.evalue;
                const traceback = message.content.traceback;
                let markdowns = [];

                /* 使用超级块显示堆栈信息 */
                markdowns.push('{{{row');
                markdowns.push(parseText(traceback.join('\n'), message_info.params));
                markdowns.push('}}}');
                markdown = markdowns.join('\n');
                ial.style = config.jupyter.style.error;
            }
            break;
        case "execute_input": // 代码输入信息\
            // /* 调整至 status 消息解析处 */
            // {
            //     /* 更新块序号状态与启动时间 */
            //     const date = new Date(message.header.date);
            //     let code_attrs = {
            //         [config.jupyter.attrs.code.index]: '*',
            //         [config.jupyter.attrs.code.time]: `${i18n('start', lang)}: ${date.format('yyyy-MM-dd hh:mm:ss')}`,
            //     };
            //     let output_attrs = { [config.jupyter.attrs.output.index]: '*' };

            //     await setBlockAttrs(message_info.code, code_attrs);
            //     await setBlockAttrs(message_info.output, output_attrs);
            // }
            break;
        case "input_request": // 需要输入信息
            break;
        case "execute_reply": // 运行结果信息
            {
                const status = message.content.status ?? message.metadata.status;
                const payloads = message.content.payload;

                let markdowns = [];
                if (payloads) {
                    /* 解析运行结果文本 */
                    for (const payload of payloads) {
                        const data = payload.data;
                        const text = await parseData(data, message_info.params);
                        if (text) markdowns.push(text);
                    }
                }
                let code_index = `${message_info.index}`;
                let output_index, output_style;
                switch (status) {
                    case 'ok': // 成功
                        output_index = code_index;
                        break;
                    case 'error': // 错误
                        output_index = 'E';
                        output_style = config.jupyter.style.error;

                        /* 使用代码块显示堆栈信息 */
                        const traceback = message.content.traceback;
                        markdowns.push('```plaintext');
                        markdowns.push(new Output(traceback.join('\n')).removeCmdControlChars().toString());
                        markdowns.push('```');
                        markdowns.push(`{: style="${config.jupyter.style.error}"}`);
                        markdowns.join('\n');
                        break;
                    default:
                        break;
                }

                /* 更新块序号状态与执行时间 */
                const started = new Date(message?.metadata?.started ?? message.parent_header.date);
                const stoped = new Date(message.header.date);

                const code_attrs = {
                    [config.jupyter.attrs.code.index]: code_index,
                    [config.jupyter.attrs.code.time]: `${i18n('start', lang)}: ${started.format('yyyy-MM-dd hh:mm:ss')} | ${i18n('runtime', lang)}: ${timestampFormat(stoped - started)}`,
                };
                const output_attrs = {
                    [config.jupyter.attrs.output.index]: output_index,
                    // style: output_style,
                };

                await setBlockAttrs(message_info.code, code_attrs);
                await setBlockAttrs(message_info.output, output_attrs);

                // markdowns.push('---');
                markdown = markdowns.join('\n');
            }
            break;
        case "kernel_info_reply": // 内核信息
        case "history_reply": // 历史指令信息
        case "debug_reply": // 调试信息
        default:
            break;
    }

    /* 如果存在需要输出的消息 */
    if (markdown) {
        let response; // 响应
        if (msg_type === 'stream') { // 输出流
            if (markdown.indexOf('\r') >= 0 || markdown.indexOf('\b') >= 0) { // 编辑原块
                if (message_info.current?.id) { // 有上一个块
                    /* 更新原块内容 */
                    markdown = new Output(markdown)
                        .parseControlChars(message_info.current.markdown) // 解析控制字符
                        .toString();

                    if (/^\s*$/.test(markdown)) { // 更新的都是空白字符
                        /* 删除原块 */
                        // await deleteBlock(message_info.current.id);
                        // message_info.current = null;
                        // return;

                        /* 更新为空块 */
                        markdown = '';
                    }

                    let blocks = markdown.split('\n\n'); // 分割块

                    /* 更新原块 */
                    response = await updateBlock(
                        message_info.current.id,
                        markdown2kramdown(
                            parseText(blocks[0], message_info.params),
                            blocks.length > 1
                                ? null
                                : ial,
                        ),
                    );

                    /* 插入剩余块(若有) */
                    for (let i = 1; i < blocks.length; ++i) {
                        markdown = blocks[i];
                        response = await appendBlock(
                            message_info.output,
                            markdown2kramdown(parseText(blocks[i], message_info.params), ial),
                        );
                    }
                }
                else { // 没有上一个块
                    markdown = new Output(markdown)
                        .parseControlChars() // 解析控制字符
                        .toString();
                    /* 插入块 */
                    response = await appendBlock(
                        message_info.output,
                        markdown2kramdown(parseText(markdown, message_info.params), ial),
                    );
                }
            }
            else { // 生成新块
                /* 插入块 */
                response = await appendBlock(
                    message_info.output,
                    markdown2kramdown(parseText(markdown, message_info.params), ial),
                );
            }
        }
        else { // 非输出流
            response = await appendBlock(
                message_info.output,
                markdown2kramdown(markdown, ial),
            );
        }

        /* 更新当前块信息 */
        if (/\n\s*$/.test(markdown)) { // 若以换行为结尾
            message_info.current = null; // 当前块结束
        }
        else { // 若不以换行为结尾
            message_info.current = { // 当前块可继续处理
                id: response?.[0]?.doOperations?.[0]?.id,
                markdown: markdown,
            };
        }
    }
}

/**
 * 创建发送消息
 * REF https://ipython.org/ipython-doc/stable/development/messaging.html
 */
function createSendMessage(
    code,
    session_id,
    username = null,
    version = null,
    msg_id = crypto.randomUUID(),
    date = (new Date()).toISOString(),
) {
    return { // SEND 请求运行代码
        buffers: [],
        channel: "shell",
        content: {
            silent: false,
            store_history: false,
            user_expressions: {},
            allow_stdin: true,
            stop_on_error: true,
            code: code,
        },
        header: {
            date: date,
            msg_id: msg_id,
            msg_type: "execute_request",
            session: session_id,
            username: username || "",
            version: version || "5.3",
        },
        metadata: {},
        parent_header: {},
    };
}

/* 设置语言 */
function setLang(l) {
    lang = l;
}

/* 获得 jupyter 配置项 */
function getConf() {
    return config;
}

/* 关闭当前活动连接 */
async function closeConnection(e, doc_id, params) {
    websockets?.[doc_id]?.ws?.close();
}

/* 重启内核 */
async function restartKernel(e, doc_id, params) {
    /* 关闭当前会话 */
    await closeConnection(e, doc_id, params);

    /* 获得文档块的块属性 */
    const doc_attrs = await getBlockAttrs(doc_id);
    if (!doc_attrs) return;

    const kernel_id = doc_attrs[config.jupyter.attrs.kernel.id];
    const kernel = await jupyter.kernels.restart(kernel_id);
    if (kernel) {
        await setBlockAttrs(doc_id, {
            [config.jupyter.attrs.other.prompt]: promptFormat(
                doc_attrs[config.jupyter.attrs.kernel.language],
                doc_attrs[config.jupyter.attrs.kernel.display_name],
                i18n(kernel?.execution_state, lang),
            ),
        }); // 更新文档块的属性
    }
}

/* 运行代码单元格 */
async function runCell(e, code_id, params, opened = null) {
    /* 获得代码块 */
    let code_block, output_block;
    code_block = await queryBlock(code_id);
    if (code_block.length === 0) return;
    else code_block = code_block[0];

    /* 获得文档 ID */
    const doc_id = code_block.root_id;

    /* 获得代码块的块属性 */
    let code_attrs = await getBlockAttrs(code_id);
    if (!code_attrs) return;

    /* 获得代码块所在文档块的块属性 */
    const doc_attrs = await getBlockAttrs(doc_id);
    if (!doc_attrs) return;

    /* 获得 jupyter 服务的 URL */
    const url = new URL(custom.jupyter.server);

    /* 获得 websocket 链接 */
    let websocket;

    /* 运行 */
    const run = async () => {
        // 从代码块的属性中获得输出块 ID
        let output_id = code_attrs[config.jupyter.attrs.code.output];
        if (output_id) output_block = await queryBlock(output_id);
        if (output_block && output_block.length > 0) {
            // 查询到输出块
            await updateBlock(output_id, `${config.jupyter.output.init}\n${output_block[0].ial}`);
        }
        else {
            // 没有查询到输出块, 在代码块后插入一个超级块
            let ials = [];
            const attrs = config.jupyter.output.attrs
            for (const attr in attrs) {
                if (attrs[attr]) ials.push(`${attr}="${attrs[attr]}"`);
            }
            const response = await insertBlock(code_id, `${config.jupyter.output.init}\n{: ${ials.join(' ')}}`);

            /* 获得超级块的块 ID */
            if (response) output_id = response[0].doOperations[0].id;
            else return;
        }
        let output_attrs = await getBlockAttrs(output_id); // 获得输出块的属性
        if (!output_attrs) return;

        /* 只更新部分属性 */
        code_attrs = {}, output_attrs = {};

        /* 设置块序号 */
        websocket.index++; // 更新消息序号
        // const index = String(websocket.index);
        const index = '*';
        code_attrs[config.jupyter.attrs.code.index] = index;
        output_attrs[config.jupyter.attrs.output.index] = index;

        /* 关联代码块与输出块 */
        code_attrs[config.jupyter.attrs.code.output] = output_id;
        output_attrs[config.jupyter.attrs.output.code] = code_id;

        /* 设置块类型 */
        code_attrs[config.jupyter.attrs.code.type.key] = config.jupyter.attrs.code.type.value;
        output_attrs[config.jupyter.attrs.output.type.key] = config.jupyter.attrs.output.type.value;

        const msg_id = crypto.randomUUID(); // 消息 ID
        websocket.messages[msg_id] = { // 将消息 ID 与输入输出块关联
            doc: doc_id,
            code: code_id,
            output: output_id,
            params: params,
            index: websocket.index,
        };
        const message = JSON.stringify(createSendMessage( // 创建消息
            code_block.content,
            doc_attrs[config.jupyter.attrs.session.id],
            websocket.username,
            websocket.version,
            msg_id,
        ));
        await setBlockAttrs(code_id, code_attrs); // 更新代码块的属性
        await setBlockAttrs(output_id, output_attrs); // 更新输出块的属性

        websocket.ws.send(message); // 发送消息
    }

    if (websockets?.[doc_id]?.ws?.readyState === WebSocket.OPEN) {
        websocket = websockets[doc_id];
        await run();
        if (typeof opened === 'function') opened(websocket);
    }
    else {
        // websockets?.[doc_id]?.ws?.close();

        const kernel_id = doc_attrs[config.jupyter.attrs.kernel.id];
        const kernel_name = doc_attrs[config.jupyter.attrs.kernel.name];
        const kernel_display_name = doc_attrs[config.jupyter.attrs.kernel.display_name];
        const kernel_language = doc_attrs[config.jupyter.attrs.kernel.language];
        const session_id = doc_attrs[config.jupyter.attrs.session.id];

        const ws = new URL(url);
        ws.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
        ws.pathname = `/api/kernels/${kernel_id}/channels`;
        ws.searchParams.set('session_id', session_id);
        if (custom.jupyter.token) ws.searchParams.set('token', custom.jupyter.token);

        websocket = {
            ws: new WebSocket(ws.href),
            kernel: {
                id: kernel_id,
                name: kernel_name,
                display_name: kernel_display_name,
                language: kernel_language,
            },
            session: session_id,
            version: null,
            index: 0,
            messages: {},
            flag: false,
            queue: new Queue(),
        };

        /** 消息队列处理
         *  REF [JavaScript 通过队列实现异步流控制 - 从过去穿越到现在 - 博客园](https://www.cnblogs.com/liaozhenting/p/8681527.html)
         */
        async function msgHandler() {
            websocket.flag = true;
            while (!websocket.queue.empty()) {
                const message = websocket.queue.dequeue().value;
                websocket.username = message.header.username;
                websocket.version = message.header.version;
                const msg_id = message.parent_header.msg_id;
                const msg_type = message.msg_type;
                await messageHandle(msg_id, msg_type, message, websocket);
            }
            websocket.flag = false;
        }
        websocket.ws.onmessage = e => {
            // REF [MessageEvent - Web API 接口参考 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/MessageEvent)
            // REF [JavaScript 通过队列实现异步流控制 - 从过去穿越到现在 - 博客园](https://www.cnblogs.com/liaozhenting/p/8681527.html)
            const data = JSON.parse(e.data);
            const index = parseInt(data.msg_id.substring(data.msg_id.lastIndexOf('_') + 0));
            websocket.queue.enqueue(data, index);
            if (!websocket.flag) msgHandler();
        };
        websocket.ws.onopen = async e => {
            console.log(e);
            await run();
            if (typeof opened === 'function') opened(websocket);
        };
        websocket.ws.onerror = async e => {
            console.warn(e);
            delete websockets[doc_id];
        };
        websocket.ws.onclose = async e => {
            console.log(e);
            delete websockets[doc_id];
        };
        websockets[doc_id] = websocket;
    }
}

/* 依次运行多个单元格 */
async function runCells(e, IDs, params) {
    const call = async i => {
        if (i < IDs.length) runCell(e, IDs[i], params, async _ => call(i + 1));
    };
    call(0);
}

/* 重新加载配置 */
async function reloadCustomJson(...args) {
    loadCustomJson();
}

workerInit(self); // 初始化工作线程
