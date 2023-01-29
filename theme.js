window.theme = {
    element: {
        editorFontSize: document.getElementById('editorFontSize'),
        pdfjsScript: document.getElementById('pdfjsScript'),
        protyleWcHtmlScript: document.getElementById('protyleWcHtmlScript'),
        baseURL: document.getElementById('baseURL'),
        emojiScript: document.getElementById('emojiScript'),
        themeDefaultStyle: document.getElementById('themeDefaultStyle'),
        themeStyle: document.getElementById('themeStyle'),
        protyleHljsStyle: document.getElementById('protyleHljsStyle'),
        themeScript: document.getElementById('themeScript') ?? document.currentScript,
        iconDefaultScript: document.getElementById('iconDefaultScript'),
        iconScript: document.getElementById('iconScript'),
    },
};

/**
 * 静态资源请求 URL 添加参数
 * @params {string} url 资源请求 URL
 * @return {string} 返回添加参数后的 URL
 */
window.theme.addURLParam = function (
    url,
    param = {
        // t: Date.now().toString(),
        v: window.siyuan.config.appearance.themeVer,
    },
) {
    let new_url;
    switch (true) {
        case url.startsWith('//'):
            new_url = new URL(`https:${url}`);
            break;
        case url.startsWith('http://'):
        case url.startsWith('https://'):
            new_url = new URL(url);
            break;
        case url.startsWith('/'):
            new_url = new URL(url, window.location.origin);
            break;
        default:
            new_url = new URL(url, window.location.origin + window.location.pathname);
            break;
    }
    for (let [key, value] of Object.entries(param)) {
        new_url.searchParams.set(key, value);
    }
    switch (true) {
        case url.startsWith('//'):
            return new_url.href.substring(new_url.protocol.length);
        case url.startsWith('http://'):
        case url.startsWith('https://'):
            return new_url.href;
        case url.startsWith('/'):
            return new_url.href.substring(new_url.origin.length);
        default:
            return new_url.href.substring((window.location.origin + window.location.pathname).length);
    }
}

/**
 * 加载 meta 标签
 * @params {object} attributes 属性键值对
 * @params {string} position 节点插入位置
 * @params {HTMLElementNode} element 节点插入锚点
 */
window.theme.loadMeta = function (attributes, position = "afterbegin", element = document.head) {
    let meta = document.createElement('meta');
    for (let [key, value] of Object.entries(attributes)) {
        meta.setAttribute(key, value);
    }
    // document.head.insertBefore(meta, document.head.firstChild);
    // [Element.insertAdjacentElement() - Web API 接口参考 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/insertAdjacentElement)
    element.insertAdjacentElement(position, meta);
}

/**
 * 加载脚本文件
 * @params {string} url 脚本地址
 * @params {string} type 脚本类型
 * @params {boolean} async 是否异步加载 & 非阻塞运行
 * @params {boolean} defer 是否异步加载 & 阻塞运行
 * @params {string} position 节点插入位置
 * @params {HTMLElementNode} element 节点插入锚点
 */
window.theme.loadScript = function (
    src,
    type = 'module',
    async = false,
    defer = false,
    position = "beforebegin",
    element = window.theme.element.themeScript,
) {
    const script = document.createElement('script');
    if (type) script.type = type;
    if (async) script.async = true;
    if (defer) script.defer = true;
    script.src = src;
    // document.head.appendChild(script);
    element.insertAdjacentElement(position, script);
}

/**
 * 加载样式文件
 * @params {string} innerHTML 样式内容
 * @params {string} id 样式 ID
 * @params {string} position 节点插入位置
 * @params {HTMLElementNode} element 节点插入锚点
 */
window.theme.loadStyle = function (
    innerHTML,
    id = null,
    position = "afterend",
    element = window.theme.element.themeStyle,
) {
    let style = document.createElement('style');
    if (id) style.id = id;
    style.innerHTML = innerHTML;
    // document.head.appendChild(style);
    element.insertAdjacentElement(position, style);
}

