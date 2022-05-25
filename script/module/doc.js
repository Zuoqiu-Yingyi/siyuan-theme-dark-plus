/* 复制加强 */

import { config } from './config.js';
import { isKey } from './../utils/hotkey.js';
import { toolbarItemInit } from './../utils/ui.js';
import {
    getDockFromPanel,
    getFocusedDocID
} from './../utils/dom.js';
import {
    ialCreate,
    HTMLDecode,
} from './../utils/string.js';
import { getObjectLength } from './../utils/misc.js';
import {
    exportMdContent,
    updateBlock,
    getDocOutline,
} from './../utils/api.js';

async function docCopy() {
    let id = getFocusedDocID();
    if (id) {
        let data = await exportMdContent(id);
        if (data) {
            let content = data.content;
            navigator.clipboard.writeText(content);
        }
    }
}

async function docDelete() {
    let id = getFocusedDocID();
    if (id) {
        await updateBlock(
            id,
            'markdown',
            '',
        );
    }
}

async function docCut() {
    let id = getFocusedDocID();
    if (id) {
        let data = await exportMdContent(id);
        if (data) {
            let content = data.content;
            navigator.clipboard.writeText(content);
            await updateBlock(
                id,
                'markdown',
                '',
            );
        }
    }
}

const MAP = {
    outline: {
        style: {
            list: {
                'o': (_) => `${_}. `,
                'u': (_) => '* ',
                't': (_) => '* [ ] ',
            },
            content: {
                'text': (text, id, title) => text,
                'link': (text, id, title) => `[${text}](siyuan://blocks/${id}${title ? ` "${title}" ` : ''})`,
                'ref': (text, id, title) => `(${id} "${title}")`,
            },
        },
    },
}

async function outlineCopy(mode) {
    const content = MAP.outline.style.content[config.theme.doc.outline.style.content];
    let mark = MAP.outline.style.list[mode];
    let markdown = [];

    function outlineDomParser(node, deep = 0, index = 0) {
        // 大纲解析器, 通过解析页面 DOM 获得大纲
        switch (node.localName) {
            case 'li':
                let indent = deep * 4;
                if (indent >= 0) {
                    let id = node.dataset.nodeId; // 块 ID
                    let text = node.querySelector('span.b3-list-item__text').innerText
                        || config.theme.doc.outline.empty; // 块内容
                    let level = node.dataset.subtype
                        ? parseInt(/^h(\d+)$/.exec(node.dataset.subtype)[1])
                        : 0; // 标题级别
                    let heading = config.theme.doc.outline.heading; // 标题级别标志配置选项
                    markdown.push(`${' '.repeat(indent)}${mark(++index)}${heading.handler(level, heading.enable)}${content(text, id)}`);
                }
                return index;
            case 'ul':
                markdown.push('');
                let child_index = 0;
                for (let child of node.childNodes) {
                    child_index = outlineDomParser(child, deep + 1, child_index);
                }
                return index;
            default:
                return 0;
        }
    }

    function outlineParser(node, offset = 0, index = 0) {
        // 大纲解析器, 通过解析 API 响应数据获得大纲

        let indent = (node.depth + offset) * 4; // 缩进
        if (indent >= 0) {
            // 节点信息
            let id = node.id; // 块 ID
            let text = HTMLDecode(
                node.content
                || node.name
                || config.theme.doc.outline.empty
            ); // 块内容
            let level = node.subType
                ? parseInt(/^h(\d+)$/.exec(node.subType)[1])
                : 0; // 标题级别
            let heading = config.theme.doc.outline.heading; // 标题级别标志配置选项
            markdown.push(`${' '.repeat(indent)}${mark(++index)}${heading.handler(level, heading.enable)}${content(text, id)}`);
        }

        if (node.count > 0) {
            // 遍历子节点
            markdown.push('');
            let child_index = 0;
            for (const chile of (node.children || node.blocks)) {
                // console.log(child_index);
                child_index = outlineParser(chile, offset, child_index);
            }
        }
        return index;
    }

    function newOutlineParser(outline) {
        // 适配 v2.0.13 的新的 API
        for (const chile of outline) {
            outlineParser(chile);
        }
    }

    const id = getFocusedDocID();
    let outline = id ? await getDocOutline(id) : null;
    if (outline) {
        // 使用 API 解析器方案
        // console.log(outline);
        if (outline instanceof Array) newOutlineParser(outline);
        else {
            switch (config.theme.doc.outline.top) {
                case 'd':
                    outlineParser(outline[0]);
                    break;
                case 'h':
                    outlineParser(outline[0], -1);
                    break;
                default:
                    return;
            }
        }
    }
    else {
        // 使用 DOM 解析器方案
        const dock = getDockFromPanel('outline');
        outline = dock
            ? dock.data.outline.element.firstElementChild
            : document.querySelector('.sy__outline .b3-list.b3-list--background');
        // console.log(outline);
        if (outline
            && outline.firstElementChild
            && !outline.firstElementChild.classList.contains('b3-list--empty')
        ) {
            // console.log(outline);
            outlineDomParser(outline);
        }
    }

    if (markdown.length > 0) {
        if (getObjectLength(config.theme.doc.outline.ial) > 0) markdown.push(ialCreate(config.theme.doc.outline.ial));
        navigator.clipboard.writeText(markdown.join('\n'));
    }
}


