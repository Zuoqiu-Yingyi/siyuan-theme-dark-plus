/* 快捷键 */
export {
    isKey, // 按键事件是否由指定快捷键触发
    isEvent, // 事件是否由指定快捷键+操作触发
    isButton, // 鼠标事件是否由指定快捷键+按键触发
    printHotKey, // 打印快捷键
};

/* 不支持 WinCtrl + 非 CtrlCmd 组合键 */
function isKey(event, key) {
    return (event.key === key.key
        && event.altKey === key.Alt
        && event.shiftKey === key.Shift
        && (event.ctrlKey || event.metaKey) === key.CtrlCmd
        && (event.ctrlKey && event.metaKey) === key.WinCtrl
    )
}

function isEvent(event, key) {
    return (event.type === key.type
        && event.altKey === key.Alt
        && event.shiftKey === key.Shift
        && (event.ctrlKey || event.metaKey) === key.CtrlCmd
        && (event.ctrlKey && event.metaKey) === key.WinCtrl
    )
}

function isButton(event, key) {
    return (event.button === key.button
        && event.altKey === key.Alt
        && event.shiftKey === key.Shift
        && (event.ctrlKey || event.metaKey) === key.CtrlCmd
        && (event.ctrlKey && event.metaKey) === key.WinCtrl
    )
}

const MOUSE_BUTTON_MAP = {
    0: 'left-click',
    1: 'middle-click',
    2: 'right-click',
};

const KEY_MAP = {
    ArrowUp: '↑',
    ArrowDown: '↓',
    ArrowLeft: '←',
    ArrowRight: '→',
};

function printHotKey(key) {
    if (key.enable === false) return "";
    let ctrl = 'Ctrl';
    let shift = 'Shift';
    let alt = 'Alt';

    // REF https://developer.mozilla.org/en-US/docs/Web/API/Navigator/platform#examples
    if (navigator.platform.indexOf('Mac') !== -1
        || navigator.platform === 'iPhone'
        || navigator.platform === 'iPad'
        || navigator.platform === 'iPod'
    ) {
        ctrl = '⌘';
        shift = '⇧';
        alt = '⌥';
    }

    let hotkey = [];
    if (key.CtrlCmd) {
        hotkey.push(ctrl);
    }
    if (key.Shift) {
        hotkey.push(shift);
    }
    if (key.Alt) {
        hotkey.push(alt);
    }
    hotkey.push(KEY_MAP[key.key] || key.key || key.type || MOUSE_BUTTON_MAP[key.button]);
    return hotkey.join(' + ');
}
