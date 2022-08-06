/* 杂项工具 */

export {
    merge, // 递归合并对象
    styleHandle, // 样式标签处理
    HTMLDecode, // HTML 解码
    focalize, // 聚焦到指定块
    jump, // 跳转到指定块
    goto, // 跳转到指定块
    isNum, // 判断字符串是否为数字
    hoverPreview, // 悬浮预览指定块
    timestampParse, // 时间戳解析为秒数
    timestampFormat, // 时间格式化为时间戳
    url2id, // 块超链接转换为块 id
    id2url, // 块 id 转换为块超链接
    intPrefix, // 整数填充前导零
    shuffle, // 打乱数组
    Iterator, // 创建循环迭代器
    getObjectLength, // 获取对象属性数量
    copyToClipboard, // 复制到剪贴板
};

import { config } from './../module/config.js';

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

function styleHandle(id, innerHTML = null, href = null) {
    let style = document.getElementById(id);
    if (style) {
        style.remove();
        return false;
    } else {
        if (innerHTML) {
            style = document.createElement('style');
            style.id = id;
            style.innerHTML = innerHTML;
            document.head.appendChild(style);
            return true;
        }
        if (href) {
            style = document.createElement('link');
            style.id = id;
            style.rel = 'stylesheet';
            style.type = 'text/css';
            style.href = href;
            document.head.appendChild(style);
            return true;
        }
        return false;
    }
}

function HTMLDecode(text) {
    // REF: [javascript处理HTML的Encode(转码)和Decode(解码)总结 - 孤傲苍狼 - 博客园](https://www.cnblogs.com/xdp-gacl/p/3722642.html)
    let temp = document.createElement("div");
    temp.innerHTML = text;
    return temp.textContent;
}

/**
 * 跳转到指定块并聚焦
 * 问题: 文档名不改变
 */
function focalize(id, callback = null) {
    // console.log('focalize:', id);
    const breadcrumbs = document.querySelector('.protyle-breadcrumb>.protyle-breadcrumb__bar');
    if (breadcrumbs) {
        let crumb = document.createElement("span");
        crumb.className = 'protyle-breadcrumb__item';
        crumb.setAttribute("data-node-id", id);
        breadcrumbs.appendChild(crumb);
        crumb.click();
        // crumb.dispatchEvent(CTRL_CLICK_EVENT);
        crumb.remove();
        if (typeof callback === 'function') setTimeout(callback, config.theme.goto.delay);
    }
    else setTimeout(() => focalize(id, callback), config.theme.goto.delay);
}

/**
 * 取消聚焦
 */
function cancelFocalize(callback = null) {
    // console.log('cancelFocalize');
    const breadcrumbs = document.querySelector('.protyle-breadcrumb>.protyle-breadcrumb__bar');
    if (breadcrumbs
        && breadcrumbs.firstElementChild
    ) {
        // console.log(breadcrumbs);
        if (breadcrumbs.firstElementChild.classList.contains('protyle-breadcrumb__item--active')) {
            // 已取消聚焦
            if (typeof callback === 'function') setTimeout(callback, config.theme.goto.delay);
            return;
        }
        else {
            // 未取消聚焦
            breadcrumbs.firstElementChild.click();
        }
    }
    else setTimeout(() => cancelFocalize(callback), config.theme.goto.delay);
}

/**
 * 跳转到指定块并可选聚焦
 */
function jump(id, callback = null) {
    // console.log('jump:', id);
    const editor = document.querySelector('div.protyle-wysiwyg div[data-node-id] div[contenteditable][spellcheck]');
    if (editor) {
        let ref = document.createElement("span");
        ref.setAttribute("data-type", "block-ref");
        ref.setAttribute("data-subtype", "s");
        ref.setAttribute("data-id", id);
        editor.appendChild(ref);
        ref.click();
        ref.remove();
        if (typeof callback === 'function') setTimeout(callback, config.theme.goto.delay);
    }
    else setTimeout(() => jump(id, callback), config.theme.goto.delay);
}

/**
 * 切换编辑模式
 * @param {number} mode 0: 只读模式, 1: 编辑模式
 */
function changeEditMode(mode = 0) { // 切换编辑模式
    let toolbarEdit = document.getElementById('toolbarEdit');
    if (toolbarEdit) {
        let editable = toolbarEdit.firstElementChild.getAttribute('xlink:href') === '#iconPreview';

        let event = new MouseEvent('click');
        switch (mode) {
            case 0:
                if (editable) toolbarEdit.dispatchEvent(event);
                else return;
            case 1:
                if (!editable) toolbarEdit.dispatchEvent(event);
                else return;
            default:
                throw new Error(`/script/utils/misc.js changeEditMode(${mode})`);
        }
    }
}

