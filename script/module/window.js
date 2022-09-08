/* 打开新窗口 */

import { config } from './config.js';
import { toolbarItemInit } from './../utils/ui.js';
import { globalEventHandler } from './../utils/listener.js';
import { merge } from './../utils/misc.js';
import { compareVersion } from './../utils/string.js';
import {
    editDocKramdown,
    editBlockKramdown,
} from '../utils/markdown.js';
import {
    putFile,
} from './../utils/api.js';
import {
    stat,
    copyFile,
    rm,
} from './../utils/system.js';
import {
    getFocusedID,
    getTargetBlockID,
    getTargetInboxID,
    getTargetHistory,
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
            config.theme.window.windowParams,
            config.theme.window.menu.template,
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

async function middleClick(e, fn_id, fn_href = null, fn_inbox = null, fn_history = null) {
    // 历史项
    let history = getTargetHistory(e.target)
    if (history) {
        if (fn_history) fn_history(history.path, history.id);
        return;
    }

    // 收集箱
    let inbox = getTargetInboxID(e.target);
    if (inbox) {
        for (const dock of ['leftDock', 'rightDock', 'topDock', 'bottomDock']) {
            if (window.siyuan.layout[dock]
                && window.siyuan.layout[dock].data
                && window.siyuan.layout[dock].data.inbox
                && window.siyuan.layout[dock].data.inbox.data
                && window.siyuan.layout[dock].data.inbox.data[inbox]
            ) {
                if (fn_inbox) {
                    fn_inbox(window.siyuan.layout[dock].data.inbox.data[inbox]);
                    return;
                }
                else if (window.siyuan.layout[dock].data.inbox.data[inbox].shorthandURL) {
                    // 新窗口打开收集箱超链接
                    window.theme.openNewWindow(
                        'browser',
                        window.siyuan.layout[dock].data.inbox.data[inbox].shorthandURL,
                        undefined,
                        config.theme.window.windowParams,
                        config.theme.window.menu.template,
                    );
                    return;
                }
            }
        }
    }

    // 文档 ID 或者超链接
    let target = getTargetBlockID(e.target);
    console.log(target);
    if (target) {
        // 目标非空, 是 ID 或者链接
        if (config.theme.regs.id.test(target)) {
            // 是 ID
            await fn_id(target);
        }
        else {
            // 是链接
            if (fn_href) await fn_href(target);
            else window.theme.openNewWindow(
                'browser',
                target,
                undefined,
                config.theme.window.windowParams,
                config.theme.window.menu.template,
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
                            const windowParams = merge(
                                {},
                                config.theme.window.windowParams,
                                { alwaysOnTop: false }, // 关闭置顶
                            );
                            if (config.theme.window.open.panel.url) {
                                // 打开指定的 URL
                                window.theme.openNewWindow(
                                    'browser',
                                    config.theme.window.open.panel.url,
                                    undefined,
                                    windowParams,
                                    config.theme.window.menu.template,
                                );
                            }
                            else {
                                // 打开 Web 端桌面版
                                window.theme.openNewWindow(
                                    'desktop',
                                    undefined,
                                    undefined,
                                    windowParams,
                                    config.theme.window.menu.template,
                                );
                            }
                        },
                    );
                }
                if (config.theme.window.open.block.enable) {
                    if (config.theme.window.open.block.outfocus.enable) {
                        const Fn_outfocus = toolbarItemInit(
                            config.theme.window.open.block.outfocus.toolbar,
                            outfocus,
                            1,
                        );

                        globalEventHandler.addEventHandler(
                            'keyup',
                            config.theme.hotkeys.window.open.block.outfocus,
                            _ => Fn_outfocus(),
                        );
                    }
                    if (config.theme.window.open.block.infocus.enable) {
                        const Fn_infocus = toolbarItemInit(
                            config.theme.window.open.block.infocus.toolbar,
                            infocus,
                            2,
                        );

                        globalEventHandler.addEventHandler(
                            'keyup',
                            config.theme.hotkeys.window.open.block.infocus,
                            _ => Fn_infocus(),
                        );
                    }
                }
                if (config.theme.window.open.link.enable) {
                    if (config.theme.window.open.link.outfocus.enable) {
                        globalEventHandler.addEventHandler(
                            'mouseup',
                            config.theme.hotkeys.window.open.link.outfocus,
                            e => setTimeout(() => middleClick(e, outfocus), 0),
                        );
                    }
                    if (config.theme.window.open.link.infocus.enable) {
                        globalEventHandler.addEventHandler(
                            'mouseup',
                            config.theme.hotkeys.window.open.link.infocus,
                            e => setTimeout(() => middleClick(e, infocus), 0),
                        );
                    }
                }
                if (config.theme.window.open.editor.enable) {
                    // 新窗口打开编辑器

                    // 首先删除并新建临时目录
                    await rm(config.theme.window.open.editor.path.temp.absolute);
                    let r = await createTempDir(config.theme.window.open.editor.path.temp.relative);
                    if (r && r.code === 0) {
                        // 临时目录创建成功
                        globalEventHandler.addEventHandler(
                            'mouseup',
                            config.theme.hotkeys.window.open.markdown,
                            e => setTimeout(async () => middleClick(
                                e,
                                async id => compareVersion(window.theme.kernelVersion, '2.0.24') > 0
                                    ? editBlockKramdown(id)
                                    : editDocKramdown(id),
                                undefined,
                                undefined,
                                async (path, id) => {
                                    /* diff 对比编辑历史文档与当前文档 kramdown */
                                    window.theme.openNewWindow(
                                        'editor',
                                        undefined,
                                        {
                                            id: id,
                                            mode: 'history',
                                            type: 'kramdown',
                                            url: encodeURI(path),
                                            lang: window.theme.languageMode,
                                            // theme: window.siyuan.config.appearance.mode,
                                            fontFamily: encodeURI(window.siyuan.config.editor.fontFamily),
                                            // tabSize: window.siyuan.config.editor.codeTabSpaces,
                                            // workspace: window.siyuan.config.system.workspaceDir,
                                        },
                                        config.theme.window.windowParams,
                                        config.theme.window.menu.template,
                                        config.theme.window.open.editor.path.index,
                                    );
                                },
                            ), 0),
                        );
                        globalEventHandler.addEventHandler(
                            'mouseup',
                            config.theme.hotkeys.window.open.editor,
                            e => setTimeout(async () => middleClick(
                                e,
                                async id => {
                                    /* 查看/编辑思源块 markdown */
                                    window.theme.openNewWindow(
                                        'editor',
                                        undefined,
                                        {
                                            id: id,
                                            mode: 'block',
                                            type: 'markdown',
                                            lang: window.theme.languageMode,
                                            // theme: window.siyuan.config.appearance.mode,
                                            fontFamily: encodeURI(window.siyuan.config.editor.fontFamily),
                                            tabSize: window.siyuan.config.editor.codeTabSpaces,
                                        },
                                        config.theme.window.windowParams,
                                        config.theme.window.menu.template,
                                        config.theme.window.open.editor.path.index,
                                    );
                                },
                                async href => {
                                    if (href.startsWith('file:')) {
                                        // 是本地文件
                                        let url = new URL(href.replaceAll('\\', '/'));
                                        let path = config.theme.regs.winpath.test(url.pathname)
                                            ? url.pathname.substring(1)
                                            : url.pathname;
                                        // 本地文件
                                        // 检查文件是否存在
                                        let stats = await stat(path);
                                        // console.log(stats);

                                        // let path = await openFile(
                                        //     config.theme.window.open.editor.labels.openFile[window.theme.languageMode]
                                        //     || config.theme.window.open.editor.labels.openFile.other,
                                        //     // href,
                                        //     // href.substring(7),
                                        //     path,
                                        //     // config.MAP.LABELS.open[params.lang] || config.MAP.LABELS.open.default,
                                        //     config.theme.window.open.editor.labels.open[window.theme.languageMode]
                                        //     || config.theme.window.open.editor.labels.open.other,
                                        // );
                                        if (stats) {
                                            // 本地文件存在
                                            // console.log(path);
                                            let filename = path.split('/').pop(); // 文件名
                                            let ext = filename.lastIndexOf('.') > 0 ? filename.split('.').pop() : null; // 文件扩展名

                                            filename = ext
                                                ? `${window.Lute.NewNodeID()}.${ext}`
                                                : window.Lute.NewNodeID();
                                            // 临时文件绝对路径
                                            let temp_file_path_absolute = `${config.theme.window.open.editor.path.temp.absolute}${filename}`;
                                            // console.log(temp_file_path_absolute);
                                            // 临时文件相对路径(相对于思源工作空间根目录)
                                            let temp_file_path_relative = `${config.theme.window.open.editor.path.temp.relative}${filename}`;
                                            // console.log(temp_file_path_relative);
                                            // 复制本地文件至临时目录
                                            await copyFile(path, temp_file_path_absolute).then(() => {
                                                // 复制成功
                                                /* 编辑本地文件 */
                                                window.theme.win = window.theme.openNewWindow(
                                                    'editor',
                                                    config.theme.window.open.editor.path.index,
                                                    {
                                                        mode: 'local',
                                                        url: encodeURI(path),
                                                        path: encodeURI(temp_file_path_relative),
                                                        lang: window.theme.languageMode,
                                                        // theme: window.siyuan.config.appearance.mode,
                                                        tabSize: window.siyuan.config.editor.codeTabSpaces,
                                                        fontFamily: encodeURI(window.siyuan.config.editor.fontFamily),
                                                        workspace: window.siyuan.config.system.workspaceDir,
                                                    },
                                                    config.theme.window.windowParams,
                                                    config.theme.window.menu.template,
                                                    undefined,
                                                    undefined,
                                                    async (win, event, level, message, line, sourceId) => {
                                                        // 根据子窗口的控制台输出内容保存临时文件
                                                        // console.log(win, event, level, message, line, sourceId);
                                                        if (level === 0 && message === 'SAVED') {
                                                            // 临时文件已保存, 需要复制临时文件至原位置
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
                                        // 思源资源文件链接或网络文件链接
                                        /* 编辑资源文件 */
                                        window.theme.openNewWindow(
                                            'editor',
                                            config.theme.window.open.editor.path.index,
                                            {
                                                mode: 'assets',
                                                path: encodeURI(href),
                                                lang: window.theme.languageMode,
                                                // theme: window.siyuan.config.appearance.mode,
                                                tabSize: window.siyuan.config.editor.codeTabSpaces,
                                                fontFamily: encodeURI(window.siyuan.config.editor.fontFamily),
                                                workspace: window.siyuan.config.system.workspaceDir,
                                            },
                                            config.theme.window.windowParams,
                                            config.theme.window.menu.template,
                                        );
                                    }
                                },
                                async inbox => {
                                    // 收集箱
                                    // 内容写入临时文件 => 打开编辑器 => 读取临时文件 => 删除临时文件
                                    const filename = `${inbox.oId}.md`; // 临时文件文件名
                                    // 临时文件绝对路径
                                    const temp_file_path_absolute = `${config.theme.window.open.editor.path.temp.absolute}${filename}`;
                                    // 临时文件相对路径(相对于思源工作空间根目录)
                                    const temp_file_path_relative = `${config.theme.window.open.editor.path.temp.relative}${filename}`;
                                    // console.log(temp_file_path_relative, temp_file_path_absolute);
                                    // 写入临时文件
                                    putFile(temp_file_path_relative, inbox.shorthandContent).then(r => {
                                        if (r && r.code === 0) {
                                            // 写入文件成功
                                            /* 编辑收集箱临时文件 */
                                            window.theme.win = window.theme.openNewWindow(
                                                'editor',
                                                config.theme.window.open.editor.path.index,
                                                {
                                                    mode: 'inbox',
                                                    url: encodeURI(inbox.shorthandURL),
                                                    path: encodeURI(temp_file_path_relative),
                                                    lang: window.theme.languageMode,
                                                    // theme: window.siyuan.config.appearance.mode,
                                                    // tabSize: window.siyuan.config.editor.codeTabSpaces,
                                                    fontFamily: encodeURI(window.siyuan.config.editor.fontFamily),
                                                    workspace: window.siyuan.config.system.workspaceDir,

                                                    title: inbox.shorthandTitle,
                                                    describe: inbox.shorthandDesc,
                                                },
                                                config.theme.window.windowParams,
                                                config.theme.window.menu.template,
                                                undefined,
                                                undefined,
                                                undefined,
                                                async (win) => {
                                                    // 窗口关闭时删除临时文件
                                                    // console.log(win);
                                                    setTimeout(async () => rm(temp_file_path_absolute), 0);
                                                },
                                            );
                                        }
                                    });
                                },
                                async (path, id) => {
                                    /* 查看历史文档 markdown */
                                    window.theme.openNewWindow(
                                        'editor',
                                        undefined,
                                        {
                                            id: id,
                                            mode: 'history',
                                            type: 'markdown',
                                            url: encodeURI(path),
                                            lang: window.theme.languageMode,
                                            // theme: window.siyuan.config.appearance.mode,
                                            fontFamily: encodeURI(window.siyuan.config.editor.fontFamily),
                                            // tabSize: window.siyuan.config.editor.codeTabSpaces,
                                            // workspace: window.siyuan.config.system.workspaceDir,
                                        },
                                        config.theme.window.windowParams,
                                        config.theme.window.menu.template,
                                        config.theme.window.open.editor.path.index,
                                    );
                                }
                            ), 0),
                        );
                    }
                }
            }
        }
    } catch (err) {
        console.error(err);
    }
}, 0);
