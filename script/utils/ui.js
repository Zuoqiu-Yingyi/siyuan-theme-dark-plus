/* 图形界面工具 */

export {
    toolbarItemInit, // 工具栏项初始化
    toolbarItemChangeStatu, // 工具栏项状态改变
    menuInit, // 右键菜单初始化
    CommonMenuObserver, // 右键菜单管理
};

import {
    config,
    custom,
    saveCustomFile,
} from '../module/config.js';
import { printHotKey } from './hotkey.js';
import {
    editDocKramdown,
    editBlockKramdown,
} from './markdown.js';
import {
    getEditor,
    getEditors,
    setBlockDOMAttrs,
    countElementIndex,
    getTooltipDirection,
    setTooltipDirection,
    requestFullscreen,
} from './dom.js';
import {
    Iterator,
    fileSelect,
    copyToClipboard,
} from './misc.js';
import { drag } from './drag.js';
import {
    removeOuterIAL,
    compareVersion,
} from './string.js';
import {
    sql,
    getBlockBreadcrumb,
    getBlockByID,
    getBlockAttrs,
    getBlockIndex,
    setBlockAttrs,
    getBlockKramdown,
    pushMsg,
    pushErrMsg,
} from './api.js';

var jupyterConfig;
var jupyterWorker;
var jupyterImportWorker;

if (config.theme.jupyter.enable) {
    if (config.theme.jupyter.worker.enable) {
        /* worker 错误捕获 */
        const worker_error_handler = e => {
            console.error(e);
        };

        if (config.theme.jupyter.worker.main.enable) {
            // const jupyterConfig = getConf();
            // REF [Web Workers API - Web API 接口参考 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API)
            jupyterWorker = new Worker(
                config.theme.jupyter.worker.main.url,
                config.theme.jupyter.worker.main.options,
            );

            jupyterWorker.addEventListener('error', worker_error_handler);
            jupyterWorker.addEventListener('messageerror', worker_error_handler);

            jupyterWorker.addEventListener('message', e => {
                // console.log(e);
                const data = JSON.parse(e.data);
                switch (data.type) {
                    case 'status':
                        switch (data.status) {
                            case 'ready':
                                /* 是否就绪 */
                                jupyterWorker.postMessage(JSON.stringify({
                                    type: 'call',
                                    handle: 'getConf',
                                    params: [],
                                }));
                                jupyterWorker.postMessage(JSON.stringify({
                                    type: 'call',
                                    handle: 'setLang',
                                    params: [window.theme.languageMode],
                                }));
                                break;
                            default:
                                break;
                        }
                        break;
                    case 'call':
                        switch (data.handle) {
                            case 'getConf':
                                jupyterConfig = data.return;
                                break;
                            default:
                                break;
                        }
                        break;
                    default:
                        break;
                }
            });
        }

        if (config.theme.jupyter.worker.import.enable) {
            jupyterImportWorker = new Worker(
                config.theme.jupyter.worker.import.url,
                config.theme.jupyter.worker.import.options,
            );

            jupyterImportWorker.addEventListener('error', worker_error_handler);
            jupyterImportWorker.addEventListener('messageerror', worker_error_handler);
        }
    }
}

var toolbarItemList = [];
var toolbar_timeout_id = null; // 工具栏延时显示定时器
/**
 * 重置节点, 可所有监听器
 * @node (HTMLElementNode): DOM 节点
 * @withChildren (boolean): 是否移除子元素节点
 */
function recreateNode(node, withChildren = false) {
    if (node && node.parentNode) {
        if (withChildren) {
            node.parentNode.replaceChild(node.cloneNode(true), node);
        }
        else {
            let newNode = node.cloneNode(false);
            while (node.hasChildNodes()) newNode.appendChild(node.firstChild);
            node.parentNode.replaceChild(newNode, node);
        }
    }
}

/**
 * 创建工具栏菜单项
 */
function createToolbarItem(toolbarConfig, className) {
    let item = document.createElement('BUTTON');
    let language = window.theme.languageMode;
    let icon, label;
    if (toolbarConfig.status
        && toolbarConfig.status.default
        && toolbarConfig.status[toolbarConfig.status.default]
    ) { // 按钮是否有多个状态且有默认状态
        const status = toolbarConfig.status[toolbarConfig.status.default];
        icon = status.icon;
        label = status.label[language] || status.label.other;
        label += (status.hotkey && status.hotkey().enable !== false) ? ` [${printHotKey(status.hotkey())}]` : '';
    }
    else { // 按钮没有多个状态
        icon = toolbarConfig.icon;
        label = toolbarConfig.label[language] || toolbarConfig.label.other;
        label += (toolbarConfig.hotkey && toolbarConfig.hotkey().enable !== false) ? ` [${printHotKey(toolbarConfig.hotkey())}]` : '';
    }

    item.id = toolbarConfig.id;
    item.className = className || "toolbar__item b3-tooltips b3-tooltips__sw";
    // item.setAttribute('aria-label', label);
    item.ariaLabel = label;
    // item.title = label;
    item.innerHTML = `<svg><use xlink:href="${icon}"></use></svg>`;
    return item;
}

/**
 * 恢复工具栏菜单项用户默认配置
 */
function itemStateLoad(id, states, node) {
    const conf = states[id];
    if (conf) {
        // 存在自定义配置
        // console.log(conf, conf.state, conf.state == null);
        const state = conf.state ?? conf.default ?? false;
        // console.log(state);
        if (state) setTimeout(() => node.click(), 0);
    }
}

