/* 背景图片 */

import { config } from './config.js';
import { globalEventHandler } from './../utils/listener.js';
import {
    toolbarItemInit,
} from './../utils/ui.js';
import {
    shuffle,
    Iterator,
} from './../utils/misc.js';

function changeBackground(background = null, mode = 'image') {
    // console.log(background);
    let element = document.querySelector('.fn__flex-1.protyle.fullscreen') || document.body;
    switch (mode) {
        case 'color':
            if (background) {
                /* 设置背景颜色 */
                document.documentElement.style.setProperty(config.theme.background.color.propertyName, background);
            }
            else {
                /* 移除所设背景颜色 */
                document.documentElement.style.removeProperty(config.theme.background.color.propertyName);
            }
            break;
        case 'image':
        default:
            if (background) {
                /* 移除背景颜色并设置背景图片 */
                changeBackground(null, 'color');
                document.documentElement.style.setProperty(config.theme.background.image.propertyName, `url("${background}")`);
            }
            else {
                /* 设置背景颜色并取消背景图片 */
                const color = config.theme.background.color.default[window.theme.themeMode];
                changeBackground(color, 'color');
                /* 由于存在默认背景图片, 因此需要使用 unset 取消默认设置的背景图片 */
                document.documentElement.style.setProperty(config.theme.background.image.propertyName, 'unset');
            }
    }
}

function switchBackground(lightIter, darkIter) {
    // console.log(customBackground);
    let landscape, portrait;
    /* 判断主题颜色 */
    switch (window.theme.themeMode) {
        case 'light':
            landscape = lightIter.landscape;
            portrait = lightIter.portrait;
            break;
        case 'dark':
        default:
            landscape = darkIter.landscape;
            portrait = darkIter.portrait;
            break;
    }
    /* 判断窗口宽高 */
    switch (window.theme.orientation()) {
        case 'portrait':
            changeBackground(portrait.next().value);
            break;
        case 'landscape':
        default:
            changeBackground(landscape.next().value);
            break;
    }
}

setTimeout(() => {
    try {
        if (config.theme.background.enable) {
            if (config.theme.background.image.enable) {
                if (config.theme.background.image.web.enable) {
                    const WEB_LIGHT_LANDSCAPE_ITER = config.theme.background.image.web.random
                        ? Iterator(shuffle(config.theme.background.image.web.landscape.light.slice()), true)
                        : Iterator(config.theme.background.image.web.landscape.light.slice(), true);
                    const WEB_LIGHT_PORTRAIT_ITER = config.theme.background.image.web.random
                        ? Iterator(shuffle(config.theme.background.image.web.portrait.light.slice()), true)
                        : Iterator(config.theme.background.image.web.portrait.light.slice(), true);

                    const WEB_DARK_LANDSCAPE_ITER = config.theme.background.image.web.random
                        ? Iterator(shuffle(config.theme.background.image.web.landscape.dark.slice()), true)
                        : Iterator(config.theme.background.image.web.landscape.dark.slice(), true);
                    const WEB_DARK_PORTRAIT_ITER = config.theme.background.image.web.random
                        ? Iterator(shuffle(config.theme.background.image.web.portrait.dark.slice()), true)
                        : Iterator(config.theme.background.image.web.portrait.dark.slice(), true);

                    const Fn_webBackground = toolbarItemInit(
                        config.theme.background.image.web.toolbar,
                        () => switchBackground({
                            landscape: WEB_LIGHT_LANDSCAPE_ITER,
                            portrait: WEB_LIGHT_PORTRAIT_ITER,
                        }, {
                            landscape: WEB_DARK_LANDSCAPE_ITER,
                            portrait: WEB_DARK_PORTRAIT_ITER,
                        }),
                    );

                    // 随机背景图片
                    globalEventHandler.addEventHandler(
                        'keyup',
                        config.theme.hotkeys.background.image.web,
                        _ => Fn_webBackground(),
                    );
                }
                if (config.theme.background.image.custom.enable) {
                    const CUSTOM_LIGHT_LANDSCAPE_ITER = config.theme.background.image.custom.random
                        ? Iterator(shuffle(config.theme.background.image.custom.landscape.light.slice()), true)
                        : Iterator(config.theme.background.image.custom.landscape.light.slice(), true);
                    const CUSTOM_LIGHT_PORTRAIT_ITER = config.theme.background.image.custom.random
                        ? Iterator(shuffle(config.theme.background.image.custom.portrait.light.slice()), true)
                        : Iterator(config.theme.background.image.custom.portrait.light.slice(), true);

                    const CUSTOM_DARK_LANDSCAPE_ITER = config.theme.background.image.custom.random
                        ? Iterator(shuffle(config.theme.background.image.custom.landscape.dark.slice()), true)
                        : Iterator(config.theme.background.image.custom.landscape.dark.slice(), true);
                    const CUSTOM_DARK_PORTRAIT_ITER = config.theme.background.image.custom.random
                        ? Iterator(shuffle(config.theme.background.image.custom.portrait.dark.slice()), true)
                        : Iterator(config.theme.background.image.custom.portrait.dark.slice(), true);

                    const Fn_customBackground = toolbarItemInit(
                        config.theme.background.image.custom.toolbar,
                        () => switchBackground({
                            landscape: CUSTOM_LIGHT_LANDSCAPE_ITER,
                            portrait: CUSTOM_LIGHT_PORTRAIT_ITER,
                        }, {
                            landscape: CUSTOM_DARK_LANDSCAPE_ITER,
                            portrait: CUSTOM_DARK_PORTRAIT_ITER,
                        }),
                        2,
                    );
                    // 是否默认启用自定义背景图片
                    if (config.theme.background.image.custom.default) Fn_customBackground();

                    // 使用快捷键切换自定义背景图片
                    globalEventHandler.addEventHandler(
                        'keyup',
                        config.theme.hotkeys.background.image.custom,
                        _ => Fn_customBackground(),
                    );
                }
            }
        }
    } catch (err) {
        console.error(err);
    }
}, 0);
