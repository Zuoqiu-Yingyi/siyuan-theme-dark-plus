export {
    editDocKramdown, // 编辑文档 kramdown 源代码
    editBlockKramdown, // 编辑块 kramdown 源代码
}

import { config } from '../module/config.js';
import {
    getBlockByID,
    renameDoc,
    docSaveAsTemplate,
    pushErrMsg,
} from './api.js';
import {
    rm,
    rename,
} from './system.js';

/** 编辑文档 kramdown 源代码
 * @deprecated v2.0.24+ https://github.com/siyuan-note/siyuan/issues/5289
 */
async function editDocKramdown(id) {
    if (window.theme.clientMode !== 'app') { // 只在桌面模式下才可以编辑
        await pushErrMsg(config.theme.window.open.editor.kramdown.message.error);
        return null;
    }
    const b = await getBlockByID(id);
    if (b && b.type === 'd') { // 如果是文档块
        // 先重命名文档为新ID, 然后导出模板, 然后恢复原命名
        const newID = window.Lute.NewNodeID();
        // 模板文件相对路径(相对于思源工作空间根目录)
        const template_path_relative = `/data/templates/${newID}.md`;
        // 模板文件绝对路径
        const template_path_absolute = `${window.siyuan.config.system.workspaceDir}${template_path_relative}`.replaceAll('\\', '/').replaceAll('//', '/');
        // 临时文件相对路径(相对于思源工作空间根目录)
        const temp_file_path_relative = `${config.theme.window.open.editor.path.temp.relative}${newID}.md`;
        // 临时文件绝对路径
        const temp_file_path_absolute = `${config.theme.window.open.editor.path.temp.absolute}${newID}.md`;

        const title = b.content;
        renameDoc(b.box, b.path, newID).then(
            _ => docSaveAsTemplate(b.id, true).then(
                _ => renameDoc(b.box, b.path, title).then(
                    _ => rename(template_path_absolute, temp_file_path_absolute).then(
                        () => window.theme.openNewWindow(
                            'editor',
                            config.theme.window.open.editor.path.index,
                            {
                                id: id,
                                mode: 'block',
                                type: 'kramdown',
                                lang: window.theme.languageMode,
                                path: temp_file_path_relative,
                                // theme: window.siyuan.config.appearance.mode,
                                fontFamily: encodeURI(window.siyuan.config.editor.fontFamily),
                                tabSize: window.siyuan.config.editor.codeTabSpaces,
                            },
                            config.theme.window.windowParams,
                            config.theme.window.menu.template,
                            undefined,
                            undefined,
                            undefined,
                            async (win) => {
                                // 窗口关闭时删除临时文件
                                setTimeout(async () => rm(temp_file_path_absolute), 0);
                            },
                        )
                    )
                )
            )
        );
    }
}

/* 编辑块 kramdown 源代码 */
async function editBlockKramdown(id) {
    window.theme.openNewWindow(
        'editor',
        undefined,
        {
            id: id,
            mode: 'block',
            type: 'kramdown',
            lang: window.theme.languageMode,
            fontFamily: encodeURI(window.siyuan.config.editor.fontFamily),
            tabSize: window.siyuan.config.editor.codeTabSpaces,
        },
        config.theme.window.windowParams,
        config.theme.window.menu.template,
        config.theme.window.open.editor.path.index,
    )
}
