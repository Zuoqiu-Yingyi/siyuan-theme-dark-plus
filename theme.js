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
    elements: new Set(), // 需要移除的 HTML 元素集合
    eventTarget: new EventTarget(), // 事件总线目标
    addEventListener: function (target, ...args) {
        target.addEventListener(...args);
        this.eventTarget.addEventListener("destroy", () => {
            target.removeEventListener(...args);
        });
    }, // 添加在主题销毁时自动移除的监听器
    // REF https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent
    coords: { // 鼠标坐标
        screenX: undefined, // 鼠标指针相对于全局（屏幕）的 X 坐标
        screenY: undefined, // 鼠标指针相对于全局（屏幕）的 Y 坐标

        pageX: undefined, // 鼠标指针相对于整个文档的 X 坐标
        pageY: undefined, // 鼠标指针相对于整个文档的 Y 坐标

        offsetX: undefined, // 鼠标指针相对于目标节点内边位置的 X 坐标
        offsetY: undefined, // 鼠标指针相对于目标节点内边位置的 Y 坐标

        movementX: undefined, // 鼠标指针相对于最后 mousemove 事件位置的 X 坐标
        movementY: undefined, // 鼠标指针相对于最后 mousemove 事件位置的 Y 坐标
    },
};

// REF: https://github.com/siyuan-note/siyuan/issues/8178
window.destroyTheme = function () {
    window.theme?.elements.forEach(element => {
        element.remove();
    });
    window.theme?.eventTarget.dispatchEvent(new Event("destroy"));
    window[Symbol.for("Dark+destroy")] = true;
    delete window.theme;
    delete window.destroyTheme;
}

/**
 * 静态资源请求 URL 添加参数
 * @param {string} url 资源请求 URL
 * @returns {string} 返回添加参数后的 URL
 */
