/* 复制加强 */

import { config } from '/appearance/themes/Dark+/script/module/config.js';
import { isKey } from '/appearance/themes/Dark+/script/utils/hotkey.js';
import { exportMdContent } from '/appearance/themes/Dark+/script/utils/api.js';

async function copyall() {
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

(() => {
    try {
        if (config.copy.enable) {
            let body = document.querySelector('body');

            if (config.copy.all.enable) {
                // 复制当前文档全部内容至剪贴板
                body.addEventListener('keydown', (e) => {
                    // console.log(e);
                    if (isKey(e, config.hotkeys.copy.all)) {
                        setTimeout(copyall, 0);
                    }
                });
            }
        }
    } catch (err) {
        console.error(err);
    }
})();
