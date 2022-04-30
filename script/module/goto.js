/** 使用形如 id=<块 ID> 的 URL 参数跳转到指定的块
 *  REF [leolee9086](https://github.com/leolee9086)
 */

import { config } from './config.js';
import { goto } from './../utils/misc.js';

async function jump(...args) {
    try {
        // console.log('goto');
        await goto(...args);
    } catch (e) {
        if (e.message === args[0]) {
            setTimeout(() => jump(...args), config.theme.goto.delay);
        }
        else throw e;
    }
}

function jumpToID() {
    let url = new URL(window.location.href);
    let id = url.searchParams.get('id');
    let focus = url.searchParams.get('focus');
    let editable = url.searchParams.get('editable');

    if (config.theme.regs.id.test(id)) {
        // console.log(id);
        setTimeout(() => jump(id, focus, editable), 0);
    }
}

setTimeout(() => {
    try {
        if (config.theme.goto.enable) {
            setTimeout(jumpToID, 0);
        }
    } catch (err) {
        console.error(err);
    }
}, 0);
