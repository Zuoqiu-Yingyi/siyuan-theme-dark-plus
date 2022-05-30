/* 反色 */

import { config } from './config.js';
import { isKey } from './../utils/hotkey.js';
import { styleHandle } from './../utils/misc.js';
import { globalEventHandler } from './../utils/listener.js';
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
        true,
        styleHandle(id.join('-'), innerHTML.join('\n')),
        'BUTTON',
    );
}

setTimeout(() => {
    try {
        if (config.theme.invert.enable) {
            const Fn_invertEnable = toolbarItemInit(
                config.theme.invert.toolbar,
                invertEnable,
            );
            // 使用快捷键启用反色模式
            globalEventHandler.addEventHandler(
                'keyup',
                config.theme.hotkeys.invert,
                _ => Fn_invertEnable(),
            );
        }
    } catch (err) {
        console.error(err);
    }
}, 0);
