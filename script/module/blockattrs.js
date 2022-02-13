/* 块属性操作 */
import { config } from '/appearance/themes/Dark+/script/module/config.js';
import { setBlockAttrs } from '/appearance/themes/Dark+/script/utils/api.js';
import { isButton } from '/appearance/themes/Dark+/script/utils/hotkey.js';

async function setter(target) {
    if (
        target.nodeName == 'SPAN'
        && target.dataset.type == 'a'
        && config.regs.url.test(target.dataset.href)
    ) {
        let id = target.dataset.href.substr(16);
        let attrs = JSON.parse(target.dataset.title.replaceAll('&quot;', '"'));
        // console.log(id, attrs);
        await setBlockAttrs(
            id,
            attrs,
        );
    }
}

(() => {
    try {
        if (config.blockattrs.enable) {
            let body = document.querySelector('body');

            // 预览窗口显示指定视频的时间戳
            body.addEventListener('mousedown', (e) => {
                // console.log(e);
                if (isButton(e, config.hotkeys.blockattrs.set)) {
                    // console.log(e);
                    setTimeout(() => {
                        setter(e.target);
                    }, 0);
                }
            }, true);
        }
    } catch (err) {
        console.error(err);
    }
})();
