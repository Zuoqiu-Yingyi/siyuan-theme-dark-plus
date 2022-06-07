/* 停靠栏 */

import {
    config,
    custom,
    saveCustomFile,
} from './config.js';
import {
    toolbarItemInit,
    toolbarItemChangeStatu,
} from './../utils/ui.js';
import { globalEventHandler } from './../utils/listener.js';

var fold = false;

/**
 * 切换停靠栏折叠状态
 */
function toggleDockFoldStatus() {
    // TODO 折叠/展开用户当前所有的面板
    fold = !fold;
    const items = document.querySelectorAll('span.dock__item');
    if (fold) { // 折叠所有打开的面板
        for (const item of items) {
            const type = item.dataset.type;
            const active = item.classList.contains('dock__item--active');
            custom.theme.dock[type] = { fold: active };
            if (active) item.click();
        }
        saveCustomFile(custom);
    }
    else { // 展开所有打开的面板
        for (const item of items) {
            const type = item.dataset.type;
            const active = item.classList.contains('dock__item--active');
            if (active ^ custom.theme.dock[type].fold) item.click();
        }
    }
    toolbarItemChangeStatu(
        config.theme.dock.fold.toolbar.id,
        true,
        fold,
        'BUTTON',
    );
}

setTimeout(() => {
    try {
        if (config.theme.dock.enable) {
            if (config.theme.dock.fold.enable) {
                const Fn_toggleDockFoldStatus = toolbarItemInit(
                    config.theme.dock.fold.toolbar,
                    toggleDockFoldStatus,
                );
                globalEventHandler.addEventHandler(
                    'keyup',
                    config.theme.hotkeys.dock.fold,
                    _ => Fn_toggleDockFoldStatus(),
                );
            }
        }
    } catch (err) {
        console.error(err);
    }
}, 0);
