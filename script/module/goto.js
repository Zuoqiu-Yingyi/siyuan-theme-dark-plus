/** 使用形如 id=<块 ID> 的 URL 参数跳转到指定的块
 *  REF [leolee9086](https://github.com/leolee9086)
 */

import { config } from '/appearance/themes/Dark+/script/module/config.js';
import { goto } from '/appearance/themes/Dark+/script/utils/misc.js';

function jumpToID() {
    let url = new URL(window.location.href);
    let id = url.searchParams.get('id');

    if (config.theme.regs.id.test(id)) {
        goto(id)
    }
}

(() => {
    try {
        if (config.theme.goto.enable) {
            window.onload = setTimeout(jumpToID, 0)
        }
    } catch (err) {
        console.error(err);
    }
})();
