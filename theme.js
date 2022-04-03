function loadScript(url, type = 'module') {
    let script = document.createElement('script');
    script.setAttribute('type', type);
    script.setAttribute('src', url);
    document.head.appendChild(script);
}

function loadStyle(url, id) {
    let style = document.createElement('link');
    style.setAttribute('id', id);
    style.setAttribute('type', 'text/css');
    style.setAttribute('rel', 'stylesheet');
    style.setAttribute('href', url);
    document.head.appendChild(style);
}

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

const ID_COLOR_STYLE = 'colorStyle';
const ID_CUSTOM_STYLE = 'customStyle';

function loadTheme(
    colorStyleID,
    colorStyleHref,
    customStyleID,
    customStyleHref,
) {
    let style = document.getElementById(colorStyleID);
    if (style) {
        style.setAttribute('href', colorStyleHref);
    }
    else {
        loadStyle(colorStyleHref, colorStyleID);
    }

    style = document.getElementById(customStyleID);
    if (style) {
        style.setAttribute('href', customStyleHref);
    }
    else {
        loadStyle(customStyleHref, customStyleID);
    }
}

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
    loadTheme(ID_COLOR_STYLE, href_color, ID_CUSTOM_STYLE, href_custom);
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
