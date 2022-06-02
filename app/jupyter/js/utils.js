export {
    merge, // 递归合并对象
    getCookie, // 获取 cookie\
    setCookie, // 设置 cookie
    setBlockDOMAttrs, // 设置 DOM 中的块属性
    timestampFormat, // 时间格式化
};

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
