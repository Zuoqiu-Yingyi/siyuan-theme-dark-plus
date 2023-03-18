export {
    Queue, // 队列
    merge, // 递归合并对象
    getCookie, // 获取 cookie
    setCookie, // 设置 cookie
    setBlockDOMAttrs, // 设置 DOM 中的块属性
    timestampFormat, // 时间格式化
    base64ToBlob, // Base64 转 Blob
    promptFormat, // 格式化 prompt
    URL2DataURL, // URL 转 DataURL
    HTMLEncode, // HTML 编码
    HTMLDecode, // HTML 解码
    createIAL, // 创建内联属性表字符串
    createStyle, // 创建样式字符串
    isEmptyObject, // 判断对象是否为空
    isString, // 判断对象是否为字符串
    Output, // 输出解析器
    parseText, // 解析文本
    parseData, // 解析数据
    markdown2kramdown, // Markdown 转 Kramdown
    nodeIdMaker, // 块 ID 生成器
    workerInit, // 初始化 worker
};

import { config } from './config.js';
import {
    upload,
    jupyter,
} from './api.js';

/* 消息序列 */
class Queue {
    constructor() {
        this.items = [];
    }
    clear() {
        this.items = [];
    }
    enqueue(value, priority) {
        this.items.push({
            value,
            priority,
        });
        this.items.sort((a, b) => a.priority - b.priority);
    }
    dequeue() {
        return this.items.shift();
    }
    peek() {
        return this.items[0];
    }
    rear() {
        return this.items[this.items.length - 1];
    }
    empty() {
        return this.items.length === 0;
    }
    size() {
        return this.items.length;
    }
}

// REF [js - 对象递归合并merge - zc-lee - 博客园](https://www.cnblogs.com/zc-lee/p/15873611.html)
function isString(obj) {
    return Object.prototype.toString.call(obj) === '[object String]'
}
function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]'
}
function isArray(arr) {
    return Array.isArray(arr)
}
function merge(target, ...arg) {
    return arg.reduce((acc, cur) => {
        return Object.keys(cur).reduce((subAcc, key) => {
            const srcVal = cur[key]
            if (isObject(srcVal)) {
                subAcc[key] = merge(subAcc[key] ? subAcc[key] : {}, srcVal)
            } else if (isArray(srcVal)) {
                // series: []，下层数组直接赋值
                subAcc[key] = srcVal.map((item, idx) => {
                    if (isObject(item)) {
                        const curAccVal = subAcc[key] ? subAcc[key] : []
                        return merge(curAccVal[idx] ? curAccVal[idx] : {}, item)
                    } else {
                        return item
                    }
                })
            } else {
                subAcc[key] = srcVal
            }
            return subAcc
        }, acc)
    }, target)
}

function getCookie(name, cookies = document?.cookie) {
    // from tornado docs: http://www.tornadoweb.org/en/stable/guide/security.html
    const r = cookies.match(`\\b${name}=([^;]*)\\b`);
    return r ? r[1] : undefined;
}

function setCookie(name, value, cookies = document?.cookie) {
    const r = cookies.match(`\\b${name}=([^;]*)\\b`);
    if (r) {
        cookies = cookies.replace(r[0], `${name}=${value}`)
    } else {
        cookies += `; ${name}=${value}`
    }
    return cookies
}

/**
 * 设置 DOM 中的块属性
 * @deprecated 2.1.15+ https://github.com/siyuan-note/siyuan/issues/5847 https://github.com/siyuan-note/siyuan/issues/5866
 * @param {string} id 块 ID
 * @param {object} attrs 块属性 dict
 */
function setBlockDOMAttrs(id, attrs) {
    let block = document.querySelector(`div.protyle-content div[data-node-id="${id}"]`);
    if (block) {
        if (block.className === 'protyle-background') {
            while (block && block.dataset.docType == null) block = block.nextElementSibling;
        };
        // console.log(block);
        // console.log(attrs);
        if (block) {
            for (let key of Object.keys(attrs)) {
                if (attrs[key]) block.setAttribute(key, attrs[key]);
                else block.removeAttribute(key);
            }
        }
    }
    // console.log(block);
}

