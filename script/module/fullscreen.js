/* iframe / widgets 全屏 */
import { config } from './config.js';
import {
    getBlockMark,
    getTargetBlock,
    requestFullscreen,
    requestFullscreenBlock,
} from './../utils/dom.js';
import { globalEventHandler } from './../utils/listener.js';

async function fullscreenIframe(target) {
    const block = getTargetBlock(target);
    switch (block.dataset.type) {
        case 'NodeVideo':
        case 'NodeIFrame':
        case 'NodeWidget':
            requestFullscreenBlock(block);
            break;
        default:
            break;
    }
}

/* 处理双击块标 */
async function ondblclickBlockMark(e) {
    const mark = getBlockMark(e.target);
    if (mark) requestFullscreen(mark.id);
}

async function onfullscreenchange(e) {
    // console.log(e);
    const target = e.target;
    if (target.dataset.nodeId) { // 非 iframe/widgets/document 的其他块
        if (document.fullscreenElement === target) { // 已全屏
            target.classList.remove('protyle-wysiwyg--select'); // 移除已选择样式
        }
        else {
            target.classList.remove('protyle-wysiwyg--select'); // 添加已选择样式
        }
    }
    else if (target.classList.contains('protyle')) { // 文档块全屏
        if (document.fullscreenElement === target) { // 已全屏
            target.classList.add('fullscreen');
        }
        else {
            target.classList.remove('fullscreen');
        }
    }
    else if (target.tagName === 'IFRAME') { // iframe/widgets 全屏
    }
    else if (target.tagName === 'VIDEO') { // 视频全屏
    }
}

setTimeout(() => {
    try {
        if (config.theme.fullscreen.enable) {
            if (config.theme.fullscreen.iframe.enable) {
                // 全屏显示 iframe / widgets / video
                globalEventHandler.addEventHandler(
                    config.theme.hotkeys.fullscreen.iframe.type,
                    config.theme.hotkeys.fullscreen.iframe,
                    e => setTimeout(async () => fullscreenIframe(e.target), 0),
                );
            }
            if (config.theme.fullscreen.mark.enable) {
                // 双击块标全屏显示对应的块
                globalEventHandler.addEventHandler(
                    config.theme.hotkeys.fullscreen.mark.type,
                    config.theme.hotkeys.fullscreen.mark,
                    ondblclickBlockMark,
                );
            }

            /* 监听全屏切换事件 */
            globalEventHandler.addEventHandler(
                'fullscreenchange',
                null,
                onfullscreenchange,
            );
        }
    } catch (err) {
        console.error(err);
    }
}, 0);
