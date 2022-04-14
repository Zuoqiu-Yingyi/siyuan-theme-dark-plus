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
}

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
        && !(
            config.theme.regs.id.test(element.dataset.nodeId)
            || config.theme.regs.id.test(element.dataset.id)
            || element.dataset.href
        )) element = element.parentElement;

    if (element != null) {
        if (config.theme.regs.id.test(element.dataset.nodeId)) return element.dataset.nodeId;
        if (config.theme.regs.id.test(element.dataset.id)) return element.dataset.id;
        if (config.theme.regs.url.test(element.dataset.href)) return url2id(element.dataset.href);
    }
    else return null;
}

/**
 * 获得目标超链接
 * @target {HTMLElement} 目标
 * @returns {string} 超链接
 * @returns {null} 没有找到超链接
 */
function getTargetHref(target) {
    let href = null;
    if (target.nodeName.toUpperCase() === 'SPAN') {
        if (
            target.dataset.type === 'a'
        ) {
            href = target.dataset.href;
        }
    }
    return href;
}
