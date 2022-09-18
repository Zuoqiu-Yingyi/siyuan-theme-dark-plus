/* 思源 DOM */

export {
    getDockFromPanel, // 从面板名称获得面板所在的 dock
    getFocusedBlock, // 获得焦点所在的块
    getFocusedBlockID, // 获得焦点所在块 ID
    getFocusedDoc, // 获得焦点所在文档
    getFocusedDocBackground, // 获得焦点所在文档的背景
    getFocusedDocID, // 获得焦点所在文档的 ID
    getFocusedID, // 获得焦点所在的块 ID, 否则获得焦点所在文档的 ID
    getTargetBlock, // 获得目标的块
    getTargetBlockID, // 获得目标的块 ID
    getTargetBlockIndex, // 获得目标的块在文档中的索引
    getTargetInboxID, // 获得目标的收件箱 ID
    getTargetHistory, // 获得目标的历史文档路径与 ID
    getTargetHref, // 获得目标超链接
    getBlockMark, // 获得块标记
    getBlockSelected, // 获得块选中
    setBlockDOMAttrs, // 设置块属性
    setFontSize, // 设置字体大小
    setBlockSlider, // 设置块滑块位置
    getEditors, // 获得所有编辑器
    getEditor, // 获得指定编辑器
    disabledProtyle, // 禁用编辑器
    enableProtyle, // 解除编辑器禁用
    setDockState, // 设置侧边栏状态
};

import { url2id } from './misc.js';
import { config } from './../module/config.js';

/**
 * 从面板名称获得面板所在的 dock
 * @params {string} panelName 面板名称
 *     file
 *     outline
 *     inbox
 *     bookmark
 *     tag
 *     graph
 *     globalGraph
 *     backlink
 * @return {object} window.siyuan.layout.* 面板所在的 dock
 * @return {null} 没有找到面板
 */
function getDockFromPanel(panelName) {
    const layout = window.siyuan.layout;
    for (const panel in layout) {
        if (layout[panel].data && layout[panel].data[panelName]) {
            return layout[panel];
        }
    }
    return null;
}

/**
 * 获得焦点所在的块
 * @return {HTMLElement} 光标所在块
 * @return {null} 光标不在块内
 */
function getFocusedBlock() {
    let block = window.getSelection()
        && window.getSelection().focusNode
        && window.getSelection().focusNode.parentElement; // 当前光标
    while (block != null && block.dataset.nodeId == null) block = block.parentElement;
    return block;
}

/**
 * 获得焦点所在块 ID
 * @return {string} 块 ID
 * @return {null} 光标不在块内
 */
function getFocusedBlockID() {
    let block = getFocusedBlock();
    if (block) {
        return block.dataset.nodeId;
    }
    else return null;
}

/**
 * 获得焦点所在文档
 * @return {HTMLElement} 焦点所在文档
 * @return {null} 没有聚焦的文档
 */
function getFocusedDoc() {
    return document.querySelector('div.layout__wnd--active div.protyle:not(.fn__none) > div.protyle-content > div.protyle-wysiwyg[data-doc-type]')
        || document.querySelector('#editor > div.protyle-content >  div.protyle-wysiwyg[data-doc-type]')
        || null;
}

/**
 * 获得焦点所在文档的背景
 * @return {HTMLElement} 焦点所在文档的背景
 * @return {null} 没有聚焦的文档
 */
function getFocusedDocBackground() {
    return document.querySelector('div.layout__wnd--active div.protyle:not(.fn__none) > div.protyle-content > div.protyle-background')
        || document.querySelector('#editor > div.protyle-content > div.protyle-background')
        || null;
}

/**
 * 获得焦点所在文档的 ID
 * @return {string} 文档 ID
 * @return {null} 没有聚焦的文档
 */
function getFocusedDocID() {
    let background = getFocusedDocBackground();
    if (background) {
        return background.dataset.nodeId;
    }
    else return null;
}

/**
 * 获得焦点所在的块 ID, 否则获得焦点所在文档的 ID
 * @return {string} 块 ID 或文档 ID
 * @return {null} 光标不在块内或文档内
 */
function getFocusedID() {
    return getFocusedBlockID() || getFocusedDocID() || null;
}


/**
 * 获得目标的块
 * @params {HTMLElement} target: 目标
 * @return {HTMLElement} 光标所在块
 * @return {null} 光标不在块内
 */
function getTargetBlock(target) {
    let element = target;
    while (element && element.dataset && !config.theme.regs.id.test(element.dataset.nodeId)) element = element.parentNode;
    if (element && element.dataset && config.theme.regs.id.test(element.dataset.nodeId)) return element;
    else return null;
}

