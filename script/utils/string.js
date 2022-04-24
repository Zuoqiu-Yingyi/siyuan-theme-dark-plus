/* 内联属性表处理 */

export {
    HTMLEncode, // HTML 转义
    HTMLDecode, // HTML 反转义
    ialParse, // 内联属性表解析
    ialCreate, // 内联属性表创建
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
 * 内联属性表解析
 * @params {string} ial: ial 字符串, 格式： {: key="value" key="value" ...}
 * @return {object}: 属性表对象
 */
function ialParse(ial) {
    if (ial == '' || ial == null) {
        return {};
    }
    ial = ial.replace(/\s*(\S+)="(.*?)"/g, ',"$1":"$2"');
    // console.log(IAL);
    let obj = JSON.parse(`{${IAL.substr(2)}`);
    for (let key of Object.keys(obj)) {
        obj[key] = HTMLDecode(obj[key]).replaceAll('_esc_newline_', '\n');
    }
    return obj;
}

/**
 * 内联属性表创建
 * @params {object} obj: 属性表对象
 * @return {string}: ial 字符串, 格式： {: key="value" key="value" ...}
 */
function ialCreate(obj) {
    let IAL = [];
    for (let key of Object.keys(obj)) {
        IAL.push(`${key}="${HTMLEncode(obj[key]).replaceAll('\n', '_esc_newline_')}"`);
    }
    return `{: ${IAL.join(' ')}}`;
}
