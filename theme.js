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
    let style = document.getElementById('themeDefaultStyle');
    let url = new URL(style.getAttribute('href'));
    switch (true) {
        case window.matchMedia('(prefers-color-scheme: light)').matches:
            return 'light';
        case window.matchMedia('(prefers-color-scheme: dark)').matches:
            return 'dark';
        default:
            return null;
    }
}

const ID_CUSTOM_STYLE = 'customStyle';

function changeThemeMode(hrefLight, hrefDark) {
    let href = null;
    switch (themeMode()) {
        case 'light':
            href = hrefLight;
            break;
        case 'dark':
            href = hrefDark;
            break;
        default:
    }
    let style = document.getElementById(ID_CUSTOM_STYLE);
    if (style) {
        style.setAttribute('href', href);
    }
    else {
        loadStyle(href, ID_CUSTOM_STYLE);
    }
}

(() => {
    changeThemeMode(
        `/appearance/themes/Dark+/style/color/light.css`,
        `/appearance/themes/Dark+/style/color/dark.css`
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
