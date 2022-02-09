/* 字符串处理工具 */
export function cutString(str, len = null, row = null) {
    // 字符串截取指定长度
    // 如果指定了行数，则按行截取，否则按字符截取
    if (len) {
        if (str.length <= len) {
            return str;
        }
        else {
            return `${str.substr(0, len - 3)}...`;
        }
    }
    else if (row) {
        return str.split(/[\r\n]+/g).slice(0, row).join('\n');
    }
}

export function ialParser(ial) {
    // 解析 ial 字符串
    // ial 字符串格式： {: key="value" key="value" ...}
    // 返回对象：{key: value, key: value, ...}
    if (ial == '' || ial == null) {
        return {};
    }
    let IAL = ial.replace(/\s*(\S+)="(.*?)\s*"/g, ',"$1":"$2"');
    // console.log(IAL);
    return JSON.parse(`{${IAL.substr(3)}`);
}

export function isEmptyString(str) {
    // 判断字符串是否为空
    return str == null || str == '';
}

export function ReplaceCRLF(str, c) {
    // 换行符替换
    return str.replace(/[\r\n]+/g, c)
}

export function ReplaceSpace(str, c) {
    // 空白字符替换
    return str.replace(/\s+/g, c)
}

export function timestampFormat(timestamp) {
    return timestamp.replace(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/, "$1-$2-$3 $4:$5:$6");
}

export function markdown2span(markdown) {
    // markdown 转 span
    if (typeof (markdown) == 'string') {
        let temp = markdown.replaceAll('|', '\\|');
        return ReplaceCRLF(temp, '<br />');
    }
    return markdown;
}
