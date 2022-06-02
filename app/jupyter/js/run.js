export {
    runCode, // 运行代码
    closeSession, // 结束会话
}

import {
    queryBlock,
    getBlockAttrs,
    setBlockAttrs,
    insertBlock,
    appendBlock,
    updateBlock,
} from './api.js';
import {
    config,
    custom,
} from './config.js';
import {
    setBlockDOMAttrs,
    timestampFormat,
} from './utils.js';

var websockets = {
    // doc_id: { // 文档 ID
    //     ws: WebSocket, // WebSocket 对象
    //     kernel: kernel_id, // 内核 ID
    //     session: session_id, // 会话 ID
    //     version: version, // 版本
    //     index: 0, // 索引
    // },
};

/* 消息的映射 */
var message_map = {
    // msg_id: { // 消息 ID
    //     websocket: websocket_ref, // WebSocket 对象
    //     doc: doc_id, // 文档块 ID
    //     code: code_id, // 代码块 ID
    //     output: output_id, // 输出块 ID
    //     escaped: boolean, // 是否转义输出结果
    // },
}

/* 加载样式 */
const style = document.getElementById(config.jupyter.id.siyuan.style.id) || document.createElement('link');
const i18n = config.jupyter.i18n;
const lang = window.theme.languageMode;
style.id = config.jupyter.id.siyuan.style.id;
style.type = 'text/css';
style.rel = 'stylesheet';
style.href = config.jupyter.id.siyuan.style.href;
document.head.appendChild(style);

/* 回复消息处理 */
async function messageHandle(msg_id, msg_type, message, websocket) {
    const message_info = message_map[msg_id];
    if (!message_info) return;
    switch (msg_type) {
        case "status": // 状态信息
            {
                /* 更新内核状态 */
                const execution_state = message.content.execution_state;
                let doc_attrs = await getBlockAttrs(message_info.doc);
                let prompt = doc_attrs[config.jupyter.attrs.other.prompt].split(' | ');
                prompt[prompt.length - 1] = i18n[execution_state][lang] || i18n[execution_state].default;
                doc_attrs = { [config.jupyter.attrs.other.prompt]: prompt.join(' | ') };
                await setBlockDOMAttrs(message_info.doc, doc_attrs);
                await setBlockAttrs(message_info.doc, doc_attrs);
            }
            break;
        case "stream": // 代码输出信息
            {
                const text = message.content.text;
                await appendBlock(
                    message_info.output,
                    message_info.escaped
                        ? text.replaceAll(config.jupyter.regs.mark, '\\$1')
                        : text,
                );
            }
            break;
        case "error": // 代码输出错误信息
            {
                const ename = message.content.ename;
                const evalue = message.content.evalue;
                const traceback = message.content.traceback;
                let markdown = [];
                markdown.push('```plaintext');
                for (const t of traceback) {
                    markdown.push(t.replace(/\u001b\[(\d+;)*\d+m/g, ''));
                }
                markdown.push('```');
                markdown.push(`{: style="${config.jupyter.style.error}"}`);
                await appendBlock(message_info.output, markdown.join('\n'));
            }
            break;
        case "execute_input": // 代码输入信息
            {
                /* 更新块序号状态与启动时间 */
                const date = new Date(message.header.date);
                let code_attrs = {
                    [config.jupyter.attrs.code.index]: '*',
                    [config.jupyter.attrs.code.time]: `${i18n.start[lang] || i18n.start.default}: ${date.format('yyyy-MM-dd hh:mm:ss')}`,
                };
                let output_attrs = { [config.jupyter.attrs.output.index]: '*' };
                await setBlockDOMAttrs(message_info.code, code_attrs);
                await setBlockDOMAttrs(message_info.output, output_attrs);
                await setBlockAttrs(message_info.code, code_attrs);
                await setBlockAttrs(message_info.output, output_attrs);
            }
            break;
        case "execute_reply": // 运行结果信息
            {
                const status = message.metadata.status;
                let code_index = String(websocket.index);
                let output_index, output_style;
                switch (status) {
                    case 'ok': // 成功
                        output_index = code_index;
                        output_style = '';
                        break;
                    case 'error': // 错误
                        output_index = 'E';
                        output_style = config.jupyter.style.error;
                        break;
                    default:
                        break;
                }

                /* 更新块序号状态与执行时间 */
                const started = new Date(message.metadata.started);
                const stoped = new Date(message.header.date);
                let code_attrs = {
                    [config.jupyter.attrs.code.index]: code_index,
                    [config.jupyter.attrs.code.time]: `${i18n.start[lang] || i18n.start.default}: ${started.format('yyyy-MM-dd hh:mm:ss')} | ${i18n.runtime[lang] || i18n.runtime.default}: ${timestampFormat(stoped - started)}`,
                };
                let output_attrs = {
                    [config.jupyter.attrs.output.index]: output_index,
                    // style: output_style,
                };
                await setBlockDOMAttrs(message_info.code, code_attrs);
                await setBlockDOMAttrs(message_info.output, output_attrs);
                await setBlockAttrs(message_info.code, code_attrs);
                await setBlockAttrs(message_info.output, output_attrs);
            }
            break;
        case "kernel_info_reply": // 内核信息
        case "history_reply": // 历史指令信息
        case "debug_reply": // 调试信息
        default:
            break;
    }
}

/* 创建发送消息 */
function createSendMessage(
    code,
    session_id,
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
            username: "",
            version: version || "5.3",
        },
        metadata: {},
        parent_header: {},
    };
}

