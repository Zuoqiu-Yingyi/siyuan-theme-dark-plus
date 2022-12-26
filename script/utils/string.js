/* 内联属性表处理 */

export {
    HTMLEncode, // HTML 转义
    HTMLDecode, // HTML 反转义
    ialParse, // 内联属性表解析
    ialCreate, // 内联属性表创建
    removeOuterIAL, // 移除非列表项块的 IAL
    looseJsonParse, // 解析 loose-json
    getCookie, // 获取指定 cookie 值
    compareVersion, // 比较版本号
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
 * 移除非列表项块的 IAL
 * @params {string} kramdown: kramdown 源码
 * @return {string}: 移除块的 IAL
 */
function removeOuterIAL(kramdown) {
    return kramdown.substring(0, kramdown.lastIndexOf('\n'))
}

/**
 * 解析 loose-json
 * @params {string} text: loose-json 字符串
 * @return {object}: js 对象
 */
function looseJsonParse(text) {
    return Function(`"use strict";return (${text})`)();
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

/**
 * 比较版本号
 * @params {string} version1: 版本号1
 * @params {string} version2: 版本号2
 * @return {number}: 1: v1 > v2; -1: v1 < v2; 0: v1 = v2
 */
function compareVersion(version1, version2) {
    let v1_arr = version1.split('.');
    let v2_arr = version2.split('.');
    for (let i = 0; i < v1_arr.length; i++) {
        let v1_str = v1_arr[i];
        let v2_str = v2_arr[i];
        let v1_int = parseInt(v1_str);
        let v2_int = parseInt(v2_str);
        let v1, v2;
        if (!isNaN(v1_str) && !isNaN(v2_str)) { // 两者都为数字
            v1 = v1_int;
            v2 = v2_int;
        }
        else if (!isNaN(v1_arr[i]) || !isNaN(v2_arr[i])) { // 其中一者为数字
            if (v1_int !== v2_int) { // 版本号不一致
                v1 = v1_int;
                v2 = v2_int;
            }
            else if (!isNaN(v1_str) && isNaN(v2_str)) // v1 是正式版 | v2 是内测(x-alphaX)/公测(x-betaX)/开发版(x-devX)
                return 1;
            else if (isNaN(v1_str) && !isNaN(v2_str)) // v2 是正式版 | v1 是内测(x-alphaX)/公测(x-betaX)/开发版(x-devX)
                return -1;
            else // 意外的情况
                return 0;
        }
        else { // 都不为数字, 比较字符串, 开发版(dev) < 内测版(alpha) < 公测版(beta)版本号小
            if (v1_int !== v2_int) { // 版本号不一致
                v1 = v1_int;
                v2 = v2_int;
            } else { // 版本号一致, 通过后缀判断
                switch (true) {
                    case v1_str.includes('-dev'):
                        v1 = 1;
                        break;
                    case v1_str.includes('-alpha'):
                        v1 = 2;
                        break;
                    case v1_str.includes('-beta'):
                        v1 = 3;
                        break;
                    default:
                        v1 = 0
                        break;
                }
                switch (true) {
                    case v2_str.includes('-dev'):
                        v2 = 1;
                        break;
                    case v2_str.includes('-alpha'):
                        v2 = 2;
                        break;
                    case v2_str.includes('-beta'):
                        v2 = 3;
                        break;
                    default:
                        v2 = 0
                        break;
                }
                if (v1 === v2) { // 后缀也相同, 比较字符串大小
                    v1 = v1_str;
                    v2 = v2_str;
                }
            }
        }
        switch (true) {
            case v1 > v2:
                return 1;
            case v1 < v2:
                return -1;
            case v1 === v2:
            default:
                continue;
        }
    }
    return 0;
}
