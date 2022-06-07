/* 停靠栏 */

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

/**
 * 切换停靠栏状态
 * @params {boolean} fold 是否折叠
 */
function toggleDockStatus(fold) {
    // TODO 折叠/展开用户当前所有的面板
}

setTimeout(() => {
    try {
        if (config.theme.menu.enable) {
            if (config.theme.menu.block.enable) {
                const Fn_toggleDockStatus = toggleDockStatus(
                    config.theme.readonly.toolbar,
                    toggleDockStatus,
                );
            }
        }
    } catch (err) {
        console.error(err);
    }
}, 0);
