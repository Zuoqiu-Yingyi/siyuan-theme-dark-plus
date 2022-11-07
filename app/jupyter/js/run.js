export {
    runCell, // 运行单元格
    restartKernel, // 重启内核
    closeConnection, // 关闭连接
}

import {
    jupyter,
    upload,
    queryBlock,
    getBlockAttrs,
    setBlockAttrs,
    insertBlock,
    appendBlock,
    updateBlock,
    deleteBlock,
} from './api.js';
import {
    config,
    i18n,
} from './config.js';
import { custom } from './../../public/custom.js';
import {
    Queue,
    Output,
    timestampFormat,
    base64ToBlob,
    promptFormat,
    parseText,
    markdown2kramdown,
} from './utils.js';

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

/* 加载样式 */
const style = document.getElementById(config.jupyter.id.siyuan.style.id) || document.createElement('link');
const lang = window.theme.languageMode;
style.id = config.jupyter.id.siyuan.style.id;
style.type = 'text/css';
style.rel = 'stylesheet';
style.href = config.jupyter.id.siyuan.style.href;
// document.head.appendChild(style);
document.getElementById('themeStyle').insertAdjacentElement("afterend", style);

/* 解析数据 */
async function parseData(data, params) {
    let file;
    const markdowns = new Queue();
    for (const mime in data) {
        // REF [Media Types](https://www.iana.org/assignments/media-types/media-types.xhtml)
        const main = mime.split('/')[0];
        const sub = mime.split('/')[1];
        const ext = sub.split('+')[0];
        const serialized = sub.split('+')[1];

        switch (main) {
            case 'text':
                switch (sub) {
                    case 'plain':
                        markdowns.enqueue(parseText(data[mime], params), 0);
                        break;
                    case 'html':
                        markdowns.enqueue(`<div>${data[mime]}</div>`, 1);
                        break;
                    case 'markdown':
                        markdowns.enqueue(data[mime], 1);
                        break;
                    default:
                        markdowns.enqueue(`\`\`\`${ext}\n${data[mime]}\n\`\`\``, 2);
                        break;
                }
                break;
            case 'image':
                switch (sub) {
                    case 'svg+xml':
                        file = Buffer.from(data[mime]).toString('base64');
                        break;
                    default:
                        file = data[mime].split('\n')[0];
                        break;
                }
                {
                    const title = data['text/plain'];
                    const filename = `jupyter-output.${ext}`;
                    const response = await upload(
                        base64ToBlob(file, mime),
                        undefined,
                        filename,
                    );
                    const filepath = response?.data?.succMap[filename];
                    if (filepath) markdowns.enqueue(`![${filename}](${filepath}${title ? ` "${title.replaceAll('"', '&quot;')}"` : ''})`, 3);
                }
                break;
            case 'audio':
                switch (sub) {
                    default:
                        file = data[mime].split('\n')[0];
                        break;
                }
                {
                    const filename = `jupyter-output.${ext}`;
                    const response = await upload(
                        base64ToBlob(file, mime),
                        undefined,
                        filename,
                    );
                    const filepath = response?.data?.succMap[filename];
                    if (filepath) markdowns.enqueue(`<audio controls="controls" src="${filepath}" data-src="${filepath}"></audio>`, 3);
                }
                break;
            case 'video':
                switch (sub) {
                    default:
                        file = data[mime].split('\n')[0];
                        break;
                }
                {
                    const filename = `jupyter-output.${ext}`;
                    const response = await upload(
                        base64ToBlob(file, mime),
                        undefined,
                        filename,
                    );
                    const filepath = response?.data?.succMap[filename];
                    if (filepath) markdowns.enqueue(`<video controls="controls" src="${filepath}" data-src="${filepath}"></video>`, 3);
                }
                break;
            case 'application':
                switch (sub) {
                    case 'json':
                        markdowns.enqueue(`\`\`\`json\n${JSON.stringify(data[mime], undefined, 4)}\n\`\`\``, 4);
                        break;
                    default:
                        markdowns.enqueue(parseText(`<${mime}>`, params), 4);
                        break;
                }
                break;
            default:
                markdowns.enqueue(parseText(`<${mime}>`, params), 4);
                break;
        }

    }
    return markdowns.items.map((item) => item.value).join('\n');
}

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
                        websocket.kernel.name,
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
                const status = message.metadata.status;
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

                let code_attrs = {
                    [config.jupyter.attrs.code.index]: code_index,
                    [config.jupyter.attrs.code.time]: `${i18n('start', lang)}: ${started.format('yyyy-MM-dd hh:mm:ss')} | ${i18n('runtime', lang)}: ${timestampFormat(stoped - started)}`,
                };
                let output_attrs = {
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
                    /* 删除原块 */
                    if (/^\r\s*$/.test(markdown)) {
                        await deleteBlock(message_info.current.id);
                        message_info.current = null;
                        return;
                    }
                    /* 更新原块 */
                    else {
                        /* 更新原块内容 */
                        markdown = new Output(markdown)
                            .parseControlChars(message_info.current.markdown) // 解析控制字符
                            .toString();
                        /* 更新块 */
                        response = await updateBlock(
                            message_info.current.id,
                            markdown2kramdown(parseText(markdown, message_info.params), ial),
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
        message_info.current = {
            id: response?.[0]?.doOperations?.[0]?.id,
            markdown: markdown,
        };
    }
}

/* 创建发送消息 */
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

async function restartKernel(e, doc_id, params) {
    /* 获得文档块的块属性 */
    const doc_attrs = await getBlockAttrs(doc_id);
    if (!doc_attrs) return;

    const kernel_id = doc_attrs[config.jupyter.attrs.kernel.id];
    const kernel = await jupyter.kernels.restart(kernel_id);
    const kernelspecs = await jupyter.kernelspecs.get();
    if (kernel && kernelspecs) {
        await setBlockAttrs(doc_id, {
            [config.jupyter.attrs.other.prompt]: promptFormat(
                doc_attrs[config.jupyter.attrs.kernel.language],
                kernelspecs?.kernelspecs?.[kernel?.name]?.spec?.display_name,
                i18n(kernel?.execution_state, lang),
            ),
        }); // 更新文档块的属性
    }
}

async function runCell(e, code_id, params) {
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

    if (websockets[doc_id]
        && websockets[doc_id].ws
        && websockets[doc_id].ws.readyState === WebSocket.OPEN
    ) {
        websocket = websockets[doc_id];
        run();
    }
    else {
        const kernel_id = doc_attrs[config.jupyter.attrs.kernel.id];
        const kernel_name = doc_attrs[config.jupyter.attrs.kernel.name];
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
            run();
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

/* 关闭当前活动连接 */
async function closeConnection(e, doc_id, params) {
    if (websockets[doc_id]) websockets[doc_id].ws.close();
}