/**
 * 获得目标的块 ID
 * @params {HTMLElement} target: 目标
 * @return {string} 块 ID
 * @return {null} 没有找到块 ID
 */
function getTargetBlockID(target) {
    let element = target;
    while (element != null
        && !(element.localName === 'a' && element.href
            || element.dataset.href
            || config.theme.regs.id.test(element.dataset.nodeId)
            || config.theme.regs.id.test(element.dataset.oid)
            || config.theme.regs.id.test(element.dataset.id)
            || config.theme.regs.id.test(element.dataset.rootId)
        )) element = element.parentElement;

    if (element != null) {
        if (config.theme.regs.id.test(element.dataset.nodeId)) return element.dataset.nodeId;
        if (config.theme.regs.id.test(element.dataset.oid)) return element.dataset.oid;
        if (config.theme.regs.id.test(element.dataset.id)) return element.dataset.id;
        if (config.theme.regs.id.test(element.dataset.oid)) return element.dataset.rootId;
        if (config.theme.regs.url.test(element.dataset.href)) return url2id(element.dataset.href);
        if (config.theme.regs.url.test(element.href)) return url2id(element.href);
        return element.href || element.dataset.href || null;
    }
    else return null;
}

/**
 * 获得目标的块在文档中的索引
 * @params {HTMLElement} target: 目标
 * @return {int} index 
 * @return {
 *      doc: string, // 文档 ID
 *      index: int, // 块在当前文档的位置
 *      offset: int, // 块序号偏移量
 *      scroll: HTMLElement, // 文档的块滚动条
 * }
 * @return {null} 没有找到块
 */
async function getTargetBlockIndex(target) {
    let element = target;
    let top = element;
    while (element != null // 没有找到目标, 退出
        && !element.classList.contains('protyle-wysiwyg') // 如果没有找到目标, 退出
    ) top = element, element = element.parentElement;

    if (element) {
        const scroll = top
            .parentElement
            .parentElement
            .nextElementSibling
            .nextElementSibling
            .nextElementSibling; // 块滚动条
        const MAX = parseInt(scroll.firstElementChild.max); // 当前文档的块数
        let index = parseInt(top.dataset.nodeIndex); // 当前块序号
        let first_index = parseInt(top.parentElement.firstElementChild.dataset.nodeIndex);
        let offset = first_index ? 0 : 1; // 块序号偏移量, 如果是从 0 开始, 则偏移量为 1
        // console.log(index, MAX);
        if (!index || index > MAX) { // 块编号超出范围, 需要手动计算编号
            index = 0;
            let pre_pointer = top;
            let next_pointer = top;
            let last_index;
            /* 首先计算到第一个块的编号, 因为一般都是从上往下翻页 */
            if (offset ? first_index < MAX : first_index <= MAX) {
                while (pre_pointer = pre_pointer.previousElementSibling) ++index;
                index += first_index;
            }
            else {
                /* 如果第一个块编号是无效的, 那么查找最近的一个块编号, 计算自身的编号 */
                offset = 0;
                first_index = null;
                while (true) {
                    if (pre_pointer || next_pointer) { // 如果有指针, 则继续
                        if (pre_pointer && parseInt(pre_pointer.dataset.nodeIndex) <= MAX) { // 搜索到 index 处于合理区间的块
                            first_index = pre_pointer.dataset.nodeIndex;
                            break;
                        }
                        if (next_pointer && parseInt(next_pointer.dataset.nodeIndex) <= MAX) { // 搜索到 index 处于合理区间的块
                            last_index = next_pointer.dataset.nodeIndex;
                            break;
                        }

                        /* 未搜索到 index 处于合理区间的块 */
                        pre_pointer = pre_pointer ? pre_pointer.previousElementSibling : null;
                        next_pointer = next_pointer ? next_pointer.nextElementSibling : null;
                        ++index;
                    }
                    else break;
                }
                if (first_index) index += parseInt(first_index);
                else if (last_index) index = parseInt(last_index) - index;
            }
        }
        return {
            doc: top
                .parentElement
                .parentElement
                .firstElementChild.dataset.nodeId,
            index: index,
            offset: offset,
            scroll: scroll,
        };
    }
    else return null;
}

/**
 * 获得目标的收集箱 ID
 * @params {HTMLElement} target: 目标
 * @return {string} 收集箱 ID
 * @return {null} 没有找到收集箱 ID
 */
