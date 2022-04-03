/**
 * 加载脚本文件
 * @param {string} url 脚本地址
 * @param {string} type 脚本类型
 */
function loadScript(url, type = 'module') {
    let script = document.createElement('script');
    script.setAttribute('type', type);
    script.setAttribute('src', url);
    document.head.appendChild(script);
}

/**
 * 加载样式文件
 * @param {string} url 样式地址
 * @param {string} id 样式 ID
 */
function loadStyle(url, id) {
    let style = document.createElement('link');
    style.setAttribute('id', id);
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
    switch (true) {
        case window.matchMedia('(prefers-color-scheme: light)').matches:
            return 'light';
        case window.matchMedia('(prefers-color-scheme: dark)').matches:
            return 'dark';
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
    changeThemeMode(
        `/appearance/themes/Dark+/style/color/light.css`,
        `/appearance/themes/Dark+/style/color/dark.css`,
        `/widgets/custom-light.css`,
        `/widgets/custom-dark.css`,
    );

    loadScript("/widgets/custom.js");

    loadScript("/appearance/themes/Dark+/script/module/blockattrs.js");
    loadScript("/appearance/themes/Dark+/script/module/doc.js");
    loadScript("/appearance/themes/Dark+/script/module/goto.js");
    loadScript("/appearance/themes/Dark+/script/module/invert.js");
    loadScript("/appearance/themes/Dark+/script/module/reload.js");
    loadScript("/appearance/themes/Dark+/script/module/style.js");
    loadScript("/appearance/themes/Dark+/script/module/timestamp.js");
    loadScript("/appearance/themes/Dark+/script/module/typewriter.js");

    loadScript("/appearance/themes/Dark+/app/comment/index.js");
    // loadScript("/appearance/themes/Dark+/script/test/listener.js");
})();
