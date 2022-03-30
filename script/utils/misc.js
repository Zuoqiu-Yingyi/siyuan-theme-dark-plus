/* 杂项工具 */

export {
    merge, // 递归合并对象
    styleHandle, // 样式标签处理
    HTMLDecode, // HTML 解码
    goto, // 跳转到指定块
    isNum, // 判断字符串是否为数字
    hoverPreview, // 悬浮预览指定块
    timestampParse, // 时间戳解析为秒数
    timestampFormat, // 时间格式化为时间戳
    url2id, // 块超链接转换为块 id
    id2url, // 块 id 转换为块超链接
    intPrefix, // 整数填充前导零
}

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

function styleHandle(id, content) {
    let style = document.getElementById(id);
    if (style) {
        style.remove();
    } else {
        style = document.createElement('style');
        style.id = id;
        style.innerHTML = content;
        document.head.appendChild(style);
    }
}

function HTMLDecode(text) {
    // REF: [javascript处理HTML的Encode(转码)和Decode(解码)总结 - 孤傲苍狼 - 博客园](https://www.cnblogs.com/xdp-gacl/p/3722642.html)
    let temp = document.createElement("div");
    temp.innerHTML = text;
    return temp.textContent;
}

function goto(id) {
    let doc = window.document
    // console.log(doc)
    let target = doc.querySelector("div.protyle-wysiwyg div[data-node-id] div[contenteditable][spellcheck]")
    if (target) {
        let link = doc.createElement("span")
        link.setAttribute("data-type", "block-ref")
        link.setAttribute("data-id", id)

        target.appendChild(link)
        link.click()
        link.remove()
    }
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
    return url.substr(16);
}

function id2url(id) {
    return `siyuan://blocks/${id}`;
}

function intPrefix(num, length) {
    let s = `${num}`;
    return s.length < length ? (Array(length).join('0') + num).slice(-length) : s;
}
