/* 打开新窗口 */

import { config } from './config.js';
import {
    isKey,
    isButton,
} from './../utils/hotkey.js';
import { toolbarItemInit } from './../utils/ui.js';
import {
    putFile,
    getBlockByID,
    renameDoc,
    docSaveAsTemplate,
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

async function middleClick(e, fn1, fn2 = null, fn3 = null) {
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
                if (fn3) {
                    fn3(window.siyuan.layout[dock].data.inbox.data[inbox]);
                    return;
                }
                else if (window.siyuan.layout[dock].data.inbox.data[inbox].shorthandURL) {
                    // 新窗口打开收集箱超链接
                    window.theme.openNewWindow(
                        'browser',
                        window.siyuan.layout[dock].data.inbox.data[inbox].shorthandURL,
                        undefined,
                        config.theme.window.open.windowParams,
                    );
                    return;
                }
            }
        }
    }

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
                }
                if (config.theme.window.open.editor.enable) {
                    // 新窗口打开编辑器

                    // 首先删除并新建临时目录
                    await rm(config.theme.window.open.editor.path.temp.absolute);
                    let r = await createTempDir(config.theme.window.open.editor.path.temp.relative);
                    if (r && r.code === 0) {
                        // 临时目录创建成功
                        window.addEventListener('mouseup', (e) => {
                            // console.log(e);
                            if (isButton(e, config.theme.hotkeys.window.open.editor)) {
                                // console.log(e);
                                setTimeout(async () => middleClick(
                                    e,
                                    async id => {
                                        // 判断是否为文档块
                                        const b = await getBlockByID(id);
                                        if (config.theme.window.open.editor.doc.type !== 'kramdown' || b == null || b.type !== 'd') {
                                            window.theme.openNewWindow(
                                                'editor',
                                                config.theme.window.open.editor.path.index,
                                                {
                                                    id: id,
                                                    mode: 'block',
                                                    lang: window.theme.languageMode,
                                                    // theme: window.siyuan.config.appearance.mode,
                                                    fontFamily: encodeURI(window.siyuan.config.editor.fontFamily),
                                                    tabSize: window.siyuan.config.editor.codeTabSpaces,
                                                },
                                                config.theme.window.open.windowParams,
                                            );
                                        }
                                        else {
                                            // 先重命名文档为新ID, 然后导出模板, 然后恢复原命名
                                            let newID = window.Lute.NewNodeID();
                                            let template_path_relative = `/data/templates/${newID}.md`;
                                            let template_path_absolute = `${window.siyuan.config.system.workspaceDir}${template_path_relative}`.replaceAll('\\', '/').replaceAll('//', '/');
                                            let title = b.content;
                                            renameDoc(b.box, b.path, newID).then(
                                                _ => docSaveAsTemplate(b.id, true).then(
                                                    _ => renameDoc(b.box, b.path, title).then(
                                                        _ => window.theme.openNewWindow(
                                                            'editor',
                                                            config.theme.window.open.editor.path.index,
                                                            {
                                                                id: id,
                                                                mode: 'block',
                                                                lang: window.theme.languageMode,
                                                                path: template_path_relative,
                                                                // theme: window.siyuan.config.appearance.mode,
                                                                fontFamily: encodeURI(window.siyuan.config.editor.fontFamily),
                                                                tabSize: window.siyuan.config.editor.codeTabSpaces,
                                                            },
                                                            config.theme.window.open.windowParams,
                                                            undefined,
                                                            undefined,
                                                            undefined,
                                                            async (win) => {
                                                                // 窗口关闭时删除临时文件
                                                                setTimeout(async () => rm(template_path_absolute), 0);
                                                            },
                                                        )
                                                    )
                                                )
                                            );
                                        }
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
                                                        config.theme.window.open.windowParams,
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
                                                config.theme.window.open.windowParams,
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
                                                window.theme.win = window.theme.openNewWindow(
                                                    'editor',
                                                    config.theme.window.open.editor.path.index,
                                                    {
                                                        mode: 'inbox',
                                                        url: encodeURI(inbox.shorthandURL),
                                                        path: encodeURI(temp_file_path_relative),
                                                        lang: window.theme.languageMode,
                                                        // theme: window.siyuan.config.appearance.mode,
                                                        tabSize: window.siyuan.config.editor.codeTabSpaces,
                                                        fontFamily: encodeURI(window.siyuan.config.editor.fontFamily),
                                                        workspace: window.siyuan.config.system.workspaceDir,

                                                        title: inbox.shorthandTitle,
                                                        describe: inbox.shorthandDesc,
                                                    },
                                                    config.theme.window.open.windowParams,
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
