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
 * @pathname (string): URL 路径名
 * @hash (string): URL hash
 * @consoleMessageCallback (function): 子窗口控制台输出回调
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
        fullscreen: false, // 是否全屏显示
    },
    pathname = null,
    hash = null,
    consoleMessageCallback = null,
    closeCallback = null,
) {
    try {
        url = new URL(url);
        // 设置窗口模式
        if (mode) {
            switch (mode.toLowerCase()) {
                case 'app':
                    return;
                case 'desktop':
                case 'mobile':
                    url.pathname = `/stage/build/${mode.toLowerCase()}/`;
                    break;
                case 'localfile':
                    url.pathname = `/${url.pathname}/conf/${pathname}index.html`.replaceAll('//', '/');
                    // url.protocol = 'file:';
                    pathname = null;
                    break;
                default:
                    break;
            }
        }
        if (pathname) url.pathname = pathname;
        if (hash) url.hash = hash;
        // 设置 URL 参数
        for (let param of Object.keys(urlParams)) {
            url.searchParams.set(param, urlParams[param]);
        }
        // 打开新窗口
        try {
            const { BrowserWindow } = require('@electron/remote');
            // 新建窗口(Electron 环境)
            newWin = new BrowserWindow(windowParams)

            console.log(url.href);
            // if (url.protocol === 'file:') newWin.loadFile(url.href.substr(8));
            // else newWin.loadURL(url.href);
            newWin.loadURL(url.href);
            // REF [Event: 'console-message'​](https://www.electronjs.org/docs/latest/api/web-contents#event-console-message)
            newWin.webContents.on('console-message', (event, level, message, line, sourceId) => {
                consoleMessageCallback && setTimeout(async () => consoleMessageCallback(newWin, event, level, message, line, sourceId));
            });
            newWin.on('closed', () => {
                closeCallback && setTimeout(async () => closeCallback(newWin), 0);
                newWin = null;
            })
            return newWin;
        }
        catch (err) {
            console.warn(err);
            // 新建标签页(Web 环境)
            // window.open(url.href, "_blank");
            window.open(url.href, "popup");
            return null;
        }
    }
    catch (err) {
        console.error(err);
        return null;
    }

}
