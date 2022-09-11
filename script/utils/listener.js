/* 事件监听处理工具 */

export {
    EventHandler,
    globalEventHandler,
}

import {
    isKey,
    isEvent,
    isButton,
} from './hotkey.js';

class EventHandler {
    /**
     * @params {boolean} multiple: 是否允许一个事件由多个处理者处理
     * @params {boolean} propagate: 是否继续传播
     * @params {boolean} capture: 是否在捕获阶段触发
     * @params {HTMLNode} Node: 监听的节点
     */
    constructor(multiple = true, propagate = true, capture = true, node = window) {
        this.multiple = multiple;
        this.propagate = propagate;
        this.capture = capture;
        this.node = node;
        this.listeners = {
            click: {
                is: isEvent,
                handlers: [
                    // {
                    //     e: hotkeys,
                    //     callback: callback,
                    // }
                ],
            },
            dblclick: {
                is: isEvent,
                handlers: [],
            },
            mouseup: {
                is: isButton,
                handlers: [],
            },
            mousedown: {
                is: isButton,
                handlers: [],
            },
            mousewheel: {
                is: isEvent,
                handlers: [],
            },
            keyup: {
                is: isKey,
                handlers: [],
            },
            keydown: {
                is: isEvent,
                handlers: [],
            },
        };

        for (const listener in this.listeners) {
            // 在指定元素中为每个事件注册一个监听器
            this.node.addEventListener(listener, (e) => {
                // console.log(listener, e);
                for (const handler of this.listeners[listener].handlers) {
                    // 如果事件符合监听器的条件，则执行回调函数
                    // console.log(listener, e);
                    if (handler.e === null || this.listeners[listener].is(e, handler.e)) {
                        if (!this.propagate) e.stopPropagation();
                        handler.callback(e);
                        if (!this.multiple) break;
                    }
                }
            }, this.capture);
        }
    }

    addEventHandler(type, e, callback) {
        const listener = this.listeners[type];
        if (listener && (e === null || e.enable !== false)) {
            listener.handlers.push({
                e: e,
                callback: callback,
            });
        }
    }
}

const globalEventHandler = new EventHandler();
