/* 在 HTML 块中使用的小工具 */

/* 运行系统命令 */
window.theme.runcmd = function (commands) {
    try {
        if (window.confirm(commands) && require) {
            commands = `start powershell -c ${commands.replaceAll('\n', '; ')}pause`;
            require('child_process').exec(commands, null);
        }
    }
    catch (err) {
        console.warn(err);
    }
}

/**
 * HTML 块中的脚本获取当前 shadow-root 的 host
 * REF [思源笔记折腾记录 -html 块 - 链接卡片 - 链滴](https://ld246.com/article/1682099979843)
 * @params {HTMLElement} element: HTML 块中的 DOM 节点
 * @return {object}:
 *      {string} id: 当前 HTML 块 ID
 *      {HTMLElement} block: 当前 HTML 块
 *      {HTMLElement} shadowRoot: 当前 HTML 块 shadowRoot
 * @return {null} null 当前 HTML 块不存在
 */
window.theme.THIS = function (element) {
    try {
        if (element) {
            return null;
        }

        if (element.host) {
            element = element.host;
            if (element?.parentElement?.parentElement?.dataset.nodeId) {
                return {
                    id: element.parentElement.parentElement.dataset.nodeId,
                    block: element.parentElement.parentElement,
                    shadowRoot: element.shadowRoot,
                };
            }
        }

        return this(element.parentNode);
    } catch (e) {
        console.log(e);
        return null;
    }
}

/**
 * HTML 块中的脚本获取当前块
 * @params {string} customID 内部定义的 ID
 * @return {object}:
 *      {string} id: 当前 HTML 块 ID
 *      {HTMLElement} block: 当前 HTML 块
 *      {HTMLElement} shadowRoot: 当前 HTML 块 shadowRoot
 * @return {null}: 当前 HTML 块不存在
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
        case url.startsWith('stage/'): // 安装目录/resources/stage

        case url.startsWith('appearance/'): // 工作空间/conf/appearance
        case url.startsWith('export/'): // 工作空间/temp/export
        case url.startsWith('history/'): // 工作空间/history

        case url.startsWith('assets/'): // 工作空间/data/assets
        case url.startsWith('emojies/'): // 工作空间/data/emojies
        case url.startsWith('plugins/'): // 工作空间/data/plugins
        case url.startsWith('plugins/'): // 工作空间/data/plugins
        case url.startsWith('snippets/'): // 工作空间/data/snippets
        case url.startsWith('templates/'): // 工作空间/data/templates
        case url.startsWith('widgets/'): // 工作空间/data/widgets
            return new URL(`${window.location.origin}/${url}`);
        case url.startsWith('//'):
            return new URL(`${ssl ? 'https' : 'http'}:${url}`);
        case url.startsWith('/'):
            return new URL(`${window.location.origin}${url}`);
        case url.startsWith('file://'):
        case url.startsWith('http://'):
        case url.startsWith('https://'):
            return new URL(url);
        default:
            return new URL(`${ssl ? 'https' : 'http'}://${url}`);
    }
}

/**
 * 新窗口打开
 * @params {string} mode: 打开窗口模式('app', 'desktop', 'mobile')
 * @params {string} url: URL
 * @params {object} urlParams: URL 参数
 * @params {object} windowParams: 窗体参数
 * @params {object} menuTemplate: 窗口菜单栏模板
 * @params {string} pathname: URL 路径名
 * @params {string} hash: URL hash
 * @params {function} consoleMessageCallback: 子窗口控制台输出回调
 * @params {function} closeCallback: 关闭窗口时的回调函数
 * @params {array} windowEventHandlers: 一组窗口的事件处理器
 * @params {array} contentsEventHandlers: 一组内容的事件处理器
 * @return {BrowserWindow}: 窗口对象
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

        // 设置窗口位置
        if (window.theme.coords?.screenX && window.theme.coords?.screenY) {
            windowParams.x = window.theme.coords.screenX;
            windowParams.y = window.theme.coords.screenY;
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
                case 'editor':
                    windowParams = JSON.parse(JSON.stringify(windowParams));
                    windowParams.webPreferences.contextIsolation = true;
                    break;
                default:
                    windowParams = JSON.parse(JSON.stringify(windowParams));
                    windowParams.webPreferences.nodeIntegration = false;
                    windowParams.webPreferences.contextIsolation = true;
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

            switch (mode.toLowerCase()) {
                case 'app':
                case 'desktop':
                case 'mobile':
                case 'editor':
                    // require('@electron/remote/main').initialize();
                    require('@electron/remote').require('@electron/remote/main').enable(newWin.webContents);
                    break;
                default:
                    break;
            }

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
            // REF [Window.open() - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/open)
            // REF [Window open() 方法 | 菜鸟教程](https://www.runoob.com/jsref/met-win-open.html)
            newWin = window.open(
                url.href,
                url.href,
                `
                    popup = true,
                    width = ${windowParams.width},
                    height = ${windowParams.height},
                    left = ${windowParams.x},
                    top = ${windowParams.y},
                `,
            );
            return newWin;
        }
    }
    catch (err) {
        console.error(err);
        return null;
    }
}
