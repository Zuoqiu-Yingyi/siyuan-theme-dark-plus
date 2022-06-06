/* 只读模式 */

import { config } from './config.js';
import {
    toolbarItemInit,
    toolbarItemChangeStatu,
} from './../utils/ui.js';
import {
    getEditors,
    disabledProtyle,
    enableProtyle,
} from './../utils/dom.js';

function readonlyEnable() {
    const editors = getEditors();
    window.siyuan.config.readonly = !window.siyuan.config.readonly;
    const fn = window.siyuan.config.readonly ? disabledProtyle : enableProtyle;
    for (const editor of editors) fn(editor.protyle);
    // 更改菜单栏按钮状态
    toolbarItemChangeStatu(
        config.theme.readonly.toolbar.id,
        true,
        window.siyuan.config.readonly,
        'BUTTON',
    );
}

setTimeout(() => {
    try {
        if (config.theme.menu.enable) {
            if (config.theme.menu.block.enable) {
                const Fn_readonlyEnable = toolbarItemInit(
                    config.theme.readonly.toolbar,
                    readonlyEnable,
                );
            }
        }
    } catch (err) {
        console.error(err);
    }
}, 0);
