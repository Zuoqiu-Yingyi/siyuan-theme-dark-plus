/* 复制加强 */

import { config } from '/appearance/themes/Dark+/script/module/config.js';
import { isKey } from '/appearance/themes/Dark+/script/utils/hotkey.js';
import {
    exportMdContent,
    updateBlock,
} from '/appearance/themes/Dark+/script/utils/api.js';

async function docCopy() {
    const background = document.querySelector('div.fn__flex-1.protyle:not(.fn__none)>div.protyle-content>div.protyle-background');
    if (background) {
        let id = background.getAttribute('data-node-id');
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
    const background = document.querySelector('div.fn__flex-1.protyle:not(.fn__none)>div.protyle-content>div.protyle-background');
    if (background) {
        let id = background.getAttribute('data-node-id');
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
    const background = document.querySelector('div.fn__flex-1.protyle:not(.fn__none)>div.protyle-content>div.protyle-background');
    if (background) {
        let id = background.getAttribute('data-node-id');
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

(() => {
    try {
        if (config.theme.doc.copy) {
            let body = document.querySelector('body');

            if (config.theme.doc.copy.enable) {
                // 复制当前文档全部内容至剪贴板
                body.addEventListener('keydown', (e) => {
                    // console.log(e);
                    if (isKey(e, config.theme.hotkeys.doc.copy)) {
                        setTimeout(docCopy, 0);
                    }
                });
            }

            if (config.theme.doc.delete.enable) {
                // 删除当前文档全文
                body.addEventListener('keydown', (e) => {
                    if (isKey(e, config.theme.hotkeys.doc.delete)) {
                        // console.log(e);
                        setTimeout(docDelete, 0);
                    }
                });
            }

            if (config.theme.doc.cut.enable) {
                // 剪切当前文档全文
                body.addEventListener('keydown', (e) => {
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
})();
