/* 思源 DOM */

export {
    getFocusedBlock, // 获得焦点所在的块
    getFocusedBlockID, // 获得焦点所在块 ID
    getFocusedDoc, // 获得焦点所在文档
    getFocusedDocBackground, // 获得焦点所在文档的背景
    getFocusedDocID, // 获得焦点所在文档的 ID
    getFocusedID, // 获得焦点所在的块 ID, 否则获得焦点所在文档的 ID
    getTargetBlockID, // 获得目标的块 ID
    getTargetHref, // 获得目标超链接
    getBlockMark, // 获得块标记
    getBlockSelected, // 获得块选中
    setBlockDOMAttrs, // 设置块属性
    setFontSize, // 设置字体大小
};

import { url2id } from './misc.js';
import { config } from './../module/config.js';

/**
 * 获得焦点所在的块
 * @returns {HTMLElement} 光标所在块
 * @returns {null} 光标不在块内
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
 * @returns {string} 块 ID
 * @returns {null} 光标不在块内
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
 * @returns {HTMLElement} 焦点所在文档
 * @returns {null} 没有聚焦的文档
 */
function getFocusedDoc() {
    return document.querySelector('div.layout__wnd--active div.protyle:not(.fn__none) > div.protyle-content > div.protyle-wysiwyg[data-doc-type="NodeDocument"]')
        || document.querySelector('#editor > div.protyle-content >  div.protyle-wysiwyg[data-doc-type="NodeDocument"]')
        || null;
}

/**
 * 获得焦点所在文档的背景
 * @returns {HTMLElement} 焦点所在文档的背景
 * @returns {null} 没有聚焦的文档
 */
function getFocusedDocBackground() {
    return document.querySelector('div.layout__wnd--active div.protyle:not(.fn__none) > div.protyle-content > div.protyle-background')
        || document.querySelector('#editor > div.protyle-content > div.protyle-background')
        || null;
}

/**
 * 获得焦点所在文档的 ID
 * @returns {string} 文档 ID
 * @returns {null} 没有聚焦的文档
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
 * @returns {string} 块 ID 或文档 ID
 * @returns {null} 光标不在块内或文档内
 */
function getFocusedID() {
    return getFocusedBlockID() || getFocusedDocID() || null;
}

/**
 * 获得目标的块 ID
 * @target {HTMLElement} 目标
 * @returns {string} 块 ID
 * @returns {null} 没有找到块 ID
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
 * 获得目标超链接
 * @param {HTMLElement} target 目标
 * @returns {string} 超链接
 * @returns {null} 没有找到超链接
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
 * @returns {null} 没有找到块 ID
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
 * @returns {string} 块 ID
 * @returns {
 *     id: string, // 块 ID
 *     type: string, // 块类型
 *     subtype: string, // 块子类型(若没有则为 null)
 * }
 * @returns {null} 没有找到块 ID */
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
        if (block.className === 'protyle-background') block = block.nextElementSibling.nextElementSibling;
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
 * @returns {number} 设置后的字号
 * @returns {null} 没有找到字号
 */
function setFontSize(size) {
    let style = document.getElementById('editorFontSize');
    if (style) {
        style.innerHTML = style.innerHTML.replace(config.theme.regs.fontsize, size);
        return parseInt(config.theme.regs.fontsize.exec(style.innerHTML));
    }
    return null;
}
