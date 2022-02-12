/* 视频/音频跳转到指定时间 */
import { config } from '/appearance/themes/Dark+/script/module/config.js';
import { isEvent } from '/appearance/themes/Dark+/script/utils/hotkey.js';
import { isNum } from '/appearance/themes/Dark+/script/utils/misc.js';

(() => {
    if (config.timestamp.enable) {
        let body = document.querySelector('body');
        // 块属性编辑窗口确认按钮保存自定义样式
        body.addEventListener('click', (e) => {
            try {
                // console.log(e);
                if (isEvent(e, config.hotkeys.timestamp.jump)) {
                    var time = e.target.getAttribute(config.timestamp.attribute);
                    if (isNum(time)) {
                        switch (e.target.getAttribute('data-type')) {
                            case 'NodeAudio':
                            case 'NodeVideo':
                                setTimeout(() => {
                                    e.target.firstElementChild.firstElementChild.currentTime = time;
                                }, 0);
                                break;

                            default:
                                break;
                        }
                    }
                }
            } catch (err) {
                console.error(err);
            }
        }, true);
    }
})();