/* 工具栏添加 */
function toolbarItemListPush(item) {
    toolbarItemList.push(item);
    const toolbar = document.getElementById('toolbar');

    if (window.theme.clientMode !== 'mobile' && toolbar) {
        const windowControls = document.getElementById('windowControls');
        var custom_toolbar = document.getElementById(config.theme.toolbar.id);

        if (!custom_toolbar) {
            /* 自定义工具栏按钮的容器 */
            custom_toolbar = document.createElement('div');
            custom_toolbar.id = config.theme.toolbar.id;
            custom_toolbar.style.display = 'none';

            /* 分割线 */
            const divider_before = document.createElement('div');
            const divider_after = document.createElement('div');
            divider_before.className = 'protyle-toolbar__divider';
            divider_after.className = 'protyle-toolbar__divider';

            /* 将自定义工具栏添加到自定义悬浮菜单栏中 */
            const custom_tooldock = document.createElement('div');
            custom_tooldock.id = config.theme.tooldock.id;

            /* 重置工具栏按钮 */
            const reset = createToolbarItem(config.theme.tooldock.reset);
            reset.style.display = 'none'; // 默认隐藏

            /* 更多按钮 */
            const more = createToolbarItem(config.theme.toolbar.more);
            more.addEventListener('dblclick', e => {
                /* 取消其他默认事件处理 */
                e.preventDefault();
                e.stopPropagation();

                // if (drag.status.flags.dragging) return; // 拖拽时忽略点击事件(无效)
                let status, language = window.theme.languageMode;
                const rect = more.getBoundingClientRect();
                const x = Math.round(rect.x);
                const y = Math.round(rect.y);
                const width = Math.round(rect.width);
                const height = Math.round(rect.height);

                if (custom_toolbar.style.display === 'none') {
                    /* 重新更改定位 */
                    custom_tooldock.style.left = `${100 * (x - more.offsetLeft) / document.documentElement.offsetWidth}vw`;
                    custom_tooldock.style.top = `${100 * (y - more.offsetTop) / document.documentElement.offsetHeight}vh`;;
                    custom_tooldock.style.right = null;
                    custom_tooldock.style.bottom = null;

                    // 显示自定义工具栏
                    status = config.theme.toolbar.more.status.unfold
                    custom_toolbar.style.display = null;
                    custom.theme.toolbar[config.theme.toolbar.more.id].fold = false;
                }
                else {
                    /* 重新更改定位 */
                    const x_center = (x + width / 2) / document.documentElement.offsetWidth;
                    const y_center = (y + height / 2) / document.documentElement.offsetHeight;
                    if (x_center < 0.5) {
                        custom_tooldock.style.right = null;
                        custom_tooldock.style.left = `${100 * (x - more.offsetLeft) / document.documentElement.offsetWidth}vw`;
                    }
                    else {
                        custom_tooldock.style.left = null;
                        custom_tooldock.style.right = `${100 - (100 * (x + width + more.offsetLeft) / document.documentElement.offsetWidth)}vw`;
                    }
                    if (y_center < 0.5) {
                        custom_tooldock.style.bottom = null;
                        custom_tooldock.style.top = `${100 * (y - more.offsetTop) / document.documentElement.offsetHeight}vh`;
                    }
                    else {
                        custom_tooldock.style.top = null;
                        custom_tooldock.style.bottom = `${100 - (100 * (y + height + more.offsetTop) / document.documentElement.offsetHeight)}vh`;;
                    }

                    custom_tooldock.style.width = `calc(var(--custom-dock-width) * 1)`;
                    custom_tooldock.style.height = null;

                    // 隐藏自定义工具栏
                    custom_toolbar.style.display = 'none';
                    status = config.theme.toolbar.more.status.fold
                    custom.theme.toolbar[config.theme.toolbar.more.id].fold = true;
                }
                // more.setAttribute('aria-label', status.label[language] || status.label.other);
                more.ariaLabel = status.label[language] || status.label.other;
                // more.title = status.label[language] || status.label.other;
                more.firstChild.firstChild.setAttribute('xlink:href', status.icon);
                setTimeout(async () => saveCustomFile(custom), 0);
            }, true);

            /* 悬浮事件处理 */
            function float(..._) {
                custom_tooldock.style.top = `${custom_tooldock.offsetTop}px`;
                custom_tooldock.style.left = `${custom_tooldock.offsetLeft}px`;
                custom_tooldock.classList.add(...config.theme.tooldock.classes);
                reset.style.display = null; // 显示重置工具栏按钮
                custom.theme.toolbar[config.theme.toolbar.more.id].state = true;
                setTimeout(async () => saveCustomFile(custom), 0);
            };

            /* 悬浮工具栏 */
            custom_tooldock.addEventListener(
                'mousedown',
                float,
                {
                    capture: true,
                    once: true,
                },
            );

            /* 重置工具栏 */
            reset.addEventListener('click', () => {
                /* 若工具栏是展开的, 则折叠工具栏 */
                if (custom_toolbar.style.display !== 'none') {
                    more.dispatchEvent(new Event('dblclick'));
                }
                reset.style.display = 'none'; // 隐藏重置按钮

                /* 删除样式 */
                custom_tooldock.style.left = null;
                custom_tooldock.style.right = null;
                custom_tooldock.style.top = null;
                custom_tooldock.style.bottom = null;
                custom_tooldock.style.width = null;
                custom_tooldock.style.height = null;

                /* 移除工具栏悬浮类 */
                custom_tooldock.classList.remove(...config.theme.tooldock.classes);

                /* 点击后再次悬浮功能 */
                custom_tooldock.addEventListener(
                    'mousedown',
                    float,
                    {
                        capture: true,
                        once: true,
                    },
                );

                /* 保存状态 */
                custom.theme.toolbar[config.theme.toolbar.more.id].state = false;
                setTimeout(async () => saveCustomFile(custom), 0);
            });

            /**注册鼠标拖动事件
             * 由于该事件注册在当前节点的子节点处
             * 且同为 mousedown 事件
             * 且在事件捕获时处理
             * 因此当前处理完成后即可调用
             */
            drag.register(
                more,
                custom_tooldock,
                document.documentElement,
                // document.getElementById('layouts'),
                drag.handler.move,
                (e, that, ..._) => { // 使用预处理方法调整宽度
                    let multiple = 1;
                    if (custom_toolbar.style.display !== 'none') { // 已展开
                        if (custom_tooldock.offsetLeft <= 0) {
                            /* 遇到左边界时压缩宽度 */
                            multiple = 1;
                        }
                        else {
                            /* 遇到右边界时压缩宽度 */
                            const item_count = custom_tooldock.querySelectorAll('.toolbar__item').length;
                            const x = e.clientX - that.status.drag.position.x;
                            multiple = Math.min(
                                item_count,
                                Math.max(
                                    1,
                                    Math.floor(
                                        (document.body.offsetWidth - x - 1)
                                        / (more.offsetWidth + more.offsetLeft * 2)
                                    ),
                                ),
                            );
                        }
                    }
                    else { // 已折叠
                        multiple = 1;
                    }
                    custom_tooldock.style.width = `calc(var(--custom-dock-width) * ${multiple})`;
                },
                undefined,
                (..._) => { // 拖动完成回调方法
                    /* 调整提示标签 */
                    setTooltipDirection(
                        getTooltipDirection,
                        ...custom_tooldock.querySelectorAll('.toolbar__item'),
                    );

                    /* 保存当前位置 */
                    custom.theme.tooldock.position.left = custom_tooldock.style.left;
                    custom.theme.tooldock.position.right = custom_tooldock.style.right;
                    custom.theme.tooldock.position.top = custom_tooldock.style.top;
                    custom.theme.tooldock.position.bottom = custom_tooldock.style.bottom;
                    custom.theme.tooldock.position.width = custom_tooldock.style.width;
                    custom.theme.tooldock.position.height = custom_tooldock.style.height;
                    setTimeout(async () => saveCustomFile(custom), 0);
                },
            );

            /* 添加自定义工具按钮至浮动工具栏 */
            custom_tooldock.appendChild(more);
            custom_tooldock.appendChild(custom_toolbar);

            /* 添加到界面 */
            if (windowControls) {
                toolbar.insertBefore(divider_before, windowControls);
                toolbar.insertBefore(reset, windowControls);
                toolbar.insertBefore(custom_tooldock, windowControls);
                if (windowControls.childElementCount > 0) // 存在窗口控制按钮, 插入分割线
                    toolbar.insertBefore(divider_after, windowControls);
            }
            else {
                toolbar.appendChild(divider_before);
                toolbar.appendChild(reset);
                toolbar.appendChild(custom_tooldock);
            }

            /* 恢复状态 */
            const conf = custom.theme.toolbar[config.theme.toolbar.more.id];
            const state = conf?.state
                ?? conf?.default
                ?? false;
            if (state) {
                const position = custom.theme.tooldock.position;
                if (position) {
                    float(); // 悬浮
                    if (!conf.fold) more.dispatchEvent(new Event('dblclick')); // 展开

                    /* 设置位置 */
                    custom_tooldock.style.left = position.left;
                    custom_tooldock.style.right = position.right;
                    custom_tooldock.style.top = position.top;
                    custom_tooldock.style.bottom = position.bottom;
                    custom_tooldock.style.width = position.width;
                    custom_tooldock.style.height = position.height;
                }
            }
        }

        /* 将元素插入界面 */
        custom_toolbar.append(item.node);

        /* 重新计时 */
        clearTimeout(toolbar_timeout_id);
        toolbar_timeout_id = setTimeout(() => {
            /* 工具栏按钮排序 */
            toolbarItemList = toolbarItemList.sort((a, b) => a.index - b.index);
            for (let item of toolbarItemList) {
                if (item.display) {
                    let node = document.getElementById(item.id);
                    custom_toolbar.append(node || item.node);
                }
            }

            const custom_tooldock = document.getElementById(config.theme.tooldock.id);
            if (custom_tooldock) {
                /* 调整提示标签 */
                setTooltipDirection(
                    getTooltipDirection,
                    ...custom_tooldock.querySelectorAll('.toolbar__item'),
                );
            }
        }, config.theme.toolbar.delay);
    }
}

