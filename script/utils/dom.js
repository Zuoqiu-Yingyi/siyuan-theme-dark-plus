/* 思源 DOM */

export {
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
    getTargetHref, // 获得目标超链接
    getBlockMark, // 获得块标记
    getBlockSelected, // 获得块选中
    setBlockDOMAttrs, // 设置块属性
    setFontSize, // 设置字体大小
    setBlockSlider, // 设置块滑块位置
};

import { url2id } from './misc.js';
import { config } from './../module/config.js';

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
    return document.querySelector('div.layout__wnd--active div.protyle:not(.fn__none) > div.protyle-content > div.protyle-wysiwyg[data-doc-type="NodeDocument"]')
        || document.querySelector('#editor > div.protyle-content >  div.protyle-wysiwyg[data-doc-type="NodeDocument"]')
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
    while (element != null && element.dataset.nodeId == null) element = element.parentNode;
    if (element != null) return element;
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
        && node.parentElement.parentElement.firstElementChild.dataset.nodeId
        && node.parentElement.parentElement.lastElementChild.dataset.docType
    ) return {
        id: node.parentElement.parentElement.firstElementChild.dataset.nodeId,
        type: node.parentElement.parentElement.lastElementChild.dataset.docType,
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
 * @param {string} id 块 ID
 * @param {object} attrs 块属性 dict
 */
function setBlockDOMAttrs(id, attrs) {
    let block = document.querySelector(`div.protyle-content div[data-node-id="${id}"]`);
    if (block) {
        if (block.className === 'protyle-background') {
            while (block && block.dataset.docType !== 'NodeDocument') block = block.nextElementSibling;
        };
        // console.log(block);
        // console.log(attrs);
        for (let key of Object.keys(attrs)) {
            if (attrs[key]) block.setAttribute(key, attrs[key]);
            else block.removeAttribute(key);
        }
    }
    // console.log(block);
}

/**
 * 设置编辑器字号
 * @param {number} size 字号
 * @return {number} 设置后的字号
 * @return {null} 没有找到字号
 */
function setFontSize(size) {
    let style = document.getElementById('editorFontSize');
    if (style) {
        style.innerHTML = style.innerHTML.replace(config.theme.regs.fontsize, size);
        return parseInt(config.theme.regs.fontsize.exec(style.innerHTML));
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
    index += offset;
    if (temp.length >= 3) // 更新鼠标悬浮标签信息
        scroll.ariaLabel = `Blocks ${index}/${Math.max(parseInt(temp[2]), index)}`;
    if (scroll.firstElementChild) // 更新滚动条位置
        scroll.firstElementChild.value = index;
}