async function runCode(e, code_id, params) {
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

    /* 获得代码块所在文档块 */
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
            await updateBlock(output_id, config.jupyter.output.init);
        }
        else {
            // 没有查询到输出块, 在代码块后插入一个超级块
            const response = await insertBlock(code_id, config.jupyter.output.init);

            /* 获得超级块的块 ID */
            if (response) output_id = response[0].doOperations[0].id;
            else return;
        }
        let output_attrs = await getBlockAttrs(output_id); // 获得输出块的属性
        if (!output_attrs) return;

        /* 只更新部分属性 */
        code_attrs = {}, output_attrs = {};
        /* 设置块序号 */
        code_attrs[config.jupyter.attrs.code.index] = String(websocket.index);
        output_attrs[config.jupyter.attrs.output.index] = String(websocket.index);

        /* 关联代码块与输出块 */
        code_attrs[config.jupyter.attrs.code.output] = output_id;
        output_attrs[config.jupyter.attrs.output.code] = code_id;

        /* 设置块类型 */
        code_attrs[config.jupyter.attrs.code.type.key] = config.jupyter.attrs.code.type.value;
        output_attrs[config.jupyter.attrs.output.type.key] = config.jupyter.attrs.output.type.value;

        const msg_id = crypto.randomUUID(); // 消息 ID
        message_map[msg_id] = { // 将消息 ID 与输出块 ID 关联
            websocket: websocket,
            doc: doc_id,
            code: code_id,
            output: output_id,
            escaped: params.escaped,
        };
        const message = JSON.stringify(createSendMessage( // 创建消息
            code_block.content,
            doc_attrs[config.jupyter.attrs.session.id],
            websocket.version,
            msg_id,
        ));
        websocket.ws.send(message); // 发送消息
        websocket.index += 1; // 更新消息序号

        await setBlockDOMAttrs(code_id, code_attrs); // 更新代码块的属性
        await setBlockDOMAttrs(output_id, output_attrs); // 更新输出块的属性
        await setBlockAttrs(code_id, code_attrs); // 更新代码块的属性
        await setBlockAttrs(output_id, output_attrs); // 更新输出块的属性
    }

    if (websockets[doc_id]
        && websockets[doc_id].ws
        && websockets[doc_id].ws.readyState === WebSocket.OPEN
    ) {
        websocket = websockets[doc_id];
        run();
    }
    else {
        websocket = {
            ws: new WebSocket(`${url.protocol === 'https:' ? 'wss:' : 'ws:'}//${url.host}/api/kernels/${doc_attrs[config.jupyter.attrs.kernel.id]}/channels?session_id=${doc_attrs[config.jupyter.attrs.session.id]}`),
            kernel: doc_attrs[config.jupyter.attrs.kernel.id],
            session: doc_attrs[config.jupyter.attrs.session.id],
            version: null,
            index: 0,
        };
        websocket.ws.onmessage = async e => {
            // REF [MessageEvent - Web API 接口参考 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/MessageEvent)
            const message = JSON.parse(e.data);
            websocket.version = message.header.version;
            const msg_id = message.parent_header.msg_id;
            const msg_type = message.msg_type;
            await messageHandle(msg_id, msg_type, message, websocket);
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

/* 结束指定会话 */
async function closeSession(e, doc_id, params) {
    if (websockets[doc_id]) websockets[doc_id].ws.close();
}