/**
 * 加载样式文件引用
 * @params {string} href 样式地址
 * @params {string} id 样式 ID
 * @params {string} position 节点插入位置
 * @params {HTMLElementNode} element 节点插入锚点
 */
window.theme.loadLink = function (
    href,
    id = null,
    position = "afterend",
    element = window.theme.element.themeStyle,
) {
    let link = document.createElement('link');
    if (id) link.id = id;
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = href;
    // document.head.appendChild(link);
    element.insertAdjacentElement(position, link);
}

/**
 * 更新样式文件
 * @params {string} id 样式文件 ID
 * @params {string} href 样式文件地址
 */
window.theme.updateStyle = function (id, href) {
    let style = document.getElementById(id);
    if (style) {
        style.setAttribute('href', href);
    }
    else {
        window.theme.loadLink(href, id);
    }
}

window.theme.ID_COLOR_STYLE = 'theme-color-style';
window.theme.ID_CUSTOM_STYLE = 'custom-color-style';

/**
 * 获取主题模式
 * @return {string} light 或 dark
 */
window.theme.themeMode = (() => {
    /* 根据浏览器主题判断颜色模式 */
    // switch (true) {
    //     case window.matchMedia('(prefers-color-scheme: light)').matches:
    //         return 'light';
    //     case window.matchMedia('(prefers-color-scheme: dark)').matches:
    //         return 'dark';
    //     default:
    //         return null;
    // }
    /* 根据配置选项判断主题 */
    switch (window.siyuan.config.appearance.mode) {
        case 0:
            return 'light';
        case 1:
            return 'dark';
        default:
            return null;
    }
})();

/**
 * 获取窗口宽高模式
 * @return {string} landscape 或 portrait
 */
window.theme.orientation = () => {
    /* 根据浏览器主题判断颜色模式 */
    switch (true) {
        case window.matchMedia('(orientation: landscape)').matches:
            /* 宽 > 高 */
            return 'landscape';
        case window.matchMedia('(orientation: portrait)').matches:
            /* 高 > 宽 */
            return 'portrait';
        default:
            return null;
    }
};

/**
 * 获取客户端模式
 * @return {string} 'app' 或 'desktop' 或 'mobile'
 */
window.theme.clientMode = (() => {
    const url = new URL(window.location.href);
    switch (true) {
        case url.pathname.startsWith('/stage/build/app/window.html'):
            return 'window';
        case url.pathname.startsWith('/stage/build/app'):
            return 'app';
        case url.pathname.startsWith('/stage/build/desktop'):
            return 'desktop';
        case url.pathname.startsWith('/stage/build/mobile'):
            return 'mobile';
        default:
            return null;
    }
})();

/**
 * 获取语言模式
 * @return {string} 'zh_CN', 'zh_CNT', 'fr_FR', 'en_US'
 */
window.theme.languageMode = window.siyuan.config.lang;

/**
 * 获取思源版本号
 * @return {string} 思源版本号
 */
window.theme.kernelVersion = window.siyuan.config.system.kernelVersion;

/**
 * 获取操作系统
 */
window.theme.OS = window.siyuan.config.system.os;

/**
 * 获取一个 Lute 对象
 * @return {Lute} Lute 对象
 */
window.theme.lute = window.Lute.New();

/**
 * 更换主题模式
 * @params {string} lightStyle 浅色主题配置文件路径
 * @params {string} darkStyle 深色主题配置文件路径
 * @params {string} customLightStyle 浅色主题自定义配置文件路径
 * @params {string} customDarkStyle 深色主题自定义配置文件路径
 */
window.theme.changeThemeMode = function (
    customLightStyle,
    customDarkStyle,
) {
    let href_custom = null;
    switch (window.theme.themeMode) {
        case 'light':
            document.documentElement.dataset.colorScheme = 'light';
            href_custom = customLightStyle;
            break;
        case 'dark':
        default:
            document.documentElement.dataset.colorScheme = 'dark';
            href_custom = customDarkStyle;
            break;
    }
    window.theme.updateStyle(window.theme.ID_CUSTOM_STYLE, href_custom);
}

