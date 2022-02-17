/* 杂项工具 */
export {
    isNum, // 判断字符串是否为数字
    hoverPreview, // 悬浮预览指定块
    timestampParse, // 时间戳解析为秒数
    url2id, // 块超链接转换为块 id
    id2url, // 块 id 转换为块超链接
    intPrefix, // 整数填充前导零
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
        ".protyle-wysiwyg div[data-node-id] div[contenteditable]"
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
