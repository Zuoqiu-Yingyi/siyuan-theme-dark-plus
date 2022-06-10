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
    getEditors,
    setBlockDOMAttrs,
} from './dom.js';
import { Iterator } from './misc.js';
import {
    getBlockByID,
    getBlockAttrs,
    setBlockAttrs,
    pushMsg,
    pushErrMsg
} from './api.js';

import {
    runCode,
    closeConnection,
} from '/appearance/themes/Dark+/app/jupyter/js/run.js';

var toolbarItemList = [];

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
        label = status.label;
        label += status.hotkey ? ` [${printHotKey(status.hotkey())}]` : '';
    }
    else { // 按钮没有多个状态
        icon = toolbarConfig.icon;
        label = toolbarConfig.label[language] || toolbarConfig.label.other;
        label += toolbarConfig.hotkey ? ` [${printHotKey(toolbarConfig.hotkey())}]` : '';
    }

    item.id = toolbarConfig.id;
    item.className = className || "toolbar__item b3-tooltips b3-tooltips__sw";
    item.setAttribute('aria-label', label);
    item.innerHTML = `<svg><use xlink:href="${icon}"></use></svg>`;
    return item;
}

/**
 * 恢复工具栏菜单项用户默认配置
 */
function itemStateLoad(id, states, node) {
    if (states[id]) {
        // 存在自定义配置
        const conf = states[id];
        // console.log(conf, conf.state, conf.state == null);
        const state = conf.state == null ? conf.default : conf.state;
        // console.log(state);
        if (state) setTimeout(() => node.click(), 0);
    }
}

/* 工具栏添加 */
function toolbarItemListPush(item) {
    toolbarItemList.push(item);
    let toolbar = document.getElementById('toolbar');
    let windowControls = document.getElementById('windowControls');
    let custom_toolbar = document.getElementById(config.theme.toolbar.id);

    if (window.theme.clientMode !== 'mobile' && toolbar && windowControls) {
        if (!custom_toolbar) {
            /* 自定义菜单项容器 */
            custom_toolbar = document.createElement('div');
            custom_toolbar.id = config.theme.toolbar.id;
            custom_toolbar.className = 'fn__flex';
            custom_toolbar.style.display = 'none';

            /* 更多按钮 */
            let more = createToolbarItem(config.theme.toolbar.more);
            more.addEventListener('click', () => {
                let status, language = window.theme.languageMode;
                if (custom_toolbar.style.display === 'none') {
                    // 显示自定义工具栏
                    status = config.theme.toolbar.more.status.unfold
                    custom_toolbar.style.display = null;
                    custom.theme.toolbar[config.theme.toolbar.more.id].state = true;
                }
                else {
                    // 隐藏自定义工具栏
                    status = config.theme.toolbar.more.status.fold
                    custom_toolbar.style.display = 'none';
                    custom.theme.toolbar[config.theme.toolbar.more.id].state = false;
                }
                more.setAttribute('aria-label', status.label[language] || status.label.other);
                more.firstChild.firstChild.setAttribute('xlink:href', status.icon);
                setTimeout(async () => saveCustomFile(custom), 0);
            });

            itemStateLoad(config.theme.toolbar.more.id, custom.theme.toolbar, more);
            toolbar.insertBefore(more, windowControls);
            toolbar.insertBefore(custom_toolbar, windowControls);
        }

        toolbarItemList = toolbarItemList.sort((a, b) => a.index - b.index);
        for (let item of toolbarItemList) {
            if (item.display) {
                let node = document.getElementById(item.id);
                custom_toolbar.append(node || item.node);
            }
        }
    }

    itemStateLoad(item.id, custom.theme.toolbar, item.node);
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

    // 在工具栏添加按钮
    let node = toolbarItemInsert(toolbarConfig);
    let listener = (e) => e.addEventListener('click', (_) => fn());

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
function createMenuItemInputNode(id = null, placeholder = '', value = '', style = '', className = 'b3-text-field fn__size200') {
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
    return span;
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

    // !config.type[type] // 主类型未定义, 不启用
    // !config.type[type].enable // 主类型被禁用, 不启用
    if (!config.type[type]
        || !config.type[type].enable
    ) return false;

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
        for (let attr of Object.keys(params)) {
            if (old_attrs[attr]) {
                // 如果属性不为空, 添加到末尾
                new_attrs[attr] = old_attrs[attr].replace(params[attr].regexp, params[attr].substr);
            }
        }
        setBlockDOMAttrs(id, new_attrs);
        setBlockAttrs(id, new_attrs);
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
        setBlockDOMAttrs(id, new_attrs);
        setBlockAttrs(id, new_attrs);
    },
    /* 覆盖整个属性值 */
    'attr-update': async (e, id, params) => {
        // console.log('attr-update');
        for (const [key, value] of Object.entries(params))
            if (!value) params[key] = '';
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
    /* 新窗口打开超链接 */
    'save-input-value': async (e, id, params) => {
        const value = document.getElementById(params.id).value;
        eval(`${params.key} = value`);
        saveCustomFile(custom);
    },
    /* 运行代码 */
    'jupyter-run-code': runCode,
    /* 关闭会话 */
    'jupyter-close-connection': closeConnection,
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
            const attrs = {bookmark: time}; // 待设置的书签属性
            IDs.forEach(id => setBlockAttrs(id, attrs));
            editors.forEach(editor => editor.protyle.model.headElement.lastElementChild.click());
            pushMsg(params.message.success);
        }
        else pushErrMsg(params.message.error);
    },
};

