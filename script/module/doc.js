/* 复制加强 */

import { config } from './config.js';
import { isKey } from './../utils/hotkey.js';
import { toolbarItemInit } from './../utils/ui.js';
import {
    getEditor,
    getDockFromPanel,
    getFocusedDocID,
} from './../utils/dom.js';
import {
    ialCreate,
    HTMLDecode,
} from './../utils/string.js';
import {
    getObjectLength,
    copyToClipboard,
} from './../utils/misc.js';
import { globalEventHandler } from './../utils/listener.js';
import {
    sql,
    exportMdContent,
    updateBlock,
    getDocOutline,
    transactions,
    pushMsg,
    pushErrMsg,
} from './../utils/api.js';

async function docCopy() {
    let id = getFocusedDocID();
    if (id) {
        let data = await exportMdContent(id);
        if (data) {
            let content = data.content;
            copyToClipboard(content)
                .then(() => pushMsg(config.theme.doc.copy.message.success))
                .catch(() => pushErrMsg(config.theme.doc.copy.message.error));
        }
    }
    else pushErrMsg(config.theme.messages.selectDocument.error);
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
    else pushErrMsg(config.theme.messages.selectDocument.error);
}

async function docCut() {
    let id = getFocusedDocID();
    if (id) {
        let data = await exportMdContent(id);
        if (data) {
            let content = data.content;
            copyToClipboard(content)
                .then(async () => {
                    const response = await updateBlock(
                        id,
                        'markdown',
                        '',
                    );
                    if (response) pushMsg(config.theme.doc.cut.message.success)
                    else {
                        pushMsg(config.theme.doc.copy.message.success);
                        pushErrMsg(config.theme.doc.cut.message.error);
                    };
                })
                .catch(() => pushErrMsg(config.theme.doc.cut.message.error));
        }
    }
    else pushErrMsg(config.theme.messages.selectDocument.error);
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
        copyToClipboard(markdown.join('\n'))
            .then(() => pushMsg(config.theme.doc.outline.message.success))
            .catch(() => pushErrMsg(config.theme.doc.outline.message.error));
    }
    else pushErrMsg(config.theme.doc.outline.message.error);
}

/**
 * 设置子标题折叠状态
 * @params {boolean} foldState 折叠状态
 * @params {string} id 子标题 ID
 * @params {object} protyle 文档对象
 */
async function setHeadingFoldState(foldState, id, protyle) {
    // 使用块属性设置折叠状态, 部分会设置失败
    // const children = await sql(`SELECT id FROM blocks WHERE parent_id = '${id}';`);
    // if (children && children.length > 0) {
    //     const heading_attrs = { 'fold': foldState ? '1' : '' };
    //     const children_attrs = { 'heading-fold': foldState ? '1' : '' };
    //     for (const child of children) setBlockAttrs(child.id, children_attrs);
    //     setBlockAttrs(id, heading_attrs);
    // }

    // 使用业务交互设置折叠状态
    const transaction = [
        {
            doOperations: [
                {
                    action: foldState ? "foldHeading" : "unfoldHeading",
                    id: id,
                },
            ],
            undoOperations: [
                {
                    action: foldState ? "unfoldHeading" : "foldHeading",
                    id: id,
                },
            ],
        },
    ];
    const r = await transactions(protyle, transaction);
    // console.log(r);
    return r;
}

/**
 * 设置文档标题折叠状态
 * @params {boolean} foldState 折叠状态
 * @params {string} id 文档 ID
 */
async function setDocFoldState(foldState = false, id = getFocusedDocID()) {
    const editor = getEditor(id);
    if (editor) {
        const sequence = foldState ? [6, 5, 4, 3, 2, 1] : [1, 2, 3, 4, 5, 6];
        for (const index of sequence) {
            const headings = await sql(`SELECT id FROM blocks WHERE root_id = '${id}' AND type = 'h' AND subtype = 'h${index}';`);
            if (headings && headings.length > 0) {
                for (const heading of headings) {
                    // console.log(heading);
                    await setHeadingFoldState(foldState, heading.id, editor.protyle);
                }
            }
        }
        pushMsg(foldState
            ? config.theme.doc.heading.fold.message.success
            : config.theme.doc.heading.unfold.message.success
        )
    }
    else {
        pushErrMsg(foldState
            ? config.theme.doc.heading.fold.message.error
            : config.theme.doc.heading.unfold.message.error
        )
    }
}

