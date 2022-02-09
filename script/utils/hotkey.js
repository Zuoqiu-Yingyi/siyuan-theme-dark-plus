/* 快捷键 */
export {
    isKey, // 按键事件是否由指定快捷键触发
}

function isKey(keydownEvent, key) {
    return (keydownEvent.key == key.key
        && (keydownEvent.ctrlKey == key.ctrlKey || keydownEvent.metaKey == key.metaKey)
        && keydownEvent.shiftKey == key.shiftKey
        && keydownEvent.altKey == key.altKey
    )
}
