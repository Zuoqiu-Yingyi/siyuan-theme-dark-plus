/* 视频/音频跳转到指定时间 */
import { config } from '/appearance/themes/Dark+/script/module/config.js';
import { isEvent } from '/appearance/themes/Dark+/script/utils/hotkey.js';
import { timestampParse } from '/appearance/themes/Dark+/script/utils/misc.js';
import { getBlockAttrs } from '/appearance/themes/Dark+/script/utils/api.js';

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
                            let timestamp = attrs[config.timestamp.attribute];
                            if (timestamp && config.regs.time.test(timestamp)) {
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

(() => {
    try {
        if (config.timestamp.enable) {
            let body = document.querySelector('body');

            // 跳转到所单击块的时间戳
            body.addEventListener('click', (e) => {
                // console.log(e);
                if (isEvent(e, config.hotkeys.timestamp.jump)) {
                    setTimeout(async () => {
                        await jump(e.target);
                    }, 0);
                }
            }, true);
        }
    } catch (err) {
        console.error(err);
    }
})();
