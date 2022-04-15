/* 快捷键 */
export {
    isKey, // 按键事件是否由指定快捷键触发
    isEvent, // 事件是否由指定快捷键+操作触发
    isButton, // 鼠标事件是否由指定快捷键+按键触发
    printHotKey, // 打印快捷键
}

function isKey(event, key) {
    return (event.key == key.key
        && (event.ctrlKey == key.ctrlKey || event.metaKey == key.metaKey)
        && event.shiftKey == key.shiftKey
        && event.altKey == key.altKey
    )
}

function isEvent(event, key) {
    return (event.type == key.type
        && (event.ctrlKey == key.ctrlKey || event.metaKey == key.metaKey)
        && event.shiftKey == key.shiftKey
        && event.altKey == key.altKey
    )
}

function isButton(event, key) {
    return (event.button == key.button
        && (event.ctrlKey == key.ctrlKey || event.metaKey == key.metaKey)
        && event.shiftKey == key.shiftKey
        && event.altKey == key.altKey
    )
}

const MOUSE_BUTTON_MAP = {
    0: 'Left-click',
    1: 'middle-click',
    2: 'right-click',
};

function printHotKey(key) {
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
    if (key.ctrlKey) {
        hotkey.push(ctrl);
    }
    if (key.shiftKey) {
        hotkey.push(shift);
    }
    if (key.altKey) {
        hotkey.push(alt);
    }
    hotkey.push(key.key || key.type || MOUSE_BUTTON_MAP[key.button]);
    return hotkey.join(' + ');
}
