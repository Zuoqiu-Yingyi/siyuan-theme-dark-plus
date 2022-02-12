/* 杂项工具 */
export {
    isNum, // 判断字符串是否为数字
}

function isNum(str) {
    if (str != null && str != "") {
        return !isNaN(str);
    }
    return false;
}
