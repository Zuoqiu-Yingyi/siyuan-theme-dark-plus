/* 渲染自定义样式 */

import { config } from './config.js';
import { isKey } from './../utils/hotkey.js';
import { styleHandle } from './../utils/misc.js';
import { globalEventHandler } from './../utils/listener.js';
import {
    toolbarItemInit,
    toolbarItemChangeStatu,
} from './../utils/ui.js';

/* 渲染自定义样式 */
function renderCustomStyle(styles) {
    try {
        const EDITOR = window.siyuan.layout
            ? window.siyuan.layout.centerLayout.element
            : window.siyuan.mobileEditor.protyle.element;
        for (let i in styles) {
            let style = styles[i];
            EDITOR.querySelectorAll(`div[data-node-id][custom-${style}]`).forEach((item, i, obj) => {
                let attr = item.getAttribute(`custom-${style}`);
                item.querySelectorAll(`div[contenteditable][spellcheck]`).forEach((item, i, obj) => {
                    item.style[style] = attr;
                });
            });
        }
    }
    catch (err) {
        console.error(err);
        window.alert(`渲染自定义样式错误!\nRendering custom styles error\n${err}`);
    }
}

// 保存自定义样式
function saveCustomStyle() {
    try {
        const EDITOR = window.siyuan.layout
            ? window.siyuan.layout.centerLayout.element
            : window.siyuan.mobileEditor.protyle.element;
        EDITOR.querySelectorAll(`div[data-node-id][${config.theme.style.attribute}]`).forEach((item, i, obj) => {
            // item.style.cssText = item.getAttribute(config.theme.style.attribute);
            let id = item.dataset.nodeId;
            let attr = item.getAttribute(config.theme.style.attribute);
            let request_body = {
                id: id,
                attrs: {
                    style: attr,
                },
            }
            // item.setAttribute('style', attr);

            // REF [js发送get 、post请求 - 牛奔 - 博客园](https://www.cnblogs.com/niuben/p/14676340.html)
            var request = new XMLHttpRequest();// 第一步：创建需要的对象
            request.open('POST', '/api/attr/setBlockAttrs', true); // 第二步：打开连接/***发送json格式文件必须设置请求头 ；如下 - */
            request.setRequestHeader("Content-type", "application/json"); // 设置请求头 注：post方式必须设置请求头（在建立连接后设置请求头）var obj = { name: 'zhansgan', age: 18 };
            request.send(JSON.stringify(request_body)); // 发送请求 将json写入send中

            // 获取数据后的处理程序
            request.onreadystatechange = function () { // 请求后的回调接口，可将请求成功后要执行的程序写在其中
                if (request.readyState == 4 && request.status == 200) { // 验证请求是否发送成功
                    var response_body = JSON.parse(request.responseText); // 获取到服务端返回的数据
                    console.log(request_body, response_body);
                    if (response_body.code == 0) { item.setAttribute('style', style); }
                }
            };
        });
    }
    catch (err) {
        console.error(err);
        window.alert(`保存自定义样式错误!\Saving custom styles error\n${err}`);
    }
}

function render() {
    renderCustomStyle(config.theme.style.render.styles);
}

/* 更改指定样式配置状态 */
function changeStyleState(styleConfig) {
    let enable = false;
    Object.keys(styleConfig.elements).forEach((key) => {
        let element = styleConfig.elements[key];
        if (element.enable) {
            enable = styleHandle(element.style.id, undefined, element.style.href) || enable;
        }
    });
    // 更改菜单栏按钮状态
    toolbarItemChangeStatu(
        styleConfig.toolbar.id,
        true,
        enable,
        'BUTTON',
    );
}

setTimeout(() => {
    try {
        if (config.theme.style.enable) {
            if (config.theme.style.save.enable) {
                // 块属性编辑窗口确认按钮保存自定义样式
                window.addEventListener('click', (e) => {
                    let target = e.target;
                    if (target.nodeName.toLocaleLowerCase() == 'button' && target.className === 'b3-button b3-button--text') {
                        setTimeout(saveCustomStyle, 0);
                    }
                }, true);
            }

            // 鼠标单击渲染自定义样式
            // let layout__center = document.querySelector('.layout__center');
            // layout__center.addEventListener('click', (e) => {
            //     setTimeout(render(), 0);
            // });
            if (config.theme.style.render.enable) {
                const Fn_render = toolbarItemInit(
                    config.theme.reload.window.toolbar,
                    render,
                );

                // 使用快捷键渲染自定义样式
                globalEventHandler.addEventHandler(
                    'keyup',
                    config.theme.hotkeys.style.render,
                    _ => Fn_render(),
                );
            }
            if (config.theme.style.guides.enable) {
                const Fn_guides = toolbarItemInit(
                    config.theme.style.guides.toolbar,
                    () => changeStyleState(config.theme.style.guides),
                );
                // 使用快捷键启用/禁用辅助线样式
                globalEventHandler.addEventHandler(
                    'keyup',
                    config.theme.hotkeys.style.guides,
                    _ => Fn_guides(),
                );
            }
            if (config.theme.style.mark.enable) {
                const Fn_mark = toolbarItemInit(
                    config.theme.style.mark.toolbar,
                    () => changeStyleState(config.theme.style.mark),
                );
                // 使用快捷键启用/禁用辅助线样式
                globalEventHandler.addEventHandler(
                    'keyup',
                    config.theme.hotkeys.style.mark,
                    _ => Fn_mark(),
                );
            }
        }
    } catch (err) {
        console.error(err);
    }
}, 0);
