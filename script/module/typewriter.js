/* 打字机模式 */

import { config } from './config.js';
import { isKey } from './../utils/hotkey.js';
import { getFocusedBlock } from './../utils/dom.js';
import { globalEventHandler } from './../utils/listener.js';
import {
    toolbarItemInit,
    toolbarItemChangeStatu,
} from './../utils/ui.js';

var enable = false;

// 激活打字机
function activate() {
    // console.log('activate');
    // let protyle_wysiwyg = document.querySelectorAll('div.layout__wnd--active div.protyle:not(.fn__none) div.protyle-wysiwyg');
    let protyle_wysiwyg = document.querySelectorAll('div.protyle:not(.fn__none) div.protyle-wysiwyg');
    if (protyle_wysiwyg.length > 0) {
        for (let editor of protyle_wysiwyg) {
            if (editor.onkeyup == null) {
                editor.onkeyup = (e, t) => {
                    // console.log('onkeyup');
                    let block = getFocusedBlock(); // 当前光标所在块
                    let page = editor.parentElement; // 当前页面
                    if (block == null || page == null) return;
                    let focus = window.getSelection().focusNode.parentElement;
                    switch (block.dataset.type) {
                        case 'NodeCodeBlock':
                            if (config.theme.typewriter.switch.NodeCodeBlock.enable == false) return;
                            /* 代码块焦点 */
                            switch (config.theme.typewriter.switch.NodeCodeBlock.mode) {
                                // 表格聚焦模式
                                case 'row': // 聚焦行
                                    if (focus != null && focus.nodeName == 'SPAN') block = focus || block;
                                    else return;
                                    break;
                                case 'block': // 聚焦块
                                default:
                                    break;
                            }
                            break;
                        case 'NodeTable':
                            if (config.theme.typewriter.switch.NodeTable.enable == false) return;
                            /* 表格焦点 */
                            switch (config.theme.typewriter.switch.NodeTable.mode) {
                                // 表格聚焦模式
                                case 'row': // 聚焦行
                                    while (focus != null && focus.nodeName != 'TR') focus = focus.parentElement;
                                    block = focus || block;
                                    break;
                                case 'block': // 聚焦块
                                default:
                                    break;
                            }
                            break;
                        default:
                            break;
                    }
                    let block_height = block.clientHeight; // 当前块的高度
                    let block_bottom = block.getBoundingClientRect().bottom; // 当前块的底部
                    let page_height = page.clientHeight; // 当前页面的高度
                    let page_bottom = page.getBoundingClientRect().bottom; // 当前页面的底部
                    // console.log(block_height, block_bottom, page_height, page_bottom);
                    page.style.scrollBehavior = "smooth";
                    page.scrollBy(0, -((page_bottom - page_height / 2) - (block_bottom - block_height / 2)));
                };
            }
        }
    }
}

function typewriterEnable() {
    // let tab_bar = document.querySelector('div.layout__center ul.layout-tab-bar');
    // console.log(tab_bar);
    var editor = window.siyuan.layout
        ? window.siyuan.layout.centerLayout.element
        : window.siyuan.mobileEditor.protyle.element;
    if (editor) {
        enable = !enable;
        // 更改菜单栏按钮状态
        toolbarItemChangeStatu(
            config.theme.typewriter.switch.toolbar.id,
            true,
            enable,
            'BUTTON',
        );
        if (enable) {
            setTimeout(activate, 0);
            // console.log(editor.onclick);
            if (editor.onclick == null) {
                editor.onclick = (e, t) => {
                    setTimeout(activate, 0);
                }
            }
        }
        else {
            editor.onclick = null;
            var editors = document.getElementsByClassName("protyle-wysiwyg");
            for (let editor of editors) {
                editor.onkeyup = null;
            }
        }
    }
}

setTimeout(() => {
    try {
        if (config.theme.typewriter.enable) {
            if (config.theme.typewriter.switch.enable) {
                const Fn_typewriterEnable = toolbarItemInit(
                    config.theme.typewriter.switch.toolbar,
                    typewriterEnable,
                );

                // 使用快捷键开/关打字机模式
                globalEventHandler.addEventHandler(
                    'keyup',
                    config.theme.hotkeys.typewriter.switch,
                    _ => Fn_typewriterEnable(),
                );
            }
        }
    } catch (err) {
        console.error(err);
    }
}, 0);
