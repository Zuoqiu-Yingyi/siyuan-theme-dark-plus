/* 视频/音频跳转到指定时间 */

import { config } from './config.js';
import {
    isEvent,
    isButton,
} from './../utils/hotkey.js';
import { getBlockAttrs } from './../utils/api.js';
import {
    timestampParse,
    timestampFormat,
    id2url,
    intPrefix,
} from './../utils/misc.js';

async function jump(target) {
    // console.log(target.dataset);
    if (target.dataset.nodeId) {
        switch (target.dataset.type) {
            case 'NodeAudio':
            case 'NodeVideo':
                setTimeout(() => {
                    getBlockAttrs(target.dataset.nodeId).then((attrs) => {
                        // console.log(attrs);
                        if (attrs) {
                            let timestamp = attrs[config.theme.timestamp.attribute];
                            if (timestamp && config.theme.regs.time.test(timestamp)) {
                                let seconds = timestampParse(timestamp);
                                target.firstElementChild.firstElementChild.currentTime = seconds;
                            }
                        }
                    });
                }, 0);
                break;
            default:
                break;
        }
    }
}

async function create(target) {
    // console.log(target.dataset);
    if (target.dataset.nodeId) {
        let id = target.dataset.nodeId; // 块 ID
        switch (target.dataset.type) {
            case 'NodeAudio':
            case 'NodeVideo':
                setTimeout(async () => {
                    let seconds = target.firstElementChild.firstElementChild.currentTime;
                    let timestamp = timestampFormat(seconds);
                    // console.log(seconds);

                    let hyperlink = `[${timestamp}](${id2url(id)} "{&quot;${config.theme.timestamp.attribute}&quot;: &quot;${timestamp}&quot;}")`;
                    // console.log(hyperlink);
                    navigator.clipboard.writeText(hyperlink);
                }, 0);
                break;
            case 'NodeIFrame':
                // 视频网站时间戳
                let timestamp = target.getAttribute(config.theme.timestamp.attribute);
                if (config.theme.regs.time.test(timestamp)) {
                    // 通过块属性生成一个时间戳
                    timestamp = timestampFormat(timestampParse(timestamp));
                    let hyperlink = `[${timestamp}](${id2url(id)} "{&quot;${config.theme.timestamp.attribute}&quot;: &quot;${timestamp}&quot;}")`;
                    navigator.clipboard.writeText(hyperlink);
                }
                break;
            default:
                break;
        }
    }
}

setTimeout(() => {
    try {
        if (config.theme.timestamp.enable) {
            let body = document.body;
            if (config.theme.timestamp.jump.enable) {
                // 跳转到所单击块的时间戳
                body.addEventListener('click', (e) => {
                    // console.log(e);
                    if (isEvent(e, config.theme.hotkeys.timestamp.jump)) {
                        setTimeout(async () => {
                            await jump(e.target);
                        }, 0);
                    }
                }, true);
            }

            if (config.theme.timestamp.create.enable) {
                // 生成时间戳并写入剪贴板
                body.addEventListener('mousedown', (e) => {
                    // console.log(e);
                    if (isButton(e, config.theme.hotkeys.timestamp.create)) {
                        setTimeout(async () => {
                            await create(e.target);
                        }, 0);
                    }
                }, true);
            }
        }
    } catch (err) {
        console.error(err);
    }
}, 0);
