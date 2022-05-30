/* 视频/音频跳转到指定时间 */

import { config } from './config.js';
import {
    isEvent,
    isButton,
} from './../utils/hotkey.js';
import { getBlockAttrs } from './../utils/api.js';
import { getTargetBlock } from './../utils/dom.js';
import { globalEventHandler } from './../utils/listener.js';
import {
    timestampParse,
    timestampFormat,
    id2url,
    intPrefix,
} from './../utils/misc.js';

async function jump(target) {
    const block = getTargetBlock(target);
    if (block) {
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
    const block = getTargetBlock(target);
    if (block) {
        let id = block.dataset.nodeId; // 块 ID
        switch (block.dataset.type) {
            case 'NodeAudio':
            case 'NodeVideo':
                setTimeout(async () => {
                    let seconds = block.firstElementChild.firstElementChild.currentTime;
                    let timestamp = timestampFormat(seconds);
                    // console.log(seconds);

                    let hyperlink = `[${timestamp}](${id2url(id)} "{&quot;${config.theme.timestamp.attribute}&quot;: &quot;${timestamp}&quot;}")`;
                    // console.log(hyperlink);
                    navigator.clipboard.writeText(hyperlink);
                }, 0);
                break;
            case 'NodeIFrame':
                // 视频网站时间戳
                let timestamp = block.getAttribute(config.theme.timestamp.attribute);
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
            if (config.theme.timestamp.jump.enable) {
                // 跳转到所单击块的时间戳
                globalEventHandler.addEventHandler(
                    config.theme.hotkeys.timestamp.jump.type,
                    config.theme.hotkeys.timestamp.jump,
                    e => setTimeout(() => jump(e.target), 0),
                );
            }

            if (config.theme.timestamp.create.enable) {
                // 生成时间戳并写入剪贴板
                globalEventHandler.addEventHandler(
                    'mouseup',
                    config.theme.hotkeys.timestamp.create,
                    e => setTimeout(() => create(e.target), 0),
                );
            }
        }
    } catch (err) {
        console.error(err);
    }
}, 0);
