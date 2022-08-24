/* 视频/音频跳转到指定时间 */

import { config } from './config.js';
import {
    getBlockAttrs,
    pushMsg,
    pushErrMsg,
} from './../utils/api.js';
import { getTargetBlock } from './../utils/dom.js';
import { globalEventHandler } from './../utils/listener.js';
import {
    timestampParse,
    timestampFormat,
    copyToClipboard,
    id2url,
} from './../utils/misc.js';

var ID, YTplayer;

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

/**
 * 复制时间戳至剪贴板
 * @params {string} timestamp: 格式化后的时间戳字符串
 * @params {string} id: 块 ID
 */
async function copyTimestamp(timestamp, id) {
    const hyperlink = `[${timestamp}](${id2url(id)} "{&quot;${config.theme.timestamp.attribute}&quot;: &quot;${timestamp}&quot;}")`;
    // console.log(hyperlink);
    copyToClipboard(hyperlink)
        .then(() => pushMsg(config.theme.timestamp.create.message.success))
        .catch(() => pushErrMsg(config.theme.timestamp.create.message.error));
}

/**
 * 监听 message 事件
 * REF [YouTube Player API Reference for iframe Embeds  |  YouTube IFrame Player API  |  Google Developers](https://developers.google.com/youtube/iframe_api_reference#Loading_a_Video_Player)
 */
async function YTmsgHandler(e) {
    // Check that the event was sent from the YouTube IFrame.
    if (e.source === YTplayer.getIframe().contentWindow) {
        const data = JSON.parse(e.data);

        // The "infoDelivery" event is used by YT to transmit any
        // kind of information change in the player,
        // such as the current time or a playback quality change.
        if (
            data.event === "infoDelivery" &&
            data.info &&
            data.info.currentTime
        ) {
            window.removeEventListener('message', YTmsgHandler, true); // 移除监听器

            // currentTime is emitted very frequently (milliseconds),
            const timestamp = timestampFormat(data.info.currentTime);
            copyTimestamp(timestamp, ID);
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
                    const seconds = block.firstElementChild.firstElementChild.currentTime;
                    const timestamp = timestampFormat(seconds);
                    // console.log(seconds);

                    copyTimestamp(timestamp, id);
                });
                break;
            case 'NodeIFrame':
                // 视频网站时间戳
                setTimeout(async () => {
                    const iframe = target.firstElementChild.firstElementChild;
                    const url = new URL(iframe.src);
                    let timestamp;
                    switch (url.hostname) {
                        case 'www.youtube.com':
                            // 如果是 YouTube 视频
                            // REF [javascript - How to listen to time change events with the YouTube IFrame Player API? - Stack Overflow](https://stackoverflow.com/questions/65511523/how-to-listen-to-time-change-events-with-the-youtube-iframe-player-api)
                            if (!url.searchParams.get('enablejsapi')) {
                                url.searchParams.set('enablejsapi', 1);
                                iframe.src = url.href;
                            }
                            ID = id;
                            if (!(
                                YTplayer
                                && YTplayer.getIframe
                                && YTplayer.getIframe() === iframe
                            )
                            ) YTplayer = new YT.Player(iframe);
                            // console.log(YTplayer);

                            // 通过监听 message 事件获取当前时间戳, 不能再暂停时使用
                            // window.addEventListener('message', YTmsgHandler, true);

                            // 使用 getCurrentTime 方法获取当前时间戳, 可以在暂停时使用
                            function then() {
                                // console.log('then');
                                if (YTplayer.getCurrentTime) {
                                    timestamp = timestampFormat(YTplayer.getCurrentTime());
                                    copyTimestamp(timestamp, id);
                                }
                                else {
                                    console.log(!!YTplayer.getCurrentTime, YTplayer.getCurrentTime);
                                    setTimeout(then, config.theme.timestamp.youtube.polling);
                                }
                            }
                            setTimeout(then, 0);
                            break;
                        case 'player.bilibili.com': // 如果是 B 站视频
                        default:
                            timestamp = block.getAttribute(config.theme.timestamp.attribute);
                            if (config.theme.regs.time.test(timestamp)) {
                                // 通过块属性生成一个时间戳
                                timestamp = timestampFormat(timestampParse(timestamp));
                                copyTimestamp(timestamp, id);
                            }
                            break;
                    }
                }, 0);
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
                window.theme.loadScript(config.theme.timestamp.youtube.iframe_api);
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