setTimeout(() => {
    try {
        if (config.theme.doc.enable) {

            if (config.theme.doc.outline.enable) {
                if (config.theme.doc.outline.o.enable) { }
                // 复制当前文档大纲
                const Fn_outlineCopy_u = toolbarItemInit(
                    config.theme.doc.outline.u.toolbar,
                    () => outlineCopy('u'),
                );
                const Fn_outlineCopy_o = toolbarItemInit(
                    config.theme.doc.outline.o.toolbar,
                    () => outlineCopy('o'),
                );
                const Fn_outlineCopy_t = toolbarItemInit(
                    config.theme.doc.outline.t.toolbar,
                    () => outlineCopy('t'),
                );

                window.addEventListener('keyup', (e) => {
                    if (isKey(e, config.theme.hotkeys.doc.outline.u)) {
                        // console.log(e);
                        Fn_outlineCopy_u();
                    }
                }, true);
                window.addEventListener('keyup', (e) => {
                    if (isKey(e, config.theme.hotkeys.doc.outline.o)) {
                        // console.log(e);
                        Fn_outlineCopy_o();
                    }
                }, true);
                window.addEventListener('keyup', (e) => {
                    if (isKey(e, config.theme.hotkeys.doc.outline.t)) {
                        // console.log(e);
                        Fn_outlineCopy_t();
                    }
                }, true);
            }

            if (config.theme.doc.copy.enable) {
                // 复制当前文档全文
                const Fn_docCopy = toolbarItemInit(
                    config.theme.doc.copy.toolbar,
                    docCopy,
                );

                window.addEventListener('keyup', (e) => {
                    // console.log(e);
                    if (isKey(e, config.theme.hotkeys.doc.copy)) {
                        Fn_docCopy();
                    }
                }, true);
            }

            if (config.theme.doc.delete.enable) {
                // 删除当前文档全文
                const Fn_docDelete = toolbarItemInit(
                    config.theme.doc.delete.toolbar,
                    docDelete,
                );

                window.addEventListener('keyup', (e) => {
                    if (isKey(e, config.theme.hotkeys.doc.delete)) {
                        // console.log(e);
                        Fn_docDelete();
                    }
                }, true);
            }

            if (config.theme.doc.cut.enable) {
                // 剪切当前文档全文
                const Fn_docCut = toolbarItemInit(
                    config.theme.doc.cut.toolbar,
                    docCut,
                );

                window.addEventListener('keyup', (e) => {
                    if (isKey(e, config.theme.hotkeys.doc.cut)) {
                        // console.log(e);
                        Fn_docCut();
                    }
                }, true);
            }
        }
    } catch (err) {
        console.error(err);
    }
}, 0);
