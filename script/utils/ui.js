/* 图形界面工具 */

export {
    toolbarItemInit, // 工具栏项初始化
    toolbarItemChangeStatu, // 工具栏项状态改变
    blockMenuInit, // 右键菜单初始化
    CommonMenuObserver, // 右键菜单管理
};

import {
    config,
    custom,
    saveCustomFile,
} from '../module/config.js';
import { printHotKey } from './hotkey.js';
import { setBlockDOMAttrs } from './dom.js';
import { Iterator } from './misc.js';
import {
    getBlockAttrs,
    setBlockAttrs,
} from './api.js';

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

/* 工具栏添加 */
function toolbarItemListPush(item) {
    toolbarItemList.push(item);
    let toolbar = document.getElementById('toolbar');
    let referenceNode = document.getElementById('windowControls');
    if (window.theme.clientMode !== 'mobile' && toolbar && referenceNode) {
        toolbarItemList = toolbarItemList.sort((a, b) => a.index - b.index);
        for (let item of toolbarItemList) {
            if (item.display) {
                let node = document.getElementById(item.id);
                if (node) toolbar.insertBefore(node, referenceNode);
                else toolbar.insertBefore(item.node, referenceNode);
            }
        }
    }

    if (custom.theme.toolbar[item.id]) {
        // 存在自定义配置
        const conf = custom.theme.toolbar[item.id];
        // console.log(conf, conf.state, conf.state == null);
        const state = conf.state == null ? conf.default : conf.state;
        // console.log(state);
        if (state) setTimeout(() => item.node.click(), 0);
    }
}

/**
 * 工具栏插入菜单项
 * @toolbarConfig (object): 工具栏配置, 参考 config.js 中的 toolbar 属性
 * @return (HTML Node): 菜单项节点
 */
function toolbarItemInsert(toolbarConfig) {
    let node = document.createElement('BUTTON');
    let language = window.theme.languageMode;
    let label = toolbarConfig.label[language] || toolbarConfig.label.other;
    label += toolbarConfig.hotkey ? ` [${printHotKey(toolbarConfig.hotkey())}]` : '';

    node.id = toolbarConfig.id;
    node.className = "toolbar__item b3-tooltips b3-tooltips__sw";
    node.setAttribute('aria-label', label);
    node.innerHTML = `
        <svg>
            <use xlink:href="${toolbarConfig.icon}"></use>
        </svg>
    `;

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
 * @type (string): 工具栏项类型
 * @node (element): 工具栏项节点
 * @svgClassIndex (int): svg 样式索引
 * @listener (function): 监听器
 * @return (void): 无返回值
 */
function toolbarItemChangeStatu(
    id,
    enable = false,
    mode = 'DIV',
    node = null,
    svgClassIndex = 0,
    listener = null,
) {
    node = node || document.getElementById(id);
    if (node) {
        switch (mode.toUpperCase()) {
            case 'SVG':
                if (svgClassIndex > 0) {
                    if (enable) {
                        node.firstElementChild.classList.add(svgClassList[svgClassIndex]);
                    }
                    else {
                        node.firstElementChild.classList.remove(svgClassList[svgClassIndex]);
                    }
                    if (custom.theme.toolbar[id]) {
                        custom.theme.toolbar[id].state = enable;
                        setTimeout(async () => saveCustomFile(custom), 0);
                    }
                }
                break;
            case 'DIV':
            case 'BUTTON':
            default:
                if (enable) {
                    node.classList.remove('toolbar__item--disabled');
                    listener && listener();
                }
                else {
                    node.classList.add('toolbar__item--disabled');
                    recreateNode(node);
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
    let listener = () => node.addEventListener('click', (_) => fn());

    // 是否禁用该按钮
    toolbarItemChangeStatu(
        toolbarConfig.id,
        toolbarConfig.enable,
        'BUTTON',
        node,
        undefined,
        listener,
    )

    // 是否设置颜色
    if (svgClassIndex > 0) {
        toolbarItemChangeStatu(
            toolbarConfig.id,
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
function createMenuItemIconNode(href = '#', style = null, className = 'b3-menu__icon') {
    let node = document.createElement('div');
    // 创建 svg 标签再添加 use 无法渲染
    node.innerHTML = `<svg class="${className}" style="${style}"><use xlink:href="${href}"></use></svg>`;
    return node.firstElementChild;
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
        window.theme.openNewWindow(
            undefined,
            undefined,
            Object.assign(params, { id: id }),
            config.theme.window.open.windowParams,
        );
    },
    /* 在新窗口打开编辑器 */
    'window-open-editor': async (e, id, params) => {
        window.theme.openNewWindow(
            'editor',
            undefined,
            Object.assign(params, { id: id }),
            config.theme.window.open.windowParams,
            config.theme.window.open.editor.path.index,
        );
    },
};

/**
 * 创建右键菜单项
 */
function createMenuItemNode(language, config, id, type, subtype, className = 'b3-menu__item') {
    switch (config.mode.toLowerCase()) {
        case 'separator':
            if (!isBlockTypeEnabled(config, type, subtype)) return null;
            return createMenuItemSeparatorNode();
        case 'button':
            if (!isBlockTypeEnabled(config, type, subtype)) return null;
            let node = document.createElement('button');
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
function blockMenuInit(configs, id, type, subtype) {
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
