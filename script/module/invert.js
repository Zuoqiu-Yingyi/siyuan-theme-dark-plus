/* 反色 */

import { config } from './config.js';
import { isKey } from './../utils/hotkey.js';
import { styleHandle } from './../utils/misc.js';
import {
    toolbarItemInit,
    toolbarItemChangeStatu,
} from './../utils/ui.js';

function invertEnable() {
    let id = [];
    let innerHTML = [];
    Object.keys(config.theme.invert.elements).forEach((key) => {
        let element = config.theme.invert.elements[key];
        if (element.enable) {
            id.push(element.style.id);
            innerHTML.push(element.style.innerHTML);
        }
    });
    // 更改菜单栏按钮状态
    toolbarItemChangeStatu(
        config.theme.invert.toolbar.id,
        styleHandle(id.join('-'), innerHTML.join('\n')),
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
                if (isKey(e, config.theme.hotkeys.invert)) {
                    Fn_invertEnable();
                }
            }, true);
        }
    } catch (err) {
        console.error(err);
    }
}, 0);
