/* 块属性操作 */

import { config } from './config.js';
import { setBlockAttrs } from './../utils/api.js';
import { isButton } from './../utils/hotkey.js';
import {
    url2id,
} from './../utils/misc.js';
import {
    HTMLDecode,
} from './../utils/string.js';

async function setter(target) {
    if (
        target.nodeName == 'SPAN'
        && target.dataset.type == 'a'
        && config.theme.regs.url.test(target.dataset.href)
    ) {
        let id = url2id(target.dataset.href);
        let attrs = eval(`(${HTMLDecode(target.dataset.title)})`);
        // console.log(attrs);
        await setBlockAttrs(
            id,
            attrs,
        );
    }
}

setTimeout(() => {
    try {
        if (config.theme.blockattrs.enable) {
            if (config.theme.blockattrs.set.enable) {
                // 设置块属性
                window.addEventListener('mousedown', (e) => {
                    // console.log(e);
                    if (isButton(e, config.theme.hotkeys.blockattrs.set)) {
                        // console.log(e);
                        setTimeout(() => {
                            setter(e.target);
                        }, 0);
                    }
                }, true);
            }
        }
    } catch (err) {
        console.error(err);
    }
}, 0);
