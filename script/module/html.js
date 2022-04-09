/* 在 HTML 块中使用的小工具 */

/* 运行系统命令 */
function runcmd(commands) {
    if (window.confirm(commands) && require) {
        commands = `start powershell -c ${commands.replaceAll('\n', '; ')}pause`;
        require('child_process').exec(commands, null);
    }
}

/**
 * HTML 块中的脚本获取当前块
 * @param {string} customID 内部定义的 ID
 * @returns {string} id 当前 HTML 块 ID
 * @returns {HTMLElement} block 当前 HTML 块
 * @returns {HTMLElement} shadowRoot 当前 HTML 块 shadowRoot
 * @returns {null} null 当前 HTML 块不存在
 */
function This(customID) {
    let protyle = document.querySelector(`protyle-html[data-content*="${customID}"]`);
    if (protyle) {
        let block = protyle.parentElement.parentElement;
        return {
            id: block.dataset.nodeId,
            block: block,
            shadowRoot: protyle.shadowRoot,
        };
    }
    else return null;
}
