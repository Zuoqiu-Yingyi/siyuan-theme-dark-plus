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
    open(id, {
        focus: 0,
        editable: (config.theme.window.open.block.editable ? 1 : 0),
    });
}

function infocus(id = getFocusedID()) {
    // 打开新窗口并聚焦块
    open(id, {
        focus: 1,
        editable: (config.theme.window.open.block.editable ? 1 : 0),
    });
}

function middleClick(e, fn1, fn2 = null) {
    let target = getTargetBlockID(e.target);
    if (target) {
        // 目标非空, 是 ID 或者链接
        if (config.theme.regs.id.test(target)) {
            // 是 ID
            fn1(target);
        }
        else {
            // 是链接
            if (fn2) fn2(target);
            else window.theme.openNewWindow(
                'browser',
                target,
                undefined,
                config.theme.window.open.windowParams,
            );
        }
    }
}

setTimeout(() => {
    try {
        if (config.theme.window.enable) {
            if (config.theme.window.open.enable) {
                if (config.theme.window.open.panel.enable) {
                    toolbarItemInit(
                        config.theme.window.open.panel.toolbar,
                        () => {
                            let windowParams = Object.assign({}, config.theme.window.open.windowParams);
                            windowParams.alwaysOnTop = false; // 关闭置顶
                            if (config.theme.window.open.panel.url) {
                                window.theme.openNewWindow(
                                    'browser',
                                    config.theme.window.open.panel.url,
                                    undefined,
                                    windowParams,
                                );
                            }
                            else {
                                window.theme.openNewWindow(
                                    'desktop',
                                    undefined,
                                    undefined,
                                    windowParams,
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
                        window.addEventListener('mouseup', (e) => {
                            // console.log(e);
                            if (isButton(e, config.theme.hotkeys.window.open.link.outfocus)) {
                                // console.log(e);
                                setTimeout(() => middleClick(e, outfocus), 0);
                            }
                        }, true);
                    }
                    if (config.theme.window.open.link.infocus.enable) {
                        window.addEventListener('mouseup', (e) => {
                            // console.log(e);
                            if (isButton(e, config.theme.hotkeys.window.open.link.infocus)) {
                                // console.log(e);
                                setTimeout(() => middleClick(e, infocus), 0);
                            }
                        }, true);
                    }
                    if (config.theme.window.open.link.editor.enable) {
                        window.addEventListener('mouseup', (e) => {
                            // console.log(e);
                            if (isButton(e, config.theme.hotkeys.window.open.link.editor)) {
                                // console.log(e);
                                setTimeout(() => middleClick(
                                    e,
                                    id => {
                                        window.theme.openNewWindow(
                                            'browser',
                                            undefined,
                                            {
                                                id: id,
                                                mode: 'block',
                                                lang: window.theme.languageMode,
                                                theme: window.siyuan.config.appearance.mode,
                                                tabSize: window.siyuan.config.editor.codeTabSpaces,
                                            },
                                            config.theme.window.open.windowParams,
                                            '/appearance/themes/Dark+/app/editor/',
                                        );
                                    },
                                    href => {
                                        window.theme.openNewWindow(
                                            'browser',
                                            undefined,
                                            {
                                                mode: 'assets',
                                                path: encodeURI(href),
                                                lang: window.theme.languageMode,
                                                theme: window.siyuan.config.appearance.mode,
                                                tabSize: window.siyuan.config.editor.codeTabSpaces,
                                            },
                                            config.theme.window.open.windowParams,
                                            '/appearance/themes/Dark+/app/editor/',
                                        );
                                    },
                                ), 0);
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
