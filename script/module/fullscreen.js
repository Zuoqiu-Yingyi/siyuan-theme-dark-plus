/* iframe / widgets 全屏 */
import { config } from './config.js';
import { getTargetBlock } from './../utils/dom.js';
import { globalEventHandler } from './../utils/listener.js';

async function fullscreenIframe(target) {
    const block = getTargetBlock(target);
    if (block) {
        switch (target.dataset.type) {
            case 'NodeIFrame':
            case 'NodeWidget':
                block.querySelector('iframe')?.requestFullscreen();
                break;
            default:
                break;
        }
    }
}

setTimeout(() => {
    try {
        if (config.theme.fullscreen.enable) {
            if (config.theme.fullscreen.iframe.enable) {
                // 全屏显示 iframe / widgets
                globalEventHandler.addEventHandler(
                    config.theme.hotkeys.fullscreen.iframe.type,
                    config.theme.hotkeys.fullscreen.iframe,
                    e => setTimeout(async () => fullscreenIframe(e.target), 0),
                );
            }
        }
    } catch (err) {
        console.error(err);
    }
}, 0);