/**
 * 时间格式化
 * REF [JavaScript Date（日期）对象 | 菜鸟教程](https://www.runoob.com/js/js-obj-date.html)
 */
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S+": this.getMilliseconds() //毫秒
    };
    let result = /(y+)/.exec(fmt);
    if (result) fmt = fmt.replace(result[1], (this.getFullYear() + "").substring(4 - result[1].length));
    for (var k in o) {
        const reg = new RegExp(`(${k})`);
        result = reg.exec(fmt);
        if (result) fmt = fmt.replace(result[1], (result[1].length === 1) ? (o[k]) : ((new Array(result[1].length + 1).join('0') + o[k]).substring(("" + o[k]).length)));
    }
    return fmt;
};

/* 数字填充前导零 */
function intPrefix(num, length) {
    let s = `${num}`;
    return s.length < length ? (Array(length).join('0') + num).slice(-length) : s;
}

/* 时间戳 */
function timestampFormat(milliseconds) {
    let h = milliseconds / 3600000 | 0;
    let m = (milliseconds % 3600000) / 60000 | 0;
    let s = (milliseconds % 60000) / 1000 | 0;
    let ms = milliseconds % 1000 | 0;
    let timestamp = `${intPrefix(h, 2)}:${intPrefix(m, 2)}:${intPrefix(s, 2)}.${intPrefix(ms, 3)}`;
    return timestamp;
}

/* base64 数据转换为 Blob */
function base64ToBlob(base64Data, mime) {
    // let bstr = atob(base64Data);
    // let n = bstr.length;
    // let buffer = new Uint8Array(n);
    // while (n--) {
    //     buffer[n] = bstr.charCodeAt(n);
    // }

    // let buffer = Buffer.from(base64Data, 'base64'); // Worker 环境下不支持 Buffer
    let buffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    return new Blob([buffer], { type: mime });

    // return new Blob([atob(base64Data)], { type: mime });
}

/* prompt 格式化 */
function promptFormat(language, name, state) {
    return `${language} | ${name} | ${state}`
}

/* 资源 URL 转 Data URL */
async function URL2DataURL(src, dom) {
    const source = await jupyter.request(
        src,
        undefined,
        false,
    );

    // console.log(source);
    // console.log(source.body);
    // console.log(source.headers.get('Content-Type'));
    // const blob = new Blob([source.body], { type: source.headers.get('Content-Type') });

    const blob = await source.blob();
    // console.log(blob);

    // REF [原创 js操作canvas、DataURL、File、Blob转换处理_weixin_42580704的博客-CSDN博客_canvas转file js](https://blog.csdn.net/weixin_42580704/article/details/109488693)
    const reader = new FileReader();

    // REF [FileReader.readAsDataURL() - Web API 接口参考 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader/readAsDataURL)
    reader.addEventListener("load", () => {
        dom.src = reader.result;
    }, false);
    reader.readAsDataURL(blob);
}

/* HTML 转义 */
function HTMLEncode(text) {
    // REF: [javascript处理HTML的Encode(转码)和Decode(解码)总结 - 孤傲苍狼 - 博客园](https://www.cnblogs.com/xdp-gacl/p/3722642.html)
    if (self.document) {
        let temp = document.createElement("div");
        temp.textContent = text;
        return temp.innerHTML;
    }
    else {
        return text
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;');
    }
}

/* HTML 反转义 */
function HTMLDecode(text) {
    // REF: [javascript处理HTML的Encode(转码)和Decode(解码)总结 - 孤傲苍狼 - 博客园](https://www.cnblogs.com/xdp-gacl/p/3722642.html)
    if (self.document) {
        let temp = document.createElement("div");
        temp.innerHTML = text;
        return temp.textContent;
    }
    else {
        return text
            .replaceAll('&quot;', '"')
            .replaceAll('&gt;', '>')
            .replaceAll('&lt;', '<')
            .replaceAll('&amp;', '&');
    }
}

/**
 * 创建内联属性表字符串
 * @params {object} obj: 属性表对象
 * @return {string}: ial 字符串, 格式： {: key="value" key="value" ...}
 */