/**
 * 工具栏插入菜单项
 * @toolbarConfig (object): 工具栏配置, 参考 config.js 中的 toolbar 属性
 * @return (HTML Node): 菜单项节点
 */
function toolbarItemInsert(toolbarConfig) {
    let node = createToolbarItem(toolbarConfig);
    // let toolbar = document.getElementById('toolbar');
    // let referenceNode = document.getElementById('windowControls');
    // return toolbar.insertBefore(node.firstElementChild, referenceNode);
    toolbarItemListPush({
        display: toolbarConfig.display,
        index: toolbarConfig.index,
        id: toolbarConfig.id,
        node: node,
    });
    return node;
}

/**
 *  button/div
 *      toolbar__item--disabled: 工具栏项禁用
 *  svg
 *      ft__primary: 图标高亮(蓝色)
 *      ft__secondary: 图标高亮(金色)
 */

const svgClassList = [
    null,
    'ft__primary',
    'ft__secondary',
];

/**
 * 改变工具栏项状态
 * @id (string): 工具栏项id
 * @enable (boolean): 是否启用
 * @active (boolean): 是否激活
 * @type (string): 工具栏项类型
 * @node (element): 工具栏项节点
 * @svgClassIndex (int): svg 样式索引
 * @listener (function): 监听器
 * @return (void): 无返回值
 */
