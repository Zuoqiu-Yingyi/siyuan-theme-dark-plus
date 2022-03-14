import { config } from '/appearance/themes/Dark+/script/module/config.js';
import { isKey } from '/appearance/themes/Dark+/script/utils/hotkey.js';

var enable = false;

// 激活打字机
function activate() {
    // let protyle_wysiwyg = document.querySelectorAll('div.layout__wnd--active div.protyle:not(.fn__none) div.protyle-wysiwyg');
    let protyle_wysiwyg = document.querySelectorAll('div.protyle:not(.fn__none) div.protyle-wysiwyg');
    if (protyle_wysiwyg.length > 0) {
        for (let editor of protyle_wysiwyg) {
            editor.onkeyup = (e, t) => {
                let block = null;
                // 当前页面
                let page = editor.parentElement;
                // let page = document.activeElement.parentElement;
                if (document.activeElement.nodeName == 'TABLE') {
                    // 表格获取焦点
                    block = window.getSelection().focusNode.parentElement;

                    while (block != null && block.nodeName != 'TD') block = block.parentElement;
                }
                else {
                    block = window.getSelection().focusNode.parentElement; // 当前光标

                    while (block != null && block.dataset.nodeId == null) block = block.parentElement;
                }
                if (block == null || page == null) return;

                if (config.theme.typewriter.NodeCodeBlock.enable == false
                    && block.dataset.type == 'NodeCodeBlock'
                ) return;

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

function typewriterEnable() {
    // let tab_bar = document.querySelector('div.layout__center ul.layout-tab-bar');
    // console.log(tab_bar);
    var layouts = document.getElementById('layouts');
    if (layouts != null) {
        enable = !enable;
        if (enable) {
            setTimeout(activate, 0);
            layouts.onclick = (e, t) => {
                setTimeout(activate, 0);
            }
        }
        else {
            layouts.onclick = null;
            var editors = document.getElementsByClassName("protyle-wysiwyg");
            for (let editor of editors) {
                editor.onkeyup = null;
            }
        }
    }
}

(() => {
    try {
        if (config.theme.typewriter.enable) {
            let body = document.body;
            if (config.theme.typewriter.switch.enable) {
                // 启动打字机模式开关
                body.addEventListener('keyup', (e) => {
                    // console.log(e);
                    if (isKey(e, config.theme.hotkeys.typewriter.switch)) {
                        setTimeout(typewriterEnable, 0);
                    }
                });
            }
        }
    } catch (err) {
        console.error(err);
    }
})();
