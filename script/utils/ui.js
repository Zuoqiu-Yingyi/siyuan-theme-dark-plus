/* 图形界面工具 */

/**
 * 消息提示 toast 
 * REF: [siyuan-note/utils.js at main · langzhou/siyuan-note · GitHub](https://github.com/langzhou/siyuan-note/blob/871bfa400e1c3d0b7f44ea98886713e368ba3892/siyuan-comment/comment/utils.js#L96)
 * @param text 提示文案
 * @param type 样式，取值：info / success / danger / warning
 **/
export function snackbar(text, type = 'info') {
    let snackbar = document.querySelector('#snackbar');
    if (!snackbar) {
        snackbar = document.createElement('div');
        snackbar.id = 'snackbar';
        document.body.appendChild(snackbar);
    }
    snackbar.classList.add('show', type);
    snackbar.innerText = text;
    setTimeout(function () { snackbar.classList.remove("show", type); }, 3000);
}