function toolbarItemChangeStatu(
    id,
    enable = false,
    active = null,
    mode = 'DIV',
    node = null,
    svgClassIndex = 0,
    listener = null,
) {
    node = node || document.getElementById(id);
    if (node) {
        switch (mode.toUpperCase()) {
            case 'SVG':
                if (active !== null && svgClassIndex > 0) {
                    if (active) {
                        node.firstElementChild.classList.add(svgClassList[svgClassIndex]);
                    }
                    else {
                        node.firstElementChild.classList.remove(svgClassList[svgClassIndex]);
                    }
                    if (custom.theme.toolbar[id]) {
                        custom.theme.toolbar[id].state = active;
                        setTimeout(async () => saveCustomFile(custom), 0);
                    }
                }
                break;
            case 'DIV':
            case 'BUTTON':
            default:
                if (active !== null) {
                    if (active) {
                        node.classList.add('toolbar__item--active');
                    }
                    else {
                        node.classList.remove('toolbar__item--active');
                    }
                    if (custom.theme.toolbar[id]) {
                        custom.theme.toolbar[id].state = active;
                        setTimeout(async () => saveCustomFile(custom), 0);
                    }
                }

                if (enable) {
                    if (node.classList.contains('toolbar__item--disabled')) {
                        node.classList.remove('toolbar__item--disabled');
                    }
                    if (typeof listener === 'function') listener(node);
                }
                else {
                    if (!node.classList.contains('toolbar__item--disabled')) {
                        node.classList.add('toolbar__item--disabled');
                        recreateNode(node);
                    }
                }
                break;
        }
    }
}

/**
 * 工具栏项初始化
 * @toolbarConfig (object): 工具栏配置, 参考 config.js 中的 toolbar 属性
 * @handler (function): 工具栏项点击时的回调函数
 * @svgClassIndex (int): svg 默认样式索引
 * @return (function): 封装后的回调函数
 */
function toolbarItemInit(toolbarConfig, handler, svgClassIndex = 0) {
    let fn = () => setTimeout(handler, 0);

    // 添加按钮点击监听器
    let listener = e => e.addEventListener('click', (_) => fn());
    // 在工具栏添加按钮
    let node = toolbarItemInsert(toolbarConfig);

    // 是否禁用该按钮
    toolbarItemChangeStatu(
        toolbarConfig.id,
        toolbarConfig.enable,
        undefined,
        'BUTTON',
        node,
        undefined,
        listener,
    )

    // 加载该按钮的原状态
    itemStateLoad(toolbarConfig.id, custom.theme.toolbar, node);

    // 是否设置颜色
    if (svgClassIndex > 0 && svgClassIndex < svgClassList.length) {
        toolbarItemChangeStatu(
            toolbarConfig.id,
            true,
            true,
            'SVG',
            node,
            svgClassIndex,
        )
    }
    return fn;
}

/**
 * 创建右键菜单项图标
 */
function createMenuItemIconNode(href = '#', style = '', className = 'b3-menu__icon') {
    let node = document.createElement('div');
    // 创建 svg 标签再添加 use 无法渲染
    node.innerHTML = `<svg class="${className}" style="${style}"><use xlink:href="${href}"></use></svg>`;
    return node.firstElementChild;
}

/**
 * 创建右键菜单项输入框
 */
function createMenuItemInputNode(id = null, placeholder = '', value = null, style = null, className = 'b3-text-field fn__size200') {
    let span = document.createElement('span');
    span.className = 'b3-menu__label';

    let hr_head = document.createElement('div');
    hr_head.className = 'fn__hr--small';

    let hr_tail = document.createElement('div');
    hr_tail.className = 'fn__hr--small';

    let input = document.createElement('input');
    input.id = id;
    input.placeholder = placeholder;
    input.value = value;
    input.style = style;
    input.className = className;

    span.addEventListener('click', e => e.stopPropagation(), false);
    span.appendChild(hr_head);
    span.appendChild(input);
    span.appendChild(hr_tail);
    return {
        span,
        input,
    }
}

/**
 * 创建右键菜单项标签
 */
function createMenuItemLabelNode(content = '菜单项', style = null, className = 'b3-menu__label') {
    let node = document.createElement('span');
    node.innerText = content;
    node.className = className;
    node.style = style;
    return node;
}

/**
 * 创建右键菜单项捷径标签
 */
function createMenuItemAcceleratorNode(content, className = 'b3-menu__accelerator') {
    let node = document.createElement('span');
    node.innerText = content;
    node.className = className;
    return node;
}

/**
 * 创建右键菜单项子菜单图标
 */
function createMenuItemSubMenuIconNode(href, style = null, className = 'b3-menu__icon b3-menu__icon--arrow') {
    return createMenuItemIconNode(href, style, className);
}

/**
 * 创建右键菜单项子菜单容器
 */
function createMenuItemSubMenuNode(className = 'b3-menu__submenu') {
    let node = document.createElement('div');
    node.className = className;
    return node;
}

/**
 * 创建右键菜单分隔项
 */
function createMenuItemSeparatorNode(className = 'b3-menu__separator') {
    let node = document.createElement('button');
    node.className = className;
    return node;
}

/**
 * 判断某个块类型是否启用
 */
function isBlockTypeEnabled(config, type, subtype) {
    // !config.enable // 被禁用, 不启用
    if (!config.enable) return false; // 不启用菜单项
    if (!config.type) return true; // 没有设置类型, 全部启用

    // !config.type[type] // 主类型存在
    if (config.type[type]) {
        // !config.type[type].enable // 主类型被禁用, 不启用
        if (!config.type[type].enable) return false;
    }
    else { // 主类型不存在
        return config.type.default?.enable // 应用默认配置
            ?? false; // 默认配置不存在则不启用
    }

    // config.type[type].subtype // 定义了子类型, 需要判断子类型是否启用
    // !config.type[type].subtype[subtype] // 该子类型未定义或被禁用, 不启用
    if (config.type[type].subtype
        && subtype
        && !config.type[type].subtype[subtype]
    ) return false;

    return true;
}