window.theme.addURLParam = function (
    url,
    param = {
        t: window[Symbol.for("Dark+destroy")]
            ? Date.now().toString()
            : undefined,
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
 * @param {object} attributes 属性键值对
 * @param {string} position 节点插入位置
 * @param {HTMLElementNode} element 节点插入锚点
 */
window.theme.loadMeta = function (attributes, position = "afterbegin", element = document.head) {
    const meta = document.createElement('meta');
    for (let [key, value] of Object.entries(attributes)) {
        meta.setAttribute(key, value);
    }
    // document.head.insertBefore(meta, document.head.firstChild);
    // [Element.insertAdjacentElement() - Web API 接口参考 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/insertAdjacentElement)
    element.insertAdjacentElement(position, meta);
    window.theme.elements.add(meta);
}

/**
 * 加载脚本文件
 * @param {string} url 脚本地址
 * @param {string} type 脚本类型
 * @param {boolean} async 是否异步加载 & 非阻塞运行
 * @param {boolean} defer 是否异步加载 & 阻塞运行
 * @param {string} position 节点插入位置
 * @param {HTMLElementNode} element 节点插入锚点
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
    window.theme.elements.add(script);
}

/**
 * 加载样式文件
 * @param {string} innerHTML 样式内容
 * @param {string} id 样式 ID
 * @param {string} position 节点插入位置
 * @param {HTMLElementNode} element 节点插入锚点
 */
window.theme.loadStyle = function (
    innerHTML,
    id = null,
    position = "afterend",
    element = window.theme.element.themeStyle,
) {
    const style = document.createElement('style');
    if (id) style.id = id;
    style.innerHTML = innerHTML;
    // document.head.appendChild(style);
    element.insertAdjacentElement(position, style);
    window.theme.elements.add(style);
}

/**
 * 加载样式文件引用
 * @param {string} href 样式地址
 * @param {string} id 样式 ID
 * @param {string} position 节点插入位置
 * @param {HTMLElementNode} element 节点插入锚点
 */
window.theme.loadLink = function (
    href,
    id = null,
    position = "afterend",
    element = window.theme.element.themeStyle,
) {
    const link = document.createElement('link');
    if (id) link.id = id;
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = href;
    // document.head.appendChild(link);
    element.insertAdjacentElement(position, link);
    window.theme.elements.add(link);
}

/**
 * 更新样式文件
 * @param {string} id 样式文件 ID
 * @param {string} href 样式文件地址
 */
window.theme.updateStyle = function (id, href) {
    const style = document.getElementById(id);
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
 * @returns {string} light 或 dark
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
 * @returns {string} landscape 或 portrait
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
 * @returns {string} 'app' 或 'desktop' 或 'mobile'
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
 * @returns {string} 'zh_CN', 'zh_CNT', 'fr_FR', 'en_US'
 */
window.theme.languageMode = window.siyuan.config.lang;

/**
 * 获取思源版本号
 * @returns {string} 思源版本号
 */
window.theme.kernelVersion = window.siyuan.config.system.kernelVersion;

/**
 * 获取操作系统
 */
window.theme.OS = window.siyuan.config.system.os;

/**
 * 获得主题根目录
 */
window.theme.root = (() => {
    const src = document.currentScript.getAttribute('src');
    return src.substring(0, src.lastIndexOf('/'));
})();

/**
 * 获取一个 Lute 对象
 * @returns {Lute} Lute 对象
 */
window.theme.lute = window.Lute.New();

/**
 * 设置原生主题模式
 * @param {number} mode: 主题模式
 * @param {boolean} modeOS: 是否启用系统主题
 */
window.theme.setNativeTheme = function (
    mode = window.siyuan.config.appearance.mode,
    modeOS = window.siyuan.config.appearance.modeOS,
) {
    try {
        const { nativeTheme } = require('@electron/remote');
        if (modeOS) {
            if (nativeTheme.themeSource !== 'system') {
                nativeTheme.themeSource = 'system';
            }
        } else {
            if ((mode === 0 && nativeTheme.themeSource !== 'light') ||
                (mode === 1 && nativeTheme.themeSource !== 'dark')
            ) {
                nativeTheme.themeSource = (mode === 0 ? 'light' : 'dark');
            }
        }
    } catch (error) {
        console.warn(error);
    }
}

/**
 * 更换主题模式
 * @param {string} lightStyle 浅色主题配置文件路径
 * @param {string} darkStyle 深色主题配置文件路径
 * @param {string} customLightStyle 浅色主题自定义配置文件路径
 * @param {string} customDarkStyle 深色主题自定义配置文件路径
 */
window.theme.changeThemeMode = function (
    customLightStyle,
    customDarkStyle,
) {
    let href_custom = null;
    switch (window.theme.themeMode) {
        case 'light':
            href_custom = customLightStyle;
            break;
        case 'dark':
        default:
            href_custom = customDarkStyle;
            break;
    }

    // 兼容思源 v2.7.2- 版本
    if (!document.documentElement.dataset.themeMode) {
        switch (window.theme.themeMode) {
            case 'light':
            default:
                document.documentElement.dataset.themeMode = 'light';
                break;
            case 'dark':
                document.documentElement.dataset.themeMode = 'dark';
                break;
        }
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

switch (window.theme.clientMode) {
    case "window":
        /* 调整窗口控件位置 */
        const toolbar__window = document.querySelector("body > .toolbar__window");
        const layouts = document.getElementById("layouts")?.parentElement;
        if (toolbar__window && layouts) {
            document.body.insertBefore(toolbar__window, layouts);
        }
    case "app":
        /* 设置 Electron 原生主题模式 */
        window.theme.setNativeTheme();
        break;
    default:
        break;
}

/* 加载 HTML 块中使用的小工具 */
import(window.theme.addURLParam(`${window.theme.root}/script/module/html.js`));

/* 加载主题功能 */
import(window.theme.addURLParam(`${window.theme.root}/script/module/background.js`));
import(window.theme.addURLParam(`${window.theme.root}/script/module/blockattrs.js`));
import(window.theme.addURLParam(`${window.theme.root}/script/module/doc.js`));
import(window.theme.addURLParam(`${window.theme.root}/script/module/dock.js`));
import(window.theme.addURLParam(`${window.theme.root}/script/module/fullscreen.js`));
import(window.theme.addURLParam(`${window.theme.root}/script/module/goto.js`));
import(window.theme.addURLParam(`${window.theme.root}/script/module/invert.js`));
import(window.theme.addURLParam(`${window.theme.root}/script/module/location.js`));
import(window.theme.addURLParam(`${window.theme.root}/script/module/menu.js`));
import(window.theme.addURLParam(`${window.theme.root}/script/module/readonly.js`));
import(window.theme.addURLParam(`${window.theme.root}/script/module/reload.js`));
import(window.theme.addURLParam(`${window.theme.root}/script/module/style.js`));
import(window.theme.addURLParam(`${window.theme.root}/script/module/timestamp.js`));
import(window.theme.addURLParam(`${window.theme.root}/script/module/typewriter.js`));
import(window.theme.addURLParam(`${window.theme.root}/script/module/wheel.js`));
import(window.theme.addURLParam(`${window.theme.root}/script/module/window.js`)); // @deprecated

/* 加载独立应用 */
import(window.theme.addURLParam(`${window.theme.root}/app/comment/index.js`));

/* 加载自定义配置文件 */
// import(window.theme.addURLParam("/widgets/custom.js"));

/* 加载测试模块 */
// import(window.theme.addURLParam(`${window.theme.root}/script/test/worker.js`));
// import(window.theme.addURLParam(`${window.theme.root}/script/test/listener.js`));
