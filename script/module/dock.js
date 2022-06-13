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
import { setDockState } from './../utils/dom.js';

var fold = false;

/**
 * 切换停靠栏折叠状态
 */
function toggleDockFoldStatus() {
    fold = !fold;
    const items = document.querySelectorAll('span.dock__item');
    const barDock = document.getElementById('barDock');
    if (fold) { // 折叠所有打开的面板
        for (const item of items) {
            const type = item.dataset.type;
            const active = item.classList.contains('dock__item--active');
            custom.theme.dock[type] = { fold: active }; // 是否是专注模式导致的折叠
            if (active) item.click();
        }
        if (config.theme.dock.fold.dock
            && barDock
            && barDock.firstElementChild
            && barDock.firstElementChild.firstElementChild
        ) {
            const icon = barDock.firstElementChild.firstElementChild.getAttribute('xlink:href');
            switch (icon) {
                case '#iconHideDock': // 目前侧边停靠栏是显示的
                    custom.theme.dock.dock = { fold: true };
                    barDock.click();
                    break;

                case '#iconDock': // 目前侧边停靠栏是隐藏的
                    custom.theme.dock.dock = { fold: false };
                    break;

                default:
                    break;
            }
        }
        saveCustomFile(custom);
    }
    else { // 展开所有打开的面板
        setDockState(items, custom.theme.dock);
        if (config.theme.dock.fold.dock
            && barDock
            && barDock.firstElementChild
            && barDock.firstElementChild.firstElementChild
        ) {
            const icon = barDock.firstElementChild.firstElementChild.getAttribute('xlink:href');
            if (icon === '#iconDock' && custom.theme.dock.dock.fold) barDock.click();
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
                setTimeout(() => setDockState(document.querySelectorAll('span.dock__item'), custom.theme.dock), 0);
                // setDockState(document.querySelectorAll('span.dock__item'), custom.theme.dock)
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