function getTargetInboxID(target) {
    let element = target;
    let rag = /^\d{13}$/
    while (element != null && !config.theme.regs.inboxid.test(element.dataset.id)) element = element.parentElement;

    if (element != null) {
        if (config.theme.regs.inboxid.test(element.dataset.id)) return element.dataset.id;
    }
    else return null;
}

/**
 * 获得目标的历史文档路径与 ID
 * @params {HTMLElement} target: 目标
 * @return {object}
 *      path: 历史文档文件路径
 *      id: 历史文档对应的 ID
 * @return {null} 没有找到历史文档
 */
function getTargetHistory(target) {
    let element = target;
    while (element != null && element.localName !== 'li') element = element.parentElement;

    if (element != null) {
        const result = config.theme.regs.historypath.exec(element.dataset.path);
        if (result
            && element.dataset.type === 'doc'
            && element.classList.contains('b3-list-item')
        ) {
            return {
                path: element.dataset.path,
                id: result[1],
            };
        }
    }
    return null;
}

/**
 * 获得目标超链接
 * @params {HTMLElement} target 目标
 * @return {string} 超链接
 * @return {null} 没有找到超链接
 */
function getTargetHref(target) {
    let href = null;
    if (target.localName === 'span'
        && target.dataset.href
    ) href = target.dataset.href;
    if (target.localName === 'a'
        && target.href
    ) href = target.href;
    return href;
}

/**
 * 获得块标所对应的块 ID
 * @param {HTMLElement} target 目标
 * @returns {
 *     id: string, // 块 ID
 *     type: string, // 块类型
 *     subtype: string, // 块子类型(若没有则为 null)
 * }
 * @return {null} 没有找到块 ID
 */
function getBlockMark(target) {
    let node = target;
    if (node.localName === 'use') node = node.parentElement;
    if (node.localName === 'svg') node = node.parentElement;

    // 非文档块块标
    if (node.localName === 'button'
        && node.getAttribute('draggable') === 'true'
        && node.dataset.nodeId
        && node.dataset.type
    ) return {
        id: node.dataset.nodeId,
        type: node.dataset.type,
        subtype: node.dataset.subtype,
    };

    // 文档块块标
    if (node.localName === 'span'
        && node.classList.contains('protyle-title__icon')
        && node.parentElement.parentElement.firstElementChild.classList.contains('protyle-background')
    ) return {
        id: node.parentElement.parentElement.firstElementChild.dataset.nodeId,
        // type: node.parentElement.parentElement.lastElementChild.dataset.docType,
        type: 'NodeDocument', // 跳转时文档块的该属性是目标块的块类型, 是个bug
        subtype: null,
    };

    return null;
}

/**
 * 获得所选择的块对应的块 ID
 * @return {string} 块 ID
 * @return {
 *     id: string, // 块 ID
 *     type: string, // 块类型
 *     subtype: string, // 块子类型(若没有则为 null)
 * }
 * @return {null} 没有找到块 ID */
function getBlockSelected() {
    let node_list = document.querySelectorAll('.protyle-wysiwyg--select');
    if (node_list.length === 1 && node_list[0].dataset.nodeId != null) return {
        id: node_list[0].dataset.nodeId,
        type: node_list[0].dataset.type,
        subtype: node_list[0].dataset.subtype,
    };
    return null;
}

/**
 * 设置 DOM 中的块属性
 * @deprecated 2.1.15+ https://github.com/siyuan-note/siyuan/issues/5847 https://github.com/siyuan-note/siyuan/issues/5866
 * @param {string} id 块 ID
 * @param {object} attrs 块属性 dict
 */
