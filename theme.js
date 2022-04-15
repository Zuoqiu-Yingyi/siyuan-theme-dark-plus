window.theme = {};

/**
 * 加载脚本文件
 * @param {string} url 脚本地址
 * @param {string} type 脚本类型
 */
window.theme.loadScript = function (src, type = 'module', async = false, defer = false) {
    let script = document.createElement('script');
    if (type) script.setAttribute('type', type);
    if (async) script.setAttribute('async', true);
    if (defer) script.setAttribute('defer', true);
    script.setAttribute('src', src);
    document.head.appendChild(script);
}

/**
 * 加载样式文件
 * @param {string} url 样式地址
 * @param {string} id 样式 ID
 */
window.theme.loadStyle = function (url, id = null) {
    let style = document.createElement('link');
    if (id) style.setAttribute('id', id);
    style.setAttribute('type', 'text/css');
    style.setAttribute('rel', 'stylesheet');
    style.setAttribute('href', url);
    document.head.appendChild(style);
}

/**
 * 更新样式文件
 * @param {string} id 样式文件 ID
 * @param {string} href 样式文件地址
 */
window.theme.updateStyle = function (id, href) {
    let style = document.getElementById(id);
    if (style) {
        style.setAttribute('href', href);
    }
    else {
        window.theme.loadStyle(href, id);
    }
}

window.theme.ID_COLOR_STYLE = 'colorStyle';
window.theme.ID_CUSTOM_STYLE = 'customStyle';

/**
 * 获取主题模式
 * @returns {string} light 或 dark
 */
window.theme.themeMode = function () {
    /* 根据浏览器主题判断颜色模式 */
    // switch (true) {
    //     case window.matchMedia('(prefers-color-scheme: light)').matches:
    //         return 'light';
    //     case window.matchMedia('(prefers-color-scheme: dark)').matches:
    //         return 'dark';
    //     default:
    //         return null;
    // }

    /* 根据思源加载的配色文件判断颜色模式 */
    let style = document.getElementById('themeDefaultStyle');
    let url = new URL(style.getAttribute('href'));
    switch (url.pathname) {
        case '/appearance/themes/daylight/theme.css':
            return 'light';
        case '/appearance/themes/midnight/theme.css':
            return 'dark';
        default:
            return null;
    }
}

/**
 * 获取客户端模式
 * @returns {string} 'app' 或 'desktop' 或 'mobile'
 */
window.theme.clientMode = function () {
    let url = new URL(window.location.href);
    switch (true) {
        case url.pathname.startsWith('/stage/build/app'):
            return 'app';
        case url.pathname.startsWith('/stage/build/desktop'):
            return 'desktop';
        case url.pathname.startsWith('/stage/build/mobile'):
            return 'mobile';
        default:
            return null;
    }
}

/**
 * 获取语言模式
 * @returns {string} 'zh_CN', 'zh_CNT', 'fr_FR', 'en_US'
 */
window.theme.languageMode = function () {
    switch (window.siyuan.languages.config) {
        case '设置':
            return 'zh_CN';
        case '設置':
            return 'zh_CNT';
        case 'Paramètres':
            return 'fr_FR';
        case 'Settings':
            return 'en_US';
        default:
            return null;
    }
}

/**
 * 获取操作系统
 * @returns {string} 'zh_CN', 'zh_CNT', 'fr_FR', 'en_US'
 */
window.theme.OS = function () {
    var sUserAgent = navigator.userAgent;
    var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
    var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
    if (isMac) return "MacOS";
    var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
    if (isUnix) return "Unix";
    var isLinux = (String(navigator.platform).indexOf("Linux") > -1);
    if (isLinux) return "Linux";
    if (isWin) {
        var isWin2K = sUserAgent.indexOf("Windows NT 5.0") > -1 || sUserAgent.indexOf("Windows 2000") > -1;
        if (isWin2K) return "Windows2000";
        var isWinXP = sUserAgent.indexOf("Windows NT 5.1") > -1 || sUserAgent.indexOf("Windows XP") > -1;
        if (isWinXP) return "WindowsXP";
        var isWin2003 = sUserAgent.indexOf("Windows NT 5.2") > -1 || sUserAgent.indexOf("Windows 2003") > -1;
        if (isWin2003) return "Windows2003";
        var isWinVista = sUserAgent.indexOf("Windows NT 6.0") > -1 || sUserAgent.indexOf("Windows Vista") > -1;
        if (isWinVista) return "Windows Vista";
        var isWin7 = sUserAgent.indexOf("Windows NT 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1;
        if (isWin7) return "Windows7";
    }
    return "other";
}

/**
 * 更换主题模式
 * @param {string} lightStyle 浅色主题配置文件路径
 * @param {string} darkStyle 深色主题配置文件路径
 * @param {string} customLightStyle 浅色主题自定义配置文件路径
 * @param {string} customDarkStyle 深色主题自定义配置文件路径
 */
window.theme.changeThemeMode = function (
    lightStyle,
    darkStyle,
    customLightStyle,
    customDarkStyle,
) {
    let href_color = null;
    let href_custom = null;
    switch (window.theme.themeMode()) {
        case 'light':
            href_color = lightStyle;
            href_custom = customLightStyle;
            break;
        case 'dark':
        default:
            href_color = darkStyle;
            href_custom = customDarkStyle;
            break;
    }
    window.theme.updateStyle(window.theme.ID_COLOR_STYLE, href_color);
    window.theme.updateStyle(window.theme.ID_CUSTOM_STYLE, href_custom);
}

/* 根据当前主题模式加载样式配置文件 */
window.theme.changeThemeMode(
    `/appearance/themes/Dark+/style/color/light.css`,
    `/appearance/themes/Dark+/style/color/dark.css`,
    `/widgets/custom-light.css`,
    `/widgets/custom-dark.css`,
);

/* 加载 HTML 块中使用的小工具 */
window.theme.loadScript("/appearance/themes/Dark+/script/module/html.js", "text/javascript");

/* 加载主题功能 */
window.theme.loadScript("/appearance/themes/Dark+/script/module/background.js");
window.theme.loadScript("/appearance/themes/Dark+/script/module/blockattrs.js");
window.theme.loadScript("/appearance/themes/Dark+/script/module/doc.js");
window.theme.loadScript("/appearance/themes/Dark+/script/module/goto.js");
window.theme.loadScript("/appearance/themes/Dark+/script/module/invert.js");
window.theme.loadScript("/appearance/themes/Dark+/script/module/reload.js");
window.theme.loadScript("/appearance/themes/Dark+/script/module/style.js");
window.theme.loadScript("/appearance/themes/Dark+/script/module/timestamp.js");
window.theme.loadScript("/appearance/themes/Dark+/script/module/typewriter.js");
window.theme.loadScript("/appearance/themes/Dark+/script/module/window.js");

/* 加载独立应用 */
window.theme.loadScript("/appearance/themes/Dark+/app/comment/index.js");

/* 加载自定义配置文件 */
window.theme.loadScript("/widgets/custom.js");

/* 加载测试模块 */
// window.theme.loadScript("/appearance/themes/Dark+/script/test/listener.js");
