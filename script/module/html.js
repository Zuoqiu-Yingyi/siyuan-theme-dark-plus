/* 在 HTML 块中使用的小工具 */

/* 运行系统命令 */
window.theme.runcmd = function (commands) {
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
window.theme.This = function (customID) {
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

/**
 * 新窗口打开
 * @mode (string): 打开窗口模式('app', 'desktop', 'mobile')
 * @url (string): URL
 * @urlParams (object): URL 参数
 * @windowParams (object): 窗体参数
 * @closeCallback (function): 关闭窗口时的回调函数
 * @return (BrowserWindow): 窗口对象
 */
window.theme.openNewWindow = function (
    mode = 'mobile',
    url = window.location.href,
    urlParams = {},
    windowParams = {
        width: 720,
        height: 480,
        frame: true, // 是否显示边缘框
        fullscreen: false // 是否全屏显示
    },
    closeCallback = null,
) {
    try {
        url = new URL(url);
    }
    catch (e) {
        return null;
    }

    // 设置窗口模式
    if (mode) {
        switch (mode.toLowerCase()) {
            case 'app':
                return;
            case 'desktop':
            case 'mobile':
                url.pathname = `/stage/build/${mode.toLowerCase()}/`;
                break;
            default:
                break;
        }
    }

    // 设置 URL 参数
    for (let param of Object.keys(urlParams)) {
        url.searchParams.set(param, urlParams[param]);
    }
    try {
        const { BrowserWindow } = require('@electron/remote');
        // 新建窗口(Electron 环境)
        newWin = new BrowserWindow(windowParams)

        newWin.loadURL(url.href);
        newWin.on('close', () => {
            newWin = null;
            closeCallback && closeCallback();
        })
        return newWin;
    }
    catch (e) {
        // 新建标签页(Web 环境)
        window.open(url.href, "_blank");
        return;
    }
}
