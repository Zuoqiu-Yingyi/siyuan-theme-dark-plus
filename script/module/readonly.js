/* 只读模式 */

import { config } from './config.js';
import {
    toolbarItemInit,
    toolbarItemChangeStatu,
} from './../utils/ui.js';

function readonlyEnable() {
    window.siyuan.config.readonly = !window.siyuan.config.readonly;
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
