/* 打开新窗口 */

import { config } from './config.js';
import {
    isKey,
    isButton,
} from './../utils/hotkey.js';
import { toolbarItemInit } from './../utils/ui.js';
import { putFile } from './../utils/api.js';
import {
    stat,
    copyFile,
    rm,
} from './../utils/system.js';
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

async function middleClick(e, fn1, fn2 = null) {
    let target = getTargetBlockID(e.target);
    if (target) {
        // 目标非空, 是 ID 或者链接
        if (config.theme.regs.id.test(target)) {
            // 是 ID
            await fn1(target);
        }
        else {
            // 是链接
            if (fn2) await fn2(target);
            else window.theme.openNewWindow(
                'browser',
                target,
                undefined,
                config.theme.window.open.windowParams,
            );
        }
    }
}

async function createTempDir(path) {
    return putFile(path, '', true);
}

setTimeout(async () => {
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
                        // 首先删除并新建临时目录
                        await rm(config.theme.window.open.link.editor.temp.path.absolute);
                        let r = await createTempDir(config.theme.window.open.link.editor.temp.path.relative);
                        if (r && r.code === 0) {
                            // 临时目录创建成功
                            window.addEventListener('mouseup', (e) => {
                                // console.log(e);
                                if (isButton(e, config.theme.hotkeys.window.open.link.editor)) {
                                    // console.log(e);
                                    setTimeout(async () => middleClick(
                                        e,
                                        async id => {
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
                                        async href => {
                                            if (href.startsWith('file:')) {
                                                let url = new URL(href.replaceAll('\\', '/'));
                                                let path = config.theme.regs.winpath.test(url.pathname)
                                                    ? url.pathname.substring(1)
                                                    : url.pathname;
                                                // 本地文件
                                                // 检查文件是否存在
                                                let stats = await stat(path);
                                                console.log(stats);
                                                // let path = await openFile(
                                                //     config.theme.window.open.link.editor.labels.openFile[window.theme.languageMode]
                                                //     || config.theme.window.open.link.editor.labels.openFile.other,
                                                //     // href,
                                                //     // href.substring(7),
                                                //     path,
                                                //     // config.MAP.LABELS.open[params.lang] || config.MAP.LABELS.open.default,
                                                //     config.theme.window.open.link.editor.labels.open[window.theme.languageMode]
                                                //     || config.theme.window.open.link.editor.labels.open.other,
                                                // );
                                                if (stats) {
                                                    // 通过临时文件传参
                                                    console.log(path);
                                                    let filename = path.split('/').pop(); // 文件名
                                                    let ext = filename.lastIndexOf('.') > 0 ? filename.split('.').pop() : null; // 文件扩展名

                                                    filename = ext
                                                        ? `${window.Lute.NewNodeID()}.${ext}`
                                                        : window.Lute.NewNodeID();
                                                    // 临时文件绝对路径
                                                    let temp_file_path_absolute = `${config.theme.window.open.link.editor.temp.path.absolute}${filename}`;
                                                    let temp_file_path_relative = `${config.theme.window.open.link.editor.temp.path.relative}${filename}`;
                                                    console.log(temp_file_path_absolute);
                                                    await copyFile(path, temp_file_path_absolute).then(() => {
                                                        window.theme.win = window.theme.openNewWindow(
                                                            'browser',
                                                            undefined,
                                                            {
                                                                mode: 'localfile',
                                                                url: encodeURI(path),
                                                                path: encodeURI(temp_file_path_relative),
                                                                lang: window.theme.languageMode,
                                                                theme: window.siyuan.config.appearance.mode,
                                                                tabSize: window.siyuan.config.editor.codeTabSpaces,
                                                                workspace: window.siyuan.config.system.workspaceDir,
                                                            },
                                                            config.theme.window.open.windowParams,
                                                            '/appearance/themes/Dark+/app/editor/',
                                                            undefined,
                                                            async (win, event, level, message, line, sourceId) => {
                                                                // 根据子窗口的控制台输出内容保存临时文件
                                                                // console.log(win, event, level, message, line, sourceId);
                                                                if (level === 2 && message === 'SAVED') {
                                                                    // 临时文件已保存, 需要复制临时文件
                                                                    await copyFile(temp_file_path_absolute, path);
                                                                }
                                                            },
                                                            async (win) => {
                                                                // 窗口关闭时删除临时文件
                                                                // console.log(win);
                                                                setTimeout(async () => rm(temp_file_path_absolute), 0);
                                                            },
                                                        );
                                                    });

                                                }
                                                return;
                                            }
                                            else {
                                                // 思源资源文件链接
                                                window.theme.openNewWindow(
                                                    'browser',
                                                    undefined,
                                                    {
                                                        mode: 'assets',
                                                        path: encodeURI(href),
                                                        lang: window.theme.languageMode,
                                                        theme: window.siyuan.config.appearance.mode,
                                                        tabSize: window.siyuan.config.editor.codeTabSpaces,
                                                        workspace: window.siyuan.config.system.workspaceDir,
                                                    },
                                                    config.theme.window.open.windowParams,
                                                    '/appearance/themes/Dark+/app/editor/',
                                                );
                                            }
                                        },
                                    ), 0);
                                }
                            }, true);
                        }
                    }
                }
            }
        }
    } catch (err) {
        console.error(err);
    }
}, 0);