async function goto(id, focus = 0, editable = 0) {
    // 是否聚焦
    if (parseInt(focus) === 1 || focus === 'true') focalize(id);
    else {
        jump(id); // v2.0.15+ 可直接跳转

        // 不聚焦, 需要先切换到文档块以退出聚焦, 之后再进行文档内跳转
        // cancelFocalize(() => jump(id)); // 退出聚焦并跳转
        // jump(id, () => cancelFocalize(() => jump(id))); // 跳转后退出聚焦并页内跳转

        // const block = await getBlockByID(id);
        // if (block) {
        //     if (block.root_id === block.id) jump(id); // 文档块直接跳转
        //     else jump(block.root_id, () => jump(id)); // 非文档块, 先跳转文档再跳转块
        // }
        // else throw new Error(id);
    }

    // 是否可编辑
    if (parseInt(editable) === 1 || editable === 'true') setTimeout(() => changeEditMode(1), 0);
    else setTimeout(() => changeEditMode(0), 0);
}

function isNum(str) {
    if (str != null && str != "") {
        return !isNaN(str);
    }
    return false;
}

function hoverPreview(id, screenX, screenY) {
    // 创建虚拟块引用节点
    let virtual_ref = document.createElement("span");
    virtual_ref.setAttribute("data-type", "block-ref");
    virtual_ref.setAttribute("data-id", id);
    virtual_ref.style = `position: fixed; left: ${screenX}px;top: ${screenY}px; `;

    // 编辑器面板
    let editor = document.querySelector(
        ".protyle-wysiwyg div[data-node-id] div[contenteditable][spellcheck]"
    );
    editor.appendChild(virtual_ref);

    // 鼠标悬停事件
    virtual_ref.mouseover();

    setTimeout(() => {
        let panel = document.querySelector(`.block__popover[data-oid="${noteId}"]`);
        if (panel) {
            panel.style.display = "none";
            panel.style.left = `${screenX}px`;
            panel.style.top = `${screenY}px`;
            panel.style.display = "flex";
            panel.style.height = '400px';
        }
        virtual_ref.remove();
    }, 800);
}

function timestampParse(timestamp) {
    let nums = timestamp.split(':');
    let time = 0;
    for (let num of nums) {
        // 计算时间戳(单位: 秒)
        time *= 60;
        time += parseFloat(num);
    }
    return time;
}

function timestampFormat(seconds) {
    let h = seconds / 3600 | 0;
    let m = (seconds % 3600) / 60 | 0;
    let s = seconds % 60 | 0;
    let ms = seconds * 1000 % 1000 | 0;
    let timestamp = `${intPrefix(h, 2)}:${intPrefix(m, 2)}:${intPrefix(s, 2)}.${intPrefix(ms, 3)}`;
    return timestamp;
}

function url2id(url) {
    let results = config.theme.regs.url.exec(url);
    // console.log(results);
    if (results && results.length >= 2) {
        return results[1];
    }
    return null;
}

function id2url(id, focus = 0) {
    if (parseInt(focus) === 1) return `siyuan://blocks/${id}/?focus=1`;
    else return `siyuan://blocks/${id}`;
}

function intPrefix(num, length) {
    let s = `${num}`;
    return s.length < length ? (Array(length).join('0') + num).slice(-length) : s;
}

function shuffle(arr) {
    // REF [如何将一个 JavaScript 数组打乱顺序？ - troy351的回答 - 知乎](https://www.zhihu.com/question/68330851/answer/262111061)
    for (let i = 1; i < arr.length; i++) {
        const random = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[random]] = [arr[random], arr[i]];
    }
    return arr;
}

function* Iterator(items, loop = false) {
    // REF [ES6中的迭代器(Iterator)和生成器(Generator) - 小火柴的蓝色理想 - 博客园](https://www.cnblogs.com/xiaohuochai/p/7253466.html)
    if (loop) {
        for (let i = 0; true; i = (i + 1) % items.length) {
            yield items[i];
        }
    }
    else {
        for (let i = 0; i < items.length; ++i) {
            yield items[i];
        }
    }
}

/**
 * 获取对象属性数量
 * REF [js 获取对象属性个数 - 走看看](http://t.zoukankan.com/ooo0-p-6534333.html)
 */
function getObjectLength(obj) {
    return Object.keys(obj).length;
}

/**
 * 写入剪贴板(兼容模式)
 * REF [google chrome - navigator.clipboard is undefined - Stack Overflow](https://stackoverflow.com/questions/51805395/navigator-clipboard-is-undefined)
 */
function copyToClipboard(text) {
    // navigator clipboard api needs a secure context (https | localhost | loopback)
    if (navigator.clipboard && window.isSecureContext) {
        // navigator clipboard api method'
        return navigator.clipboard.writeText(text);
    } else {
        // text area method
        const textarea = document.createElement("textarea");
        textarea.value = text;
        // make the textarea out of viewport
        // textarea.style.position = "fixed";
        // textarea.style.left = "-999999px";
        // textarea.style.top = "-999999px";
        textarea.style.display = "none";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        return new Promise((resolve, reject) => {
            // here the magic happens
            document.execCommand('copy') ? resolve() : reject();
            textarea.remove();
        });
    }
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
    const result = /(y+)/.exec(fmt);
    if (result) fmt = fmt.replace(result[1], (this.getFullYear() + "").substring(4 - result[1].length));
    for (var k in o) {
        const reg = new RegExp(`(${k})`);
        result = reg.exec(fmt);
        if (result) fmt = fmt.replace(result[1], (result[1].length === 1) ? (o[k]) : ((new Array(result[1].length + 1).join('0') + o[k]).substring(("" + o[k]).length)));
    }
    return fmt;
};