function createIAL(obj) {
    let IAL = [];
    for (const key in obj) {
        if (obj[key])
            IAL.push(`${key}="${HTMLEncode(obj[key]).replaceAll('\n', '_esc_newline_')}"`);
    }
    return `{: ${IAL.join(' ')}}`;
}

/**
 * 创建 style 属性表字符串
 * @params {object} obj: 属性表对象
 * @return {string}: style 字符串, 格式： style="key: value; key: value; ..."
 */
function createStyle(obj) {
    let style = [];
    for (const key in obj) {
        style.push(`${key}: ${obj[key]};`);
    }
    return `${style.join(' ')}`;
}

/**
 * 判断对象是否为空
 * @params {object} obj: 对象
 * @return {boolean}: 是否为空
 */
function isEmptyObject(obj) {
    for (const key in obj) {
        return false;
    }
    return true;
}

/* 处理输出结果的类 */
class Output {
    /* 操作的文本对象 */
    text;

    /* 构造函数 */
    constructor(text = "") {
        this.text = text.toString();
    }

    toString() {
        return this.text;
    }

    /* 👇可链式调用的方法👇 */

    /* 转义符号 */
    escapeMark() {
        this.text = this.text.replaceAll(config.jupyter.regs.mark, '\\$1');
        return this;
    }

    /**
     * 解析控制字符
     * @params {string} src: 原字符串
     */
    parseControlChars(src = "") {
        const chars = [...src];
        const content = this.text.replaceAll('\r\n', '\n');
        const content_length = content.length;
        let ptr = chars.length;
        let start = src.lastIndexOf('\n') + 1;
        for (let i = 0; i < content_length; ++i) {
            const c = content[i];
            switch (c) {
                case '\b': // backspace
                    if (ptr > start) ptr--;
                    break;
                case '\r': // carriage return
                    ptr = start;
                    break;
                case '\n': // line feed
                    start = ptr + 1;
                default:
                    chars[ptr++] = c;
                    break;
            }
        }
        this.text = chars.slice(0, ptr).join('');
        return this;
    }

