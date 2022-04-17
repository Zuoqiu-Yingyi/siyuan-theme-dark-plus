/* 菜单增强 */

import { config } from './config.js';
import { isKey } from './../utils/hotkey.js';
import { getSysFonts } from './../utils/api.js';
import {
    getBlockMark, // 获得块标记 ID
    getBlockSelected, // 获得块选中 ID
} from './../utils/dom.js';
import {
    toolbarItemInit,
    toolbarItemChangeStatu,
    blockMenuInit,
    CommonMenuObserver,
} from './../utils/ui.js';

var block_mark = null; // 块标获取的块
var block_menu_enable = false; // 块菜单是否激活
var block_menu_observer = null; // 块菜单
const COMMON_FONTS = [
    '等线',
    '方正舒体',
    '方正姚体',
    '仿宋',
    '黑体',
    '华文彩云',
    '华文仿宋',
    '华文琥珀',
    '华文楷体',
    '华文隶书',
    '华文宋体',
    '华文细黑',
    '华文新魏',
    '华文行楷',
    '华文中宋',
    '楷体',
    '隶书',
    '宋体',
    '微软雅黑',
    '新宋体',
    '幼圆',
];

/**
 * 块菜单更改回调函数
 * REF [MutationObserver.MutationObserver() - Web API 接口参考 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver/MutationObserver)
 * REF [MutationRecord - Web API 接口参考 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationRecord)
 */
function blockMenuCallback(mutationList, observer) {
    // 已经添加菜单项
    // console.log(mutationList);

    if (block_menu_observer.menuNode.querySelector(`#${config.theme.menu.block.items[0].id}`)) {
        observer.takeRecords();
        return;
    };

    // 没有添加菜单项
    // console.log(mutationList);
    for (let i = mutationList.length - 1; i >= 0; --i) {
        let mutation = mutationList[i];
        // console.log(mutation);

        // 菜单已经加载完成
        if (mutation.addedNodes.length === 1
            && mutation.addedNodes[0].classList.contains('b3-menu__item--readonly')
            && mutation.previousSibling
            && mutation.previousSibling.classList.contains('b3-menu__separator')
        ) {
            // 块菜单添加
            // console.log(mutation);
            let block = block_mark || getBlockSelected() || null;
            if (block) {
                let items = blockMenuInit(
                    config.theme.menu.block.items,
                    block.id,
                    block.type,
                    block.subtype,
                );
                if (items) items.forEach(item => block_menu_observer.menuNode.insertBefore(item, mutation.previousSibling));
            }
            break;
        }
    }
}

/* 开启/关闭块菜单 */
function blockMenuEnable() {
    if (!block_menu_enable) {
        // 开启块菜单
        block_menu_observer.observe();
        block_menu_enable = true;
    }
    else {
        // 关闭块菜单        
        block_menu_observer.disconnect();
        block_menu_observer.takeRecords();
        block_menu_enable = false;
    }
    // 更改菜单栏按钮状态
    toolbarItemChangeStatu(
        config.theme.menu.block.toolbar.id,
        block_menu_enable,
        'SVG',
        undefined,
        1,
    );
}

/* 加载字体 */
async function loadFonts(menuItems, fonts, mode) {
    switch (mode) {
        case 'custom-font-family':
            fonts.forEach(font => menuItems.push({ // 加载自定义字体
                enable: true,
                type: null,
                mode: "button",
                icon: "#iconFont",
                label: {
                    zh_CN: font,
                    other: font,
                    style: `font-family: "${font}"`,
                },
                accelerator: `font-family: "${font}"`,
                click: {
                    enable: true,
                    callback: null,
                    tasks: [
                        {
                            type: 'attr-update',
                            params: {
                                'custom-font-family': font,
                            },
                        },
                    ],
                },
            }));
            break;
        case 'style':
            fonts.forEach(font => menuItems.push({ // 加载其他字体
                enable: true,
                type: null,
                mode: "button",
                icon: "#iconFont",
                label: {
                    zh_CN: font,
                    other: font,
                    style: `font-family: "${font}"`,
                },
                accelerator: font,
                click: {
                    enable: true,
                    callback: null,
                    tasks: [
                        {
                            type: 'attr-update',
                            params: {
                                'style': `font-family: "${font}"`,
                            },
                        },
                    ],
                },
            }));
            break;
        default:
    }
}

/* 加载字体菜单项 */
async function loadFontsItem(items, fontList) {
    let system_fonts = await getSysFonts();
    loadFonts(config.theme.menu.block.items[0].items, COMMON_FONTS, 'custom-font-family');
    loadFonts(config.theme.menu.block.items[1].items, system_fonts, 'style');
}


setTimeout(() => {
    try {
        if (config.theme.menu.enable) {
            if (config.theme.menu.block.enable) {
                setTimeout(loadFontsItem, 0);
                block_menu_observer = new CommonMenuObserver(blockMenuCallback);
                let Fn_blockMenuEnable = toolbarItemInit(
                    config.theme.menu.block.toolbar,
                    blockMenuEnable,
                );
                // 使用快捷键开启/关闭块菜单
                window.addEventListener('keyup', (e) => {
                    // console.log(e);
                    if (isKey(e, config.theme.hotkeys.menu.block)) {
                        Fn_blockMenuEnable();
                    }
                }, true);

                // 获取块标记 ID
                window.addEventListener('mouseup', (e) => {
                    // console.log(e);
                    block_mark = getBlockMark(e.target);
                }, true);
            }
        }
    } catch (err) {
        console.error(err);
    }
}, 0);
