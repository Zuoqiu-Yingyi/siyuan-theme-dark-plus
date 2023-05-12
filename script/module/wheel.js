/* 鼠标滚轮功能 */

import { config } from './config.js';
import {
    setFontSize,
    disableMouseWheelZoomDom,
    isEventInEditor,
} from './../utils/dom.js';
import { compareVersion } from './../utils/string.js';
import { globalEventHandler } from './../utils/listener.js';

/* 字号更改 */
function changeFontSize(delta) {
    let size = delta / config.theme.wheel.zoom.threshold | 0;
    let old_size = window.siyuan.config.editor.fontSize;
    let new_size = Math.max(Math.min(old_size + size, config.theme.wheel.zoom.max), config.theme.wheel.zoom.min);
    new_size = setFontSize(new_size);
    if (new_size) window.siyuan.config.editor.fontSize = new_size;
}

setTimeout(() => {
    try {
        if (config.theme.wheel.enable) {
            if (config.theme.wheel.zoom.enable) {
                switch (window.theme.clientMode) {
                    case 'app':
                    case 'window':
                    case 'mobile':
                        /** 
                         * 2.8.8+ 版本思源原生支持编辑器字体缩放
                         * REF: https://github.com/siyuan-note/siyuan/issues/80
                        */
                        if (compareVersion(window.theme.kernelVersion, '2.8.7') > 0) {
                            break;
                        }

                    default:
                        // 更改字号
                        globalEventHandler.addEventHandler(
                            'mousewheel',
                            config.theme.hotkeys.wheel.zoom,
                            e => {
                                if (isEventInEditor(e)) {
                                    setTimeout(() => changeFontSize(e.wheelDeltaY), 0);
                                }
                            },
                        );
                        break;
                }

                if (config.theme.wheel.zoom.preventDefault.enable) {
                    // 阻止浏览器中的原生缩放
                    disableMouseWheelZoomDom(
                        config.theme.wheel.zoom.preventDefault.chromium,
                        config.theme.wheel.zoom.preventDefault.firefox,
                    );
                }
            }
        }
    } catch (err) {
        console.error(err);
    }
}, 0);
