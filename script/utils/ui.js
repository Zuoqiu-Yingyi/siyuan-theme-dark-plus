/* 图形界面工具 */

export {
    toolbarItemInit, // 工具栏项初始化
    toolbarItemChangeStatu, // 工具栏项状态改变
}

var toolbarItemList = [];

/* 工具栏添加 */
function toolbarItemListPush(item) {
    toolbarItemList.push(item);

    let toolbar = document.getElementById('toolbar');
    let referenceNode = document.getElementById('windowControls');
    if (toolbar && referenceNode) {
        toolbarItemList = toolbarItemList.sort((a, b) => a.index - b.index);
        for (let item of toolbarItemList) {
            let node = document.getElementById(item.id);
            if (node) toolbar.insertBefore(node, referenceNode);
            else toolbar.insertBefore(item.node, referenceNode);
        }
    }
}

/**
 * 工具栏插入菜单项
 * @toolbarConfig (object): 工具栏配置, 参考 config.js 中的 toolbar 属性
 * @return (HTML Node): 菜单项节点
 */
function toolbarItemInsert(toolbarConfig) {
    let node = document.createElement('BUTTON');
    node.id = toolbarConfig.id;
    node.className = "toolbar__item b3-tooltips b3-tooltips__sw";
    node.setAttribute('aria-label', toolbarConfig.label);
    node.innerHTML = `
        <svg>
            <use xlink:href="${toolbarConfig.icon}"></use>
        </svg>
    `;

    // let toolbar = document.getElementById('toolbar');
    // let referenceNode = document.getElementById('windowControls');
    // return toolbar.insertBefore(node.firstElementChild, referenceNode);
    toolbarItemListPush({
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
 * @return (void): 无返回值
 */
function toolbarItemChangeStatu(
    id,
    enable = false,
    mode = 'DIV',
    node = null,
    svgClassIndex = 0,
) {
    node = node || document.getElementById(id);
    switch (mode.toUpperCase()) {
        case 'SVG':
            if (svgClassIndex > 0) {
                if (enable) {
                    node.firstElementChild.classList.add(svgClassList[svgClassIndex]);
                }
                else {
                    node.firstElementChild.classList.remove(svgClassList[svgClassIndex]);
                }
            }
            break;
        case 'DIV':
        case 'BUTTON':
        default:
            if (enable) {
                node.classList.remove('toolbar__item--disabled');
            }
            else {
                node.classList.add('toolbar__item--disabled');
            }
            break;
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

    // 是否禁用该按钮
    toolbarItemChangeStatu(
        toolbarConfig.id,
        toolbarConfig.enable,
        'BUTTON',
        node,
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
    // 使用按钮渲染自定义样式
    node.addEventListener('click', (_) => fn());
    return fn;
}