    /* 解析控制台控制字符 */
    parseCmdControlChars(escaped) {
        const reg = escaped
            ? config.jupyter.regs.escaped.richtext
            : config.jupyter.regs.richtext;
        this.text = this.text
            .replaceAll(/\x1bc/g, '') // 不解析清屏命令
            .replaceAll(/\x1b\\?\[\\?\?\d+[lh]/g, '') // 不解析光标显示命令
            .replaceAll(/\x1b\\?\[\d*(\\?;\d+)*[a-ln-zA-Z]/g, '') // 不解析光标位置命令
            .replaceAll(
                reg,
                (match, p1, p2, offset, string) => {
                    // REF [将一个函数指定为一个参数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/replaceAll#%E5%B0%86%E4%B8%80%E4%B8%AA%E5%87%BD%E6%95%B0%E6%8C%87%E5%AE%9A%E4%B8%BA%E4%B8%80%E4%B8%AA%E5%8F%82%E6%95%B0)
                    let mark = {
                        strong: false, // 加粗
                        em: false, // 倾斜
                        s: false, // 删除线
                        u: false, // 下划线
                    }; // 标志

                    // REF [Terminal里的颜色的那些事 - 知乎](https://zhuanlan.zhihu.com/p/184924477)
                    let custom = {
                        ground: null, // 'color' 前景颜色, background-color: 背景颜色
                        mode: null, // 第二个参数的模式
                        color: null, // 颜色
                    }; // 使用 ANSI 转义序列自定义颜色

                    let style = {}; // ial 样式列表
                    let ial = ""; // 行级元素的 IAL 字符串

                    const params = p1
                        .replaceAll('\\;', ';') // 替换转义的分号
                        .split(';'); // 根据分号分割所有参数
                    for (const param of params) {
                        const num = parseInt(param);
                        if (custom.mode) { // 自定义颜色
                            /* 颜色值必须是有效的 */
                            if (num >= 0 && num <= 255) {
                                switch (custom.mode) {
                                    case 2: // 24 位色
                                        if (!custom.color) custom.color = '#';
                                        switch (custom.color.length) {
                                            case 1:
                                            case 3:
                                                custom.color += num.toString(16).toUpperCase().padStart(2, '0');
                                                continue;
                                            case 5:
                                                custom.color += num.toString(16).toUpperCase().padStart(2, '0');
                                                style[custom.ground] = custom.color;
                                            default:
                                                break;
                                        }
                                        break;
                                    case 5: // 8 位色
                                        custom.color = `var(--custom-jupyter-256-color-${num.toString().padStart(3, '0')})`;
                                        style[custom.ground] = custom.color;
                                        break;
                                    default:
                                        break;
                                }
                            }
                        }
                        else {
                            switch (num) {
                                case NaN: // 无效参数
                                case 0: // 清除样式
                                    mark = {};
                                    style = {};
                                    break;
                                case 1: // 加粗
                                    mark.strong = true;
                                    break;
                                case 2: // 字体变暗
                                    /* ANSI 转义序列自定义颜色: 8 位色 */
                                    if (custom.ground) {
                                        custom.mode = num;
                                        continue;
                                    }
                                    style.opacity = '0.75';
                                    break;
                                case 3: // 斜体
                                    mark.em = true;
                                    break;
                                case 4: // 下划线
                                    mark.u = true;
                                    break;
                                case 5: // 呼吸闪烁
                                    /* ANSI 转义序列自定义颜色 24 位色 */
                                    if (custom.ground) {
                                        custom.mode = num;
                                        continue;
                                    }
                                    style.animation = 'breath 4s ease-in-out infinite';
                                    break;
                                case 6: // 快速闪烁
                                    style.animation = 'blink 0.5s steps(2) infinite';
                                    break;
                                case 7: // 反色
                                    style.filter = 'invert(1)';
                                    break;
                                case 8: // 透明
                                    style.opacity = '0';
                                    break;
                                case 9: // 删除线
                                    mark.s = true
                                    break;
                                default:
                                    {
                                        let k;

                                        /* 前景/背景 */
                                        const pre = parseInt(param.substring(0, param.length - 1));
                                        const suf = parseInt(param.substring(param.length - 1));
                                        switch (pre) {
                                            case 3:
                                            case 9:
                                                /* 前景 */
                                                k = 'color';
                                                break;
                                            case 4:
                                            case 10:
                                                /* 背景 */
                                                k = 'background-color';
                                                break;
                                            default:
                                                break;
                                        }

                                        /* 颜色 */
                                        /**
                                         * windows:
                                         * cmd: `color /?`
                                         * 0 = 黑色       8 = 灰色
                                         * 1 = 蓝色       9 = 淡蓝色
                                         * 2 = 绿色       A = 淡绿色
                                         * 3 = 浅绿色     B = 淡浅绿色
                                         * 4 = 红色       C = 淡红色
                                         * 5 = 紫色       D = 淡紫色
                                         * 6 = 黄色       E = 淡黄色
                                         * 7 = 白色       F = 亮白色
                                         */
                                        switch (pre) {
                                            case 3:
                                            case 4:
                                                /* 正常颜色 */
                                                switch (suf) {
                                                    case 0: // 黑色
                                                        style[k] = 'var(--custom-jupyter-ansi-color-black)';
                                                        break;
                                                    case 1: // 红色
                                                        style[k] = 'var(--custom-jupyter-ansi-color-red)';
                                                        break;
                                                    case 2: // 绿色
                                                        style[k] = 'var(--custom-jupyter-ansi-color-green)';
                                                        break;
                                                    case 3: // 黄色
                                                        style[k] = 'var(--custom-jupyter-ansi-color-yellow)';
                                                        break;
                                                    case 4: // 蓝色
                                                        style[k] = 'var(--custom-jupyter-ansi-color-blue)';
                                                        break;
                                                    case 5: // 紫色
                                                        style[k] = 'var(--custom-jupyter-ansi-color-magenta)';
                                                        break;
                                                    case 6: // 青色
                                                        style[k] = 'var(--custom-jupyter-ansi-color-cyan)';
                                                        break;
                                                    case 7: // 白色
                                                        style[k] = 'var(--custom-jupyter-ansi-color-white)';
                                                        break;
                                                    case 8: // 自定义颜色
                                                        custom.ground = k;
                                                        continue;
                                                    case 9: // 默认
                                                    // REF [node.js - What is this \u001b[9... syntax of choosing what color text appears on console, and how can I add more colors? - Stack Overflow](https://stackoverflow.com/questions/23975735/what-is-this-u001b9-syntax-of-choosing-what-color-text-appears-on-console)
                                                    default:
                                                        delete style[k];
                                                        break;
                                                } // switch (suf)
                                                break;
                                            case 9:
                                            case 10:
                                                /* 亮色颜色 */
                                                switch (suf) {
                                                    case 0: // 黑色
                                                        style[k] = 'var(--custom-jupyter-ansi-color-black-intense)';
                                                        break;
                                                    case 1: // 红色
                                                        style[k] = 'var(--custom-jupyter-ansi-color-red-intense)';
                                                        break;
                                                    case 2: // 绿色
                                                        style[k] = 'var(--custom-jupyter-ansi-color-green-intense)';
                                                        break;
                                                    case 3: // 黄色
                                                        style[k] = 'var(--custom-jupyter-ansi-color-yellow-intense)';
                                                        break;
                                                    case 4: // 蓝色
                                                        style[k] = 'var(--custom-jupyter-ansi-color-blue-intense)';
                                                        break;
                                                    case 5: // 紫色
                                                        style[k] = 'var(--custom-jupyter-ansi-color-magenta-intense)';
                                                        break;
                                                    case 6: // 青色
                                                        style[k] = 'var(--custom-jupyter-ansi-color-cyan-intense)';
                                                        break;
                                                    case 7: // 白色
                                                        style[k] = 'var(--custom-jupyter-ansi-color-white-intense)';
                                                        break;
                                                    case 8: // 自定义颜色
                                                        custom.ground = k;
                                                        continue;
                                                    case 9: // 默认
                                                    // REF [node.js - What is this \u001b[9... syntax of choosing what color text appears on console, and how can I add more colors? - Stack Overflow](https://stackoverflow.com/questions/23975735/what-is-this-u001b9-syntax-of-choosing-what-color-text-appears-on-console)
                                                    default:
                                                        delete style[k];
                                                        break;
                                                } // switch (suf)
                                                break;
                                            default:
                                                break;
                                        } // switch (pre)
                                    } // default
                                    break;
                            } // switch (param)
                        }
                        custom.ground = null;
                        custom.mode = null;
                        custom.color = null;
                    }
                    /* 添加行级 IAL */
                    if (!isEmptyObject(style)) {
                        ial = createIAL({ style: createStyle(style) });
                    }
                    const pre_mark =
                        `${mark.strong || !isEmptyObject(style) ? '**' : ''
                        }${mark.em ? '*' : ''
                        }${mark.s ? '~~' : ''
                        }${mark.u ? '<u>' : ''
                        }`; // 前缀标志
                    const suf_mark =
                        `${mark.u ? '</u>' : ''
                        }${mark.s ? '~~' : ''
                        }${mark.em ? '*' : ''
                        }${mark.strong || !isEmptyObject(style) ? '**' : ''
                        }`; // 后缀标志
                    return p2
                        .replaceAll('\r\n', '\n') // 替换换行符
                        .replaceAll('\n{2,}', '\n\n') // 替换多余的换行符
                        .split('\n\n') // 按块分割
                        .map(block => config.jupyter.output.ZWS + block // 段首添加零宽空格
                            .split('\n') // 按照换行分隔
                            .map(line => {
                                if (line.length > 0) {
                                    /* markdown 标志内测不能存在空白字符 */
                                    if (mark.u && escaped) // 移除 <u></u> 标签内的转义符号
                                        line = line.replaceAll(config.jupyter.regs.escaped.mark, '\$1');
                                    /* 标志内测添加零宽空格 */
                                    return `${pre_mark}${config.jupyter.output.ZWS}${line}${config.jupyter.output.ZWS}${suf_mark}${ial}`;
                                }
                                else return '';
                            })
                            .join('\n')
                        ) // 添加标志和行级 IAL
                        .join('\n\n');
                }
            );
        return this;
    }

    /* 移除控制台 ANSI 转义序列(保留 \b, \r) */
    removeCmdControlChars() {
        this.text = this.text.replaceAll(config.jupyter.regs.ANSIesc, '');
        return this;
    }
}

/**
 * 解析文本
 * @params {string | Output} text: 文本
 * @params {object} params: 解析选项
 * @return {string} 解析后的文本
 */
function parseText(text, params) {
    const output = new Output(text);
    if (params.escaped) output.escapeMark();
    if (params.cntrl) output.parseCmdControlChars(params.escaped);
    else output.removeCmdControlChars();
    return output.toString();
}


/**
 * 解析数据
 * @params {object} data: 数据
 * @params {object} params: 解析选项
 * @return {string} 解析后的文本
 */
async function parseData(data, params) {
    let filedata;
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
                        // filedata = Buffer.from(data[mime]).toString('base64');
                        filedata = btoa(data[mime]);
                        break;
                    default:
                        filedata = data[mime].split('\n')[0];
                        break;
                }
                {
                    const title = data['text/plain'];
                    const filename = `jupyter-output.${ext}`;
                    const response = await upload(
                        base64ToBlob(filedata, mime),
                        undefined,
                        filename,
                    );
                    const filepath = response?.data?.succMap[filename];
                    if (filepath) markdowns.enqueue(`![${filename}](${filepath}${isString(title) ? ` "${title.replaceAll('"', '&quot;')}"` : ''})`, 3);
                }
                break;
            case 'audio':
                switch (sub) {
                    default:
                        filedata = data[mime].split('\n')[0];
                        break;
                }
                {
                    const filename = `jupyter-output.${ext}`;
                    const response = await upload(
                        base64ToBlob(filedata, mime),
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
                        filedata = data[mime].split('\n')[0];
                        break;
                }
                {
                    const filename = `jupyter-output.${ext}`;
                    const response = await upload(
                        base64ToBlob(filedata, mime),
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

/**
 * Markdown 转 Kramdown
 * @params {string} markdown: markdown 字符串
 * @params {string | object} ial: IAL 字符串 | IAL 键值对
 * @return {string}: kramdown 字符串
 */
function markdown2kramdown(markdown, ial) {
    markdown = markdown.replace(/\n+$/, '');
    switch (true) {
        case isObject(ial):
            if (isEmptyObject(ial))
                return markdown;
            else
                return `${markdown}\n${createIAL(ial)}`;
        case isString(ial):
            return `${markdown}\n${ial}`;
        default:
            return markdown;
    }
}

/**
 * 返回一个块 ID 生成器
 * @return {Function}: 块 ID 生成器
 */
function nodeIdMaker() {
    var index = 0;
    return (time = new Date()) => `${time.toLocaleString().replace(
        /(\d{4})\/(\d{2})\/(\d{2})\s+(\d{2}):(\d{2}):(\d{2})/,
        '$1$2$3$4$5$6',
    )}-${(index++).toString(36).padStart(7, '0')}`;
}

/* worker 初始化 */
function workerInit(self) {
    // console.log(self);
    if (self.name) { // 设置了 DedicatedWorkerGlobalScope.name 后才能正常运行
        const worker_error_handler = e => {
            console.error(e);
        };
        self.addEventListener('error', worker_error_handler);
        self.addEventListener('messageerror', worker_error_handler);

        self.addEventListener('message', async e => {
            // console.log(e);
            const data = JSON.parse(e.data);

            const message = {
                type: data.type,
                handle: data.handle,
            };

            switch (data.type) {
                case 'call':
                    const handle = self?.handlers?.[data.handle];
                    if (handle) message.return = await handle(...data.params);
                    break;
                default:
                    break;
            }

            self.postMessage(JSON.stringify(message));
        });

        self.postMessage(JSON.stringify({
            type: 'status',
            status: 'ready',
        }));
    }
};
