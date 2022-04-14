/* 打开新窗口 */

import { config } from './config.js';
import {
    isKey,
    isButton,
} from './../utils/hotkey.js';
import { toolbarItemInit } from './../utils/ui.js';
import {
    getFocusedID,
    getTargetBlockID,
    getTargetHref,
} from './../utils/dom.js';

function open(id = getFocusedID(), urlParams = {}) {
    // 打开新窗口
    if (id) {
        urlParams.id = id;
        // console.log(urlParams);
        window.theme.openNewWindow(
            undefined,
            undefined,
            urlParams,
            config.theme.window.open.windowParams,
        );
    }
}

function outfocus(id = getFocusedID()) {
    // 打开新窗口
    open(id);
}

function infocus(id = getFocusedID()) {
    // 打开新窗口并聚焦块
    open(id, { focus: 1 });
}


setTimeout(() => {
    try {
        if (config.theme.window.enable) {
            if (config.theme.window.open.enable) {
                if (config.theme.window.open.panel.enable) {
                    toolbarItemInit(
                        config.theme.window.open.panel.toolbar,
                        () => {
                            if (config.theme.window.open.panel.url) {
                                window.theme.openNewWindow(
                                    'browser',
                                    config.theme.window.open.panel.url,
                                    undefined,
                                    config.theme.window.open.windowParams,
                                );
                            }
                            else {
                                window.theme.openNewWindow(
                                    'desktop',
                                    undefined,
                                    undefined,
                                    config.theme.window.open.windowParams,
                                );
                            }
                        },
                    );
                }
                if (config.theme.window.open.block.enable) {
                    if (config.theme.window.open.block.outfocus.enable) {
                        let Fn_outfocus = toolbarItemInit(
                            config.theme.window.open.block.outfocus.toolbar,
                            outfocus,
                            1,
                        );

                        window.addEventListener('keyup', (e) => {
                            // console.log(e);
                            if (isKey(e, config.theme.hotkeys.window.open.block.outfocus)) {
                                Fn_outfocus();
                            }
                        }, true);
                    }
                    if (config.theme.window.open.block.infocus.enable) {
                        let Fn_infocus = toolbarItemInit(
                            config.theme.window.open.block.infocus.toolbar,
                            infocus,
                            2,
                        );

                        window.addEventListener('keyup', (e) => {
                            // console.log(e);
                            if (isKey(e, config.theme.hotkeys.window.open.block.infocus)) {
                                Fn_infocus();
                            }
                        }, true);
                    }
                }
                if (config.theme.window.open.link.enable) {
                    if (config.theme.window.open.link.outfocus.enable) {
                        window.addEventListener('mousedown', (e) => {
                            // console.log(e);
                            if (isButton(e, config.theme.hotkeys.window.open.link.outfocus)) {
                                // console.log(e);
                                setTimeout(() => {
                                    let id = getTargetBlockID(e.target);
                                    if (id) outfocus(id);
                                    else {
                                        window.theme.openNewWindow(
                                            'browser',
                                            getTargetHref(e.target),
                                            undefined,
                                            config.theme.window.open.windowParams,
                                        );
                                    }
                                }, 0);
                            }
                        }, true);
                    }
                    if (config.theme.window.open.link.infocus.enable) {
                        window.addEventListener('mousedown', (e) => {
                            // console.log(e);
                            if (isButton(e, config.theme.hotkeys.window.open.link.infocus)) {
                                // console.log(e);
                                setTimeout(() => {
                                    infocus(getTargetBlockID(e.target));
                                }, 0);
                            }
                        }, true);
                    }
                }
            }
        }
    } catch (err) {
        console.error(err);
    }
}, 0);