/**
 * 创建右键菜单项
 */
function createMenuItemNode(language, config, id, type, subtype, className = 'b3-menu__item') {
    let node;
    switch (config.mode.toLowerCase()) {
        case 'separator':
            if (!isBlockTypeEnabled(config, type, subtype)) return null;
            node = createMenuItemSeparatorNode();
            return node;
        case 'input':
            if (!isBlockTypeEnabled(config, type, subtype)) return null;
            node = document.createElement('button');
            node.className = className;
            node.appendChild(createMenuItemIconNode(config.icon));
            node.appendChild(createMenuItemInputNode(
                config.id,
                config.placeholder[language] || config.placeholder.other,
                eval(config.value),
            ));
            if (config.click.enable) {
                if (config.click.callback) node.addEventListener('click', async (e) => await config.click.callback(e, id));
                else {
                    let handlers = [];
                    config.click.tasks.forEach((task) => {
                        if (TASK_HANDLER[task.type]) handlers.push(async (e) => TASK_HANDLER[task.type](e, id, task.params));
                    });
                    node.addEventListener('click', (e) => {
                        handlers.forEach((handler) => handler(e));
                    });
                }
            };
            return node;
        case 'button':
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
                let subMenuNodes = [];
                let separator = 0; // 启用的子菜单项数量
                config.items.forEach((subConfig) => {
                    let item = createMenuItemNode(language, subConfig, id, type, subtype); // 创建子菜单项
                    if (item) {
                        subMenuNodes.push(item);
                        if (item.className === 'b3-menu__separator') separator++;
                    }
                });
                // 有效节点大于0, 则创建子菜单
                if (subMenuNodes.length - separator > 0) {
                    let subMenuNode = createMenuItemSubMenuNode(); // 子菜单容器
                    subMenuNodes.forEach((item) => subMenuNode.appendChild(item));
                    node.appendChild(subMenuNode);
                }
            }
            if (config.click.enable) {
                if (config.click.callback) node.addEventListener('click', async (e) => await config.click.callback(e, id));
                else {
                    let handlers = [];
                    config.click.tasks.forEach((task) => {
                        if (TASK_HANDLER[task.type]) handlers.push(async (e) => TASK_HANDLER[task.type](e, id, task.params));
                    });
                    node.addEventListener('click', (e) => {
                        handlers.forEach((handler) => handler(e));
                    });
                }
            };
            return node;
        default:
            return null;
    }
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
    let items = [];
    let language = window.theme.languageMode;
    configs.forEach((config) => {
        let item = createMenuItemNode(language, config, id, type, subtype);
        if (item) {
            if (config.prefixSeparator) items.push(createMenuItemSeparatorNode());
            items.push(item);
            if (config.suffixSeparator) items.push(createMenuItemSeparatorNode());
        }
    });
    return items.length > 0 ? items : null;
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
            // REF [MutationObserverInit | MDN](https://developer.mozilla.org/zh-CN/docs/conflicting/Web/API/MutationObserver/observe_2f2addbfa1019c23a6255648d6526387)
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
