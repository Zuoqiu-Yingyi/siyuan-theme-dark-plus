/* 快捷键 */
export {
    isKey, // 按键事件是否由指定快捷键触发
    isEvent, // 事件是否由指定快捷键+操作触发
    isButton, // 鼠标事件是否由指定快捷键+按键触发
}

function isKey(keydownEvent, key) {
    return (keydownEvent.key == key.key
        && (keydownEvent.ctrlKey == key.ctrlKey || keydownEvent.metaKey == key.metaKey)
        && keydownEvent.shiftKey == key.shiftKey
        && keydownEvent.altKey == key.altKey
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
