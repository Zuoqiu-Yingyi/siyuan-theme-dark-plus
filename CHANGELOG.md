# 更改日志 | CHANGE LOG

- [v0.4.0 <=> v0.4.1](https:///github.com/Zuoqiu-Yingyi/siyuan-theme-dark-plus/compare/v0.4.0...v0.4.1)
- 配置文件 `config.css` 有变更 | There are changes to the configuration file `config.css`.
- 配置文件 `config.js` 有变更 | There are changes to the configuration file `config.js`.
- 设置更细粒度的功能开关 | Set more fine-grained function switches.
- 使用快捷键 <kbd>Shift + Alt + C</kbd> 复制当前文档 markdown 全文至剪贴板 | Use the shortcut keys <kbd>Shift + Alt + C</kbd> to copy the full markdown text of the current document to the clipboard.
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
