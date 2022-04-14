/** 使用形如 id=<块 ID> 的 URL 参数跳转到指定的块
 *  REF [leolee9086](https://github.com/leolee9086)
 */

import { config } from './config.js';
import { goto } from './../utils/misc.js';

function jumpToID() {
    let url = new URL(window.location.href);
    let id = url.searchParams.get('id');
    let focus = url.searchParams.get('focus');

    if (config.theme.regs.id.test(id)) {
        // console.log(id);
        try {
            goto(id, focus);
        } catch (e) {
            if (e.message === id) {
                setTimeout(jumpToID, 500);
            }
            else throw e;
        }
    }
}

setTimeout(() => {
    try {
        if (config.theme.goto.enable) {
            window.onload = setTimeout(jumpToID, 0);
        }
    } catch (err) {
        console.error(err);
    }
}, 0);
