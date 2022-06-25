export {
    editKramdownDoc, // 编辑 kramdown 源代码
}

import { config } from '../module/config.js';
import {
    getBlockByID,
    renameDoc,
    docSaveAsTemplate,
} from './api.js';
import {
    rm,
} from './system.js';

/* 编辑 kramdown 源代码 */
async function editKramdownDoc(id) {
    const b = await getBlockByID(id);
    if (b && b.type === 'd') { // 如果是文档块
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
                        config.theme.window.windowParams,
                        config.theme.window.menu.template,
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
}