/**
 * 判断是否单击了子菜单项
 */
function isClickSubMenuItem(node, target) {
    return node.lastElementChild.contains(target.parentNode);
}
// 任务处理器
const TASK_HANDLER = {
    /**
     *  替换属性中的子字符串
     *  @params: {
     *      'key': {
     *          regexp: //, // 匹配正则
     *          substr: "", // 替换的字符串
     *      },
     *  }
     */
    'attr-replace': async (e, id, params) => {
        // console.log('attr-replace');
        let old_attrs = await getBlockAttrs(id);
        let new_attrs = {};
        let changed = false;
        for (let attr of Object.keys(params)) {
            if (old_attrs[attr]) {
                // 如果属性不为空, 添加到末尾
                new_attrs[attr] = old_attrs[attr].replace(params[attr].regexp, params[attr].substr);
                changed = changed || new_attrs[attr] !== old_attrs[attr];
            }
        }
        if (changed) {
            if (compareVersion(window.theme.kernelVersion, '2.2.0') < 0)
                setBlockDOMAttrs(id, new_attrs);
            setBlockAttrs(id, new_attrs);
        }
    },
    /**
     * 设置属性
     *  @params: {
     *      'key': {
     *          regexp: RegExp, // 待删除的字段值正则, 可选
     *          value: "", // 设置的字段值
     *      },
     *  }
     */
    'attr-set': async (e, id, params) => {
        // console.log('attr-set');
        let old_attrs = await getBlockAttrs(id);
        let new_attrs = {};
        for (let attr of Object.keys(params)) {
            if (old_attrs[attr]) {
                // 如果属性不为空, 添加移除原字段值后添加新字段值
                new_attrs[attr] = old_attrs[attr].replace(params[attr].regexp, '') + params[attr].value;
            }
            else {
                // 如果属性不存在, 则直接插入
                new_attrs[attr] = params[attr].value;
            }
        }
        if (compareVersion(window.theme.kernelVersion, '2.2.0') < 0)
            setBlockDOMAttrs(id, new_attrs);
        setBlockAttrs(id, new_attrs);
    },
    /* 在后方插入属性 */
    'attr-append': async (e, id, params) => {
        // console.log('attr-append');
        let old_attrs = await getBlockAttrs(id);
        let new_attrs = {};
        for (let attr of Object.keys(params)) {
            if (old_attrs[attr]) {
                // 如果属性不为空, 添加到末尾
                new_attrs[attr] = old_attrs[attr] + params[attr];
            }
            else {
                // 如果属性不存在, 则直接插入
                new_attrs[attr] = params[attr];
            }
        }
        if (compareVersion(window.theme.kernelVersion, '2.2.0') < 0)
            setBlockDOMAttrs(id, new_attrs);
        setBlockAttrs(id, new_attrs);
    },
    /* 插入属性值中空格分隔的一项(插入单词) */
    'attr-insert': async (e, id, params) => {
        // console.log('attr-insert');
        let old_attrs = await getBlockAttrs(id);
        let new_attrs = {};
        for (let attr of Object.keys(params)) {
            if (old_attrs[attr]) {
                // 如果属性已存在, 则插入新属性值
                let values = new Set(old_attrs[attr].trim().split(/\s+/));
                values.add(params[attr]);
                new_attrs[attr] = [...values].join(' ').trim();
            }
            else {
                // 如果属性不存在, 则直接插入
                new_attrs[attr] = params[attr];
            }
        }
        if (compareVersion(window.theme.kernelVersion, '2.2.0') < 0)
            setBlockDOMAttrs(id, new_attrs);
        setBlockAttrs(id, new_attrs);
    },
    /* 删除属性值中空格分隔的一项 */
    'attr-delete': async (e, id, params) => {
        // console.log('attr-delete');
        let old_attrs = await getBlockAttrs(id);
        let new_attrs = {};
        for (let key of Object.keys(params)) {
            if (params[key]) {
                if (old_attrs[key]) {
                    // 如果属性已存在, 则删除属性值
                    let values = new Set(old_attrs[key].trim().split(/\s+/));
                    if (values.has(params[key])) {
                        values.delete(params[key]);
                        new_attrs[key] = [...values].join(' ').trim();
                    }
                }
            }
            else {
                // 如果没有指定删除的属性值, 则删除属性
                new_attrs[key] = '';
            }
        }
        if (compareVersion(window.theme.kernelVersion, '2.2.0') < 0)
            setBlockDOMAttrs(id, new_attrs);
        setBlockAttrs(id, new_attrs);
    },
    /* 覆盖整个属性值 */
    'attr-update': async (e, id, params) => {
        // console.log('attr-update');
        for (const [key, value] of Object.entries(params))
            if (!value) params[key] = '';
        if (compareVersion(window.theme.kernelVersion, '2.2.0') < 0)
            setBlockDOMAttrs(id, params);
        setBlockAttrs(id, params);
    },
    /* 切换属性值中空格分隔的一项 */
    'attr-switch': async (e, id, params) => {
        // console.log('attr-switch');
        let old_attrs = await getBlockAttrs(id);
        let new_attrs = {};
        for (let key of Object.keys(params)) {
            let iter = Iterator(params[key], true); // 循环迭代器
            if (old_attrs[key]) {
                // 如果属性已存在, 则切换属性值
                let values = new Set(old_attrs[key].trim().split(/\s+/));
                for (let i = 1; i <= params[key].length; ++i) {
                    let v = iter.next().value;
                    if (values.has(v)) {
                        values.delete(v);
                        break;
                    }
                }
                values.add(iter.next().value);
                new_attrs[key] = [...values].join(' ').trim();
            }
            else {
                // 如果属性不存在, 则直接插入
                new_attrs[key] = iter.next().value;
            }
        }
        if (compareVersion(window.theme.kernelVersion, '2.2.0') < 0)
            setBlockDOMAttrs(id, new_attrs);
        setBlockAttrs(id, new_attrs);
    },
    /* 子菜单展开 */
    'menu-unfold': async (e, id, params) => {
        let menuItem = window.siyuan.menus.menu.element.querySelector(`#${params.id}`);
        if (isClickSubMenuItem(menuItem, e.target)) return; // 单击了子菜单项, 不触发上级菜单项

        let item = params.item();
        item.itemsLoad = !item.itemsLoad;
        menuItem.remove();
    },
    /* 在新窗口打开 */
    'window-open': async (e, id, params) => {
        if (params.src) { // 如果需要打开资源
            const BLOCK = await getBlockByID(id);
            if (BLOCK) {
                const DIV = document.createElement('div');
                DIV.innerHTML = BLOCK.markdown;
                window.theme.openNewWindow(
                    'browser',
                    DIV.firstElementChild.src,
                    BLOCK.type === 'widget'
                        ? { id: id }
                        : undefined,
                    config.theme.window.windowParams,
                    config.theme.window.menu.template,
                );
                return null;
            }
            return null;
        }
        else if (params.href) { // 如果需要打开链接
            window.theme.openNewWindow(
                'browser',
                params.href,
                Object.assign({ id: id }, params.urlParams),
                config.theme.window.windowParams,
                config.theme.window.menu.template,
            );
            return null;
        }
        else { // 默认打开 Web 端
            window.theme.openNewWindow(
                undefined,
                undefined,
                Object.assign({ id: id }, params),
                config.theme.window.windowParams,
                config.theme.window.menu.template,
            );
        }
    },
    /* 在新窗口打开编辑器 */
    'window-open-editor': async (e, id, params) => {
        window.theme.openNewWindow(
            'editor',
            undefined,
            Object.assign({ id: id }, params),
            config.theme.window.windowParams,
            config.theme.window.menu.template,
            config.theme.window.open.editor.path.index,
        );
    },
    /* 在新窗口打开编辑器并编辑 kramdown 文档源代码 */
    'window-open-editor-kramdown': async (e, id, params) => {
        if (compareVersion(window.theme.kernelVersion, '2.0.24') > 0)
            editBlockKramdown(id);
        else
            editDocKramdown(id);
    },
    /* 选择文件 */
    'file-select': async (e, id, params) => {
        fileSelect(params.accept, params.multiple).then(files => {
            params.files = files;
            TASK_HANDLER?.[params.callback](e, id, params);
        });
    },
    /* 保存输入框内容 */
    'save-input-value': async (e, id, params) => {
        const value = e.target.value;
        // console.log(value);
        switch (params.mode) {
            case 'attr':
                setBlockAttrs(
                    id,
                    { [params.key]: value },
                );
                break;
            default:
                break;
        }
    },
    /* 处理输入框内容 */
    'handler': async (e, id, params) => params.handler(e, id, params),
    /* 打开全局设置窗口 */
    'jupyter-open-global-settings': async (e, id, params) => {
        window.theme.openNewWindow(
            'browser',
            params.href,
            Object.assign({ id: id }, params.urlParams),
            config.theme.window.windowParams,
            config.theme.window.menu.template,
            undefined,
            undefined,
            undefined,
            async (...args) => jupyterWorker.postMessage(JSON.stringify({
                type: 'call',
                handle: 'reloadCustomJson',
                params: [],
            })),
        );
        return null;
    },
    /* 关闭会话 */
    // 'jupyter-close-connection': closeConnection,
    'jupyter-close-connection': async (...args) => jupyterWorker.postMessage(JSON.stringify({
        type: 'call',
        handle: 'closeConnection',
        params: args,
    })),
    /* 重启内核 */
    // 'jupyter-restart-kernel': restartKernel,
    'jupyter-restart-kernel': async (...args) => jupyterWorker.postMessage(JSON.stringify({
        type: 'call',
        handle: 'restartKernel',
        params: args,
    })),
    /* 运行单元格 */
    // 'jupyter-run-cell': runCell,
    'jupyter-run-cell': async (...args) => jupyterWorker.postMessage(JSON.stringify({
        type: 'call',
        handle: 'runCell',
        params: args,
    })),
    /* 运行所有单元格 */
    'jupyter-run-all-cells': async (e, id, params) => {
        const stmt = `SELECT a.block_id FROM attributes AS a WHERE a.root_id = '${id}' AND a.name = '${jupyterConfig.jupyter.attrs.code.type.key}' AND a.value = '${jupyterConfig.jupyter.attrs.code.type.value}';`;
        const rows = await sql(stmt);
        if (rows && rows.length > 0) {
            for (let i = 0; i < rows.length; ++i) {
                const index = await getBlockIndex(rows[i].block_id);
                if (!index) return;
                rows[i].index = index;
            }
            rows.sort((a, b) => a.index - b.index);
            const IDs = rows.map(row => row.block_id);

            jupyterWorker.postMessage(JSON.stringify({
                type: 'call',
                handle: 'runCells',
                params: [
                    e,
                    IDs,
                    params,
                ],
            }));
        }
    },
    /* 导入 *.ipynb */
    'jupyter-import-ipynb': async (e, id, params) => {
        /* 读取并解析 ipynb */
        const ipynb = await params.files[0].text();
        jupyterImportWorker.postMessage(JSON.stringify({
            type: 'call',
            handle: 'importJson',
            params: [id, ipynb, params.mode],
        }));
    },
    /* 归档页签 */
    'tab-archive': async (e, id, params) => {
        const editors = getEditors().filter(editor => {
            if (editor.protyle.model.headElement.classList.contains('item--pin')) return false;
            if (!params.unupdate && editor.protyle.model.headElement.classList.contains('item--unupdate')) return false;
            return true;
        });
        if (editors.length > 0) {
            const IDs = editors.map(editor => editor.protyle.options.blockId); // 待归档的文档的 ID
            const time = new Date().format('yyyy-MM-dd hh:mm:ss'); // 归档时间戳(书签名)
            const attrs = { bookmark: time }; // 待设置的书签属性
            IDs.forEach(id => setBlockAttrs(id, attrs));
            editors.forEach(editor => editor.protyle.model.headElement.lastElementChild.click());
            pushMsg(params.message.success);
        }
        else pushErrMsg(params.message.error);
    },
    /* 全屏显示 iframe 块/挂件块 */
    'full-screen': async (e, id, params) => {
        requestFullscreen(id);
    },
    /* 复制分享链接 */
    'copy-share-link': async (e, id, params) => {
        const url = new URL(window.location.origin);

        /* 设置块 ID */
        url.searchParams.set('id', id);

        /* 是否聚焦 */
        if (params.focus) {
            url.searchParams.set('focus', 1);
        }

        /* 平台 */
        switch (params.platform) {
            case 'desktop': // 桌面端
                url.pathname = '/stage/build/desktop';
                break;
            case 'mobile': // 移动端
                url.pathname = '/stage/build/mobile';
                break;
        }

        copyToClipboard(url.href);
    },
    /* 显示嵌入块查询结果的路径 */
    // REF [思源笔记渲染 SQL 文档路径代码 - 链滴](https://ld246.com/article/1665129901544)
    // @deprecated
    'show-hpath': async (e, id, params) => {
        /* 定位到嵌入块的 DOM */
        document.querySelectorAll(`.render-node[data-node-id="${id}"]`).forEach(block => {
            const callback = () => {
                // console.log('callback');
                /* 遍历嵌入块的查询结果的 DOM */
                let counter = 0;
                const results = block.parentElement.querySelectorAll(`.render-node[data-node-id="${block.dataset.nodeId}"]>.protyle-wysiwyg__embed`);
                // console.log(block, results);
                const length = results.length.toString().length;
                results.forEach(result => {
                    const index = ++counter;
                    // console.log(index);
                    setTimeout(async () => {
                        /* 使用 API /api/filetree/getFullHPathByID 查询完整路径 */
                        const breadcurmb = await getBlockBreadcrumb(result.dataset.id);
                        if (breadcurmb) {
                            /* 将路径插入每个查询结果中 */
                            let nodes = []; // 文档路径 HTML 节点列表
                            const paths = breadcurmb[0].name.split('/'); // 文档路径节点列表
                            for (let i = 0; i < paths.length; ++i)
                                nodes.push(`<span data-type="kbd">${paths[i]}</span>`);
                            let crumb = document.createElement('div');
                            crumb.classList.add('p');
                            crumb.style.outline = '2px solid var(--b3-theme-on-surface-light)'
                            crumb.style.borderRadius = '2px';
                            crumb.setAttribute('data-node-id', '');
                            crumb.setAttribute('data-type', 'NodeParagraph');
                            // [关于格式化：如何在javascript中将整数格式化为特定长度？ | 码农家园](https://www.codenong.com/1127905/)
                            crumb.innerHTML = `<div contenteditable="false" spellcheck="false"><span data-type="code">#${index.toString().padStart(length, '0')}</span>: ${nodes.join('&gt;')}</div>`;
                            result.parentElement.insertBefore(crumb, result);
                        }
                    }, 0);
                });
            };
            callback();
            const observer = new MutationObserver((mutationList, observer) => {
                for (let i = mutationList.length - 1; i >= 0; --i) {
                    const mutation = mutationList[i];
                    // console.log(mutation);
                    if (mutation.type === 'childList'
                        && mutation.addedNodes.length >= 2
                        && mutation.nextSibling?.classList.contains('protyle-attr')
                    ) {
                        // setTimeout(callback(), 0);
                        callback();
                        break;
                    }
                }
            });
            observer.observe(block, {
                // attributeFilter: ['data-render'], // 声明哪些属性名会被监听的数组
                // attributeOldValue: true, // 记录上一次被监听的节点的属性变化
                childList: true,
                attributes: false,
                characterData: false,
            });
            observer.takeRecords();
        });
    },
};

