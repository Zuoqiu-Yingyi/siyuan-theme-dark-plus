/* 浏览位置 */

import {
    config,
    custom,
    saveCustomFile,
} from './config.js';
import { jump } from './../utils/misc.js';
import { globalEventHandler } from './../utils/listener.js';
import {
    isKey,
    isButton,
} from './../utils/hotkey.js';
import {
    getFocusedBlock,
    getFocusedDocID,
    getTargetBlockIndex,
    setBlockDOMAttrs,
    setBlockSlider,
} from './../utils/dom.js';
import {
    getBlockAttrs,
    setBlockAttrs,
} from './../utils/api.js';
import {
    toolbarItemInit,
    toolbarItemChangeStatu,
} from './../utils/ui.js';

var record_enable = false;

/**
 * 更新 index 值
 */
async function updateBlockSlider() {
    let block = getFocusedBlock(); // 当前光标所在块
    let top = await getTargetBlockIndex(block); // 获得焦点所在顶层块
    // console.log(block, top);
    if (block && top) {
        setBlockSlider(top.index, top.scroll, top.offset); // 设置滑块位置
        return {
            block,
            top,
        }
    }
    return null;
}
/**
 * 目标处理函数
 */
async function focusHandler(target, mode = config.theme.location.record.mode) {
    if (target
        && (target.classList.contains('protyle-scroll')
            || target.classList.contains('b3-slider')
        )
    ) return; // 单击了滑块
    const INDEX = await updateBlockSlider();
    // console.log(INDEX);
    if (INDEX) {
        switch (mode) {
            case 1: // 保存在 custom.json 中
                record(INDEX.top.doc, INDEX.top.index); // 记录当前阅读进度
                break;
            case 2: // 保存在文档块属性中
                const ID = INDEX.block.dataset.nodeId; // 当前光标所在块的 ID
                record(INDEX.top.doc, ID); // 记录当前阅读进度
                break;
        }
    }
}


/**
 * 跳转到浏览位置
 */
async function goto(docID, scroll, mode = config.theme.location.record.mode) {
    // console.log(docID, scroll);
    switch (mode) {
        case 1: // 保存在 custom.json 中
            const INDEX = custom.theme.location[docID];
            if (INDEX) {
                setBlockSlider(INDEX, scroll);
                scroll.firstElementChild.click();
            }
            break;
        case 2: // 保存在文档块属性中
            const ATTRS = await getBlockAttrs(docID);
            if (ATTRS) {
                const LOCATION = ATTRS[config.theme.location.record.attribute];
                if (LOCATION) {
                    setTimeout(() => jump(LOCATION), 0);
                }
            }
            break;
    }
}

/**
 * 回到上次浏览位置
 */
async function back(target) {
    // console.log(target);
    let scroll;
    // console.log(target.dataset.docType, target.getAttribute('custom-location'))
    if (target.dataset.docType
        && config.theme.regs.id.test(target.getAttribute('custom-location'))
    ) {
        // 当前阅读进度标识
        scroll = target
            .parentElement
            .nextElementSibling
            .nextElementSibling
            .nextElementSibling; // 块滚动条;
    }
    else if (target && target.localName === 'input' && target.className === 'b3-slider') {
        scroll = target.parentElement;
    }
    else if (target && target.localName === 'div' && target.classList.contains('protyle-scroll')) {
        scroll = target;
    }
    else return null;

    setTimeout(async () => goto(
        scroll.parentElement.querySelector('.protyle-background').dataset.nodeId,
        scroll,
    ), 0);
}

/**
 * 记录浏览位置
 */
function record(docID, value, mode = config.theme.location.record.mode) {
    if (record_enable && config.theme.location.record.enable) {
        switch (mode) {
            case 1: // 保存在 custom.json 中
                custom.theme.location[id] = index; // 记录当前阅读进度
                setTimeout(async () => saveCustomFile(custom), 0);
                break;

            case 2: // 保存在文档块属性中
                const ATTRS = { [config.theme.location.record.attribute]: value };
                setBlockDOMAttrs(docID, ATTRS);
                setBlockAttrs(docID, ATTRS);
                break;
            default:
                break;
        }
    }
}

/**
 * 开关浏览位置记录功能
 */
function recordEnable() {
    record_enable = !record_enable;
    // 更改菜单栏按钮状态
    toolbarItemChangeStatu(
        config.theme.location.record.toolbar.id,
        true,
        record_enable,
        'BUTTON',
    );
}

/**
 * 清除当前文档浏览位置
 */
function clear(mode = config.theme.location.record.mode) {
    if (config.theme.location.clear.enable) {
        const DOC_ID = getFocusedDocID();
        // console.log(DOC_ID);
        if (config.theme.regs.id.test(DOC_ID)) {
            switch (mode) {
                case 1: // 保存在 custom.json 中
                    delete custom.theme.location[DOC_ID]; // 清除当前文档阅读进度
                    setTimeout(async () => saveCustomFile(custom), 0); // 保存
                    break;
                case 2: // 保存在文档块属性中
                    const ATTRS = { [config.theme.location.record.attribute]: '' };
                    setBlockDOMAttrs(DOC_ID, ATTRS);
                    setBlockAttrs(DOC_ID, ATTRS);
                    break;
                default:
                    break;
            }
        }
    }
}

/* 获得编辑器 */
function getEditor(callback) {
    const EDITOR = window.siyuan.layout
        ? window.siyuan.layout.centerLayout.element
        : window.siyuan.mobileEditor.protyle.element;
    if (EDITOR) {
        if (typeof callback === 'function') setTimeout(() => callback(EDITOR), 0);
        return EDITOR;
    }
}

setTimeout(() => {
    try {
        if (config.theme.location.enable) {
            if (config.theme.location.slider.enable) {
                function fn() {
                    // 编辑器可能还没有加载完成, 所以需要轮询
                    try {
                        getEditor((editor) => {
                            if (config.theme.location.slider.follow.enable) {
                                // 滑块跟踪鼠标点击的块
                                editor.addEventListener('click', e => setTimeout(async () => focusHandler(e.target), 0));
                            }

                            if (config.theme.location.slider.goto.enable) {
                                // 跳转浏览进度
                                editor.addEventListener('mouseup', (e) => {
                                    // console.log(e);
                                    if (isButton(e, config.theme.hotkeys.location.slider.goto)) {
                                        setTimeout(() => back(e.target), 0);
                                    }
                                }, true);
                            }
                        })
                    }
                    catch (e) {
                        setTimeout(fn, config.theme.goto.delay);
                    };
                }
                setTimeout(fn, 0);
            }
            if (config.theme.location.record.enable) {
                // 开关浏览位置记录功能
                const Fn_recordEnable = toolbarItemInit(
                    config.theme.location.record.toolbar,
                    recordEnable,
                );
                globalEventHandler.addEventHandler(
                    'keyup',
                    config.theme.hotkeys.location.record,
                    _ => Fn_recordEnable(),
                );
            }
            if (config.theme.location.clear.enable) {
                // 清除当前文档浏览位置
                const Fn_clear = toolbarItemInit(
                    config.theme.location.clear.toolbar,
                    clear,
                );
                globalEventHandler.addEventHandler(
                    'keyup',
                    config.theme.hotkeys.location.clear,
                    _ => Fn_clear(),
                );
            }
        }
    } catch (err) {
        console.error(err);
    }
}, 0);
