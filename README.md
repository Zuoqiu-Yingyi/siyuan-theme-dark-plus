# 🌙Dark+

<center>

![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/Zuoqiu-Yingyi/siyuan-theme-dark-plus?include_prereleases&style=flat-square)
![GitHub Release Date](https://img.shields.io/github/release-date/Zuoqiu-Yingyi/siyuan-theme-dark-plus?style=flat-square)
![GitHub](https://img.shields.io/github/license/Zuoqiu-Yingyi/siyuan-theme-dark-plus?style=flat-square)
![GitHub last commit](https://img.shields.io/github/last-commit/Zuoqiu-Yingyi/siyuan-theme-dark-plus?style=flat-square)
![GitHub repo size](https://img.shields.io/github/repo-size/Zuoqiu-Yingyi/siyuan-theme-dark-plus?style=flat-square)
![hits](https://hits.b3log.org/Zuoqiu-Yingyi/siyuan-theme-dark-plus.svg)
![GitHub all releases](https://img.shields.io/github/downloads/Zuoqiu-Yingyi/siyuan-theme-dark-plus/total?style=flat-square)

</center>

[思源笔记](https://github.com/siyuan-note/siyuan)的一款暗黑主题  
A dark theme of [SiYuan Note](https://github.com/siyuan-note/siyuan).

现已上架[思源笔记社区集市](https://github.com/siyuan-note/bazaar), 如果您需要订阅[思源笔记](https://github.com/siyuan-note/siyuan)增值服务，欢迎使用我的推荐码: **h0sc9rc**  
It is now on the shelves of the [Siyuan Notes Community Bazaar](https://github.com/siyuan-note/bazaar). If you need to subscribe to the value-added services of [siyuan note](https://github.com/siyuan-note/siyuan/blob/master/README_en_US.md), please use my referral code: **h0sc9rc**

## 预览 | PREVIEW

![preview](./preview.png)


## 介绍 | INTRODUCTION

- 指向到思源 Web 静态文件服务目录的超链接显示图标  
  Hyperlinks to the Siyuan Web Static File Service directory displays icons
  - `assets/`: 资源文件目录 | Asset file directory
    - `data/**/assets/`
  - `emojis/`: 表情文件目录 | Emoji file directory
    - `data/emojis/`
  - `widgets/`: 挂件文件目录 | Widget file directory
    - `data/widgets/`
  - `appearance/`: 外观文件目录 | Appearance file directory
    - `conf/appearance/`
  - `export/`: 导出文件目录 | Export file directory
    - `temp/export/`
- 指向资源文件目录下常见文件的超链接显示图标  
  Hyperlinks to common files under the resource file directory display icons
  - Word
  - PowerPoint
  - Excel
  - Image
  - Audio
  - Video
  - ZIP
- 在其他主题中引用本主题模块  
  Reference this theme modules in other themes.
  - 在 `<工作空间>/conf/appearance/themes/Dark+/theme.css` 文件中直接粘贴所需模块到其他主题的 `theme.css` 文件或 `custom.css` 文件中  
    Paste the desired module into `theme.css` file or `custom.css` file for another theme in the `<workspace>/conf/appearance/themes/Dark+/theme.css` file.
  - 在其他主题中引用本主题模块时, 自定义配置文件 `<工作空间>/data/widgets/custom.css` 同样有效  
    Custom configuration files `<workspace>/data/widgets/custom.css` also work when this theme modules were referenced in other theme modules.
- 使用 URL 参数 `id=<内容块 ID>` 从浏览器外跳转到 Web 端的指定块(必须已经打开至少一个页签)  
  Jump from outside the browser to a specified block on the web side using the URL parameter `id=<content block ID>` (at least one tab must already be open)
  - 示例: `http(s)://host:port/stage/build/desktop/?id=20220128124308-bancmue`  
    exanple: `http(s)://host:port/stage/build/desktop/?id=20220128124308-bancmue`
- 使用超链接设置块属性  
  Use hyperlinks to set block attributes.
  - `超文本引用`: 指向想要设置块属性的块的超链接  
    `href`: A hyperlink to the block for which you want to set the block attributes.
    - 示例 | example: `siyuan://blocks/20220213230830-g1amobi`
  - `标题`: `json` 格式的一组键值对  
    `title`: A set of key-value pairs in `json` format.
      - 示例 | example: `{"memo": "timestamp", "custom-time": "00:00:01"}`
  - 使用快捷键 <kbd>Ctrl + 鼠标中键</kbd> 单击超链接设置自定义块属性  
    Use the shortcut keys <kbd>Ctrl + Middle Mouse Button</kbd> click the hyperlink to set the custom block attributes.
- 使用快捷键 <kbd>Ctrl + 鼠标中键</kbd> 单击视频块将当前时间戳写入剪贴板  
  Use the shortcut keys <kbd>Ctrl + Middle Mouse Button</kbd> click the video block to write the current timestamp to the clipboard.
- 块自定义属性
  Block custom attributes.
  - `auto-num-h`: 属性名 | key
    - `0`: 属性值 | value
    - 适用于文档块 | Applies to document blocks
    - 取消该文档的自动编号 | Cancels the automatic numbering of the document.
  - `auto-num-f`: 属性名 | key
    - `图`: 属性值 | value
    - `Fig.`: 属性值 | value
    - `figure`: 属性值 | value
    - `Figure`: 属性值 | value
    - `FIGURE`: 属性值 | value
    - 适用于文档块 | Applies to document blocks
    - 启用该文档中图片的自动编号 | Enable automatic numbering of pictures in the document.
  - `auto-num-t`: 属性名 | key
    - `表`: 属性值 | value
    - `Tab.`: 属性值 | value
    - `table`: 属性值 | value
    - `Table`: 属性值 | value
    - `TABLE`: 属性值 | value
    - 适用于文档块 | Applies to document blocks
    - 启用该文档中表格的自动编号 | Enable automatic numbering of tables in the document.
  - `title`: 属性名 | key
    - 适用于所有块 | Applies to all blocks
    - 在块的上方设置块标题 | Set the block title above the block.
  - `time`: 属性名 | key
    - `<时间戳|timestamp>`: 属性值 | value
      - 适用于视频块/音频块 | Applies to video blocks and audio blocks
      - 格式 | format
        - `ss`: `ss >= 0`
        - `mm:ss`: `mm >= 0 && 0 <= ss <= 59`
        - `hh:mm:ss`: `hh >= 0 && 0 <= mm <= 59 && 0 <= ss <= 59`
      - 在视频块/音频块中设置该自定义属性后, 按住 <kbd>Ctrl</kbd> 后单击视频/音频块可以跳转到该属性所设置的时间戳  
        After you set this custom attribute in a video/audio block, clicking the video/audio block while <kbd>ctrl-down</kbd> jumps to the point in time.
  - `type`: 属性名 | key
    - `danmaku`: 属性值 | value
      - 适用于所有块 | Applies to all blocks
      - 将块设置为滚动弹幕样式  
        Set the block to the scrolling danmaku block style.
    - `table`: 属性值 | value
      - 适用于列表块 | Applies to list blocks
      - 列表转换为表格 | convert list to table
      - 详情请参考 [土法列表表格 · 语雀](https://www.yuque.com/siyuannote/docs/yev84m)  
        For details, please refer to [Soil Law List Table - Yuque](https://www.yuque.com/siyuannote/docs/yev84m).
    - `图标题` 或 `表标题` | `table-title` or `table-title`: 属性值 | value
      - 适用于段落块 | Applies to paragraph blocks
      - 图标题/表标题自动计数 | Figure titles/table titles are counted automatically
  - `style`: 属性名 | key
    - 适用于所有块 | Applies to all blocks
    - 块样式 | block style
    - 设置后单击 <kbd>确认</kbd> 按钮将该自定义属性设置为块样式属性  
      After setting, click the <kbd>Confirm</kbd> button to set the custom attribute to a block style attribute.
  - `list-guides`: 属性名 | key
    - 适用于列表块 | Applies to list blocks
    - 属性值可以设置为任意字符(不可为空)  
      The attribute value can be set to any character(not nullable).
    - 启用动态列表辅助线 | Enable dynamic list guides
  - `table-width`: 属性名 | key
    - 适用于表格块 | Applies to table blocks
    - 设置表格宽度样式 | Sets the table width style.
    - `auto`: 属性值 | value
      - 表格宽度自动跟随文档宽度变化  
        The table width automatically follows the document width.
  - `writing-mode`: 属性名 | key
    - 适用于所有块 | Applies to all blocks
    - 文本排版模式 | text layout mode
    - 属性值 | attribute value
      - `horizontal-tb`
        - (默认)水平方向自上而下的书写方式 | (default)left-right-top-bottom
      - `vertical-rl`
        - 垂直方向自右而左的书写方式 | top-bottom-right-left
      - `vertical-lr`
        - 垂直方向自左而右的书写方式 | top-bottom-left-right
  - `font-family`: 属性名 | key
    - 适用于所有块 | Applies to all blocks
    - 字体 | font
    - 属性值: 字体名称  
      Attribute value: Font name
      - `等线`
      - `方正舒体`
      - `方正姚体`
      - `仿宋`
      - `黑体`
      - `华文彩云`
      - `华文仿宋`
      - `华文琥珀`
      - `华文楷体`
      - `华文隶书`
      - `华文宋体`
      - `华文细黑`
      - `华文新魏`
      - `华文行楷`
      - `华文中宋`
      - `楷体`
      - `隶属`
      - `宋体`
      - `微软雅黑`
      - `新宋体`
      - `幼圆`
  - 其他自定义样式  
    Other custom attributes.
    - 这些样式不会自动加载  
      These styles are not loaded automatically.
    - 将自定义样式名添加到 `<工作空间>/data/widgets/custom.js` 的 `custom.styles`  
      Add the custom style name to `custom.styles` in `<workspace>/data/widgets/custom.js`.
    - 在块的自定义属性中添加自定义样式名与样式值  
      Add custom style names and style values to the block's custom attributes.
    - 使用快捷键 <kbd>Ctrl + F1 / ⌘ + F1</kbd> 渲染当前所有块的自定义样式  
      Use the hot key <kbd>Ctrl + F1 / ⌘ + F1</kbd> to render the custom style of all current blocks.

## 自定义配置 | CUSTOM CONFIG

1. 创建文件 `<工作空间>/data/widgets/custom.css`  
   Create a file `<workspace>/data/widgets/custom.css`
2. 在文件 `<工作空间>/data/widgets/custom.css` 中定义的值将覆盖 `<工作空间>/conf/appearance/themes/Dark+/style/module/config.css` 中对应的值  
   The value defined in file `<workspace>/data/widgets/custom.css` overwrites the corresponding value in file `<workspace>/conf/appearance/themes/Dark+/style/module/config.css`.
3. 创建文件 `<工作空间>/data/widgets/custom.js`  
   Create a file `<workspace>/data/widgets/custom.js`
4. 在文件 `<工作空间>/data/widgets/custom.js` 中定义的值将覆盖 `<工作空间>/conf/appearance/themes/Dark+/script/module/config.js` 中对应的值  
   The value defined in file `<workspace>/data/widgets/custom.js` overwrites the corresponding value in file `<workspace>/conf/appearance/themes/Dark+/script/module/config.js`.

### 配置示例 | CONFIG EXAMPLE

#### custom.css

```css
/* 路径 | Path
 * <工作空间>/data/widgets/custom.css
 * <workspace>/data/widgets/custom.css
 */
:root {
    /* 标题层级标记与标题之间宽度 */
    --custom-h-mark-blank: 4px;

    /* 标题层级标记 */
    --custom-h1-mark: "¹";
    --custom-h2-mark: "²";
    --custom-h3-mark: "³";
    --custom-h4-mark: "⁴";
    --custom-h5-mark: "⁵";
    --custom-h6-mark: "⁶";

    /* --custom-h1-mark: "₁";
    --custom-h2-mark: "₂";
    --custom-h3-mark: "₃";
    --custom-h4-mark: "₄";
    --custom-h5-mark: "₅";
    --custom-h6-mark: "₆"; */

    /* 标题序号缩放 | Title ordinal scaling */
    --custom-h-num-font-size: 50%;

    /* 子标题及其对应大纲颜色 | Subheadings and their corresponding outline colors */
    --custom-h1-color: var(--b3-theme-on-background);
    --custom-h2-color: var(--b3-card-info-color);
    --custom-h3-color: var(--b3-card-warning-color);
    --custom-h4-color: var(--b3-card-success-color);
    --custom-h5-color: var(--b3-card-error-color);
    --custom-h6-color: var(--custom-color-8-3);

    /* 块引用标记 | Block reference mark */
    /* --custom-quote-l: "「";
    --custom-quote-r: "」"; */

    /* 
     * ⸢: U+2E22
     * ⸥: U+2E25
     */
    --custom-quote-l: "⸢";
    --custom-quote-r: "⸥";

    /* 背景图片 | Background image */
    --custom-background-image: url("/appearance/themes/Dark+/image/background (05).jpg");

    /* 对话框背景图片 | Dialog background image */
    /* 暂未使用 | Not used yet */
    --custom-background-image-dialog: url("/appearance/themes/Dark+/image/background (01).jpg");

    /* 背景图片滤波器 | Background image filter */
    /* --custom-backdrop-filter: blur(16px); */
    --custom-backdrop-filter: none;

    /* 悬浮面板滤波器(引用预览, 菜单) | Hover panel filters (reference preview, menu)*/
    /* --custom-backdrop-popover-filter: blur(2px); */
    --custom-backdrop-popover-filter: none;

    /* 悬浮预览窗口最小高度 | The minimum height of the hover preview window */
    --custom-popover-min-height: 50%;

    /* 悬浮预览窗口最大宽度 | The maximum width of the hover preview window */
    --custom-popover-max-width: 50%;

    /* 悬浮菜单宽度 | The width of popover menu */
    --custom-popover-menu-width: auto;

    /* 功能面板间隔距离 | Function panel spacing distance */
    --custom-panel-distance: 8px;

    /* 功能面板分隔线补偿距离 | Function panel dividers compensate for distance
     * 需要设置为 --custom-panel-distance 的负值 | A negative value of --custom-panel-distance is required
     */
    --custom-separator-distance-compensation: -8px;

    /* 超级块内边距 | The inner margin of the superblock */
    --custom-block-padding: 8px;

    /* 圆角弧度 | Rounded arc */
    --custom-border-radius: 4px;

    /* 列表辅助线弧度 | Rounded arc of list guides line */
    --custom-list-guides-line-radius: 16px;

    /* 列表辅助线宽度 | The width of list guides line */
    --custom-list-guides-line-width: 2px;

    /* 列表辅助线与上层节点的接缝 | The seams between the list guides line and the upper layer nodes */
    --custom-list-guides-line-top: -4px;

    /* 列表辅助线与本层节点的接缝 | The seams between the list guides line and the local layer nodes */
    --custom-list-guides-line-right-t: calc(22px + 5em / 16);
    --custom-list-guides-line-right-u: calc(22px + 5em / 16);
    --custom-list-guides-line-right-o: calc(14px + 1em);

    /* 透明组件颜色 | Transparent component color */
    --custom-transparent-lighter: #3338;
    --custom-transparent-light: #222A;
    --custom-transparent: #222C;
    --custom-transparent-deep: #222D;
    --custom-transparent-deeper: #222E;

    /* 不透明的组件颜色 | Opaque component color */
    --custom-components-light: #444;
    --custom-components: #222;
    --custom-components-deep: #111;

    /* 左右菜单栏(功能坞)背景颜色 | Left and right menu bar (dock) background color */
    --custom-dock-left-background-color: var(--custom-transparent);
    --custom-dock-right-background-color: var(--custom-transparent);

    /* 顶部工具栏背景颜色 | The background color of the top toolbar */
    --custom-tool-bar-background-color: var(--custom-transparent);

    /* 编辑区背景颜色 | The background color of the edit area */
    --custom-editor-background-color: var(--custom-transparent);

    /* 编辑区标题栏背景颜色 | The background color of the edit area title bar */
    --custom-editor-title-bar-background-color: transparent;

    /* 编辑区导航栏(面包屑)背景颜色 | The background color of the edit area navigation bar (breadcrumbs) */
    --custom-editor-breadcrumb-bar-background-color: var(--custom-components);

    /* 编辑区内边距 | Padding of editor pannel */
    --custom-editor-padding-left: 24px;
    --custom-editor-padding-right: 24px;

    /* 编辑区页签栏背景颜色 | The background color of the  edit area tab bar */
    --custom-tab-bar-background-color: var(--custom-transparent);

    /* 弹出窗口背景颜色 | The background color of the popover */
    --custom-popover-background-color: var(--custom-editor-background-color);

    /* 弹出窗口标题栏背景颜色 | The background color of the popover title bar */
    --custom-popover-title-bar-background-color: var(--custom-editor-title-bar-background-color);

    /* 弹出窗口导航栏(面包屑)背景颜色 | The background color of the popover navigation bar (breadcrumbs) */
    --custom-popover-breadcrumb-bar-background-color: var(--custom-editor-breadcrumb-bar-background-color);


    /* iframe 块背景颜色 | The background color of iframe block */
    --custom-block-iframe-background-color: var(--custom-transparent);

    /* 代码块背景颜色 | The background color of code block */
    --custom-block-code-background-color: var(--custom-transparent-lighter);

    /* 嵌入块背景颜色 | The background color of embed block */
    --custom-block-embed-background-color: var(--custom-transparent-lighter);

    /* 引述块背景颜色 | The background color of quote block */
    --custom-block-quote-background-color: var(--custom-transparent-lighter);

    /* 超级块背景颜色 | The background color of super block */
    --custom-block-super-background-color: var(--custom-transparent-lighter);

    /* 表格块背景颜色 | The background color of table block */
    --custom-block-table-background-color: transparent;
    /* 表头 | thead */
    --custom-block-table-thead-background-color: var(--custom-components-light);
    /* 奇数行 | odd line */
    --custom-block-table-odd-background-color: var(--custom-transparent-lighter);
    /* 偶数行 | even line */
    --custom-block-table-even-background-color: var(--custom-transparent-light);


    /* 弹出功能菜单背景颜色 | The background color of the popover function menu */
    --custom-popover-function-menu-background-color: var(--custom-transparent-deep);

    /* 弹出搜索菜单背景颜色 | The background color of the popover search menu */
    --custom-popover-search-menu-background-color: var(--custom-transparent-deep);


    /* 鲜明颜色 | Striking color */
    --custom-striking-color: var(--b3-font-color12);

    /* 数学公式整体缩放比例 | The overall scale of the mathematical formula */
    --custom-math-size: 100%;

    /* 数学公式上下标缩放比例 | The mathematical formula superscript scaling */
    --custom-math-sub-size: 100%;

    /* 数学公式编号的位置 | The position of the mathematical formula number */
    /* 固定在页面右侧 | Pinned to the right side of the page
     * - 公式过长时会被遮挡 | Formulas can be obscured when they are too long
     */
    --custom-math-tag-position: absolute;
    /* 跟随在公式右侧 | Follow to the right of the formula
     * - 公式过长时需要滑动滚动条才能看到编号 | Formulas that are too long require sliding the scroll bar to see
     */
    /* --custom-math-tag-position: relative; */

    /* 块引用标志颜色 | Block reference flag color */
    --custom-ref-mark-color: var(--b3-protyle-inline-link-color);

    /* 列表项聚焦颜色 | List item focus color */
    --custom-list-item-color: var(--b3-protyle-inline-link-color);

    /* 空行聚焦提示 | Blank line focus prompt */
    --custom-empty-focus-p: "´･-･)ﾉ㊫";
    --custom-empty-focus-c: "´･-･)ﾉ↹";
    --custom-empty-focus-t: "´･-･)ﾉ☑";
    --custom-empty-focus-u: "´･-･)ﾉ◉";
    --custom-empty-focus-o: "´･-･)ﾉ①";

    /* 空行提示 | Blank line prompt */
    --custom-empty-p: "这里是空的 (´･-･)ﾉ㊫";
    --custom-empty-c: "这里是空的 (´･-･)ﾉ↹";
    --custom-empty-t: "这里是空的 (´･-･)ﾉ☑";
    --custom-empty-u: "这里是空的 (´･-･)ﾉ◉";
    --custom-empty-o: "这里是空的 (´･-･)ﾉ①";

    /* 面板内字段名显示样式 | The field name display style within the panel */

    /* 折叠显示字段名 | Collapsed display when the field name is too long */
    /* --custom-backlink-display: table-cell; */
    /* --custom-bookmark-display: table-cell; */
    /* --custom-file-display: table-cell; */
    /* --custom-outline-display: table-cell; */
    /* --custom-tag-display: table-cell; */

    /* 过长时仅显示部分名称(默认样式) | Only partial names are displayed when too long (default style) */
    --custom-backlink-display: -webkit-box;
    --custom-bookmark-display: -webkit-box;
    --custom-file-display: -webkit-box;
    --custom-outline-display: -webkit-box;
    --custom-tag-display: -webkit-box;

    /* 文档树匹配标题颜色(文档标题尾匹配) | Document tree match header color (document end-of-title match) */
    /* * */
    --custom-doctree-end-asterisk-color: var(--b3-card-success-color);
    /* # */
    --custom-doctree-end-sharp-color: var(--b3-card-info-color);
    /* ? */
    --custom-doctree-end-question-color: var(--b3-card-warning-color);
    /* ! */
    --custom-doctree-end-exclamation-color: var(--b3-card-error-color);

    /* 文档树匹配文档标题颜色(文档标题头匹配) | Document tree matches document title color (document header match) */
    /* * */
    --custom-doctree-begin-asterisk-color: var(--custom-color-9-3);
    /* # */
    --custom-doctree-begin-sharp-color: var(--custom-color-8-3);
    /* ? */
    --custom-doctree-begin-question-color: var(--custom-color-4-0);
    /* ! */
    --custom-doctree-begin-exclamation-color: var(--custom-color-6-0);
    /* @ */
    --custom-doctree-begin-at-color: var(--custom-color-5-0);
    /* . */
    --custom-doctree-begin-period-color: #0000;

    /* 弹幕块移动周期 | Danmaku block movement cycle */
    --custom-type-danmaku-time: 16s;
}
```

#### custom.js

```js
/* 路径 | Path
 * <工作空间>/data/widgets/custom.js
 * <workspace>/data/widgets/custom.js
 */

export var config = {
    token: '', // API token, 无需填写
    regs: {
        // 正则表达式
        url: /^siyuan:\/\/blocks\/\d{14}\-[0-9a-z]{7}$/, // 思源 URL Scheme 正则表达式
        time: /^(\d+)(:[0-5]?[0-9]){0,2}$/, // 时间戳正则表达式
    },
    style: {
        enable: false, // 是否启用自定义样式渲染
        attribute: 'custom-style', // 自定义块属性名称
        styles: [
            // 渲染的自定义样式
            'font-size',
        ],
    },
    timestamp: {
        // 视频/音频时间戳
        enable: true, // 是否启用时间戳
        attribute: 'custom-time', // 自定义块属性名称
    },
    blockattrs: {
        // 块属性操作
        enable: true, // 是否启用块属性操作
    },
    hotkeys: {
        // 快捷键
        style: {
            render: {
                // 渲染(Ctrl + F1)
                ctrlKey: true,
                metaKey: true,
                shiftKey: false,
                altKey: false,
                key: 'F1',
            },
        },
        timestamp: {
            jump: {
                // 跳转到指定时间点(Ctrl + 单击)
                ctrlKey: true,
                metaKey: true,
                shiftKey: false,
                altKey: false,
                type: 'click',
            },
        },
        blockattrs: {
            set: {
                // 设置块属性(Ctrl + 鼠标中键)
                ctrlKey: true,
                metaKey: true,
                shiftKey: false,
                altKey: false,
                button: 1, // 鼠标中键
            }
        }
    },
};

```

## 计划 | TODO

- [ ] 介绍
  - [x] 自定义配置
    - [x] 教程
    - [x] 示例
  - [x] 在其他主题中引用样式
  - [x] 将所有的半透明背景颜色在配置中集中设置

## 开始 | START

### 自动安装 | AUTO INSTALL

该主题已在[思源笔记社区集市](https://github.com/siyuan-note/bazaar)上架, 可直接在集市中安装  
The theme has been put on the shelves at [SiYuan community bazaar](https://github.com/siyuan-note/bazaar) and can be installed directly in the Bazaar.

### 手动安装 | MANUAL INSTALL

在 [Releases](https://github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/releases) 中下载发行包, 解压后放到思源笔记 `<工作空间>/conf/appearance/themes/` 目录下  
Download the release package in [Releases](https://github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/releases), unzip it and place it in the `<workspace>/conf/appearance/themes/` directory of SiYuan Note.

## 参考 & 感谢 | REFERENCE & THANKS

| 作者 \| Author                                      | 项目 \| Project                                                                                                                                       | 许可证 \| License |
| :-------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------- |
| **[Achuan-2](https://github.com/Achuan-2)**         | [Achuan-2/siyuan-themes-tsundoku-dark: a editor theme for siyuan note](https://github.com/Achuan-2/siyuan-themes-tsundoku-dark)                       | *Unknown*         |
| **[roeseth](https://github.com/roeseth)**           | [roeseth/Siyuan-Golden-Topaz-Refined: A ported Golen Topaz theme for Siyuan note with tweaks](https://github.com/roeseth/Siyuan-Golden-Topaz-Refined) | *Unknown*         |
| **[Morganwan90](https://github.com/Morganwan90)**   | [Morganwan90/Lightblue-siyuan-theme](https://github.com/Morganwan90/Lightblue-siyuan-theme)                                                           | *Unknown*         |
| **[Crowds21](https://github.com/Crowds21)**         | [Crowds21/Cliff-Light](https://github.com/Crowds21/Cliff-Light)                                                                                       | *Unknown*         |
| **[Zhangwuji](https://ld246.com/member/Zhangwuji)** | [希望能够增加根据大纲生成思维导图的功能](https://ld246.com/article/1640259008838/comment/1640304551938#:~:text=fontxiugaidark.rar)                    | *Unknown*         |
| **[Morganwan90](https://github.com/Morganwan90)**   | [Morganwan90/Darkblue-siyuan-theme](https://github.com/Morganwan90/Darkblue-siyuan-theme)                                                             | *Unknown*         |
| **[leolee9086](https://github.com/leolee9086)**     | [leolee9086/cc-baselib](https://github.com/leolee9086/cc-baselib)                                                                                     | *Unknown*         |
| **[UserZYF](https://github.com/UserZYF)**           | [UserZYF/zhang-light](https://github.com/UserZYF/zhang-light)                                                                                         | *Unknown*         |

注: 排序不分先后  
ps: Sort in no particular order.

## 更改日志 | CHANGE LOGS

[CHANGELOG](./CHANGELOG.md)
