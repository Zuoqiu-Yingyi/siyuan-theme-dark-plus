/* 
 * 重新加载整个窗口
 * 重新加载 iframe(iframe块, 挂件块)
 * REF [JS/jQuery 刷新 iframe 的方法 | 菜鸟教程](https://www.runoob.com/w3cnote/js-jquery-refresh-iframe.html)
 */

import { config } from './config.js';
import {
    isKey,
    isEvent,
} from './../utils/hotkey.js';
import { getBlockAttrs } from './../utils/api.js';
import { timestampParse } from './../utils/misc.js';
import { toolbarItemInit } from './../utils/ui.js';

function bilibiliTimestamp(url, seconds = null) {
    // BiliBili 视频时间戳
    if (seconds == null || seconds == 0) {
        url.searchParams.delete('t');
    } else {
        url.searchParams.set('t', seconds);
    }
}

function youtubeTimestamp(url, seconds = null) {
    // YouTube 视频时间戳
    if (seconds == null || (seconds | 0) == 0) {
        url.searchParams.delete('start');
        url.searchParams.delete('autoplay');
    } else {
        url.searchParams.set('start', seconds | 0);
        url.searchParams.set('autoplay', 1);
    }
}

async function reloadIframe(target) {
    // console.log(target.dataset);
    if (target.dataset.nodeId) {
        switch (target.dataset.type) {
            case 'NodeIFrame':
                if (config.theme.timestamp.jump.enable) {
                    // 视频网站时间戳
                    // let timestamp = target.getAttribute(config.theme.timestamp.attribute);
                    setTimeout(async () => {
                        getBlockAttrs(target.dataset.nodeId).then((attrs) => {
                            let href = target.firstElementChild.firstElementChild.src;
                            // console.log(attrs);
                            if (attrs) {
                                let url = new URL(href);
                                let timestamp = attrs[config.theme.timestamp.attribute];
                                if (config.theme.regs.time.test(timestamp)) {
                                    // 块自定义属性中有时间戳
                                    let seconds = timestampParse(timestamp);
                                    switch (url.hostname) {
                                        case 'player.bilibili.com':
                                            // 如果是 B 站视频
                                            bilibiliTimestamp(url, seconds);
                                            break;
                                        case 'www.youtube.com':
                                            // 如果是 YouTube 视频
                                            // REF [YouTube | How to configure iFrame parameters](https://fernandosarachaga.com/en/youtube-how-to-configure-iframe-parameters/)
                                            youtubeTimestamp(url, seconds);
                                            break;
                                        default:
                                            break;
                                    }
                                } else {
                                    // 块自定义属性中没有时间戳
                                    switch (url.hostname) {
                                        case 'player.bilibili.com':
                                            // 如果是 B 站视频
                                            bilibiliTimestamp(url);
                                            break;
                                        case 'www.youtube.com':
                                            // 如果是 YouTube 视频
                                            // REF [YouTube | How to configure iFrame parameters](https://fernandosarachaga.com/en/youtube-how-to-configure-iframe-parameters/)
                                            youtubeTimestamp(url);
                                            break;
                                        default:
                                            break;
                                    }
                                }
                                href = url.href;
                            }
                            target.firstElementChild.firstElementChild.src = href;
                        });
                    }, 0);
                    break;
                }
            case 'NodeWidget':
                try {
                    target.firstElementChild.firstElementChild.location.reload();
                } catch (err) {
                    target.firstElementChild.firstElementChild.src = target.firstElementChild.firstElementChild.src;
                }
                break;
            default:
                break;
        }
    }
}

setTimeout(() => {
    try {
        if (config.theme.reload.enable) {
            if (config.theme.reload.window.enable) {
                let Fn_reload = toolbarItemInit(
                    config.theme.reload.window.toolbar,
                    () => window.location.reload(),
                );
                
                // 使用快捷键重新加载整个窗口
                window.addEventListener('keyup', (e) => {
                    // console.log(e);
                    if (isKey(e, config.theme.hotkeys.reload.window)) {
                        Fn_reload();
                    }
                }, true);
            }

            if (config.theme.reload.iframe.enable) {
                // 重新加载 iframe
                window.addEventListener('click', (e) => {
                    // console.log(e);
                    if (isEvent(e, config.theme.hotkeys.reload.iframe)) {
                        setTimeout(async () => {
                            await reloadIframe(e.target);
                        }, 0);
                    }
                }, true);
            }
        }
    } catch (err) {
        console.error(err);
    }
}, 0);