/**
 * 创建右键菜单项
 */
function createMenuItemNode(language, config, id, type, subtype, className = 'b3-menu__item') {
    var node = null;
    switch (config.mode.toLowerCase()) {
        case 'separator': // 分割线
            if (!isBlockTypeEnabled(config, type, subtype)) return null;
            node = createMenuItemSeparatorNode();
            break;
        case 'input': { // 输入框
            if (!isBlockTypeEnabled(config, type, subtype)) return null;
            node = document.createElement('button');
            node.className = className;
            node.appendChild(createMenuItemIconNode(config.icon)); // 图标
            const { span, input } = createMenuItemInputNode(
                config.id,
                config.placeholder[language] || config.placeholder.other,
            );
            node.appendChild(span); // 输入框

            /* 备注 */
            let accelerator = config.accelerator;
            if (typeof accelerator === 'function') accelerator = printHotKey(accelerator(id));
            if (typeof accelerator === 'string') node.appendChild(createMenuItemAcceleratorNode(accelerator));

            switch (config.value?.mode) {
                case 'attr': // 使用块属性初始化 input 内容
                    getBlockAttrs(id).then(attrs => {
                        // console.log(attrs);
                        if (attrs?.[config.value?.key]) input.value = attrs?.[config.value?.key];
                    });
                    break;
                default:
                    break;
            }

            /* 绑定事件处理 */
            function boundTaskHandlers(id, type, taskHandler, element = input) {
                if (taskHandler.callback)
                    element.addEventListener(
                        type,
                        async e => await taskHandler.callback(e, id),
                        true,
                    );
                else {
                    let handlers = [];
                    taskHandler.tasks.forEach((task) => {
                        if (TASK_HANDLER[task.type]) handlers.push(async e => TASK_HANDLER[task.type](e, id, task.params));
                    });
                    element.addEventListener(
                        type,
                        e => handlers.forEach((handler) => handler(e)),
                        true,
                    );
                }
            }

            if (config.onchange?.enable) { // 绑定 onchange 事件
                boundTaskHandlers(
                    id,
                    'change',
                    config.onchange,
                )
            };
            if (config.oninput?.enable) { // 绑定 oninput 事件
                boundTaskHandlers(
                    id,
                    'input',
                    config.oninput,
                )
            };

            break;
        }
        case 'button': // 按钮
            if (!isBlockTypeEnabled(config, type, subtype)) return null;
            node = document.createElement('button');
            node.className = className;
            if (config.id) node.id = config.id;
            node.appendChild(createMenuItemIconNode(config.icon));
            node.appendChild(createMenuItemLabelNode(config.label[language] || config.label.other, config.label.style));
            let accelerator = config.accelerator;
            if (typeof accelerator === 'function') accelerator = printHotKey(accelerator(id));
            if (typeof accelerator === 'string') node.appendChild(createMenuItemAcceleratorNode(accelerator));
            if (config.itemsIcon) {
                switch (typeof (config.itemsIcon)) {
                    case 'string':
                        node.appendChild(createMenuItemSubMenuIconNode(config.itemsIcon))
                        break;
                    case 'object':
                        node.appendChild(createMenuItemSubMenuIconNode(
                            config.itemsLoad
                                ? config.itemsIcon.unfold
                                : config.itemsIcon.fold
                        ))
                    default:
                        break;
                }
            };
            if (config.itemsLoad && config.items && config.items.length > 0) {
                const subMenuNodes = [];
                let separator = 0; // 分隔线数量
                config.items.forEach(subConfig => {
                    const item = createMenuItemNode(language, subConfig, id, type, subtype); // 创建子菜单项
                    if (item) {
                        if (item.className === 'b3-menu__separator') separator++;
                        if (subConfig.prefixSeparator && subMenuNodes.length > 0) {
                            subMenuNodes.push(createMenuItemSeparatorNode());
                            separator++;
                        }
                        subMenuNodes.push(item);
                        if (subConfig.suffixSeparator) {
                            subMenuNodes.push(createMenuItemSeparatorNode());
                            separator++;
                        }
                    }
                });
                // 有效节点大于0, 则创建子菜单
                if (subMenuNodes.length - separator > 0) {
                    const subMenuNode = createMenuItemSubMenuNode(); // 子菜单容器
                    subMenuNodes.forEach(item => subMenuNode.appendChild(item));
                    node.appendChild(subMenuNode);
                }
            }
            if (config.click.enable) {
                if (config.click.callback) node.addEventListener('click', async e => await config.click.callback(e, id), true);
                else {
                    const handlers = [];
                    config.click.tasks.forEach((task) => {
                        if (TASK_HANDLER[task.type]) handlers.push(async e => TASK_HANDLER[task.type](e, id, task.params));
                    });
                    node.addEventListener('click', e => {
                        handlers.forEach((handler) => handler(e));
                    }, true);
                }
            };
            break;
        default:
            return null;
    }
    return node;
}

