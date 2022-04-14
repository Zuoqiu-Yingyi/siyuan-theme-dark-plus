/* 反色 */

import { config } from './config.js';
import { isKey } from './../utils/hotkey.js';
import { styleHandle } from './../utils/misc.js';
import {
    toolbarItemInit,
    toolbarItemChangeStatu,
} from './../utils/ui.js';

function invertEnable() {
    let enable = false;
    Object.keys(config.theme.invert).forEach((key) => {
        if (key === 'enable') return;
        if (key === 'toolbar') return;

        if (config.theme.invert[key].enable) {
            enable = styleHandle(config.theme.invert[key].style.id, config.theme.invert[key].style.innerHTML);
        }
    });
    // 更改菜单栏按钮状态
    toolbarItemChangeStatu(
        config.theme.invert.toolbar.id,
        enable,
        'SVG',
        undefined,
        1,
    );
}

setTimeout(() => {
    try {
        if (config.theme.invert.enable) {
            let Fn_invertEnable = toolbarItemInit(
                config.theme.invert.toolbar,
                invertEnable,
            );
            // 使用快捷键启用反色模式
            window.addEventListener('keyup', (e) => {
                // console.log(e);
                if (isKey(e, config.theme.hotkeys.invert.switch)) {
                    Fn_invertEnable();
                }
            }, true);
        }
    } catch (err) {
        console.error(err);
    }
}, 0);
