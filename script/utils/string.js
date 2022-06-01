/* 内联属性表处理 */

export {
    HTMLEncode, // HTML 转义
    HTMLDecode, // HTML 反转义
    ialParse, // 内联属性表解析
    ialCreate, // 内联属性表创建
    getCookie, // 获取指定 cookie 值
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
 * @params {string} ial: 字符串, 格式： {: key="value" key="value" ...}
 * @return {object}: 属性表对象
 */
function ialParse(ial) {
    // 解析 ial 字符串
    // ial 字符串格式： {: key="value" key="value" ...}
    // 返回对象：{key: value, key: value, ...}
    if (ial == '' || ial == null) return {};
    let IAL = ial
        .replace(/\\/g, '\\\\')
        .replace(/\s*(\S+)="(.*?)"/g, ',"$1":"$2"')
        .replace(/^\{\:\s*\,\s*/, '{');
    // console.log(ial, IAL);
    IAL = JSON.parse(IAL);
    for (const key in IAL) IAL[key] = HTMLDecode(IAL[key]);
    return IAL;
}

/**
 * 内联属性表创建
 * @params {object} obj: 属性表对象
 * @return {string}: ial 字符串, 格式： {: key="value" key="value" ...}
 */
function ialCreate(obj) {
    let IAL = [];
    for (const key in obj) {
        IAL.push(`${key}="${HTMLEncode(obj[key]).replaceAll('\n', '_esc_newline_')}"`);
    }
    return `{: ${IAL.join(' ')}}`;
}


/**
 * 获取指定 cookie 值
 * @params {string} name: cookie 名称
 * @return {string}: cookie 值
 */
function getCookie(name) {
    const cookie_list = document.cookie.split('; ');
    for (let i = 0; i < cookie_list.length; i++) {
        let cookie_item = cookie_list[i].split('=');
        if (cookie_item[0] == name) return cookie_item[1];
    }
    return null;
}