/* 禁用缓存(无效) */
// window.theme.loadMeta({
//     "http-equiv": "Pragma",
//     "content": "no-cache",
// });
// window.theme.loadMeta({
//     "http-equiv": "Cache-Control",
//     "content": "no-cache, no-store, must-revalidate",
// });
// window.theme.loadMeta({
//     "http-equiv": "Expires",
//     "content": "0",
// });

/* 根据当前主题模式加载样式配置文件 */
if (window.siyuan.config.appearance[window.siyuan.config.appearance.mode ? "themeDark" : "themeLight"] === "Dark+") {
    window.theme.changeThemeMode(
        `/widgets/custom-light.css`,
        `/widgets/custom-dark.css`,
    );
}

/* 调整窗口控件位置 */
if (window.theme.clientMode === "window") {
    const toolbar__window = document.querySelector("body > .toolbar__window");
    const layouts = document.getElementById("layouts")?.parentElement;
    if (toolbar__window && layouts) {
        document.body.insertBefore(toolbar__window, layouts);
    }
}

/* 加载 HTML 块中使用的小工具 */
window.theme.loadScript(window.theme.addURLParam("/appearance/themes/Dark+/script/module/html.js"), undefined, true);

/* 加载主题功能 */
window.theme.loadScript(window.theme.addURLParam("/appearance/themes/Dark+/script/module/background.js"), undefined, true);
window.theme.loadScript(window.theme.addURLParam("/appearance/themes/Dark+/script/module/blockattrs.js"), undefined, true);
window.theme.loadScript(window.theme.addURLParam("/appearance/themes/Dark+/script/module/doc.js"), undefined, true);
window.theme.loadScript(window.theme.addURLParam("/appearance/themes/Dark+/script/module/dock.js"), undefined, true);
window.theme.loadScript(window.theme.addURLParam("/appearance/themes/Dark+/script/module/fullscreen.js"), undefined, true);
window.theme.loadScript(window.theme.addURLParam("/appearance/themes/Dark+/script/module/goto.js"), undefined, true);
window.theme.loadScript(window.theme.addURLParam("/appearance/themes/Dark+/script/module/invert.js"), undefined, true);
window.theme.loadScript(window.theme.addURLParam("/appearance/themes/Dark+/script/module/location.js"), undefined, true);
window.theme.loadScript(window.theme.addURLParam("/appearance/themes/Dark+/script/module/menu.js"), undefined, true);
window.theme.loadScript(window.theme.addURLParam("/appearance/themes/Dark+/script/module/readonly.js"), undefined, true);
window.theme.loadScript(window.theme.addURLParam("/appearance/themes/Dark+/script/module/reload.js"), undefined, true);
window.theme.loadScript(window.theme.addURLParam("/appearance/themes/Dark+/script/module/style.js"), undefined, true);
window.theme.loadScript(window.theme.addURLParam("/appearance/themes/Dark+/script/module/timestamp.js"), undefined, true);
window.theme.loadScript(window.theme.addURLParam("/appearance/themes/Dark+/script/module/typewriter.js"), undefined, true);
window.theme.loadScript(window.theme.addURLParam("/appearance/themes/Dark+/script/module/wheel.js"), undefined, true);
window.theme.loadScript(window.theme.addURLParam("/appearance/themes/Dark+/script/module/window.js"), undefined, true);

/* 加载独立应用 */
window.theme.loadScript(window.theme.addURLParam("/appearance/themes/Dark+/app/comment/index.js"), undefined, true);

/* 加载自定义配置文件 */
// window.theme.loadScript(window.theme.addURLParam("/widgets/custom.js"));

/* 加载测试模块 */
// window.theme.loadScript(window.theme.addURLParam("/appearance/themes/Dark+/script/test/worker.js"), undefined, true);
// window.theme.loadScript(window.theme.addURLParam("/appearance/themes/Dark+/script/test/listener.js"), undefined, true);
