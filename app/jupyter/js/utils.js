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
    Output, // 输出解析器
    parseText, // 解析文本
    markdown2kramdown, // Markdown 转 Kramdown
};

import { config } from './config.js';
import { jupyter } from './api.js';

/* 消息序列 */
class Queue {
    constructor() {
        this.items = [];
    }
    clear() {
        this.items = [];
    }
    enqueue(item, priority) {
        this.items.push({
            priority,
            item,
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

function getCookie(name, cookies = document.cookie) {
    // from tornado docs: http://www.tornadoweb.org/en/stable/guide/security.html
    const r = cookies.match(`\\b${name}=([^;]*)\\b`);
    return r ? r[1] : undefined;
}

function setCookie(name, value, cookies = document.cookie) {
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
    let buffer = Buffer.from(base64Data, 'base64');
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
    let temp = document.createElement("div");
    temp.textContent = text;
    return temp.innerHTML;;
}

/* HTML 反转义 */
function HTMLDecode(text) {
    // REF: [javascript处理HTML的Encode(转码)和Decode(解码)总结 - 孤傲苍狼 - 博客园](https://www.cnblogs.com/xdp-gacl/p/3722642.html)
    let temp = document.createElement("div");
    temp.innerHTML = text;
    return temp.textContent;;
}

/**
 * 创建内联属性表字符串
 * @params {object} obj: 属性表对象
 * @return {string}: ial 字符串, 格式： {: key="value" key="value" ...}
 */
function createIAL(obj) {
    let IAL = [];
    for (const key in obj) {
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

    /* 文本 */
    set text(text) {
        this.text = text.toString();
    }

    get text() {
        return this.text;
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
        for (let i = 0; i < content_length; ++i) {
            const c = content[i];
            switch (c) {
                case '\b': // backspace
                    if (ptr > 0) ptr--;
                    break;
                case '\r': // carriage return
                    ptr = 0;
                    break;
                default:
                    chars[ptr++] = c;
            }
        }
        this.text = chars.slice(0, ptr).join('');
        return this;
    }

    /* 解析控制台控制字符 */
    parseCmdControlChars() {
        this.text = this.text
            .replaceAll(/\x1bc/g, '') // 不解析清屏命令
            .replaceAll(/\x1b\\?\[\\?\?\d+[lh]/g, '') // 不解析光标显示命令
            .replaceAll(/\x1b\\?\[\d*(\\?;\d+)*[^\dm]/g, '') // 不解析光标位置命令
            .replaceAll(
                config.jupyter.regs.richtext,
                (match, p1, p2, offset, string) => {
                    // REF [将一个函数指定为一个参数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/replaceAll#%E5%B0%86%E4%B8%80%E4%B8%AA%E5%87%BD%E6%95%B0%E6%8C%87%E5%AE%9A%E4%B8%BA%E4%B8%80%E4%B8%AA%E5%8F%82%E6%95%B0)
                    let mark = {
                        strong: false, // 加粗
                        em: false, // 倾斜
                        u: false, // 下划线
                        s: false, // 删除线
                    }; // 标志
                    let style = {}; // ial 样式列表
                    let ial = ""; // 行级元素的 IAL 字符串

                    const params = p1
                        .replaceAll('\\;', ';') // 替换转义的分号
                        .split(';'); // 根据分号分割所有参数
                    for (const param of params) {
                        switch (parseInt(param)) {
                            case 0: // 清除样式
                                mark = {};
                                style = {};
                                break;
                            case 1: // 加粗
                                mark.strong = true;
                                break;
                            case 2: // 字体变暗
                                style.opacity = '0.75';
                                break;
                            case 3: // 斜体
                                mark.em = true;
                                break;
                            case 4: // 下划线
                                mark.u = true;
                                break;
                            case 5: // 呼吸闪烁
                                style.animation = 'breath 4s ease-in-out infinite';
                                break;
                            case 6: // 快速闪烁
                                style.animation = 'blink 1s steps(2) infinite';
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
                                    if (param[0] === '3') {
                                        k = 'color';
                                    }
                                    else if (param[0] === '4') {
                                        k = 'background-color';
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
                                    switch (parseInt(param.substring(1))) {
                                        case 0: // 黑色
                                            style[k] = 'var(--custom-jupyter-color-black)';
                                            break;
                                        case 1: // 红色
                                            style[k] = 'var(--custom-jupyter-color-red)';
                                            break;
                                        case 2: // 绿色
                                            style[k] = 'var(--custom-jupyter-color-green)';
                                            break;
                                        case 3: // 黄色
                                            style[k] = 'var(--custom-jupyter-color-yellow)';
                                            break;
                                        case 4: // 蓝色
                                            style[k] = 'var(--custom-jupyter-color-blue)';
                                            break;
                                        case 5: // 紫色
                                            style[k] = 'var(--custom-jupyter-color-magenta)';
                                            break;
                                        case 6: // 青色
                                            style[k] = 'var(--custom-jupyter-color-cyan)';
                                            break;
                                        case 7: // 白色
                                            style[k] = 'var(--custom-jupyter-color-white)';
                                            break;
                                        case 9: // 默认
                                        // REF [node.js - What is this \u001b[9... syntax of choosing what color text appears on console, and how can I add more colors? - Stack Overflow](https://stackoverflow.com/questions/23975735/what-is-this-u001b9-syntax-of-choosing-what-color-text-appears-on-console)
                                        default:
                                            delete style[k];
                                            break;
                                    }
                                }
                                break;
                        }
                    }
                    /* 添加行级 IAL */
                    if (!isEmptyObject(style)) {
                        ial = createIAL({ style: createStyle(style) });
                    }
                    const pre_mark =
                        `${mark.strong || !isEmptyObject(style) ? '**' : ''
                        }${mark.em ? '*' : ''
                        }${mark.u ? '<u>' : ''
                        }${mark.s ? '~~' : ''
                        }`; // 前缀标志
                    const suf_mark =
                        `${mark.s ? '~~' : ''
                        }${mark.u ? '</u>' : ''
                        }${mark.em ? '*' : ''
                        }${mark.strong || !isEmptyObject(style) ? '**' : ''
                        }`; // 后缀标志
                    return p2
                        .replaceAll('\r\n', '\n') // 替换换行符
                        .replaceAll('\n{2,}', '\n\n') // 替换多余的换行符
                        .split('\n\n') // 按块分割
                        .map(block => block
                            .split('\n') // 按照换行分隔
                            .map(line => {
                                if (line.length > 0) {
                                    /* markdown 标志内测不能存在空白字符 */
                                    const pre_blank = line.substring(0, line.length - line.trimLeft().length);
                                    const sub_blank = line.substring(line.trimRight().length);
                                    return `${pre_blank}${pre_mark}${line.trim()}${suf_mark}${ial}${sub_blank}`
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

    /* 移除控制台转义字符 */
    removeCmdControlChars() {
        this.text = this.text.replaceAll(/\x1b[^a-zA-Z]*[a-zA-Z]/g, '');
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
    if (params.cntrl) output.parseCmdControlChars();
    else output.removeCmdControlChars();
    return output.toString();
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