function setBlockDOMAttrs(id, attrs) {
    let block = document.querySelector(`.protyle-content [data-node-id="${id}"]`);
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
 * 设置编辑器字号
 * REF https://github.com/siyuan-note/siyuan/blob/fcabf93cabf0383a8b59616d66ec44e7869236cf/app/src/protyle/export/index.ts#L242-L107
 * @param {number} fontSize 字号
 * @return {number} 设置后的字号
 * @return {null} 没有找到字号
 */
function setFontSize(fontSize) {
    let style = document.getElementById('editorFontSize');
    if (style) {
        const height = Math.floor(fontSize * 1.625);
        style.innerHTML = `
.b3-typography, .protyle-wysiwyg, .protyle-title {font-size:${fontSize}px !important}
.b3-typography code:not(.hljs), .protyle-wysiwyg code:not(.hljs) { font-variant-ligatures: ${window.siyuan.config.editor.codeLigatures ? "normal" : "none"} }
.li > .protyle-action {height:${height + 8}px;line-height: ${height + 8}px}
.protyle-wysiwyg [data-node-id].li > .protyle-action ~ .h1, .protyle-wysiwyg [data-node-id].li > .protyle-action ~ .h2, .protyle-wysiwyg [data-node-id].li > .protyle-action ~ .h3, .protyle-wysiwyg [data-node-id].li > .protyle-action ~ .h4, .protyle-wysiwyg [data-node-id].li > .protyle-action ~ .h5, .protyle-wysiwyg [data-node-id].li > .protyle-action ~ .h6 {line-height:${height + 8}px;}
.protyle-wysiwyg [data-node-id].li > .protyle-action:after {height: ${fontSize}px;width: ${fontSize}px;margin:-${fontSize / 2}px 0 0 -${fontSize / 2}px}
.protyle-wysiwyg [data-node-id].li > .protyle-action svg {height: ${Math.max(14, fontSize - 8)}px}
.protyle-wysiwyg [data-node-id] [spellcheck="false"] {min-height:${height}px}
.protyle-wysiwyg .li {min-height:${height + 8}px}
.protyle-gutters button svg {height:${height}px}
.protyle-wysiwyg img.emoji, .b3-typography img.emoji {width:${height - 8}px}
.protyle-wysiwyg .h1 img.emoji, .b3-typography h1 img.emoji {width:${Math.floor(fontSize * 1.75 * 1.25)}px}
.protyle-wysiwyg .h2 img.emoji, .b3-typography h2 img.emoji {width:${Math.floor(fontSize * 1.55 * 1.25)}px}
.protyle-wysiwyg .h3 img.emoji, .b3-typography h3 img.emoji {width:${Math.floor(fontSize * 1.38 * 1.25)}px}
.protyle-wysiwyg .h4 img.emoji, .b3-typography h4 img.emoji {width:${Math.floor(fontSize * 1.25 * 1.25)}px}
.protyle-wysiwyg .h5 img.emoji, .b3-typography h5 img.emoji {width:${Math.floor(fontSize * 1.13 * 1.25)}px}
.protyle-wysiwyg .h6 img.emoji, .b3-typography h6 img.emoji {width:${Math.floor(fontSize * 1.25)}px}
.b3-typography, .protyle-wysiwyg, .protyle-title, .protyle-title__input{font-family: "${window.siyuan.config.editor.fontFamily}", "quote", "Helvetica Neue", "Luxi Sans", "DejaVu Sans", "Hiragino Sans GB", "Microsoft Yahei", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Segoe UI Symbol", "Android Emoji", "EmojiSymbols" !important;}
`;
        return parseInt(config.theme.regs.fontsize.exec(style.innerHTML));
    }
    return null;
}

/**
 * 从布局中获得编辑器列表(多叉树遍历)
 * @params {layout} centerLayout 编辑器布局
 */
function getEditorsFromLayout(centerLayout) {
    const editors = [];
    const layouts = [];
    layouts.push(centerLayout);
    while (layouts.length > 0) {
        const layout = layouts.pop();
        if (layout.children.length > 0) {
            for (let child of layout.children) {
                if (child.model?.editor) editors.push(child.model.editor);
                else if (child.children) layouts.push(child);
            }
        }
    }
    return editors;
}

/**
 * 从悬浮面板中获得编辑器列表
 * @params {layout} blockPanels 悬浮面板
 */
function getEditorsFromblockPanels(blockPanels) {
    const editors = [];
    for (const blockPanel of blockPanels) {
        for (const editor of blockPanel.editors) {
            editors.push(editor);
        }
    }
    return editors;
}

/**
 * 获得所有的编辑器
 * @return {array} 编辑器列表
 */
function getEditors() {
    return window.siyuan.layout
        ? getEditorsFromLayout(window.siyuan.layout.centerLayout).concat(getEditorsFromblockPanels(window.siyuan.blockPanels))
        : [window.siyuan.mobileEditor];
}

/**
 * 获得指定的编辑器
 * @params {string} id 文档 ID
 * @return {object} 编辑器
 * @return {null} 没有找到编辑器
 */
function getEditor(id) {
    const editors = getEditors();
    for (const editor of editors) {
        if (editor.protyle.options.blockId === id) return editor;
    }
    return null;
}

/**
 * 设置块滚动条的位置
 * @params {int} index: 块在文档中的位置索引
 * @params {HTMLElement} scroll: 滚动条容器
 */
function setBlockSlider(index, scroll, offset = 0) {
    const temp = /^Blocks\s+(\d+)\/(\d+)$/.exec(scroll.ariaLabel);
    if (temp) {
        index += offset;
        if (temp.length >= 3) // 更新鼠标悬浮标签信息
            scroll.ariaLabel = `Blocks ${index}/${Math.max(parseInt(temp[2]), index)}`;
        if (scroll.firstElementChild) // 更新滚动条位置
            scroll.firstElementChild.value = index;
    }
}

/**
 * REF: [siyuan/hideElements.ts at 4c46937744c6746c9e9c2fa5219386867d966dcc · siyuan-note/siyuan](https://github.com/siyuan-note/siyuan/blob/4c46937744c6746c9e9c2fa5219386867d966dcc/app/src/protyle/ui/hideElements.ts)
 */
// "gutter", "toolbar", "select", "hint", "util", "dialog"
function hideElements(panels, protyle) {
    if (!protyle) {
        if (panels.includes("dialog")) {
            for (let i = 0; i < window.siyuan.dialogs.length; i++) {
                if (window.siyuan.dialogs[i].destroy()) {
                    i--;
                }
            }
        }
        return;
    }
    if (panels.includes("hint")) {
        clearTimeout(protyle.hint.timeId);
        protyle.hint.element.classList.add("fn__none");
    }
    if (protyle.gutter && panels.includes("gutter")) {
        protyle.gutter.element.classList.add("fn__none");
        protyle.gutter.element.innerHTML = "";
        // https://ld246.com/article/1651935412480
        protyle.wysiwyg.element.querySelectorAll(".protyle-wysiwyg--hl").forEach((item) => {
            item.classList.remove("protyle-wysiwyg--hl");
        });
    }
    if (protyle.toolbar && panels.includes("toolbar")) {
        protyle.toolbar.element.classList.add("fn__none");
    }
    if (protyle.toolbar && panels.includes("util")) {
        const pinElement = protyle.toolbar.subElement.querySelector('[data-type="pin"]');
        if (!pinElement || (pinElement && !pinElement.classList.contains("ft__primary"))) {
            protyle.toolbar.subElement.classList.add("fn__none");
        }
    }
    if (panels.includes("select")) {
        protyle.wysiwyg.element.querySelectorAll(".protyle-wysiwyg--select").forEach(item => {
            item.classList.remove("protyle-wysiwyg--select");
        });
    }
};

/**
 * REF: [siyuan/hasClosest.ts at master · siyuan-note/siyuan](https://github.com/siyuan-note/siyuan/blob/master/app/src/protyle/util/hasClosest.ts)
 */
function hasClosestByClassName(element, className, top = false) {
    if (!element) {
        return false;
    }
    if (element.nodeType === 3) {
        element = element.parentElement;
    }
    let e = element;
    let isClosest = false;
    while (e && !isClosest && (top ? e.tagName !== "BODY" : !e.classList.contains("protyle-wysiwyg"))) {
        if (e.classList.contains(className)) {
            isClosest = true;
        } else {
            e = e.parentElement;
        }
    }
    return isClosest && e;
};

/**
 * REF: [siyuan/onGet.ts at master · siyuan-note/siyuan](https://github.com/siyuan-note/siyuan/blob/master/app/src/protyle/util/onGet.ts#L182)
 */
/** 禁用编辑器 */
function disabledProtyle(protyle) {
    hideElements(["gutter", "toolbar", "select", "hint", "util"], protyle);
    protyle.disabled = true;
    protyle.wysiwyg.element.setAttribute("contenteditable", "false");
    protyle.wysiwyg.element.querySelectorAll('[contenteditable="true"][spellcheck="false"]').forEach(item => {
        item.setAttribute("contenteditable", "false");
    });
};

/** 解除编辑器禁用 */
function enableProtyle(protyle) {
    protyle.disabled = false;
    if (navigator && navigator.maxTouchPoints > 1 && ["MacIntel", "iPhone"].includes(navigator.platform)) {
        // iPhone，iPad 端输入 contenteditable 为 true 时会在块中间插入 span
    } else {
        protyle.wysiwyg.element.setAttribute("contenteditable", "true");
    }
    protyle.wysiwyg.element.querySelectorAll('[contenteditable="false"][spellcheck="false"]').forEach(item => {
        if (!hasClosestByClassName(item, "protyle-wysiwyg__embed")) {
            item.setAttribute("contenteditable", "true");
        }
    });
};

/**
 * 设置侧边栏状态
 * @params {elements} items: 侧边栏展开/收缩按钮列表
 * @params {object} state: 侧边栏项想要设置的展开/收缩状态
 */
function setDockState(items, state) {
    for (const item of items) {
        const type = item.dataset.type;
        const active = item.classList.contains('dock__item--active');
        if (state[type] && (active ^ state[type].fold)) item.click();
    }
}