/**
 * 右键菜单初始化
 * @param {Array} configs 菜单项配置
 * @param {String} id 块 ID
 * @param {String} type 块类型
 * @param {String} subtype 块子类型
 * @returns {Array} 菜单项节点列表
 * @returns {null} 无菜单项
 */
function menuInit(configs, id, type, subtype) {
    let menuNodes = [];
    let separator = 0; // 分隔线数量
    let language = window.theme.languageMode;
    configs.forEach(config => {
        const node = createMenuItemNode(language, config, id, type, subtype);
        // console.log(node);
        if (node) {
            if (node.className === 'b3-menu__separator') separator++;
            if (config.prefixSeparator && menuNodes.length > 0) {
                menuNodes.push(createMenuItemSeparatorNode());
                separator++;
            }
            menuNodes.push(node);
            if (config.suffixSeparator) {
                menuNodes.push(createMenuItemSeparatorNode());
                separator++;
            }
        }
    });
    // 有效节点大于 0, 则创建菜单
    return menuNodes.length - separator > 0 ? menuNodes : null;
}

/**
 * 右键菜单管理
 */
class CommonMenuObserver {
    constructor(
        // 回调函数
        // REF [MutationObserver.MutationObserver() - Web API 接口参考 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver/MutationObserver)
        fn_callback,
        observerConfig = { // 节点监听配置
            // REF [MutationObserverInit | MDN](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver/observe#parameters)
            childList: true,
            subtree: false,
        },
    ) {
        this.menuNode = window.siyuan.menus.menu.element;
        this.menuLoaded = false; // 原菜单是否加载完成
        this.menuItemLoaded = false; // 菜单项是否加载完成
        this.config = observerConfig;
        this.observer = new MutationObserver(fn_callback);
        this.observe = (target = this.menuNode, options = this.config) => this.observer.observe(target, options);
        this.takeRecords = () => this.observer.takeRecords();
        this.disconnect = () => this.observer.disconnect();
    }
}
