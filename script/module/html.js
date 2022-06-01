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
 * URL 格式化
 * @params {string} url: 要格式化的 URL
 * @reutrn {URL}: URL 对象
 */
window.theme.urlFormat = function (url, ssl = true) {
    switch (true) { // 格式化 URL
        case url.startsWith('assets/'):
        case url.startsWith('widgets/'):
        case url.startsWith('emojies/'):
        case url.startsWith('appearance/'):
        case url.startsWith('export/'):
            return new URL(`${window.location.origin}/${url}`);
        case url.startsWith('//'):
            return new URL(`${ssl ? 'https' : 'http'}:${url}`);
        case url.startsWith('/'):
            return new URL(`${window.location.origin}${url}`);
        case url.startsWith('http://'):
        case url.startsWith('https://'):
            return new URL(url);
        default:
            return new URL(`${ssl ? 'https' : 'http'}://${url}`);
    }
}

/**
 * 新窗口打开
 * @mode (string): 打开窗口模式('app', 'desktop', 'mobile')
 * @url (string): URL
 * @urlParams (object): URL 参数
 * @windowParams (object): 窗体参数
 * @menuTemplate (object): 窗口菜单栏模板
 * @pathname (string): URL 路径名
 * @hash (string): URL hash
 * @consoleMessageCallback (function): 子窗口控制台输出回调
 * @closeCallback (function): 关闭窗口时的回调函数
 * @windowEventHandlers (array): 一组窗口的事件处理器
 * @contentsEventHandlers (array): 一组内容的事件处理器
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
    menuTemplate = null,
    pathname = null,
    hash = null,
    consoleMessageCallback = null,
    closeCallback = null,
    windowEventHandlers = [],
    contentsEventHandlers = [],
) {
    try {
        // 优化思源内部 URL
        url = window.theme.urlFormat(url);

        // 设置窗口模式
        if (mode) {
            switch (mode.toLowerCase()) {
                case 'app':
                    return;
                case 'desktop':
                case 'mobile':
                    url.pathname = `/stage/build/${mode.toLowerCase()}/`;
                    break;
                case 'editor':
                    break;
                default:
                    break;
            }
        }
        if (pathname) url.pathname = pathname;
        if (hash) url.hash = hash;
        // 设置 URL 参数
        for (const param in urlParams) {
            url.searchParams.set(param, urlParams[param]);
        }
        // 打开新窗口
        try {
            const {
                BrowserWindow,
                Menu,
            } = require('@electron/remote');
            // 新建窗口(Electron 环境)
            var newWin = new BrowserWindow(windowParams);
            const menu = Menu.buildFromTemplate(menuTemplate);

            // console.log(menu);
            console.log(url.href);

            // if (url.protocol === 'file:') newWin.loadFile(url.href.substr(8));
            // else newWin.loadURL(url.href);
            newWin.setMenu(menu);
            newWin.loadURL(url.href);
            // REF [Event: 'console-message'​](https://www.electronjs.org/docs/latest/api/web-contents#event-console-message)
            newWin.webContents.on('console-message', (event, level, message, line, sourceId) => {
                if (level === 0) {
                    switch (message) { // 通用的命令
                        case 'WINDOW-SWITCH-PIN': // 切换窗口置顶状态
                            // REF [win.setAlwaysOnTop(flag[, level][, relativeLevel])​](https://www.electronjs.org/zh/docs/latest/api/browser-window#winsetalwaysontopflag-level-relativelevel)
                            newWin.setAlwaysOnTop(!newWin.isAlwaysOnTop());
                            break;
                        default:
                            break;
                    }
                }
                consoleMessageCallback && setTimeout(async () => consoleMessageCallback(newWin, event, level, message, line, sourceId));
            });
            if (mode) {
                switch (mode.toLowerCase()) {
                    case 'editor':
                    case 'desktop':
                        newWin.removeMenu(); // 移除窗口的菜单栏
                        break;
                    case 'app':
                    case 'mobile':
                    default:
                        break;
                }
            }
            for (const handler of windowEventHandlers) {
                newWin.on(handler.event, (...args) => handler.callback(newWin, ...args));
            }
            for (const handler of contentsEventHandlers) {
                newWin.webContents.on(handler.event, (...args) => handler.callback(newWin, ...args));
            }
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
