/* 鼠标滚轮功能 */

import { config } from './config.js';
import { setFontSize } from './../utils/dom.js';
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
                // 重新加载 iframe
                globalEventHandler.addEventHandler(
                    'mousewheel',
                    config.theme.hotkeys.wheel.zoom,
                    e => setTimeout(() => changeFontSize(e.wheelDeltaY), 0),
                );
            }
        }
    } catch (err) {
        console.error(err);
    }
}, 0);
