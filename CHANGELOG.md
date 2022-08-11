# 更改日志 | CHANGE LOG

## v1.2.6/2022-08-12

- [v1.2.5 <=> v1.2.6](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v1.2.5...v1.2.6)
- 为 Jupyter 全局配置的 Server 字段输入框添加有效性检查 | Add a check to the Server field of the Jupyter global config to make sure the input is a valid URL.
- 使用 `data-fullwidth="true"` 属性判断是否启用自适应宽度 | Use the `data-fullwidth="true"` attribute to determine whether to enable adaptive width.
  - REF: [siyuan-note/siyuan: #5468](https://github.com/siyuan-note/siyuan/issues/5468)
- 修复列表项脑图视图在发布工具中样式问题 | Fix the style issue of the list item in the publish tool.
- 调整分割线超链接标志样式 | Adjust the style of the separator link icon.
- 在块菜单中添加发布子菜单项 | Add a publish submenu item in the block menu.
  - [Zuoqiu-Yingyi/siyuan-publish: 思源笔记在线发布工具 | Siyuan Notes online publishing tool.](https://github.com/Zuoqiu-Yingyi/siyuan-publish)
- 调整超级块轮廓阴影颜色 | Adjust the shadow color of the super block.
- [#94](https://github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/issues/94) 使用兼容方案将文本写入剪贴板 | Use the compatibility scheme to write text to the clipboard.
- 调整面包屑样式选择器 | Adjust the style selector of the breadcrumb.
- 使用 `Less` 重构 `custom-render-danmaku.css` | Refactored `custom-render-danmaku.css` with `Less`.
- 为 `theme.js` 中加载的 `script` 标签设置 `defer` 属性 | Set the `defer` attribute of the `script` tag loaded in `theme.js` to `true`.
- 使用 `Less` 重构 `custom-position.css` | Refactored `custom-position.css` with `Less`.

## v1.2.5/2022-08-03

- [v1.2.4 <=> v1.2.5](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v1.2.4...v1.2.5)
- [#92](https://github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/issues/92) 修复搜索历史菜单背景颜色透明问题 | Fixed an issue where the background color of the search history menu was transparent.
- 使用 `Less` 重构 `custom-type-title.css` | Refactored `custom-type-title.css` with `Less`.
- 使用 `Less` 重构 `custom-type-table.css` | Refactored `custom-type-table.css` with `Less`.
- 使用 `Less` 重构 `custom-type-map.css` | Refactored `custom-type-map.css` with `Less`.
- 使用 `Less` 重构 `custom-table-width.css` | Refactored `custom-table-width.css` with `Less`.
- [#93](https://github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/issues/93) 修复 Monaco 编辑器编辑公式块无法保存问题 | Fixed an issue where the formula block cannot be saved in Monaco editor.
- 使用 `Less` 重构 `custom-render-scroll.css` | Refactored `custom-render-scroll.css` with `Less`.

## v1.2.4/2022-07-26

- [v1.2.3 <=> v1.2.4](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v1.2.3...v1.2.4)
- 使用快捷键 <kbd>Shift + Alt + B</kbd> 启动/关闭页签纵向排列功能 | Use the shortcut <kbd>Shift + Alt + B</kbd> to turn on/off the feature of tabs are arranged vertically.
- 动态加载样式支持在其他主题调用 | Dynamic loading of style support in other themes called.
- 移除动态加载样式文件对配置文件的引用 | Removes references to configuration files from dynamically loaded style filesRemoves references to configuration files from dynamically loaded style files.
- 使用 `Less` 重构 `custom-type-title.css` | Refactored `custom-type-title.css` with `Less`.
- [#90](https://github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/issues/90) 修复有序列表折叠时序号被遮挡问题 | Fixed an issue where the sequence numbers of folding ordered list were covered.
- 修复搜索对话框中预览面板代码语言选择菜单样式异常问题 | Fixed an issue where the style of the menu of the language selection in the preview panel of the search dialog is abnormal.
- 为浏览器中链接提供从新窗口打开功能 | Provides a function to open links in a new window in the browser.
- 移除列表表格视图中列表块的轮廓线 | Removes the outline line of the list block in the list table view.

## v1.2.3/2022-07-18

- [v1.2.2 <=> v1.2.3](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v1.2.2...v1.2.3)
- 使用 `Less` 重构 `custom-writing-modes.css` | Refactored `custom-writing-modes.css` with `Less`.
- [#84](https://github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/issues/84) 适配窗口自适应功能(v2.0.26) | Adapted the window-adaptive function (v2.0.26).
- 块引用计数元素鼠标悬浮放大 | Blockquote counting element mouse hover zooms in.
- 调整上下停靠栏按钮样式 | Adjusted the style of top dock and bottom dock.
- 为自定义工具栏项添加分割线 | Added dividers for custom tool bar items.
- 修复集市内容预览背景样式问题 | Fixed the background style of preview in the bazaar.
- 面包屑完整显示文档路径 | Breadcrumbs display the full path of the document.
- 重构不能公开的应用自定义配置信息加载方法 | Refactored the loading method of the app custom configuration information which cannot be exposed.
- 使用 `Less` 重构 `custom-width.css` | Refactored `custom-width.css` with `Less`.

## v1.2.2/2022-07-13

- [v1.2.1 <=> v1.2.2](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v1.2.1...v1.2.2)
- 修复块反链列表匹配关键词样式失效问题 | Fixed match keyword style invalid issue of block-backlink-list.
- [#81](https://github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/issues/81) 修复 PDF 标注悬浮预览动画问题 | Fixed PDF annotation floating preview animation issue.
- `Jupyter` 支持使用 `token` 认证 | `Jupyter` supports `token` authentication.
- 为部分按钮添加悬浮放大样式 | Add floating zoom style for some buttons.
- 调整强制刷新实现方案 | Adjust the refresh implementation scheme.
- 修复列表辅助线重叠问题 | Fixed list guides overlap issue.
- 修复 `Jupyter` 应用解析 svg 图片错误问题 | Fixed `Jupyter` app parse svg image error issue.

## v1.2.1/2022-07-11

- [v1.2.0 <=> v1.2.1](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v1.2.0...v1.2.1)
- 配置文件 `config.js` 有变更 | There are changes to the configuration file `config.js`.
- 为面包屑项添加边框 | Added a border to the breadcrumb items
- 使用 `Less` 重构 `docker.css` | Refactored `docker.css` with `Less`.
- 使用 `Less` 重构 `hover-menu.css` | Refactored `hover-menu.css` with `Less`.
- [#79](https://github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/issues/79) 修复嵌入块与数学公式块样式混淆问题 | Fixed a style conflict between the `blockquote` and `math` styles.
- 使用 `Less` 重构 `hover-preview.css` | Refactored `hover-preview.css` with `Less`.
- 使用 `Less` 重构 `hover-textarea.css` | Refactored `hover-textarea.css` with `Less`.
- 使用 `Less` 重构 `icon-zoom.css` | Refactored `icon-zoom.css` with `Less`.
- 使用 `Less` 重构 `math.css` | Refactored `math.css` with `Less`.
- 使用 `Less` 重构 `span-strikethrough.css` | Refactored `span-strikethrough.css` with `Less`.
- 使用 `Less` 重构 `panel-editor.css` | Refactored `panel-editor.css` with `Less`.
- 使用 `Less` 重构 `global.css` | Refactored `global.css` with `Less`.
- 使用 `Less` 重构 `panel-separator.css` | Refactored `panel-separator.css` with `Less`.
- 使用 `Less` 重构 `panel-file.css` | Refactored `panel-file.css` with `Less`.
- 使用 `Less` 重构 `panel-outline.css` | Refactored `panel-outline.css` with `Less`.
- 使用 `Less` 重构 `panel-graph.css` | Refactored `panel-graph.css` with `Less`.
- 修复浮窗预览窗口样式问题 | Fixed an issue with the floating preview window style.
- 使用 `Less` 重构 `span-file-annotation-ref.css` | Refactored `span-file-annotation-ref.css` with `Less`.
- 使用 `Less` 重构 `span-img.css` | Refactored `span-img.css` with `Less`.
- 使用 `Less` 重构 `span-link.css` | Refactored `span-link.css` with `Less`.
- 使用 `Less` 重构 `span-ref.css` | Refactored `span-ref.css` with `Less`.
- 使用 `Less` 重构 `tab-bar.css` | Refactored `tab-bar.css` with `Less`.
- 使用 `Less` 重构 `span-tag.css` | Refactored `span-tag.css` with `Less`.
- 将文件 `statusbar.css` 与 `toolbar.css` 重命名为 `status-bar.css` 与 `tool-bar.css` | Renamed `statusbar.css` and `toolbar.css` to `status-bar.css` and `tool-bar.css`.
- 修复快捷键 <kbd>Shift + Alt + 鼠标中键</kbd> 与快捷键 <kbd>Alt + 鼠标中键</kbd> 混淆问题 | Fixed an issue with the <kbd>Shift + Alt + Middle Mouse Button</kbd> and <kbd>Alt + Middle Mouse Button</kbd> key combinations.
- 捕获 `window.theme.runcmd` 函数在非 electron 环境时抛出的异常 | Catches the exception thrown by the function `window.theme.runcmd` in non-electron environments.
- 修复鼠标滚轮调整编辑器字号不一致问题 | Fixed the issue that the font size of the mouse wheel adjustment editor was inconsistent.

## v1.2.0/2022-07-03

- [v1.1.4 <=> v1.2.0](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v1.1.4...v1.2.0)
- 配置文件 `config.js` 有变更 | There are changes to the configuration file `config.js`.
- 使用 `Less` 重构 `block-code.css` | Refactored `block-code.css` with `Less`.
- 使用 `Less` 重构 `block-embed.css` | Refactored `block-embed.css` with `Less`.
- 使用 `Less` 重构 `block-heading.css` | Refactored `block-heading.css` with `Less`.
- 使用 `Less` 重构 `block-iframe.css` | Refactored `block-iframe.css` with `Less`.
- 使用 `Less` 重构 `block-list.css` | Refactored `block-list.css` with `Less`.
- 使用 `Less` 重构 `block-quote.css` | Refactored `block-quote.css` with `Less`.
- 使用 `Less` 重构 `block-super.css` | Refactored `block-super.css` with `Less`.
- 使用 `Less` 重构 `dialog.css` | Refactored `dialog.css` with `Less`.
- 新增编辑容器块 kramdown 源码功能 | Added kramdown source code editing feature for container block.
- 使用 `Less` 重构 `empty.css` | Refactored `empty.css` with `Less`.
- 使用 `Less` 重构 `fold.css` | Refactored `fold.css` with `Less`.
- 修复 `custom.js` 重复加载问题 | Fixed `custom.js` duplicate loading issue.
- 修复块置顶样式问题 | Fixed an issue with block top style.

## v1.1.4/2022-06-27

- [v1.1.3 <=> v1.1.4](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v1.1.3...v1.1.4)
- 配置文件 `config.js` 有变更 | There are changes to the configuration file `config.js`.
- 配置文件 `config.css` 有变更 | There are changes to the configuration file `config.css`.
- [#72](https://github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/issues/72) 修复全局关系图全屏模式样式 | Fixed the global graph full-screen mode style.
- 调整未打开文档时编辑区的样式 | Adjusted the style of the edit area when the document is not opened.
- 调整文档树折叠/展开按钮样式 | Adjusted the style of the document tree fold/unfold button.
- 将编辑文档 kramdown 源代码功能添加至文档的块菜单 | Added the kramdown source code function to the block menu of the document.
- 禁用非桌面端的 kramdown 源代码编辑功能 | Disable the kramdown source code editing function except the desktop client.
- 设置底部状态栏背景颜色 | Set the background color of the bottom status bar.
- 为 `theme.js` 文件中模块加载 URL 设置版本参数 | Add the version parameter to the module load URL in `theme.js`.

## v1.1.3/2022-06-18

- [v1.1.2 <=> v1.1.3](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v1.1.2...v1.1.3)
- 配置文件 `config.js` 有变更 | There are changes to the configuration file `config.js`.
- 配置文件 `config.css` 有变更 | There are changes to the configuration file `config.css`.
- 添加复制文档大纲功能的消息提示 | Add a message hint for the function of copying the document outline.
- [#34](https://github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/issues/34) 专注模式可选同时隐藏侧边停靠栏(默认不隐藏) | Focus mode optional to hide side docks at the same time (not hidden by default).
- 添加文档树面板折叠/展开小三角鼠标悬浮样式 | Add the mouse hover style of folding/expanding small triangle of the filetree panel.
- 保存用户 `记住当前浏览位置`, `显示标记文本`, `专注模式`, `只读模式` 开关状态 | Save the user `remember current browsing position`, `display marked text`, `focus mode`, `read-only mode` switch status.
- [#72](https://github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/issues/72) 调整全屏模式关系图样式 | Adjust the full-screen mode graph style.

## v1.1.2/2022-06-11

- [v1.1.1 <=> v1.1.2](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v1.1.1...v1.1.2)
- 配置文件 `config.js` 有变更 | There are changes to the configuration file `config.js`.
- [#34](https://github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/issues/34) 使用快捷键 <kbd>Shift + Alt + F</kbd> 启动/关闭专注模式 (折叠/展开功能面板) | Use the shortcut <kbd>Shift + Alt + F</kbd> to turn on/off the focus mode (collapse/expand the feature panels).
- 使用快捷键 <kbd>Shift + Alt + ↑/↓</kbd> 折叠/展开当前文档所有子标题 | Use the shortcut <kbd>Shift + Alt + ↑/↓</kbd> to collapse/expand all sub-headings of the current document.
- [#68](https://github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/issues/68) 添加 CSS 属性 `--custom-tab-bar-flex-wrap` 用于控制标签栏多行/单行排列 | Add CSS property `--custom-tab-bar-flex-wrap` to control the tab bar flex wrap.
- 为页签栏的右键菜单添加归档功能 | Add archive function to the right click menu of the tab bar.
- [#60](https://github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/issues/60) 修复编辑区 emojis 选择菜单多列问题 | Fix the multiple column issue of the emoji selection menu in the edit area.

## v1.1.1/2022-06-06

- [v1.1.0 <=> v1.1.1](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v1.1.0...v1.1.1)
- 配置文件 `config.js` 有变更 | There are changes to the configuration file `config.js`.
- 修复取消聚焦方法 `cancelFocalize` 无法终止问题 | Fixed the issue of function `cancelFocalize` can not terminate.
- 改进 Jupyter 消息缓存机制 | Improved the Jupyter message cache mechanism.
- 调整扩展工具栏的样式 | Adjusted the style of extension toolbar.
- 调整亮色主题中悬浮预览窗口背景透明度 | Adjusted the transparency of the floating preview window in light theme.
- 更换明亮主题默认背景图片 | Changed the default background image of light theme.
- 调整反链浮窗匹配项样式 | Adjusted the style of the matching item of the floating window.
- 只读模式对已打开的文档生效 | Only read mode will take effect on the opened document.
- 只读模式对悬浮窗口生效 | Only read mode will take effect on the floating windows.

## v1.1.0/2022-06-03

- [v1.0.5 <=> v1.1.0](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v1.0.5...v1.1.0)
- [#65](https://github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/issues/65) 修复 `/` 菜单多栏样式失效问题 | Fixed the issue of the `/` menu multi-column style being invalid.
- 调整代码块语言样式选择菜单颜色 | Adjusted the color of the code block language selection menu.
- 移除部分不能使用自定义字体的块字体菜单 | Removed some block font menus that cannot be used with custom fonts.
- 添加 Jupyter 会话管理功能 | Added Jupyter session management functionality.
- 添加 Jupyter 会话信息读写功能 | Added Jupyter session information read/write functionality.
- 调整代码块按钮位置 | Adjusted the position of the code block buttons.
- 实现 Jupyter 会话纯文本输出内容解析 | Implemented Jupyter session plain text output content parsing.
- 添加 Jupyter 服务认证失败提示 | Added Jupyter server authentication failure prompt.
- 实现 Jupyter 会话图片输出内容解析 | Implemented Jupyter session image output content parsing.
- 实现 Jupyter 魔术命令输出内容解析 | Implemented Jupyter magic commands output content parsing.
- 调整 Jupyter 错误输出样式 | Adjusted the style of Jupyter error output.
- 修复 Jupyter 序号错误 | Fixed the Jupyter numbering error.
- 修复删除 Jupyter 活动内核时更改文档信息的问题 | Fixed the issue of changing the document information when deleting the Jupyter active kernel.
- 添加 `No Kernel` 标识 | Added the `No Kernel` tag.
- 调整 Jupyter 序号计数方案 | Adjusted the Jupyter numbering scheme.
- 调整菜单项文案 | Adjusted the menu item text.
- 调整 Jupyter `display_data` 类型消息解析策略 | Adjusted the Jupyter `display_data` type message parsing strategy.

## v1.0.5/2022-05-31

- [v1.0.4 <=> v1.0.5](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v1.0.4...v1.0.5)
- 配置文件 `config.css` 有变更 | There are changes to the configuration file `config.css`.
- 添加块自定义属性 `custom-position: top` 与 `custom-position: bottom` | Added `custom-position: top` and `custom-position: bottom` custom attributes to block.
  - `custom-position: top`: 将块固定到父容器顶部 | Pin the block to the top of the parent container
  - `custom-position: bottom`: 将块固定到父容器底部 | Pin the block to the bottom of the parent container
- [#63](https://github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/issues/63) 修复搜索与替换对话框输入框样式问题 | Fix the style of the search and replace dialog input box.
- 重构全局监听器事件处理方案 | Refactored global event listener handling scheme.
- 修复取消聚焦功能 | Fix the feature of canceling focus.
- 优化全局监听器事件处理方案 | Optimized global event listener handling scheme.

## v1.0.4/2022-05-29

- [v1.0.3 <=> v1.0.4](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v1.0.3...v1.0.4)
- 复制大纲功能适配 `v2.0.13` 的 API 与 DOM | Adapted the copy outline function to the API and DOM of `v2.0.13`.
- 修复图标选择菜单搜索输入框宽度样式问题 | Fixed the width style of the icon selection menu search input.
- 修复编辑区的 `emojis` 选择菜单样式问题 | Fixed the style of the `emojis` selection menu in the edit area.
- 添加背景颜色变量 `--custom-background-color` | Added the background color variable `--custom-background-color`.
  - 需要先设置 `--custom-background-image: none;` | Need to set `--custom-background-image: none;` first.

## v1.0.3/2022-05-25

- [v1.0.2 <=> v1.0.3](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v1.0.2...v1.0.3)
- 可选使用 <kbd>Ctrl + 单击</kbc> 模拟单击面包屑进行聚焦 | Optional use <kbd>Ctrl + Click</kbd> to simulate clicking on a breadcrumb to focus.
- 重构对话框 CSS 选择器 | Refactored the CSS selector of the dialog.
- 修复用于解析思源超链接的正则表达式 | Fixed regexp for parsing Synergaia links.
- 在 `README.md` 中添加 Monaco Editor 中部分自定义快捷键介绍 | Add some custom shortcuts introduction for Monaco Editor in `README.md`.
- 为 `/` 菜单的子标题按钮添加颜色 | Add color for the subheading button of the `/` menu.
- 完整显示被钉住页签的标题 | Show the pinned tab's title completely.

## v1.0.2/2022-05-19

- [v1.0.1 <=> v1.0.2](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v1.0.1...v1.0.2)
- 配置文件 `config.css` 有变更 | There are changes to the configuration file `config.css`.
- 移除在新窗口打开的桌面版 Web 端的窗口菜单栏 | Removed the menu bar of desktop web side of opening in new window.
- 调整当前阅读进度标识的位置 | Adjusted the position of the current reading progress indicator.
- 兼容文档块 DOM 属性 `data-doc-type` 不为 `NodeDocument` 的情况 | Compatible with the DOM attribute `data-doc-type` is not `NodeDocument` in the case.
- 修复思源块聚焦超链接的样式(带有参数 `focus=1` 的 `siyuan` 协议的超链接) | Fixed the style of link of focusing the siyuan block (with parameter `focus=1` of the `siyuan` protocol link).
- 调整工具栏项的样式 | Adjusted the style of the toolbar item.
- 调整附加工具栏项激活样式 | Adjusted the style of the active additional toolbar item.
- 添加只读模式 | Added read-only mode.
- 重构获取大纲面板的方法 | Refactored the method of getting the outline panel.

## v1.0.1/2022-05-18

- [v1.0.0 <=> v1.0.1](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v1.0.0...v1.0.1)
- 配置文件 `config.css` 有变更 | There are changes to the configuration file `config.css`.
- 添加搜索结果匹配的关键词样式配置选项 | Add a configuration option for the style of the keyword in the search results.
- 修复打开新窗口工具栏按钮 | Fix the button of opening a new window in the toolbar.
- 记住 `更多` 按钮上次的状态 | Remember the last state of the `More` button.
- 更新 `README.md` 文件中自定义背景图片方案 | Update the custom background image scheme in the `README.md` file.
- 修复块滚动条跟随焦点功能 | Fix the function of the block scrollbar following the focus.
- 使用快捷键 <kbd>Ctrl + F5</kbd> 强制刷新页面 | Use the shortcut <kbd>Ctrl + F5</kbd> to force refresh the page.

## v1.0.0/2022-05-17

- [v0.9.9 <=> v1.0.0](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v0.9.9...v1.0.0)
- 统一移动界面大纲样式 | Unified the style of outline on mobile interface.
- 调整工具栏按钮样式与按钮激活样式 | Adjusted the style of toolbar buttons and the activation style of toolbar buttons.
- 调整工具栏按钮在窗口较窄时的样式 | Adjusted the style of toolbar buttons when the window is narrower.
- 移除侧边停靠栏的边框 | Removed the border of the sidebar dock bar.
- 调整历史记录面板背景颜色 | Adjusted the background color of the history panel.
- 调整划选文本背景颜色 | Adjusted the background color of the selected text.
- 为新窗口添加部分菜单项 | Added some menu items to new windows.

## v0.9.9/2022-05-16

- [v0.9.8 <=> v0.9.9](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v0.9.8...v0.9.9)
- 为资源块(挂件块, iframe 块, 视频块与音频块)添加`在新窗口打开资源`菜单项 | Add the `Open the resource in a New Window` menu item for resource blocks (widget blocks, iframe blocks, video blocks and audio blocks).
- 为子窗口添加窗口置顶/取消置顶菜单项 | Add the `Topmost` menu item for subwindows.
- 使用 <kbd>Shift + Alt + 鼠标中键</kbd> 单击文档在新窗口打开 [Monaco 编辑器](https://github.com/microsoft/monaco-editor)并编辑文档的 kramdown 源码 | Click on a document to open [Monaco Editor](https://github.com/microsoft/monaco-editor) in a new window and edit the kramdown source code of document using the <kbd>Shift + Alt + Middle Mouse Button</kbd>.
- 使用 API `getFullHPathByID` 获取文档的完整路径 | Use the API `getFullHPathByID` to get the full path of a document.
- 统一移动界面输入框样式 | Unified the style of input fields on mobile interface.
- 修复 Moncaco 编辑器编辑部分类型的块时缩进空格数不正确问题 | Fix the issue of the indentation space number when editing a part of type of block in Monaco Editor.

## v0.9.8/2022-05-13

- [v0.9.7 <=> v0.9.8](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v0.9.7...v0.9.8)
- 调整页签项图标的大小 | Adjusted the size of the tab icon.
- 调整页签中按钮控件样式 | Adjusted the style of the button in the tab.
- 使用快捷键 <kbd>Shift + Alt + E</kbd> 启用/关闭显示标记文本功能 | Use the shortcut <kbd>Shift + Alt + E</kbd> to enable/disable the feature of displaying mark text.
- 统一块属性与快捷键显示标记文本内容样式 | Unified the style of the block attribute and the shortcut to display the mark text.
- 修复页签项阴影遮挡上一行页签项问题 | Fixed the issue of the tab item shadow covering the previous line of the tab item.

## v0.9.7/2022-05-11

- [v0.9.6 <=> v0.9.7](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v0.9.6...v0.9.7)
- 修复在新窗口打开无法跳转非文档块问题 | Fixed an issue where opening in a new window could not jump to non-document blocks.
- 修复获得目标块方法运行时异常问题 | Fixed an issue where the getTargetBlock method would throw an exception.
- 调整被选择的文本背景颜色 | Changed the background color of the selected text.
- 带图标的页签完整显示 | The tab with an icon is fully displayed.
- 调整钉住的页签图标样式 | Adjusted the style of the pinned tab icon.
- 修复使用 URL 参数以非聚焦模式跳转块不稳定问题 | Fixed an unstable issue where jumping to a block using a URL parameter would not be stable.
- 鼠标悬浮在页签关闭按钮时突出显示 | The close button is highlighted when the mouse hovers over it.
- 调整代码块导出预览样式 | Adjusted the style of the code block preview.
- 添加代码块行号与编辑区之间的分隔线 | Added a separator line between the line numbers and the code block editor.
- 为自定义工具栏添加 `更多` 按钮 | Added the `More` button to the custom toolbar.

## v0.9.6/2022-05-09

- [v0.9.5 <=> v0.9.6](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v0.9.5...v0.9.6)
- 配置文件 `config.js` 有变更 | There are changes to the configuration file `config.js`.
- 代码块功能按钮固定显示 | Fixed display code block function buttons.
- 使用自定义块属性 `custom-width` 将 iframe 窗口宽度设置为文档宽度 | Use the custom block attribute `custom-width` to set the width of the iframe window to the document width.
- 调整搜索对话框/面板搜索结果显示样式 | Adjust the style of the search dialog/panel search results display.
- 移除文档<kbd>更多</kbd>菜单中异常出现的块增强菜单项 | Remove abnormal menu items in the document <kbd>More</kbd> menu.
- 修复加载 `custom.js` 文件错误时无法加载 `custom.json` 文件的问题 | Fix the loading issue of the `custom.json` file when the `custom.js` file is not loaded.
- 优化默认用户配置初始化顺序 | Optimize the initialization order of the default user configuration.

## v0.9.5/2022-05-05

- [v0.9.4 <=> v0.9.5](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v0.9.4...v0.9.5)
- 强制显示块滚动条 | Blocks scrollbars are always visible.
- 调整当前文档浏览位置标识位置 | Adjust the position of the current document indicator.
- 部分功能移动端支持 | Some features are supported on mobile devices.
  - 记录当前文档浏览位置 | Record the current document position.
  - 打字机模式 | Typewriter mode.
- 修复移动端记录当前文档浏览位置问题 | Fix the issue of recording the current document position on mobile devices.
- 添加文档块菜单项: 清除浏览位置记录 | Add a menu item for document blocks: Clear the browsing position record.

## v0.9.4/2022-05-04

- [v0.9.3 <=> v0.9.4](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v0.9.3...v0.9.4)
- 配置文件 `config.js` 有变更 | There are changes to the configuration file `config.js`.
- 禁用新窗口的 Node.js 组件 | Disable Node.js components in new windows.
- 调整菜单分隔线颜色 | Adjust the color of the menu separator.
- 修复 IAL 解析器无法解析 `\` 字符的问题 | Fix the issue that IAL parser cannot parse `\` character.
- 新增记录当前浏览位置功能 | Add the ability to record the current browsing location.
- 新增跳转上次浏览位置功能 | Add the ability to jump to the last browsing location.
- 新增文档滑块跟随焦点功能 | Add the ability to follow the document slider with the focus.
- 代码块工具栏适配 `v2.0.4` | Code block toolbar adapts `v2.0.4`.
- 调整数据历史对话框样式 | Adjust data history dialog style.

## v0.9.3/2022-05-01

- [v0.9.2 <=> v0.9.3](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v0.9.2...v0.9.3)
- 移除列表块脑图视图标题块的左侧边线 | Remove left border of heading block which in list block with mind map view.
- 调整代码块样式 | Adjust code block style.
- 移除编辑器窗口的菜单栏 | Remove the menu bar of editor window.
- 修复新窗口聚焦模式无法退出问题 | Fix the issue that new window cannot exit focus mode.
- 修复代码块折叠样式异常问题 | Fix the issue that code block fold style is abnormal.
- 优化新窗口跳转与聚焦解决方案 | Optimize the solution of new window jump and focus.

## v0.9.2/2022-04-30

- [v0.9.1 <=> v0.9.2](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v0.9.1...v0.9.2)
- 配置文件 `config.js` 有变更 | There are changes to the configuration file `config.js`.
- 为复制当前文档大纲增加 API 解析方案 | Added API parsing scheme for copying the current document outline.
- 优化打字机模式监听器添加方案 | Optimized the typewriter mode listener addition scheme.
- Monaco Editor 编辑 Markdown 时禁用复制为富文本功能 | Disables the copy to rich text function when editing Markdown in Monaco Editor.
- 使用 <kbd>鼠标中键</kbd> 在新窗口打开收集箱中的链接 | Use <kbd>mouse middle button</kbd> to open links in the collection box in a new window.
- 使用 <kbd>Alt + 鼠标中键</kbd> 在 Monaco Editor 中打开收集箱内容 | Use <kbd>Alt + mouse middle button</kbd> to open the content of the collection box in Monaco Editor.
- 修复 `显示标记文本` 块菜单项重复问题 | Fixed the block menu item duplicate issue of `Display Marked Text`.
- 使用 API 查询思源内部资源文件路径 | Use API to query the path of siyuan asset file.
- 为工具栏按钮添加配置选项 `display: boolean` 控制是否显示 | Add configuration options `display: boolean` to control whether to display the toolbar button.
- 移除代码块下边距(适配思源 `v2.0.3`) | Remove the bottom margin of code block (adapted to SiYuan `v2.0.3`).
- 在块菜单中支持更多书写模式 | Support more writing modes in block menu.
- 更新书写模式示例 | Update the writing mode example.
- 修复使用 URL 参数 `id` 跳转时文档名不改变问题 | Fixed the issue of document title not changing when using URL parameter `id` to jump.

## v0.9.1/2022-04-24

- [v0.9.0 <=> v0.9.1](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v0.9.0...v0.9.1)
- 增加 Monaco Editor 状态指示图标 | Add a status icon for the Monaco Editor.
- 增加 Monaco Editor 复制当前页面链接功能 | Add a function to copy the current page's link to the clipboard in the Monaco Editor.
- 增加 Monaco Editor 复制当前页面完整链接功能 | Add a function to copy the current page's full link to the clipboard in the Monaco Editor.
- 在自述文件中添加项目依赖 | Add project dependencies in the README file.
- 新增 `calibre` URL Scheme 超链接图标 | Added `evernote` URL Scheme link icon.
- 增加 Monaco Editor 在 VS Code 中打开文件/目录功能 | Add a function to open file and directory in VS Code in the Monaco Editor.
- 视频时间戳功能支持单击视频内部触发 | Support click to trigger the video timestamp function in the video player.
- 调整收集箱面板背景颜色 | Adjust the background color of the collection panel.
- 为大纲导出功能添加列表块内联属性表 | Add IAL for the outline export function.
- 添加 `karmdown` 模式编辑文档功能 | Add a function to edit documents in `karmdown` mode.

## v0.9.0/2022-04-23

- [v0.8.2 <=> v0.9.0](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v0.8.2...v0.9.0)
- 配置文件 `config.js` 有变更 | There are changes to the configuration file `config.js`.
- 列表表格视图与脑图视图内列表项中嵌入块保持纵向排列 | The embedded blocks whitch in list items in a table view or a mind-map view are arranged in portrait orientation.
- 使用快捷键 <kbd>Ctrl/⌘ + 鼠标滚轮</kbd> 调整编辑区字体大小 | Use the shortcut keys <kbd>Ctrl/⌘ + Mouse Wheel</kbd> to adjust the edit area font size.
- [#10](https://github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/issues/10) 修复批注功能块属性无法写入问题 | Fix the issue that the annotation block properties can't be written.
- 调整鼠标悬浮列表项的背景颜色 | Adjust the background color of the list item when the mouse hovers.
- [#22](https://github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/issues/22) 添加自定义块属性 `mark: 显示` 与一项块菜单项以显示标记文本 | Add the custom block property `mark: display` and a block menu item to show the mark text.
- 添加介绍视频 | Add a introduction video.
- [#24](https://github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/issues/24) 修复块菜单面板超出可视窗口问题 | Fix the issue that the block menu panel is out of the visible window.
- 使用 <kbd>Alt + 鼠标中键</kbd> 单击块或资源文件链接, 在新窗口使用 Monaco 编辑器打开 | Use the shortcut key <kbd>Alt + Mouse Middle Button</kbd> to open the block or asset file in a new window using Monaco Editor.
- 增加 Monaco 编辑器读写本地文件功能 | Add the function to read and write local files using Monaco Editor.
- 增加 Monaco 编辑器另存为本地文件功能 | Add the function to save as local files using Monaco Editor.
- 修复 Monaco 编辑器字号设置失效问题 | Fix the issue that Monaco Editor font size setting is invalid.
- 增加 Monaco 编辑器下载网络文件功能 | Add the function to download the network file using Monaco Editor.
- 添加右键菜单项: 在编辑器中打开 | Add the context menu item: Open in Editor.
- 修复临时文件路径问题 | Fix the issue that the temporary file path is invalid.

## v0.8.2/2022-04-20

- [v0.8.1 <=> v0.8.2](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v0.8.1...v0.8.2)
- 配置文件 `config.js` 有变更 | There are changes to the configuration file `config.js`.
- 修复列表辅助线错位问题 | Fixed an issue where the list guides line was misplaced.
- 完善鼠标中键打开新窗口时获取块 ID 方法 | Improved the method to get the block ID when opening a new window with the middle mouse button.
- 修复更新块属性值为 `null` 时无法使用 API 取消块属性的问题 | Fixed an issue where the API could not cancel the block attribute value when the value is `null`.
- `/` 菜单分列显示 | The `/` menu is split into two columns.
- 为块移动对话框应用搜索列表样式 | The search list style is applied to the block move dialog.
- 自动加载/保存主题功能状态配置 | Automatically load and save the theme function status configuration.
- 添加 `在新窗口打开` 块菜单项 | Add the `Open in a new window` block menu item.
- 重构使用鼠标中键打开新窗口功能 | Refactor the function to open new windows using the middle mouse button.
- 修复设置页面列表项背景颜色问题 | Fix the background color of the list items in the settings page.
- 移除功能面板中各项的轮廓 | Remove the outline of each item in the function panel.
- 修复提及面板匹配关键字突出显示样式 | Fix the highlighting style of the keyword in the mention panel.

## v0.8.1/2022-04-19

- [v0.8.0 <=> v0.8.1](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v0.8.0...v0.8.1)
- 修复块菜单中的其他字体子菜单项无法选择问题 | Fixed an issue where other font submenu items in the block menu could not be selected.
- 修复块菜单中的其他字体无法保存问题 | Fixed an issue where other font could not be saved.
- 修复块菜单通用项分隔线冗余问题 | Fixed an issue where the common items separator line was redundant.

## v0.8.0/2022-04-18

- [v0.7.3 <=> v0.8.0](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v0.7.3...v0.8.0)
- 配置文件 `config.js` 有变更 | There are changes to the configuration file `config.js`.
- 使用快捷键 <kbd>Shift + Alt + M</kbd> 启用/关闭块标菜单增强功能 | Use the shortcut <kbd>Shift + Alt + M</kbd> to enable/disable the block menu enhancement feature.
- 统一移动端与桌面端搜索面板样式 | Unified the search panel style on mobile and desktop.

## v0.7.3/2022-04-16

- [v0.7.2 <=> v0.7.3](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v0.7.2...v0.7.3)
- 配置文件 `config.js` 有变更 | There are changes to the configuration file `config.js`.
- 添加配置选项 `editable` 控制新窗口的编辑器是否可编辑 | Add configuration option `editable` to control whether the editor is editable in new windows.
- 修复新窗口 URL 参数解析问题 | Fix the URL parameter parsing problem in new windows.
- 关闭通过 `打开新窗口` 工具栏按钮打开的新窗口的置顶功能 | Disable the pin feature of the new window opened by the `Open a new window` toolbar button.
- 优化工具栏按钮的提示信息 | Optimize the tooltip of the toolbar buttons.
- 优化反色模式的样式加载方式 | Optimize the style loading method of the inverted mode.
- 修复工具栏按钮快捷键提示信息显示问题 | Fix the shortcut tooltip display issue of the toolbar buttons.
- 使用自定义块属性将列表转换为思维导图 | Use the custom block attribute to convert the list to a mind map.
  - `custom-type: 导图`
  - `custom-type: 思维导图`
  - `custom-type: map`
  - `custom-type: mindmap`
- 使用快捷键 <kbd>Shift + Alt + G</kbd> 开启/关闭列表辅助线 | Use the shortcut <kbd>Shift + Alt + G</kbd> to open/close the list guides line.
- 修复列表表格单元格宽度问题 | Fix the width issue of the table cells in the list.
- 移除导图列表无效样式 | Remove the invalid style of the mind map list.
- 表格列表与导图列表内的容器块内容恢复纵向排列 | Restore the vertical layout of the container block content of the table list and mind map list.
- 将列表脑图横向滚动条更改为自动显示 | Change the horizontal scrollbar of the list mind map to auto show.
- 修复列表脑图单根节点时显示不完全问题 | Fix the incomplete display issue of the single root node of the list mind map.
- 支持使用文档块属性设置列表表格与列表脑图 | Support the setting of the table and mind map list with the document block attribute.

## v0.7.2/2022-04-15

- [v0.7.1 <=> v0.7.2](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v0.7.1...v0.7.2)
- 配置文件 `config.js` 有变更 | There are changes to the configuration file `config.js`.
- 配置文件 `config.css` 有变更 | There are changes to the configuration file `config.css`.
- 生成超级块动作的拖拽参考线使用鲜明颜色标记 | The draggable guide line for generating super blocks is marked with striking color.
- 扩展自定义块属性样式值 | The custom block attribute style values are extended.
- 完善使用 URL 参数 `id` 跳转指定块功能 | Improved the function of jumping to the specified block using URL parameter `id`.
- 添加在新窗口打开函数 | Added the function of opening in a new window.
- 使用 <kbd>鼠标中键</kbd> 与 <kbd>Shift + 鼠标中键</kbd> 打开新窗口 | Use <kbd>Middle Mouse Button</kbd> and <kbd>Shift + Middle Mouse Button</kbd> to open a new window.
- 优化新窗口打开方法 | Improved the method of opening in a new window.
- 新窗口默认置顶 | The new window is set to the top.

## v0.7.1/2022-04-09

- [v0.7.0 <=> v0.7.1](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v0.7.0...v0.7.1)
- 配置文件 `config.js` 有变更 | There are changes to the configuration file `config.js`.
- 添加网络图片 URL 列表 | Added network image URL list.
- 反色支持 iframe 与视频资源 | Inverted color feature supports iframes and video resources.
- 添加在 HTML 块的 shadowRoot 中获取当前块的工具 `This(customID)` | Added tool `This(customID)` to get the current block in the shadowRoot of HTML block.
- 修复列表中嵌入块辅助线问题 | Fixed the issue of guides with embed blocks in the list.
- 移除被禁用的工具栏项的功能 | Removed the function of disabled toolbar items.
- 调整工具栏按钮的顺序 | Reordered the toolbar buttons.

## v0.7.0/2022-04-08

- [v0.6.2 <=> v0.7.0](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v0.6.2...v0.7.0)
- 配置文件 `config.js` 有变更 | There are changes to the configuration file `config.js`.
- 完善打字机模式对代码块与表格的支持 | Improved support for code blocks and table blocks in the typewriter mode.
- 为自定义背景是图片功能添加随机开关与默认启用开关 | Added a random switch and a default switch for the background image feature.
- 在窗口工具栏中添加主题功能按钮 | Added theme buttons to the toolbar of window.
- 完善反色功能 | Improved the reverse color feature.
- 完善复制当前文档大纲功能的异常处理 | Improved the exception handling of the copy current document outline feature.
- 完善工具栏主题功能按钮 | Improved the theme buttons in the toolbar.

## v0.6.2/2022-04-06

- [v0.6.1 <=> v0.6.2](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v0.6.1...v0.6.2)
- 配置文件 `config.js` 有变更 | There are changes to the configuration file `config.js`.
- 配置文件 `config.css` 有变更 | There are changes to the configuration file `config.css`.
- 为集市资源自述文件预览设置背景颜色 | Sets the background color for the Bazaar Resource Readme Preview.
- 窗口较宽时搜索对话框并排显示搜索结果 | When the window is wide, the search results of the search dialog are displayed in a row.
- 调整搜索对话框关闭按钮, 避免被遮挡 | Adjust the close button of the search dialog to avoid being covered.
- 调整列表辅助线颜色为不透明颜色 | Adjust the color of the list helper line to opaque color.
- 添加 HTML 块中使用的工具函数 `runcmd(commands: string)` | Add the function `runcmd(commands: string))` to use in HTML blocks.
- 使用快捷键 <kbd>Shift + Alt + R</kbd> 使用随机背景图片(来源: [Beautiful Free Images & Pictures | Unsplash](https://unsplash.com/)) | Use the shortcut <kbd>Shift + Alt + R</kbd> to use the random background image (source: [Beautiful Free Images & Pictures | Unsplash](https://unsplash.com/)).
- 使用快捷键 <kbd>Ctrl + Shift + Alt + R</kbd> 使用随机内置背景图片 | Use the shortcut <kbd>Ctrl + Shift + Alt + R</kbd> to use the random built-in background image.
- 随机背景图片功能应用于全屏模式 | Random background image function applies to full screen mode.

## v0.6.1/2022-04-03

- [v0.6.0 <=> v0.6.1](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v0.6.0...v0.6.1)
- 配置文件 `config.css` 有变更 | There are changes to the configuration file `config.css`.
- 配置文件 `light.css` 有变更 | There are changes to the configuration file `light.css`.
- 修复菜单项输入框选择器使用错误问题 | Fixed an issue where the menu item input box selector was used incorrectly.
- 将默认主题模式设置为深色模式 | Set the default theme mode to dark mode.
- 改进浅色模式块引用波浪线动画图标 | Improved the wave animation icon for the light mode block reference element.
- 修复自定义配置文件 `custom-light.css` 与 `custom-dark.css` 失效问题 | Fixed an issue where the custom configuration file `custom-light.css` and `custom-dark.css` were not working.

## v0.6.0/2022-04-02

- [v0.5.7 <=> v0.6.0](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v0.5.7...v0.6.0)
- 配置文件 `config.css` 有变更 | There are changes to the configuration file `config.css`.
- 修复基础配色文件引用问题 | Fixed an issue with the underlying color matching file reference.
- 为虚拟引用元素添加背景色 | Adds a background color to the virtual reference element.
- 添加浅色模式 | Adds the mode of light color.
- 支持浅色模式与深色模式自定义样式配置文件引用 | Supports light mode and dark mode custom style profile references.
- 调整浅色主题背景图片 | Adjust the light theme background image.
- 为 `README.md` 添加深色模式与浅色模式预览图 | Add a dark mode and a light mode preview for the `README.md`.
- 完善自定义配置文件说明 | Refine custom profile descriptions.
- 添加弹出菜单中的输入框最小宽度设置项 `--custom-popover-menu-input-min-width` | Adds an input box minimum width setting item in the pop-up menu `--custom-popover-menu-input-min-width`.

## v0.5.7/2022-04-02

- [v0.5.6 <=> v0.5.7](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v0.5.6...v0.5.7)
- 配置文件 `config.js` 有变更 | There are changes to the configuration file `config.js`.
- 复制当前文档大纲可选择添加标题级别标记 `#` | Copy the current document outline with the option of adding a heading level mark `#`.
- 修复悬浮输入框透明度问题 | Fixed an issue with the transparency of the floating input box.

## v0.5.6/2022-03-31

- [v0.5.5 <=> v0.5.6](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v0.5.5...v0.5.6)
- 配置文件 `config.css` 有变更 | There are changes to the configuration file `config.css`.
- 修复 `.all-contributorsrc` 文件配置问题 | Fix the configuration problem of the `.all-contributorsrc` file.
- 完善图片, 音频与视频文件扩展名 | Improve the extension of the image, audio and video files.
- 调整面板分隔线 | Adjust the panel separator.
- 悬浮文本输入框背景颜色设置为半透明 | The background color of the floating text input box is set to translucent.
- 修复行内批注功能在移动端界面失效问题 | Fixed the issue that the inline annotation function failed in the mobile interface.
- 优化移动端侧边面板 | Optimize the mobile side panel.
- 添加标题折叠标记 | Add a title collapse mark.

## v0.5.5/2022-03-30

- [v0.5.4 <=> v0.5.5](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v0.5.4...v0.5.5)
- 配置文件 `config.js` 有变更 | There are changes to the configuration file `config.js`.
- 配置文件 `config.css` 有变更 | There are changes to the configuration file `config.css`.
- 修复复制当前文档大纲为有序列表时序号错误问题 | Fixed the issue that the number of the list was wrong when copying the current document outline as an ordered list.
- 视频时间戳跳转支持 Bilibili 与 YouTube | Video timestamp jump supports Bilibili and YouTube.
- 视频时间戳生成支持 Bilibili 与 YouTube | Video timestamp generation supports Bilibili and YouTube.
- 删除 iframe 块的 `custom-time` 自定义属性后使用快捷键 <kbd>Ctrl + 鼠标左键</kbd> 单击 iframe 块移除 Bilibili 与 YouTube 的视频时间戳 | Remove the Bilibili and YouTube video timestamp after removing the `custom-time` attribute of the iframe block and using the shortcut keys <kbd>Ctrl + Left Mouse Button</kbd> click the iframe block.
- 使用快捷键 <kbd>Shift + Alt + I</kbd> 将所有图片渲染为反色 | Use the shortcut keys <kbd>Shift + Alt + I</kbd> to render all images as inverted.
- 使用自定义块属性 `custom-render: invert` 将图片渲染为反色 | Use the custom block attribute `custom-render: invert` to render images as inverted.

## v0.5.4/2022-03-29

- [v0.5.3 <=> v0.5.4](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v0.5.3...v0.5.4)
- 配置文件 `config.js` 有变更 | There are changes to the configuration file `config.js`.
- 配置文件 `config.css` 有变更 | There are changes to the configuration file `config.css`.
- 使用快捷键 <kbd>Ctrl/⌘ + Shift + Alt + O</kbd> 复制当前文档大纲为有序列表 | Use shortcut key <kbd>Ctrl/⌘ + Shift + Alt + O</kbd> to copy the current document outline as an ordered list.
- 使用快捷键 <kbd>Ctrl/⌘ + Shift + Alt + U</kbd> 复制当前文档大纲为无序列表 | Use shortcut key <kbd>Ctrl/⌘ + Shift + Alt + U</kbd> to copy the current document outline as an unordered list.
- 使用快捷键 <kbd>Ctrl/⌘ + Shift + Alt + T</kbd> 复制当前文档大纲为任务列表 | Use shortcut key <kbd>Ctrl/⌘ + Shift + Alt + T</kbd> to copy the current document outline as a task list.
- 使用 [All Contributors · GitHub](https://github.com/all-contributors) 自动生成贡献者列表 | Use [All Contributors · GitHub](https://github.com/all-contributors) automatically generates a table of contributors.
- 调整图片预览窗口遮罩颜色 | Adjust the color of the image preview window mask.

## v0.5.3/2022-03-23

- [v0.5.2 <=> v0.5.3](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v0.5.2...v0.5.3)
- 配置文件 `config.css` 有变更 | There are changes to the configuration file `config.css`.
- 为对话框添加背景图片 | Add background image for dialogs.
- 修复块属性设置对话框头部颜色问题 | Fix the issue of the header color of the block attribute setting dialog.
- 将批注标题由四级标题调整为一级标题 | Change the title of notes from a fourth-level title to a first-level title.
- 调整块属性面板中自定义属性值标签的宽度为自适应 | Adjust the width of the label of the custom attribute value in the block attribute panel to be adaptive.

## v0.5.2/2022-03-21

- [v0.5.1 <=> v0.5.2](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v0.5.1...v0.5.2)
- 修复图文混排无法对齐问题 | Fixed the issue that mixed text and graphics could not be aligned.
- 修复图片尺寸调整控件偏移问题 | Fixed an issue with the offset of the image sizing control.
- 将 README.md 中 `<br>` 替换为 `<br/>` | Replaced `<br>` in README.md with `<br/>`.
- 添加图标题与表标题名称 `图片` 与 `表格` | Added the icon title and table title `图片` and `表格`.
- 调整使用自定义块属性 `type: 表标题` 的样式 | Adjusted the style of the custom block attribute `type: table-title`.
- 将 CSS 选择器 `[contenteditable]` 替换为 `[contenteditable][spellcheck]` | Replaced CSS selector `[contenteditable]` with `[contenteditable][spellcheck]`.

## v0.5.1/2022-03-18

- [v0.5.0 <=> v0.5.1](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v0.5.0...v0.5.1)
- 配置文件 `config.js` 有变更 | There are changes to the configuration file `config.js`.
- 配置文件 `config.css` 有变更 | There are changes to the configuration file `config.css`.
- 使用自定义块属性 `custom-render: scroll` 为过高的块设置滚动条 | Use the custom block attribute `custom-render: scroll` to set the scroll bar for blocks that are too tall.
- 将自定义块属性 `custom-type: danmaku` 重命名为 `custom-render: danmaku` | Rename the custom block attribute `custom-type: danmaku` to `custom-render: danmaku`.
- 修复滚动时表格头未遮盖部分元素问题 | Fix the issue of the table header not covering the part of the element when scrolling.
- 打字机模式添加代码块与表格块的单独开关 | Add a separate switch for code blocks and table blocks in the typewriter mode.
- 修复导出预览模式中非最顶级的标题自动编号问题 | Fix the issue of automatically numbering the non-top-level headings in the export preview mode.
- 使用自定义块属性 `custom-table-width`: `monospaced` 设置表格单元格等宽 | Use the custom block attribute `custom-table-width`: `monospaced` to set the table cell to be monospaced.

## v0.5.0/2022-03-17

- [v0.4.6 <=> v0.5.0](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v0.4.6...v0.5.0)
- 配置文件 `config.js` 有变更 | There are changes to the configuration file `config.js`.
- 配置文件 `config.css` 有变更 | There are changes to the configuration file `config.css`.
- 调整文档标签样式 | Adjusted the style of the document tags.
- 新增 `evernote` URL Scheme 超链接图标 | Added `evernote` URL Scheme link icon.
- 新增行内评论功能 | Added inline comment function. (REF: [siyuan-note/siyuan-comment at main · langzhou/siyuan-note · GitHub](https://github.com/langzhou/siyuan-note/tree/main/siyuan-comment))
- 调整行内评论样式 | Adjusted the style of the inline comment.
- 修复行内评论与其他行内元素重叠问题 | Fixed the overlap problem of the inline comment and other inline elements.

## v0.4.6/2022-03-15

- [v0.4.5 <=> v0.4.6](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v0.4.5...v0.4.6)
- 配置文件 `config.js` 有变更 | There are changes to the configuration file `config.js`.
- 配置文件 `config.css` 有变更 | There are changes to the configuration file `config.css`.
- 新增 `runcmd` URL Scheme 超链接图标 | Added `runcmd` URL Scheme link icon.
- 新增 [liquidtext](https://www.liquidtext.net/) 的 URL Scheme `lt` 超链接图标 | Added `lt` URL Scheme link icon for [liquidtext](https://www.liquidtext.net/).
- 调整部分图标样式 | Adjusted some icon styles.
- 打字机模式添加是否应用代码块的选项 | Added option to apply code block in typewriter mode.
- 完善搜索结果列表展示样式 | Improved search result list display style.
- 完善关键字匹配字段样式 | Improved keyword match field style.
- 添加文档定义属性 `render: index` 与 `render: content` | Added custom document attributes `render: index` and `render: content`.
- 新增文件(PDF)注释引用元素样式 | Added file (PDF) annotation reference element style.
- 特化思源内部超链接样式 | Specialized SiYuan internal link style.
- 将部分文件引用路径更改为绝对路径 | Change the partial file reference path to an absolute path.
- 调整导出中超链接样式 | Adjusted link style in export.
- 调整部分行级元素样式 | Adjusts the style of some inline elements.

## v0.4.5/2022-03-13

- [v0.4.4 <=> v0.4.5](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v0.4.4...v0.4.5)
- 配置文件 `config.js` 有变更 | There are changes to the configuration file `config.js`.
- 为可聚焦的思源内部超链接添加样式 | Add styles to the focused hyperlinks of siyuan.
- 使用快捷键 <kbd>Shift + Alt + T</kbd> 启动/关闭打字机模式 | Use the shortcut key <kbd>Ctrl/⌘ + F5</kbd> to turn on/off typewriter mode.
- 将快捷键触发事件由 `keydown` 更改为 `keyup` | Change the event of the shortcut key from `keydown` to `keyup`.
- 移除冗余配图, 新增元素对齐样式配图 | Remove redundant pictures, add element alignment style pictures.
- 修复自定义块属性 `custom-font-family` 中 `隶书` 字体名称错误 | Fix the font name of `隶书` in the custom block attribute `custom-font-family`.

## v0.4.4/2022-03-12

- [v0.4.3 <=> v0.4.4](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v0.4.3...v0.4.4)
- 配置文件 `config.css` 有变更 | There are changes to the configuration file `config.css`.
- 调整弹出菜单分隔线样式 | Adjust the style of the separator of the pop-up menu.
- 添加 SuperMemo URL Scheme(`sm:`) 图标 | Add the SuperMemo URL Scheme(`sm:`) icon.
- 调整上方菜单栏与下方菜单栏的背景颜色 | Adjust the background color of the top menu bar and the bottom menu bar.
- 更新文档图片 | Update the document image.
- 文档新增快捷键表格与自定义块属性表格 | A new shortcut table and a custom block attribute table have been added to the document.

## v0.4.3/2022-03-10

- [v0.4.2 <=> v0.4.3](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v0.4.2...v0.4.3)
- 配置文件 `config.css` 有变更 | There are changes to the configuration file `config.css`.
- 配置文件 `config.js` 有变更 | There are changes to the configuration file `config.js`.
- 调整搜索结果原文的高亮样式 | Adjust the highlight style of the original text of the search results.
- 更改自定义配置文件覆盖默认配置文件方案为递归覆盖 | Change the custom configuration file override the default configuration file solution to recursive overrides.
- 隔离不同应用的配置 | Isolate configurations for different apps.
- 修复列表转换为表格宽度异常问题 | Fixed an issue where the list was converted to table width exception.
- 为已完成任务列表项添加删除线 | Add strikethroughs to completed task list items.
- 统一标记样式在编辑器与导出预览的背景颜色 | Uniform the background color of mark in the editor and export preview panel.
- 调整删除线样式颜色 | Adjust the strikethrough style color.

## v0.4.2/2022-03-09

- [v0.4.1 <=> v0.4.2](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v0.4.1...v0.4.2)
- 配置文件 `config.js` 有变更 | There are changes to the configuration file `config.js`.
- 重构使用 URL 参数 `id` 跳转到指定块 | The refactoring of using the URL parameter `id` to jump to the specified block.
- 修复使用 URL 参数 `id` 跳转到指定块 | Fix the issue of using the URL parameter `id` to jump to the specified block.
- 移除失效的列表辅助线 | Removes the stale list guide.
- 修复使用超链接设置块属性无法解析非 ASCII 字符问题 | Fixed an issue where using hyperlinks to set block attributes could not parse non-ASCII characters.
- 添加护眼配色色卡(起点背景颜色) | Add eye-care color palette (Qidian background color).
- 调整搜索结果高亮字段样式 | Adjust the search result highlight field style.
- 移除失效的对代码块语言标签频闪问题的修复 | Remove a broken fix for strobe issues with language labels in code blocks.

## v0.4.1/2022-03-07

- [v0.4.0 <=> v0.4.1](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v0.4.0...v0.4.1)
- 配置文件 `config.css` 有变更 | There are changes to the configuration file `config.css`.
- 配置文件 `config.js` 有变更 | There are changes to the configuration file `config.js`.
- 设置更细粒度的功能开关 | Set more fine-grained function switches.
- 使用快捷键 <kbd>Shift + Alt + C</kbd> 复制当前文档 markdown 全文至剪贴板 | Use the shortcut keys <kbd>Shift + Alt + C</kbd> to copy the full markdown text of the current document to the clipboard.
- 使用快捷键 <kbd>Shift + Alt + X</kbd> 剪切当前文档 markdown 全文至剪贴板 | Use the shortcut keys <kbd>Shift + Alt + X</kbd> to cut the full markdown text of the current document to the clipboard.
- 使用快捷键 <kbd>Shift + Alt + D</kbd> 删除当前文档全部内容 | Use the shortcut keys <kbd>Shift + Alt + D</kbd> to delete the full content of the current documen.
- 添加图片元素的阴影 | Adds a shadow of a picture element.
- 优化列表转表格功能 | Optimized the list to table function.

## v0.4.0/2022-03-03

- [v0.3.8 <=> v0.4.0](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v0.3.8...v0.4.0)
- 配置文件 `config.css` 有变更 | There are changes to the configuration file `config.css`.
- 配置文件 `config.js` 有变更 | There are changes to the configuration file `config.js`.
- 更换公式编号默认样式 | Replace the formula numbering default style.
- 修复表格宽度自适应样式 | Fixed the table width adaptive style.
- 使用文档块的自定义属性 `custom-auto-num-h="0"` 取消指定文档的子标题自动编号 | Use the custom attribute of the document block `custom-auto-num-h="0"`  to unspecify the automatic numbering of Subheading.
- 使用文档块自定义属性 `custom-auto-num-f` 设置图片自动编号 | Use the document block custom attribute `custom-auto-num-f` to set the picture autonumbering.
  - `图`
  - `Fig.`
  - `figure`
  - `Figure`
  - `FIGURE`
- 使用文档块自定义属性 `custom-auto-num-t` 设置表格自动编号 | Use the document block custom attribute `custom-auto-num-t` to set the table autonumbering.
  - `表`
  - `Tab.`
  - `table`
  - `Table`
  - `TABLE`
- 使用文档块自定义属性 `custom-background` 设置自定义背景图片 | Use the document block custom attribute `custom-background` to set the custom background image.
- 自定义样式属性可以设置为多个值(使用空格分隔) | Custom style properties can be set to multiple values (separated by spaces).
- 使用自定义属性 `custom-title` 设置块标题 | Use the custom attribute `custom-title` to set the block title.
- 使用文档块自定义属性 `custom-render` 设置块渲染样式 | Use the custom attribute of document block `custom-render` to set the block rendering style.
  - `id`: 渲染每个块的块 ID | Renders the ID of each block.
  - `outline`: 渲染鼠标悬浮的块的轮廓 | Renders the outline of a hovering block.
- 使用快捷键 <kbd>Ctrl + F5</kbd> 重新加载整个窗口 | Use the hot key <kbd>Ctrl + F5</kbd> to reload the entire window.
- 使用快捷键 <kbd>Ctrl + 鼠标左键</kbd> 单击 Iframe 块或挂件块重新加载块内容 | Use the hot keys <kbd>Ctrl + Left Mouse Button</kbd> click the iframe block or the widget block to reload the block contents.
- 修复嵌入块背景颜色失效问题 | Fixed the issue where the background color of the embedded block does not work.
- 高亮鼠标悬浮的表格行 | Highlight the table row under the mouse.

## v0.3.8/2022-02-24

- [v0.3.7 <=> v0.3.8](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v0.3.7...v0.3.8)
- 修复特定文档名颜色渲染问题 | Fixed color rendering issue for specific document names.
- 修复列表内引用块辅助线错位问题 | Fixed the issue of misalignment of reference block guides in the list.

## v0.3.7/2022-02-20

- [v0.3.6 <=> v0.3.7](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v0.3.6...v0.3.7)
- 修复列表渲染为表格样式 | Fixed list rendering to table style.
- 添加各式图标折叠时的样式 | Adds a style for various icons when collapsed.
- 调整部分样式 | Adjust some of the styles.
- 列表相对于段落调整为 `2em` 缩进 | The list is adjusted to a `2em` indentation relative to the paragraph.
- 修复列表中的标题项对列表辅助线的干扰问题 | Fixed an issue where the header item in the list interfered with the list guides.

## v0.3.6/2022-02-18

- [v0.3.5 <=> v0.3.6](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v0.3.5...v0.3.6)
- 配置文件 `config.js` 有变更 | There are changes to the configuration file `config.js`.
- 使用快捷键 <kbd>Ctrl + 鼠标中键</kbd> 单击视频块将当前时间戳写入剪贴板 | Use the shortcut keys <kbd>Ctrl + Middle Mouse Button</kbd> click the video block to write the current timestamp to the clipboard.
- 添加时间戳超链接图标 | Add a timestamp hyperlink icon.

## v0.3.5/2022-02-16

- [v0.3.4 <=> v0.3.5](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v0.3.4...v0.3.5)
- 配置文件 `config.css` 有变更 | There are changes to the configuration file `config.css`.
- 将文件引用路径更改为绝对路径 | Change the file reference path to an absolute path.
- 为移动端背景图片添加半透明蒙版 | Add a translucent mask to the mobile background image.
- 使用自定义块属性 `custom-type`: `danmaku` 设置滚动弹幕块样式 | Use the custom block attribute `custom-type`: `danmaku` to set the scrolling danmaku block style.
- 钉住的标签页全部显示 | The pinned tabs are all displayed.
- 添加公式编号位置设置选项 `-custom-math-tag-position` | Adds formula numbering position setting options `-custom-math-tag-position`.
  - `absolute`: 公式过长时会被遮挡 | Formulas can be obscured when they are too long.
  - `relative`: 公式过长时需要滑动滚动条才能看到编号 | Formulas that are too long require sliding the scroll bar to see.
- 使用自定义块属性 `custom-list-guides`: `<任意值>` 设置列表辅助线 | Use the custom block attribute `custom-type`: `<Any value>` to set the list guides.
- 超级块鼠标悬浮时显示轮廓 | Displays an outline when the superblock is hovered.
- 使用自定义块属性 `custom-table-width`: `auto` 设置表格宽度自动跟随文档宽度 | Use the custom block attribute `custom-table-width`: `auto` to set the table width automatically follows the document width.

## v0.3.4/2022-02-14

- [v0.3.3 <=> v0.3.4](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v0.3.3...v0.3.4)
- 配置文件 `config.js` 有变更 | There are changes to the configuration file `config.js`.
- 使用快捷键 <kbd>Ctrl + 鼠标中键</kbd> 设置自定义块属性 | Use the shortcut keys <kbd>Ctrl + Middle Mouse Button</kbd> to set custom block properties.
- 视频时间戳更改为通过 API 查询块属性 | The video timestamp changes to query the block attributes through the API.

## v0.3.3/2022-02-13

- [v0.3.2 <=> v0.3.3](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v0.3.2...v0.3.3)
- 配置文件 `config.js` 有变更 | There are changes to the configuration file `config.js`.
- 视频/音频跳转到指定时间点 | The video/audio jumps to the specified point in time.

## v0.3.2/2022-02-12

- [v0.3.1 <=> v0.3.2](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v0.3.1...v0.3.2)
- 移除 Query 功能(可使用挂件 [Query](https://github.com/Zuoqiu-Yingyi/widget-query) 实现) | Remove the Query feature (This can be implemented using widget [Query](https://github.com/Zuoqiu-Yingyi/widget-query)).

## v0.3.1/2022-02-10

- [v0.3.0 <=> v0.3.1](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v0.3.0...v0.3.1)
- 使用自定义属性 `type` = `query` 的 SQL 代码块从思源数据库中进行查询并将查询结果在其下方渲染为表格 | Use the sql code block of the custom attribute `type` = `query` to query from the siyuan database and render the query results below the code block as a table.
  - 默认快捷键为 <kbd>Ctrl + F2</kbd> | The default shortcut key is <kbd>Ctrl + F2</kbd>.
- 将渲染自定义块属性指定的样式的默认快捷键更改为 <kbd>Ctrl + F1</kbd> | Changes the default shortcut key for rendering the style specified by the custom block attribute to <kbd>Ctrl + F1</kbd>.
- 添加错误捕获与弹窗提示 | Added error capture with pop-up hints.
- 配置文件中添加查询结果对齐样式与渲染内容处理方法 | Adds query result alignment styles and rendered content handling methods to the configuration file.
- 修复空白子标题块光标位置错误 | Fixed the cursor position error of blank subheading block.
- 补充遗漏的块类型 | Supplement the missing block type.

## v0.3.0/2022-02-07

- [v0.2.0 <=> v0.3.0](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v0.2.0...v0.3.0)
- 编辑区内边距固定为自定义值 | The padding of editor pannel are fixed to custom values.
- 修复文档树标题颜色模块引用问题 | Fixed an issue with document tree title color module references.
- 使用自定义块属性渲染块样式 | Use custom block attributes to render the block style.
- 添加块自定义属性样式 | Add block custom attribute styles.
  - `font-family`: 字体 | font.
  - `writing-mode`: 文本排版模式 | Text layout mode.
- 使用文件 `/widgets/custom.js` 覆盖文件 `/appearance/themes/Dark+/script/module/config.js` 中的配置 | Use file `/widgets/custom.js` to overwrite the configuration in file `/appearance/themes/Dark+/script/module/config.js`.
- 使用快捷键 <kbd>F1</kbd> 渲染自定义块属性指定的样式 | Use the hot key <kbd>F1</kbd> to render the style specified by the custom block attribute.

## v0.2.0/2022-01-29

- 使用 URL 参数 `id` 跳转到指定的块 | Use the URL parameter `id` to jump to the specified block.
- 移除废弃的 `MouseEvent.initMouseEvent()` 方法 | Remove the `MouseEvent.initMouseEvent()` deprecated method.
- 添加连接到静态目录的链接图标 | Add link icons that connect to a static directory.
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
- 添加连接到资源文件夹内常见文件的链接图标 | Adds link icons that connect to common files within the assets folder.
  - Word
  - PowerPoint
  - Excel
  - Image
  - Audio
  - Video
  - ZIP

## v0.1.11/2022-01-25

- 修复列表项内的多个块级元素中含有列表时高亮辅助线不显示问题 | Fixed an issue where highlighted guides were not displayed when multiple block-level elements within a list item contained lists.
- 将 `:before` 与 `:after` 规范为 `::before` 与 `::after` | Normalize `:before` and `:after` as `::before` and `::after`.
- 添加滴答清单 URL Scheme 图标 | Add ticktick list URL Scheme icon.
- 添加侧边面板条目显示选项(过长条目自动换行显示) | Add side panel item display options (word wrap display).
- 新增脚本加载函数 `addScript` | New script load function `addScript`.

## v0.1.10/2022-01-17

- 修复列表项内具有多个块级元素时高亮辅助线不显示问题 | Fixed an issue where highlighted guides were not displayed when there were multiple block-level elements within a list item.

## v0.1.9/2022-01-13

- 修复多行列表项的辅助线渲染错误 | Fixed a guide rendering error for multi-line list items.
- 修复列表项内标题块与嵌入块辅助线错误问题 | Fixed an issue where header blocks and embedded block guides within list items were incorrect.

## v0.1.8/2022-01-11

- 添加列表当前行辅助线 | Adds a guide to the current row of the list.
- 调整列表辅助线 | Adjust the list guides line.
- 重命名 `/style/module/indent.css` 为 `/style/module/block-list.css` | Rename `/style/module/indent.css` to `/style/module/block-list.css`.
- 修复行内代码背景颜色 | Fixed inline code background color.
- 列表辅助线随字号自动调整 | List guides automatically adjust with the font size.

## v0.1.7/2022-01-10

- 修复文档树色彩渲染 | Fixed document tree color rendering.
- 添加悬浮预览窗口最小高度设置选项 | Adds the Option to set the minimum height of the hover preview window.
- 添加更多可自定义的变量 | Add more customizable variables.
- 导出预览模式添加半透明背景色 | Export preview mode adds a translucent background color.

## v0.1.6/2022-01-07

- 添加 Quicker URL Scheme 图标 | Add the Quicker URL Scheme icon.
- 修复文档树色彩渲染 | Fixed document tree color rendering.
- 添加基于超链接的行内备注图标 | Adds a hyperlink-based inline comment icon.

## v0.1.5/2022-01-02

- 提高超链接图标中 URL Scheme 的优先级 | Increase the priority of the URL Scheme in the hyperlink icon.
- 添加表标题与图标题自动编号功能 | Added auto-numbering feature of table titles and figure titles.
- 添加 joplin URL Scheme 图标 | Add the joplin USL Scheme icon.
- 调整 iframe 背景颜色为半透明 | Adjust the iframe background color to translucent.
- 修复标题自动编号重复计数 | Fixed title auto-numbering duplicate count.

## v0.1.4/2021-12-29

- 调整默认的 `--b3-border-color` 颜色为 `--b3-scroll-color` | Adjust the default `--b3-border-color` color to `--b3-scroll-color`.
- 将水平分隔线调整为双实线 | Adjust the horizontal divider line to a double solid line.
- 添加 `--custom-list-guides-distance-compensation` 属性用于在非默认字号下手动调整列表缩进辅助线的位置 | Added the `-custom-list-guides-distance-compensation` attribute to manually adjust the position of list indentation guides under non-default font sizes.
- 调整标题空行光标位置 | Adjusts the position of the header blank line cursor.
- 移除列表中标题块的自动编号功能 | Removes the auto-numbering feature for title blocks in the list.
- 将自定义配置文件添加到 `theme.css` 末尾以获得更高优先级 | Add a custom profile to the end of `theme.css` for higher priority.

## v0.1.3/2021-12-28

- 修复悬浮预览窗口无法拖动的问题 | Fixed an issue where the hover preview window could not be dragged.
- 修复窗口周围白色边框问题 | Fixed an issue with white borders around windows.
- 高亮聚焦的侧边功能面板的标题栏 | Highlight the title bar of the focused side feature panel.
- 令 `data/widgets/custom.css` 中自定义配置字段覆盖 `conf/appearance/themes/Dark+/style/module/config.css` 中对应的默认配置 | Cause the custom configuration field in file `data/widgets/custom.css` to override the default configuration in file `conf/appearance/themes/Dark+/style/module/config.css`.
- 完善配置选项示例 | Refine the configuration options for examples.
- 将所有模块的引用 URL 设置为相对根目录路径 | Set the reference URL of all modules to a relative root path.

## v0.1.2/2021-12-27

- 根据文档名在文档树中显示不同颜色 | Displays different colors in the document tree based on the document name.
- 导入 `seguiemj.ttf` 字体 | Import the `seguiemj.ttf` font.
- 更改空白页面动画, 使其更平滑 | Change the blank page animation to make it smoother.
- 在配置页面中添加标题标号的缩放大小变量 | Adds a scaling size variable for the title label in the configuration page.
- 悬浮搜索菜单背景颜色设置为半透明 | The hover search menu background is set to translucent
- 调整搜索菜单的最大宽度 | Adjust the maximum width of the search menu.

## v0.1.1/2021-12-25

- 修复超链接图标显示问题 | Fixed hyperlink icon display issue.
- 调整空行提示文字 | Adjust the blank line prompt text.

## v0.1.0/2021-12-25

- 项目初始化 | Project initialization.
