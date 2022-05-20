/* 事件 */

export {
    CTRL_CLICK_EVENT, // 左键单击事件
};

/* Ctrl + Click 事件 */
const CTRL_CLICK_EVENT = new MouseEvent('click', {
    bubbles: true, // 是否冒泡
    cancelable: true, // 是否可以取消
    button: 0, // 鼠标左键
    ctrlKey: true,
});
