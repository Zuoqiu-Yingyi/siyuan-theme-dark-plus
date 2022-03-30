/* 反色 */

import { config } from './config.js';
import { isKey } from './../utils/hotkey.js';
import { styleHandle } from './../utils/misc.js';

function invertEnable() {
    Object.keys(config.theme.invert).forEach((key) => {
        if (key === 'enable') return;

        if (config.theme.invert[key].enable) {
            styleHandle(config.theme.invert[key].id, config.theme.invert[key].content);
        }
    });
}

(() => {
    try {
        if (config.theme.invert.enable) {
            let body = document.body;
            // 启动打字机模式开关
            body.addEventListener('keyup', (e) => {
                // console.log(e);
                if (isKey(e, config.theme.hotkeys.invert.switch)) {
                    setTimeout(invertEnable, 0);
                }
            });
        }
    } catch (err) {
        console.error(err);
    }
})();
