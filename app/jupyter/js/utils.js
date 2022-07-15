export {
    merge, // 递归合并对象
    getCookie, // 获取 cookie
    setCookie, // 设置 cookie
    setBlockDOMAttrs, // 设置 DOM 中的块属性
    timestampFormat, // 时间格式化
    base64ToBlob, // Base64 转 Blob
    escapeText, // 转义纯文本
    promptFormat, // 格式化 prompt
    URL2DataURL, // URL 转 DataURL
    HTMLEncode, // HTML 编码
    HTMLDecode, // HTML 解码
};

import { config } from './config.js';
import { jupyter } from './api.js';

// REF [js - 对象递归合并merge - zc-lee - 博客园](https://www.cnblogs.com/zc-lee/p/15873611.html)
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

/* 转义纯文本 */
function escapeText(text) {
    return text.replaceAll(config.jupyter.regs.mark, '\\$1');
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
