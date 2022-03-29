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

async function reloadIframe(target) {
    // console.log(target.dataset);
    if (target.dataset.nodeId) {
        switch (target.dataset.type) {
            case 'NodeIFrame':
                // 视频网站时间戳
                // let timestamp = target.getAttribute(config.theme.timestamp.attribute);
                setTimeout(() => {
                    getBlockAttrs(target.dataset.nodeId).then((attrs) => {
                        let href = target.firstElementChild.firstElementChild.src;
                        // console.log(attrs);
                        if (attrs) {
                            let timestamp = attrs[config.theme.timestamp.attribute];
                            if (config.theme.regs.time.test(timestamp)) {
                                // 块自定义属性中有时间戳
                                let src = target.firstElementChild.firstElementChild.src;
                                let url = new URL(src);
                                let second = timestampParse(timestamp);
                                switch (url.hostname) {
                                    case 'player.bilibili.com':
                                        // 如果是 B 站视频
                                        if (second == 0) url.searchParams.delete('t');
                                        else url.searchParams.set('t', second);
                                        href = url.href;
                                        break;
                                    case 'www.youtube.com':
                                        // 如果是 YouTube 视频
                                        // REF [YouTube | How to configure iFrame parameters](https://fernandosarachaga.com/en/youtube-how-to-configure-iframe-parameters/)
                                        if (second == 0) {
                                            url.searchParams.delete('start');
                                            url.searchParams.delete('autoplay');
                                        } else {
                                            url.searchParams.set('start', second | 0);
                                            url.searchParams.set('autoplay', 1);
                                        }
                                        href = url.href;
                                        break;
                                    default:
                                        break;
                                }
                            }
                        }
                        target.firstElementChild.firstElementChild.src = href;
                    });
                }, 0);
                break;
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

(() => {
    try {
        if (config.theme.reload.enable) {
            let body = document.querySelector('body');
            if (config.theme.reload.window.enable) {
                // 重新加载整个窗口
                body.addEventListener('keyup', (e) => {
                    // console.log(e);
                    if (isKey(e, config.theme.hotkeys.reload.window)) {
                        setTimeout(() => {
                            window.location.reload();
                        }, 0);
                    }
                });
            }

            if (config.theme.reload.iframe.enable) {
                // 重新加载 iframe
                body.addEventListener('click', (e) => {
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
})();