setTimeout(() => {
    try {
        if (config.theme.doc.enable) {
            if (config.theme.doc.heading.enable) {
                if (config.theme.doc.heading.fold.enable) {
                    // 标题折叠
                    const Fn_headingFold = toolbarItemInit(
                        config.theme.doc.heading.fold.toolbar,
                        () => setDocFoldState(true),
                    );
                    globalEventHandler.addEventHandler(
                        'keyup',
                        config.theme.hotkeys.doc.heading.fold,
                        _ => Fn_headingFold(),
                    );
                }
                if (config.theme.doc.heading.unfold.enable) {
                    // 标题展开
                    const Fn_headingUnfold = toolbarItemInit(
                        config.theme.doc.heading.unfold.toolbar,
                        () => setDocFoldState(false),
                    );
                    globalEventHandler.addEventHandler(
                        'keyup',
                        config.theme.hotkeys.doc.heading.unfold,
                        _ => Fn_headingUnfold(),
                    );
                }
            }

            if (config.theme.doc.outline.enable) {
                // 大纲功能
                if (config.theme.doc.outline.u.enable) {
                    // 复制当前文档大纲为无序列表
                    const Fn_outlineCopy_u = toolbarItemInit(
                        config.theme.doc.outline.u.toolbar,
                        () => outlineCopy('u'),
                    );

                    globalEventHandler.addEventHandler(
                        'keyup',
                        config.theme.hotkeys.doc.outline.u,
                        _ => Fn_outlineCopy_u(),
                    );
                }
                if (config.theme.doc.outline.o.enable) {
                    // 复制当前文档大纲为有序列表
                    const Fn_outlineCopy_o = toolbarItemInit(
                        config.theme.doc.outline.o.toolbar,
                        () => outlineCopy('o'),
                    );

                    globalEventHandler.addEventHandler(
                        'keyup',
                        config.theme.hotkeys.doc.outline.o,
                        _ => Fn_outlineCopy_o(),
                    );
                }
                if (config.theme.doc.outline.t.enable) {
                    // 复制当前文档大纲为任务列表
                    const Fn_outlineCopy_t = toolbarItemInit(
                        config.theme.doc.outline.t.toolbar,
                        () => outlineCopy('t'),
                    );

                    globalEventHandler.addEventHandler(
                        'keyup',
                        config.theme.hotkeys.doc.outline.t,
                        _ => Fn_outlineCopy_t(),
                    );
                }

            }

            if (config.theme.doc.copy.enable) {
                // 复制当前文档全文
                const Fn_docCopy = toolbarItemInit(
                    config.theme.doc.copy.toolbar,
                    docCopy,
                );
                globalEventHandler.addEventHandler(
                    'keyup',
                    config.theme.hotkeys.doc.copy,
                    _ => Fn_docCopy(),
                );
            }

            if (config.theme.doc.delete.enable) {
                // 删除当前文档全文
                const Fn_docDelete = toolbarItemInit(
                    config.theme.doc.delete.toolbar,
                    docDelete,
                );
                globalEventHandler.addEventHandler(
                    'keyup',
                    config.theme.hotkeys.doc.delete,
                    _ => Fn_docDelete(),
                );
            }

            if (config.theme.doc.cut.enable) {
                // 剪切当前文档全文
                const Fn_docCut = toolbarItemInit(
                    config.theme.doc.cut.toolbar,
                    docCut,
                );
                globalEventHandler.addEventHandler(
                    'keyup',
                    config.theme.hotkeys.doc.cut,
                    _ => Fn_docCut(),
                );
            }
        }

    }
    catch (err) {
        console.error(err);
    }
}, 0);
