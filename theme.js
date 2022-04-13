/**
 * 加载脚本文件
 * @param {string} url 脚本地址
 * @param {string} type 脚本类型
 */
function loadScript(src, type = 'module', async = false, defer = false) {
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
function loadStyle(url, id = null) {
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
function updateStyle(id, href) {
    let style = document.getElementById(id);
    if (style) {
        style.setAttribute('href', href);
    }
    else {
        loadStyle(href, id);
    }
}

const ID_COLOR_STYLE = 'colorStyle';
const ID_CUSTOM_STYLE = 'customStyle';

/**
 * 获取主题模式
 * @returns {string} light 或 dark
 */
function themeMode() {
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
function clientMode() {
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
 * 更换主题模式
 * @param {string} lightStyle 浅色主题配置文件路径
 * @param {string} darkStyle 深色主题配置文件路径
 * @param {string} customLightStyle 浅色主题自定义配置文件路径
 * @param {string} customDarkStyle 深色主题自定义配置文件路径
 */
function changeThemeMode(
    lightStyle,
    darkStyle,
    customLightStyle,
    customDarkStyle,
) {
    let href_color = null;
    let href_custom = null;
    switch (themeMode()) {
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
    updateStyle(ID_COLOR_STYLE, href_color);
    updateStyle(ID_CUSTOM_STYLE, href_custom);
}

(() => {
    /* 根据当前主题模式加载样式配置文件 */
    changeThemeMode(
        `/appearance/themes/Dark+/style/color/light.css`,
        `/appearance/themes/Dark+/style/color/dark.css`,
        `/widgets/custom-light.css`,
        `/widgets/custom-dark.css`,
    );

    /* 加载 HTML 块中使用的小工具 */
    loadScript("/appearance/themes/Dark+/script/module/html.js", "text/javascript");
    
    /* 加载主题功能 */
    loadScript("/appearance/themes/Dark+/script/module/background.js");
    loadScript("/appearance/themes/Dark+/script/module/blockattrs.js");
    loadScript("/appearance/themes/Dark+/script/module/doc.js");
    loadScript("/appearance/themes/Dark+/script/module/goto.js");
    loadScript("/appearance/themes/Dark+/script/module/invert.js");
    loadScript("/appearance/themes/Dark+/script/module/reload.js");
    loadScript("/appearance/themes/Dark+/script/module/style.js");
    loadScript("/appearance/themes/Dark+/script/module/timestamp.js");
    loadScript("/appearance/themes/Dark+/script/module/typewriter.js");
    loadScript("/appearance/themes/Dark+/script/module/window.js", "text/javascript");
    
    /* 加载独立应用 */
    loadScript("/appearance/themes/Dark+/app/comment/index.js");

    /* 加载自定义配置文件 */
    loadScript("/widgets/custom.js");

    /* 加载测试模块 */
    // loadScript("/appearance/themes/Dark+/script/test/listener.js");
})();
