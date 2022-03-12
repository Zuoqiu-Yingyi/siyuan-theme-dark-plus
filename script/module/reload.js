/* 
 * 重新加载整个窗口
 * 重新加载 iframe(iframe块, 挂件块)
 * REF [JS/jQuery 刷新 iframe 的方法 | 菜鸟教程](https://www.runoob.com/w3cnote/js-jquery-refresh-iframe.html)
 */

import { config } from '/appearance/themes/Dark+/script/module/config.js';
import {
    isKey,
    isEvent,
} from '/appearance/themes/Dark+/script/utils/hotkey.js';

async function reloadIframe(target) {
    // console.log(target.dataset);
    if (target.dataset.nodeId) {
        switch (target.dataset.type) {
            case 'NodeIFrame':
            case 'NodeWidget':
                try {
                    target.firstElementChild.firstElementChild.location.reload();
                } catch (err) {
                    target.firstElementChild.firstElementChild.src = target.firstElementChild.firstElementChild.src;
                }
                break;
            default:
                break;
        }
    }
}

(() => {
    try {
        if (config.theme.reload.enable) {
            let body = document.querySelector('body');
            if (config.theme.reload.window.enable) {
                // 重新加载整个窗口
                body.addEventListener('keyup', (e) => {
                    // console.log(e);
                    if (isKey(e, config.theme.hotkeys.reload.window)) {
                        setTimeout(() => {
                            window.location.reload();
                        }, 0);
                    }
                });
            }

            if (config.theme.reload.iframe.enable) {
                // 重新加载 iframe
                body.addEventListener('click', (e) => {
                    // console.log(e);
                    if (isEvent(e, config.theme.hotkeys.reload.iframe)) {
                        setTimeout(async () => {
                            await reloadIframe(e.target);
                        }, 0);
                    }
                }, true);
            }
        }
    } catch (err) {
        console.error(err);
    }
})();
