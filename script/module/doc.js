/* 复制加强 */

import { config } from './config.js';
import { isKey } from './../utils/hotkey.js';
import { toolbarItemInit } from './../utils/ui.js';
import {
    exportMdContent,
    updateBlock,
} from './../utils/api.js';

async function docCopy() {
    const background = document.querySelector('div.layout__wnd--active div.protyle:not(.fn__none)>div.protyle-content>div.protyle-background');
    if (background) {
        let id = background.dataset.nodeId;
        if (id) {
            let data = await exportMdContent(id);
            if (data) {
                let content = data.content;
                navigator.clipboard.writeText(content);
            }
        }
    }
}

async function docDelete() {
    const background = document.querySelector('div.layout__wnd--active div.protyle:not(.fn__none)>div.protyle-content>div.protyle-background');
    if (background) {
        let id = background.dataset.nodeId;
        if (id) {
            await updateBlock(
                id,
                'markdown',
                '',
            );
        }
    }
}

async function docCut() {
    const background = document.querySelector('div.layout__wnd--active div.protyle:not(.fn__none)>div.protyle-content>div.protyle-background');
    if (background) {
        let id = background.dataset.nodeId;
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

function outlineCopy(mode) {
    const outline = document.querySelector('.sy__outline .b3-list.b3-list--background');
    const content = MAP.outline.style.content[config.theme.doc.outline.style.content];
    if (outline) {
        let mark = MAP.outline.style.list[mode];
        let markdown = [];
        function outlineParser(node, deep = 0, index = 0) {
            // 大纲解析器
            switch (node.nodeName) {
                case 'LI':
                    let id = node.dataset.nodeId; // 块 ID
                    let text = node.querySelector('.b3-list-item__text').innerText; // 块内容
                    let level = parseInt(/^h(\d+)$/.exec(node.dataset.subtype)[1]); // 标题级别
                    let headline = config.theme.doc.outline.headline; // 标题级别标志配置选项
                    markdown.push(`${' '.repeat(deep * 4)}${mark(++index)}${headline.handler(level, headline.enable)}${content(text, id)}`);
                    return index;
                case 'UL':
                    markdown.push('');
                    let child_index = 0;
                    for (let child of node.childNodes) {
                        child_index = outlineParser(child, deep + 1, child_index);
                    }
                    return index;
                default:
                    return 0;
            }
        }

        switch (config.theme.doc.outline.top) {
            case 'd':
                outlineParser(outline.firstElementChild);
                outlineParser(outline.lastElementChild);
                break;
            case 'h':
                outlineParser(outline.lastElementChild, -1);
                break;
            default:
                return;
        }
        navigator.clipboard.writeText(markdown.join('\n'));
    }
}


setTimeout(() => {
    try {
        if (config.theme.doc.enable) {
            let body = document.body;

            if (config.theme.doc.outline.enable) {
                // 复制当前文档大纲
                let Fn_outlineCopy = toolbarItemInit(
                    config.theme.doc.outline.toolbar,
                    () => outlineCopy('o'),
                );

                body.addEventListener('keyup', (e) => {
                    if (isKey(e, config.theme.hotkeys.doc.outline.o)) {
                        // console.log(e);
                        Fn_outlineCopy();
                    }
                });
                body.addEventListener('keyup', (e) => {
                    if (isKey(e, config.theme.hotkeys.doc.outline.u)) {
                        // console.log(e);
                        setTimeout(() => outlineCopy('u'), 0);
                    }
                });
                body.addEventListener('keyup', (e) => {
                    if (isKey(e, config.theme.hotkeys.doc.outline.t)) {
                        // console.log(e);
                        setTimeout(() => outlineCopy('t'), 0);
                    }
                });
            }

            if (config.theme.doc.copy.enable) {
                // 复制当前文档全文
                let Fn_docCopy = toolbarItemInit(
                    config.theme.doc.copy.toolbar,
                    docCopy,
                );

                body.addEventListener('keyup', (e) => {
                    // console.log(e);
                    if (isKey(e, config.theme.hotkeys.doc.copy)) {
                        Fn_docCopy();
                    }
                });
            }

            if (config.theme.doc.delete.enable) {
                // 删除当前文档全文
                let Fn_docDelete = toolbarItemInit(
                    config.theme.doc.delete.toolbar,
                    docDelete,
                );

                body.addEventListener('keyup', (e) => {
                    if (isKey(e, config.theme.hotkeys.doc.delete)) {
                        // console.log(e);
                        Fn_docDelete();
                    }
                });
            }

            if (config.theme.doc.cut.enable) {
                // 剪切当前文档全文
                body.addEventListener('keyup', (e) => {
                    if (isKey(e, config.theme.hotkeys.doc.cut)) {
                        // console.log(e);
                        setTimeout(docCut, 0);
                    }
                });
            }
        }
    } catch (err) {
        console.error(err);
    }
}, 0);
