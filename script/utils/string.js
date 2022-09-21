/* 内联属性表处理 */

export {
    HTMLEncode, // HTML 转义
    HTMLDecode, // HTML 反转义
    ialParse, // 内联属性表解析
    ialCreate, // 内联属性表创建
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
        let v1, v2;
        if (!isNaN(v1_arr[i]) && !isNaN(v2_arr[i])) { // 两者都为数字
            v1 = parseInt(v1_arr[i]);
            v2 = parseInt(v2_arr[i]);
        }
        else if (!isNaN(v1_arr[i]) || !isNaN(v2_arr[i])) { // 其中一者为数字
            v1 = v1_arr[i];
            v2 = v2_arr[i];
            if (v1 == undefined || v2 == undefined) // 其中一者没有更细分的版本号
                return 0;
            else if (!isNaN(v1) && isNaN(v2)) // v1 是发行版 | v2 是内测(x-alphaX)/公测版(x-devX)
                return 1;
            else if (isNaN(v1) && !isNaN(v2)) // v2 是发行版 | v1 是内测(x-alphaX)/公测版(x-devX)
                return -1;
            else // 意外的情况
                return 0;
        }
        else { // 都不为数字, 比较字符串, 内测版(alpha)比公测版(dev)版本号小
            v1 = v1_arr[i];
            v2 = v2_arr[i];
        }
        switch (true) {
            case v1 > v2:
                return 1;
            case v1 < v2:
                return -1;
            case v1 === v2:
            default:
                break;
        }
    }
    return 0;
}
