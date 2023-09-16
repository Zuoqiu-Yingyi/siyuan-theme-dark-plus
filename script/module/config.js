/* 配置文件(可以被 data/widgets/custom.js 覆盖) */

export {
    config,
    custom,
    loadCustomJs,
    saveCustomFile,
    loadCustomJson,
}

import { merge } from './../utils/misc.js';
import { compareVersion } from './../utils/string.js';
import {
    getFile,
    putFile,
} from './../utils/api.js';

const THEME_PATHNAME = window.theme.root;

const config = {
    custom: {
        // 自定义配置
        path: '/data/widgets/custom.json', // 自定义配置文件路径
    },
    theme: {
        regs: {
            // 正则表达式
            url: /^siyuan:\/\/blocks\/(\d{14}\-[0-9a-z]{7})\/*(?:(?:\?)(\w+=\w+)(?:(?:\&)(\w+=\w+))*)?$/, // 思源 URL Scheme 正则表达式
            time: /^(\d+)(:[0-5]?[0-9]){0,2}(\.\d*)?$/, // 时间戳正则表达式
            id: /^\d{14}\-[0-9a-z]{7}$/, // 块 ID 正则表达式
            fontsize: /(?<=\.b3-typography|protyle-wysiwyg|protyle-title\s*\{\s*font-size\s*:\s*)(\d+)(?=px(?:\s+\!important)?(?:\s*;|\}))/,
            winpath: /^\/\w\:\/.*$/, // Windows 路径正则表达式
            inboxid: /^\d{13}$/, // 收集箱 ID 正则表达式
            historypath: /^(?:.*[\/\\]history[\/\\].+[\/\\])(?:\d{14}\-[0-9a-z]{7}[\/\\])+(\d{14}\-[0-9a-z]{7})\.sy$/, // 历史文档路径
        },
        messages: {
            // 消息提示
            copy: {
                // 复制
                success: {
                    zh_CN: '复制成功',
                    zh_CHT: '復製成功',
                    other: 'Copy succeeded.',
                },
                error: {
                    zh_CN: '复制失败',
                    zh_CHT: '復製失敗',
                    other: 'Copy failed.',
                },
            },
            selectDocument: {
                error: {
                    zh_CN: '请在编辑区中选择文档',
                    zh_CHT: '請在編輯區中選擇文檔',
                    other: 'Please select the document in the edit area.',
                },
            }
        },
        tooldock: { // 悬浮栏
            id: 'custom-tooldock', // 悬浮栏 ID
            classes: [ // 样式类名
                'float-tooldock',
            ],
            reset: { // 重置工具栏
                enable: true,
                id: 'custom-tooldock-reset',
                label: {
                    zh_CN: '重置悬浮工具栏',
                    zh_CHT: '重置懸浮工具欄',
                    other: 'Reset the Floating Toolbar',
                },
                icon: '#iconRefresh',
            },
        },
        toolbar: {
            // 工具栏
            id: 'custom-toolbar', // 工具栏 ID
            delay: 250, // 延迟显示工具栏的时间
            more: {
                id: 'custom-toolbar-more',
                enable: true,
                status: {
                    default: "fold",
                    fold: {
                        icon: '#iconFullscreen',
                        label: {
                            zh_CN: '按住拖动\n双击展开扩展工具栏',
                            zh_CHT: '按住拖動\n雙擊展開擴展工具欄',
                            other: 'Hold Down to Drag\nDouble-click to Expand the Expansion Toolbar',
                        },
                    },
                    unfold: {
                        icon: '#iconContract',
                        label: {
                            zh_CN: '按住拖动\n双击收起扩展工具栏',
                            zh_CHT: '按住拖動\n雙擊收起擴展工具欄',
                            other: 'Hold Down to Drag\nDouble-click to Collapse the Expansion Toolbar',
                        },
                    },
                },
            },
        },
        goto: {
            enable: true, // 是否启用使用 URL 参数跳转指定块功能
            delay: 250, // 延迟时间，单位毫秒
        },
        style: {
            enable: true, // 是否启用自定义样式渲染
            save: {
                enable: false, // 是否启用保存自定义样式
            },
            itemtext: {
                enable: true, // 是否完整显示文本内容
                toolbar: {
                    enable: true,
                    display: true,
                    id: 'toolbar-theme-style-itemtext',
                    label: {
                        zh_CN: '完整显示文本内容',
                        zh_CHT: '完整顯示文本內容',
                        other: 'Full Display Text Content',
                    },
                    icon: '#iconParagraph',
                    index: -8,
                },
                elements: {
                    itemtext: {
                        enable: true,
                        style: {
                            id: 'theme-style-list-item-text-style',
                            href: `${THEME_PATHNAME}/style/dynamic-module/list-item-text.css`, // 样式文件 URL
                        },
                    },
                },
            },
            tabbar: {
                enable: true, // 是否启用纵向选项卡
                toolbar: { // 菜单栏
                    enable: true,
                    display: true,
                    id: 'toolbar-theme-style-tabbar',
                    hotkey: () => config.theme.hotkeys.style.tabbar,
                    label: {
                        zh_CN: '纵向排列选项卡',
                        zh_CHT: '縱向排列選項卡',
                        other: 'Arrange Tabs Vertically',
                    },
                    icon: '#iconSort',
                    index: -7,
                },
                elements: {
                    tabbar: {
                        enable: true,
                        style: {
                            id: 'theme-style-tab-bar-vertical-style',
                            href: `${THEME_PATHNAME}/style/dynamic-module/tab-bar-vertical.css`, // 样式文件 URL
                        },
                    },
                },
            },
            guides: {
                enable: true, // 是否启用辅助样式
                toolbar: { // 菜单栏
                    enable: true,
                    display: true,
                    id: 'toolbar-theme-style-guides',
                    hotkey: () => config.theme.hotkeys.style.guides,
                    label: {
                        zh_CN: '列表辅助线',
                        zh_CHT: '列表輔助線',
                        other: 'List Guides',
                    },
                    icon: '#iconIndent',
                    index: -6,
                },
                elements: {
                    // 应用辅助线样式的元素
                    list: {
                        // 列表辅助线
                        enable: true,
                        style: {
                            id: 'theme-style-guides-elements-list-style',
                            href: `${THEME_PATHNAME}/style/dynamic-module/guides-list.css`, // 样式文件 URL
                        },
                    },
                },
            },
            mark: {
                enable: true, // 是否显示标记
                toolbar: { // 菜单栏
                    enable: true,
                    display: true,
                    id: 'toolbar-theme-style-mark',
                    hotkey: () => config.theme.hotkeys.style.mark,
                    label: {
                        zh_CN: '显示标记文本',
                        zh_CHT: '顯示標記文本',
                        other: 'Displays Mark Text',
                    },
                    icon: '#iconMark',
                    index: -5,
                },
                elements: {
                    // 应用标记样式的元素
                    mark: {
                        // 标记
                        enable: true,
                        style: {
                            id: 'theme-style-mark-elements-display-style',
                            href: `${THEME_PATHNAME}/style/dynamic-module/mark-display.css`, // 样式文件 URL
                        },
                    },
                },
            },
            render: {
                enable: false, // 是否启用自定义样式渲染
                toolbar: { // 菜单栏
                    enable: true,
                    display: true,
                    id: 'toolbar-theme-style-render',
                    hotkey: () => config.theme.hotkeys.style.render,
                    label: {
                        zh_CN: '渲染自定义样式',
                        zh_CHT: '渲染自定義樣式',
                        other: 'Render Custom Styles',
                    },
                    icon: '#iconTheme',
                    index: 3,
                },
                styles: [
                    // 渲染的自定义样式
                    'font-size',
                ],
            },
            attribute: 'custom-style', // 自定义块属性名称
        },
        timestamp: {
            // 视频/音频时间戳
            enable: true, // 是否启用时间戳
            youtube: { // YouTube 时间戳相关配置
                // iframe_api: "https://www.youtube.com/iframe_api", // API 工具
                iframe_api: `${THEME_PATHNAME}/static/youtube/iframe_api.js`, // API 工具
                type: 'text/javascript', // script 类型
                polling: 500, // 轮询时间(单位: ms)
            },
            jump: {
                enable: true, // 是否启用跳转
            },
            create: {
                enable: true, // 是否启用生成时间戳
                message: {
                    success: {
                        zh_CN: '时间戳复制成功',
                        zh_CHT: '時間戳復製成功',
                        other: 'Timestamp copy succeeded.',
                    },
                    error: {
                        zh_CN: '时间戳复制失败',
                        zh_CHT: '時間戳復製失敗',
                        other: 'Timestamp copy failed.',
                    },
                },
            },
            attribute: 'custom-time', // 自定义块属性名称
        },
        blockattrs: {
            // 块属性操作
            enable: true, // 是否启用块属性操作
            set: {
                enable: true, // 是否启用设置块属性
            },
        },
        reload: {
            // 重新加载
            enable: true, // 是否启用重新加载
            window: {
                enable: true, // 是否启用窗口重新加载
                toolbar: { // 菜单栏
                    enable: true,
                    display: true,
                    id: 'toolbar-theme-reload-window',
                    hotkey: () => config.theme.hotkeys.reload.window,
                    label: {
                        zh_CN: '重新加载窗口',
                        zh_CHT: '重新加載窗口',
                        other: 'Reload the Window',
                    },
                    icon: '#iconRefresh',
                    index: 0,
                },
            },
            iframe: {
                enable: true, // 是否启用 iframe 重新加载
            },
        },
        fullscreen: {
            // 全屏
            enable: true, // 是否启用全屏
            iframe: {
                enable: true, // 是否启用 iframe/widgets/video 全屏
            },
            mark: {
                enable: true, // 是否开启双击块标全屏某个块
            },
        },
        doc: {
            enable: true, // 是否启用文档扩展功能
            heading: { // 标题操作
                enable: true, // 是否启用标题操作
                fold: {
                    enable: true, // 是否启用一键全部折叠
                    toolbar: { // 菜单栏
                        enable: true,
                        display: true,
                        id: 'toolbar-theme-doc-heading-fold',
                        hotkey: () => config.theme.hotkeys.doc.heading.fold,
                        label: {
                            zh_CN: '折叠当前文档所有子标题',
                            zh_CHT: '折疊當前文檔所有子標題',
                            other: 'Collapses Sll Subheadings of the Current Document',
                        },
                        icon: '#iconContract',
                        index: 10,
                    },
                    message: {
                        success: {
                            zh_CN: '折叠完成, 请刷新当前文档',
                            zh_CHT: '折疊完成, 請刷新當前文檔',
                            other: 'Collapse completed, please refresh the current document.',
                        },
                        error: {
                            zh_CN: '折叠失败，请在编辑区中选择文档',
                            zh_CHT: '折疊失敗，請在編輯區中選擇文檔',
                            other: 'Collapse failed, please select the document in the edit area.',
                        },
                    },
                },
                unfold: {
                    enable: true, // 是否启用一键全部展开
                    toolbar: { // 菜单栏
                        enable: true,
                        display: true,
                        id: 'toolbar-theme-doc-heading-unfold',
                        hotkey: () => config.theme.hotkeys.doc.heading.unfold,
                        label: {
                            zh_CN: '展开当前文档所有子标题',
                            zh_CHT: '展開當前文檔所有子標題',
                            other: 'Expand Sll Subheadings of the Current Document',
                        },
                        icon: '#iconFullscreen',
                        index: 11,
                    },
                    message: {
                        success: {
                            zh_CN: '展开完成, 请刷新当前文档',
                            zh_CHT: '展開完成, 請刷新當前文檔',
                            other: 'Expand completed, please refresh the current document.',
                        },
                        error: {
                            zh_CN: '展开失败，请在编辑区中选择文档',
                            zh_CHT: '展開失敗，請在編輯區中選擇文檔',
                            other: 'Expand failed, please select the document in the edit area.',
                        },
                    },
                },
            },
            outline: {
                enable: true, // 是否启用当前文档大纲复制功能
                ial: { // 列表块属性, 用于设置渲染样式, 为空则为默认样式
                    // 'custom-type': 'map', // 脑图视图
                    // 'custom-type': 'table', // 表格视图
                },
                message: {
                    success: {
                        zh_CN: '复制当前文档大纲完成',
                        zh_CHT: '復製當前文檔大綱完成',
                        other: 'Copying the current document outline is complete.',
                    },
                    error: {
                        zh_CN: '复制当前文档大纲失败，请在编辑区中选择包含子标题的文档',
                        zh_CHT: '復製當前文檔大綱失敗，請在編輯區中選擇包含子標題的文檔',
                        other: 'Copying the current document outline failed, please select the document that contains the subheading in the edit area.',
                    },
                },
                u: {
                    enable: true, // 无序列表
                    toolbar: { // 菜单栏
                        enable: true,
                        display: true,
                        id: 'toolbar-theme-doc-outline-u',
                        hotkey: () => config.theme.hotkeys.doc.outline.u,
                        label: {
                            zh_CN: '复制当前文档大纲为无序列表',
                            zh_CHT: '復製當前文檔大綱為無序列表',
                            other: 'Copy the Current Document Outline as an Unordered List',
                        },
                        icon: '#iconList',
                        index: 7,
                    },
                },
                o: {
                    enable: true, // 有序列表
                    toolbar: { // 菜单栏
                        enable: true,
                        display: true,
                        id: 'toolbar-theme-doc-outline-o',
                        hotkey: () => config.theme.hotkeys.doc.outline.o,
                        label: {
                            zh_CN: '复制当前文档大纲为有序列表',
                            zh_CHT: '復製當前文檔大綱為有序列表',
                            other: 'Copy the Current Document Outline as an Ordered List',
                        },
                        icon: '#iconOrderedList',
                        index: 8,
                    },
                },
                t: {
                    enable: true, // 任务列表
                    toolbar: { // 菜单栏
                        enable: true,
                        display: true,
                        id: 'toolbar-theme-doc-outline-t',
                        hotkey: () => config.theme.hotkeys.doc.outline.t,
                        label: {
                            zh_CN: '复制当前文档大纲为任务列表',
                            zh_CHT: '復製當前文檔大綱為任務列表',
                            other: 'Copy the Current Document Outline as a Task List',
                        },
                        icon: '#iconCheck',
                        index: 9,
                    },
                },
                style: {
                    // 大纲样式
                    content: 'link', // 内容样式('text': 文本, 'link': 链接, 'ref': 块引用)
                },
                heading: {
                    enable: false, // 是否在列表中添加标题级别标志
                    handler: (level, enable) => (enable ? `${'#'.repeat(level)} ` : ''),
                },
                top: 'h', // 大纲最顶层块类型('d': 文档块, 'h': 标题块)
                empty: '-', // 大纲空块显示内容
            },
            copy: {
                enable: true, // 是否启用当前文档全文复制功能
                toolbar: { // 菜单栏
                    enable: true,
                    display: true,
                    id: 'toolbar-theme-doc-copy',
                    hotkey: () => config.theme.hotkeys.doc.copy,
                    label: {
                        zh_CN: '复制当前文档内容 (Markdown)',
                        zh_CHT: '復製當前文檔內容 (Markdown)',
                        other: 'Copy the Current Document Content (Markdown)',
                    },
                    icon: '#iconCopy',
                    index: 12,
                },
                message: {
                    success: {
                        zh_CN: '复制当前文档内容 (Markdown) 成功',
                        zh_CHT: '復製當前文檔內容 (Markdown) 成功',
                        other: 'Copy the current document content (Markdown) succeeded.',
                    },
                    error: {
                        zh_CN: '复制当前文档内容 (Markdown) 失败',
                        zh_CHT: '復製當前文檔內容 (Markdown) 失敗',
                        other: 'Copy the current document content (Markdown) failed.',
                    },
                },
            },
            delete: {
                enable: true, // 是否启用当前文档全文删除功能
                toolbar: { // 菜单栏
                    enable: false,
                    display: true,
                    id: 'toolbar-theme-doc-delete',
                    hotkey: () => config.theme.hotkeys.doc.delete,
                    label: {
                        zh_CN: '删除当前文档内容',
                        zh_CHT: '刪除當前文檔內容',
                        other: 'Delete the Current Document Content',
                    },
                    icon: '#iconTrashcan',
                    index: 14,
                },
            },
            cut: {
                enable: true, // 是否启用当前文档全文剪切功能
                toolbar: { // 菜单栏
                    enable: false,
                    display: true,
                    id: 'toolbar-theme-doc-cut',
                    hotkey: () => config.theme.hotkeys.doc.cut,
                    label: {
                        zh_CN: '剪切当前文档内容 (Markdown)',
                        zh_CHT: '剪切當前文檔內容 (Markdown)',
                        other: 'Cut the Current Document Content (Markdown)',
                    },
                    icon: '#iconCut',
                    index: 13,
                },
                message: {
                    success: {
                        zh_CN: '剪切当前文档内容 (Markdown) 成功',
                        zh_CHT: '剪切當前文檔內容 (Markdown) 成功',
                        other: 'Cut the current document content (Markdown) succeeded.',
                    },
                    error: {
                        zh_CN: '剪切当前文档内容 (Markdown) 失败',
                        zh_CHT: '剪切當前文檔內容 (Markdown) 失敗',
                        other: 'Cut the current document content (Markdown) failed.',
                    },
                },
            },
        },
        typewriter: {
            // 打字机模式开关
            enable: false,
            switch: {
                enable: true, // 是否启用打字机模式开关
                toolbar: { // 菜单栏
                    enable: true,
                    display: true,
                    id: 'toolbar-theme-typewriter-switch',
                    hotkey: () => config.theme.hotkeys.typewriter.switch,
                    label: {
                        zh_CN: '打字机模式',
                        zh_CHT: '打字機模式',
                        other: 'Typewriter Mode',
                    },
                    icon: '#iconKeymap',
                    index: -3,
                },
                NodeCodeBlock: {
                    enable: false, // 是否在代码块中启用打字机模式
                    mode: 'row', // 打字机模式，`row`: 聚焦行, 'block': 聚焦代码块
                },
                NodeTable: {
                    enable: true, // 是否在表格块中启用打字机模式
                    mode: 'row', // 打字机模式，`row`: 聚焦行, 'block': 聚焦表格块
                },
            },
        },
        invert: {
            // 反色功能开关
            enable: true,
            toolbar: { // 菜单栏
                enable: true,
                display: true,
                id: 'toolbar-theme-invert',
                hotkey: () => config.theme.hotkeys.invert,
                label: {
                    zh_CN: '反色显示',
                    zh_CHT: '反色顯示',
                    other: 'Display in Inverse Color',
                },
                icon: '#iconDark',
                index: -4,
            },
            elements: {
                // 反色元素
                img: {
                    // 图片反色
                    enable: true,
                    style: {
                        id: 'theme-invert-elements-img-style',
                        innerHTML: 'img:not(.emoji, .thumbnailImage), div.thumbnailSelectionRing {filter: invert(100%) hue-rotate(180deg);}div.protyle-background__icon>img,span.b3-list-item__icon>img {filter: none;}', // 样式标签内容
                    },
                },
                viewer: {
                    // PDF 预览反色
                    enable: true,
                    style: {
                        id: 'theme-invert-elements-viewer-style',
                        innerHTML: '#viewer {filter: invert(100%) hue-rotate(180deg);}',
                    },
                },
                iframe: {
                    // iframe 反色
                    enable: true,
                    style: {
                        id: 'theme-invert-elements-iframe-style',
                        innerHTML: 'iframe {filter: invert(100%) hue-rotate(180deg);}',
                    },
                },
                video: {
                    // 视频反色
                    enable: true,
                    style: {
                        id: 'theme-invert-elements-video-style',
                        innerHTML: 'video {filter: invert(100%) hue-rotate(180deg);}',
                    },
                },
            },
        },
        background: {
            // 背景图片功能开关
            enable: true,
            color: {
                propertyName: '--custom-background-color', // CSS 全局变量名称
                default: { // 背景图片为空时的默认背景颜色
                    light: 'white',
                    dark: 'black',
                },
            },
            image: {
                enable: true, // 是否启用背景图片更改功能
                propertyName: '--custom-background-image', // CSS 全局变量名称
                web: {
                    enable: true, // 网络背景图片
                    toolbar: { // 菜单栏
                        enable: true,
                        display: true,
                        id: 'toolbar-theme-background-image-web',
                        hotkey: () => config.theme.hotkeys.background.image.web,
                        label: {
                            zh_CN: '更换背景图片 (网络)',
                            zh_CHT: '更換背景圖片 (網絡)',
                            other: 'Change Background Image (Web)',
                        },
                        icon: '#iconImage',
                        index: 5,
                    },
                    random: false, // 是否随机切换网络背景图片 URL
                    landscape: { // 横屏背景图片
                        light: [ // 随机亮色背景图片 URL
                            'https://source.unsplash.com/random/1920x1080/?bright',
                            'https://api.dujin.org/bing/1920.php',
                            'https://unsplash.it/1920/1080?random',
                            // 'https://api.ixiaowai.cn/gqapi/gqapi.php⁠⁠⁠⁠⁠⁠',
                        ],
                        dark: [ // 随机暗色背景图片 URL
                            'https://source.unsplash.com/random/1920x1080/?night',
                            'https://source.unsplash.com/random/1920x1080/?starry',
                            'https://source.unsplash.com/random/1920x1080/?dark',
                        ],
                    },
                    portrait: { // 竖屏背景图片
                        light: [
                            'https://source.unsplash.com/random/1080x1920/?bright',
                            'https://unsplash.it/1080/1920?random',
                        ],
                        dark: [
                            'https://source.unsplash.com/random/1080x1920/?night',
                            'https://source.unsplash.com/random/1080x1920/?starry',
                            'https://source.unsplash.com/random/1080x1920/?dark',
                        ],
                    },
                },
                custom: {
                    enable: true, // 自定义背景图片
                    toolbar: { // 菜单栏
                        enable: true,
                        display: true,
                        id: 'toolbar-theme-background-image-custom',
                        hotkey: () => config.theme.hotkeys.background.image.custom,
                        label: {
                            zh_CN: '更换背景图片 (自定义)',
                            zh_CHT: '更換背景圖片 (自定義)',
                            other: 'Change Background Image (Custom)',
                        },
                        icon: '#iconImage',
                        index: 6,
                    },
                    random: false, // 是否随机选择自定义背景图片
                    default: false, // 是否默认使用自定义背景图片
                    landscape: { // 横屏背景图片
                        light: [ // 自定义亮色背景图片 URL 列表
                            null, // 纯白色背景
                            `${THEME_PATHNAME}/image/light/background-main.jpg`,
                            `${THEME_PATHNAME}/image/light/background-dialog.jpg`,
                        ],
                        dark: [ // 自定义暗色背景图片 URL 列表
                            null, // 纯黑色背景
                            `${THEME_PATHNAME}/image/dark/background-main.jpg`,
                            `${THEME_PATHNAME}/image/dark/background-dialog.jpg`,
                        ],
                    },
                    portrait: { // 竖屏背景图片
                        light: [ // 自定义亮色背景图片 URL 列表
                            `${THEME_PATHNAME}/image/light/background-main-portrait.jpg`,
                            `${THEME_PATHNAME}/image/light/background-dialog.jpg`,
                        ],
                        dark: [ // 自定义暗色背景图片 URL 列表
                            `${THEME_PATHNAME}/image/dark/background-main-portrait.jpg`,
                            `${THEME_PATHNAME}/image/dark/background-dialog.jpg`,
                        ],
                    },
                },
            },
        },
        window: {
            enable: true, // 窗口功能开关
            windowParams: {
                // 窗口参数
                width: 720, // 窗口宽度
                height: 480, // 窗口高度
                frame: true, // 是否显示边缘框
                fullscreen: false, // 是否全屏显示
                alwaysOnTop: true, // 是否置顶显示
                autoHideMenuBar: true, // 是否隐藏菜单栏(使用 Alt 显示)
                // backgroundColor: window.siyuan.config.appearance.mode // 窗口默认背景色
                //     ? '#1e1e1e'
                //     : '#f5f5f5',
                webPreferences: {
                    nodeIntegration: true, // 是否启用 Node.js 内置模块
                    nativeWindowOpen: true,
                    webviewTag: true, // 是否启用 webview 标签 (类似于 iframe 标签)
                    webSecurity: false, // 是否启用 Web 安全
                    contextIsolation: false, // 上下文隔离, 设置 false 之后可以使用 require
                    defaultFontFamily: { // 默认字体
                        standard: window.siyuan.config.editor.fontFamily,
                    },
                },
            },
            menu: {
                // 新窗口菜单
                // template: [
                //     {role: "appMenu"},
                //     {role: "fileMenu"},
                //     {role: "editMenu"},
                //     {role: "viewMenu"},
                //     {role: "windowMenu"},
                //     {role: "shareMenu"},
                // ],
                template: [
                    // 新窗口菜单模板
                    // REF [菜单项 | Electron](https://www.electronjs.org/zh/docs/latest/api/menu-item)
                    {
                        label: 'SiYuan',
                        submenu: [
                            {
                                label: 'About SiYuan',
                                role: 'about',
                            },
                            { type: 'separator' },
                            { role: 'services' },
                            { type: 'separator' },
                            {
                                label: 'Hide SiYuan',
                                role: 'hide',
                            },
                            { role: 'hideOthers' },
                            { role: 'unhide' },
                            { type: 'separator' },
                            {
                                label: 'Quit SiYuan',
                                role: 'quit',
                            },
                        ],
                    },
                    {
                        role: 'editMenu',
                        submenu: [
                            { role: 'selectAll' },
                            { role: 'cut' },
                            { role: 'copy' },
                            { role: 'paste' },
                            { role: 'pasteAndMatchStyle', accelerator: 'CmdOrCtrl+Shift+V' },
                            { type: 'separator' },
                            { role: 'toggleSpellChecker' },
                        ],
                    },
                    {
                        role: 'viewMenu',
                        submenu: [
                            { role: 'resetZoom' },
                            { role: 'zoomIn', accelerator: 'CmdOrCtrl+=' },
                            { role: 'zoomOut' },
                        ],
                    },
                    {
                        role: 'windowMenu',
                        submenu: [
                            { role: 'minimize' },
                            { role: 'zoom' },
                            { role: 'togglefullscreen' },
                            { type: 'separator' },
                            { role: 'toggledevtools' },
                            { type: 'separator' },
                            { role: 'front' },
                            { type: 'separator' },
                            { role: 'reload', accelerator: 'F5' },
                            { role: 'forcereload', accelerator: 'CmdOrCtrl+F5' },
                            { role: 'close' },
                            { type: 'separator' },
                            {
                                label: 'Pinned',
                                click: (menuItem, browserWindow, event) => {
                                    if (browserWindow) browserWindow.setAlwaysOnTop(!browserWindow.isAlwaysOnTop());
                                },
                                type: 'checkbox',
                                checked: true,
                                // REF [快捷键 | Electron](https://www.electronjs.org/zh/docs/latest/api/accelerator)
                                accelerator: 'Alt+Shift+P',
                            },
                        ],
                    },
                ],
            },
            open: {
                enable: true, // 打开窗口功能开关
                panel: {
                    enable: true, // 打开一个新窗口
                    url: null, // 新窗口的 URL, 值 null 则为 '/stage/build/desktop/'
                    toolbar: { // 菜单栏
                        enable: true,
                        display: true,
                        id: 'toolbar-theme-window-open-panel',
                        label: {
                            zh_CN: '打开一个新窗口',
                            zh_CHT: '打開一個新窗口',
                            other: 'Open a New Window',
                        },
                        icon: '#iconOpenWindow',
                        index: 1,
                    },
                },
                block: {
                    // 新窗口打开当前块, 否则打开当前文档
                    enable: true,
                    editable: false, // 新窗口默认是否可编辑
                    outfocus: {
                        // 新窗口打开当前块, 否则打开当前文档
                        enable: true,
                        toolbar: { // 菜单栏
                            enable: true,
                            display: true,
                            id: 'toolbar-theme-window-open-block-outfocus',
                            hotkey: () => config.theme.hotkeys.window.open.block.outfocus,
                            label: {
                                zh_CN: '在新窗口打开当前块',
                                zh_CHT: '在新窗口打開當前塊',
                                other: 'Open the Current Block in a New Window',
                            },
                            icon: '#iconOpenWindow',
                            index: 2,
                        },
                    },
                    infocus: {
                        // 新窗口打开当前块并聚焦, 否则打开当前文档
                        enable: true,
                        toolbar: { // 菜单栏
                            enable: true,
                            display: true,
                            id: 'toolbar-theme-window-open-block-infocus',
                            hotkey: () => config.theme.hotkeys.window.open.block.infocus,
                            label: {
                                zh_CN: '在新窗口打开当前块并聚焦',
                                zh_CHT: '在新窗口打開當前塊並聚焦',
                                other: 'Open the Current Block in a New Window and Focus',
                            },
                            icon: '#iconOpenWindow',
                            index: 3,
                        },
                    },
                },
                link: {
                    enable: compareVersion(window.theme.kernelVersion, '2.8.9') <= 0, // 新窗口打开链接/块引用
                    outfocus: {
                        enable: true, // 不聚焦
                    },
                    infocus: {
                        enable: true, // 聚焦
                    },
                },
                editor: {
                    enable: compareVersion(window.theme.kernelVersion, '2.9.7') <= 0, // 启用新窗口打开编辑器
                    labels: {
                        openFile: {
                            zh_CN: '打开文件',
                            zh_CHT: '打開文件',
                            other: 'Open File',
                        },
                        open: {
                            zh_CN: '打开',
                            zh_CHT: '打開',
                            other: 'Open',
                        },
                    },
                    path: {
                        // 路径
                        index: `${THEME_PATHNAME}/app/editor/`, // 编辑器路径
                        temp: {
                            // 临时文件路径
                            relative: '/temp/theme/editor/', // 临时文件相对路径
                            absolute: `${window.siyuan.config.system.workspaceDir}/temp/theme/editor/`.replaceAll('\\', '/').replaceAll('//', '/'), // 临时文件绝对路径
                        },
                    },
                    kramdown: {
                        // 编辑文档 kramdown 源代码
                        message: {
                            error: {
                                zh_CN: "编辑文档 kramdown 源代码功能仅能在桌面端使用",
                                zh_CHT: "編輯文檔 kramdown 源代碼功能僅能在桌面端使用",
                                other: "The feature to edit the kramdown source code of a document is only available on the desktop client",
                            },
                        },
                    },
                },
            },
        },
        wheel: { // @deprecated
            enable: false, // 滚轮功能开关
            zoom: {
                enable: true, // 滚轮缩放功能开关
                threshold: 100, // 滚轮缩放阈值
                min: 9, // 最小字号(px)
                max: 72, // 最大字号(px)

                preventDefault: {
                    enable: true, // 阻止浏览器原生缩放开关
                    chromium: true, // 阻止 chromium 内核浏览器缩放
                    firefox: true, // 阻止 firefox 内核浏览器缩放
                },
            },
        },
        location: {
            enable: true, // 浏览位置开关
            slider: {
                enable: true, // 滑块功能开关
                follow: {
                    enable: true, // 滑块跟随焦点开关
                },
                goto: {
                    enable: true, // 滑块跳转浏览位置功能开关
                },
            },
            focus: {
                enable: false, // 当前光标所在块开关
                id: 'plugin-focus-unique-id', // 当前光标所在块的 HTML 元素 id
                className: 'plugin-focus-classname', // 光标所在块 CSS 类名
            },
            record: {
                enable: true, // 记录浏览位置开关
                mode: 2, // 记录模式, 1: 记录至 custom.json, 2: 记录至文档块属性
                attribute: 'custom-location', // 记录浏览位置的块属性名
                toolbar: { // 菜单栏
                    enable: true,
                    display: true,
                    id: 'toolbar-theme-location-record',
                    hotkey: () => config.theme.hotkeys.location.record,
                    label: {
                        zh_CN: '记录浏览位置',
                        zh_CHT: '記錄瀏覽位置',
                        other: 'Record Browsing Location',
                    },
                    icon: '#iconBookmark',
                    index: -10,
                },
            },
            clear: {
                enable: true, // 清除浏览位置按钮
                toolbar: { // 菜单栏
                    enable: true,
                    display: true,
                    id: 'toolbar-theme-location-clear',
                    hotkey: () => config.theme.hotkeys.location.clear,
                    label: {
                        zh_CN: '清除当前文档浏览位置记录',
                        zh_CHT: '清除當前文檔瀏覽位置記錄',
                        other: 'Clear the Current Document Browsing Location History',
                    },
                    icon: '#iconTrashcan',
                    index: 15,
                },
            }
        },
        readonly: { // @deprecated: https://github.com/siyuan-note/siyuan/issues/2648
            enable: false, // 只读功能开关 
            toolbar: { // 菜单栏
                enable: true,
                display: true,
                id: 'toolbar-theme-readonly',
                label: {
                    zh_CN: '只读模式',
                    zh_CHT: '只讀模式',
                    other: 'Read-Only Mode',
                },
                icon: '#iconPreview',
                index: -1,
            },
        },
        dock: {
            enable: true, // dock 功能开关
            fold: {
                enable: true, // dock 收缩/展开功能面板功能开关
                dock: false, // 模式开启时是否同时收起侧边停靠栏
                toolbar: { // 菜单栏
                    enable: true,
                    display: true,
                    id: 'toolbar-theme-dock-fold',
                    hotkey: () => config.theme.hotkeys.dock.fold,
                    label: {
                        zh_CN: '专注模式',
                        zh_CHT: '專註模式',
                        other: 'Focus Mode',
                    },
                    icon: '#iconHideDock',
                    index: -2,
                },
            },
        },
        jupyter: {
            enable: false,
            worker: {
                enable: false,
                main: {
                    enable: false,
                    url: '/appearance/themes/Dark+/app/jupyter/js/run.js',
                    options: {
                        type: 'module',
                        name: 'ui',
                    },
                },
                import: {
                    enable: false,
                    url: '/appearance/themes/Dark+/app/jupyter/js/import.js',
                    options: {
                        type: 'module',
                        name: 'ui',
                    },
                },
            },
        },
        menu: {
            enable: true, // 菜单功能开关
            block: {
                enable: true, // 块菜单功能开关
                toolbar: { // 菜单栏
                    enable: true,
                    display: true,
                    id: 'toolbar-theme-menu-block',
                    hotkey: () => config.theme.hotkeys.menu.block,
                    label: {
                        zh_CN: '扩展菜单',
                        zh_CHT: '擴展菜單',
                        other: 'Extended Menu',
                    },
                    icon: '#iconMenu',
                    index: -9,
                },
                items: [ // 块菜单项
                    {
                        enable: true, // 是否启用菜单项
                        prefixSeparator: false, // 是否添加前缀分隔线
                        suffixSeparator: true, // 是否添加后缀分隔线
                        type: null, // 哪些类型的块启用, 值 null 则全部启用
                        id: 'theme-menu-block-extend', // 菜单项 ID
                        mode: "button",  // 菜单项类型
                        icon: "#iconMenu",  // 菜单项图标
                        label: {  // 菜单项标签
                            zh_CN: "扩展菜单",
                            zh_CHT: "擴展菜單",
                            other: "Extended Menu",
                        },
                        accelerator: "",  // 菜单项快捷键
                        click: {  // 菜单项点击事件
                            enable: false, // 是否启用点击事件
                        },
                        itemsLoad: true, // 是否加载子菜单
                        itemsIcon: "#iconRight",
                        items: [
                            { // 常用字体设置
                                enable: true, // 是否启用菜单项
                                prefixSeparator: false, // 是否添加前缀分隔线
                                suffixSeparator: false, // 是否添加后缀分隔线
                                type: { // 哪些类型的块启用, 值 null 则全部启用
                                    NodeBlockQueryEmbed: { enable: true },
                                    NodeBlockquote: { enable: true },
                                    NodeDocument: { enable: true },
                                    NodeHeading: { enable: true },
                                    NodeList: { enable: true },
                                    NodeListItem: { enable: true },
                                    NodeParagraph: { enable: true },
                                    NodeSuperBlock: { enable: true },
                                    NodeTable: { enable: true },
                                },
                                id: 'theme-menu-block-common-font', // 菜单项 ID
                                mode: "button",  // 菜单项类型
                                icon: "#iconFont",  // 菜单项图标
                                label: {  // 菜单项标签
                                    zh_CN: "常用字体",
                                    zh_CHT: "常用字體",
                                    other: "Common Fonts",
                                },
                                accelerator: "",  // 菜单项快捷键
                                click: {  // 菜单项点击事件
                                    enable: false, // 是否启用点击事件
                                },
                                itemsLoad: true, // 是否加载子菜单
                                itemsIcon: "#iconRight",
                                items: [
                                    {
                                        enable: true,
                                        type: null,
                                        mode: "button",
                                        icon: "#iconFont",
                                        label: {
                                            zh_CN: "默认字体",
                                            zh_CHT: "默認字體",
                                            other: "Default Font",
                                            style: `font-family: "${window.siyuan.config.editor.fontFamily}"`,
                                        },
                                        accelerator: window.siyuan.config.editor.fontFamily,
                                        click: {
                                            enable: true,
                                            callback: null,
                                            tasks: [
                                                {
                                                    type: 'attr-update',
                                                    params: {
                                                        'custom-font-family': null,
                                                    },
                                                },
                                                {
                                                    type: 'attr-replace',
                                                    params: {
                                                        style: {
                                                            regexp: /\s*font-family:.*?;/g,
                                                            substr: '',
                                                        },
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                ],
                            },
                            { // 其他字体设置
                                enable: true,
                                prefixSeparator: false,
                                suffixSeparator: false,
                                type: {
                                    NodeBlockQueryEmbed: { enable: true },
                                    NodeBlockquote: { enable: true },
                                    NodeHeading: { enable: true },
                                    NodeList: { enable: true },
                                    NodeListItem: { enable: true },
                                    NodeParagraph: { enable: true },
                                    NodeSuperBlock: { enable: true },
                                    NodeTable: { enable: true },
                                },
                                id: 'theme-menu-block-other-font',
                                mode: "button",
                                icon: "#iconFont",
                                label: {
                                    zh_CN: "其他字体",
                                    zh_CHT: "其他字體",
                                    other: "Other Fonts",
                                },
                                accelerator: "",
                                click: {
                                    enable: true,
                                    callback: null,
                                    tasks: [
                                        {
                                            type: 'menu-unfold', // 展开菜单
                                            params: {
                                                id: 'theme-menu-block-other-font',
                                                item: () => config.theme.menu.block.items[0].items[1],
                                            }
                                        },
                                    ],
                                },
                                itemsLoad: false,
                                itemsIcon: {
                                    fold: "#iconFullscreen",
                                    unfold: "#iconContract",
                                },
                                items: [
                                ],
                            },
                            { // jupyter 设置
                                enable: false,
                                prefixSeparator: true,
                                suffixSeparator: false,
                                type: {
                                    NodeDocument: { enable: true },
                                    NodeCodeBlock: { enable: true, subtype: { null: true } },
                                },
                                id: 'theme-menu-jupyter',
                                mode: "button",
                                icon: "#iconCode",
                                label: {
                                    other: "Jupyter",
                                },
                                accelerator: "",
                                click: { enable: false },
                                itemsLoad: true, // 是否加载子菜单
                                itemsIcon: "#iconRight",
                                items: [
                                    {
                                        enable: true,
                                        type: { NodeDocument: { enable: true } },
                                        mode: "button",
                                        icon: "#iconSettings",
                                        label: {
                                            zh_CN: "全局设置",
                                            zh_CHT: "全局設置",
                                            other: "Global Settings",
                                        },
                                        click: {
                                            enable: true,
                                            callback: null,
                                            tasks: [
                                                {
                                                    type: 'jupyter-open-global-settings',
                                                    params: {
                                                        href: `${THEME_PATHNAME}/app/jupyter/settings-global.html`,
                                                        urlParams: { lang: window.theme.languageMode },
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        enable: true,
                                        type: { NodeDocument: { enable: true } },
                                        mode: "button",
                                        icon: "#iconFile",
                                        label: {
                                            zh_CN: "文档设置",
                                            zh_CHT: "文檔設置",
                                            other: "Document Settings",
                                        },
                                        click: {
                                            enable: true,
                                            callback: null,
                                            tasks: [
                                                {
                                                    type: 'window-open',
                                                    params: {
                                                        href: `${THEME_PATHNAME}/app/jupyter/settings-document.html`,
                                                        urlParams: { lang: window.theme.languageMode },
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        enable: true,
                                        type: { NodeDocument: { enable: true } },
                                        mode: "button",
                                        icon: "#iconClose",
                                        label: {
                                            zh_CN: "关闭连接",
                                            zh_CHT: "關閉連接",
                                            other: "Close Connection",
                                        },
                                        click: {
                                            enable: true,
                                            callback: null,
                                            tasks: [
                                                {
                                                    type: 'jupyter-close-connection',
                                                    params: {},
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        enable: true,
                                        type: { NodeDocument: { enable: true } },
                                        mode: "button",
                                        icon: "#iconRefresh",
                                        label: {
                                            zh_CN: "重启内核",
                                            zh_CHT: "重啟內核",
                                            other: "Restart Kernel",
                                        },
                                        click: {
                                            enable: true,
                                            callback: null,
                                            tasks: [
                                                {
                                                    type: 'jupyter-restart-kernel',
                                                    params: {},
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        enable: true,
                                        type: { NodeDocument: { enable: true } },
                                        mode: "button",
                                        icon: "#iconPlay",
                                        label: {
                                            zh_CN: "运行所有单元格 (转义输出: ✔ 控制字符: ✔)",
                                            zh_CHT: "運行所有單元格 (轉義輸出: ✔ 控製字符: ✔)",
                                            other: "Run All Cells (Escape: ✔ cntrl: ✔)",
                                        },
                                        click: {
                                            enable: true,
                                            callback: null,
                                            tasks: [
                                                {
                                                    type: 'jupyter-run-all-cells',
                                                    params: { escaped: true, cntrl: true },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        enable: true,
                                        type: { NodeDocument: { enable: true } },
                                        mode: "button",
                                        icon: "#iconPlay",
                                        label: {
                                            zh_CN: "运行所有单元格 (转义输出: ✔ 控制字符: ✖)",
                                            zh_CHT: "運行所有單元格 (轉義輸出: ✔ 控製字符: ✖)",
                                            other: "Run All Cells (Escape: ✔ cntrl: ✖)",
                                        },
                                        click: {
                                            enable: true,
                                            callback: null,
                                            tasks: [
                                                {
                                                    type: 'jupyter-run-all-cells',
                                                    params: { escaped: true, cntrl: false },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        enable: true,
                                        type: { NodeDocument: { enable: true } },
                                        mode: "button",
                                        icon: "#iconPlay",
                                        label: {
                                            zh_CN: "运行所有单元格 (转义输出: ✖ 控制字符: ✔)",
                                            zh_CHT: "運行所有單元格 (轉義輸出: ✖ 控製字符: ✔)",
                                            other: "Run All Cells (Escape: ✖ cntrl: ✔)",
                                        },
                                        click: {
                                            enable: true,
                                            callback: null,
                                            tasks: [
                                                {
                                                    type: 'jupyter-run-all-cells',
                                                    params: { escaped: false, cntrl: true },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        enable: true,
                                        type: { NodeDocument: { enable: true } },
                                        mode: "button",
                                        icon: "#iconPlay",
                                        label: {
                                            zh_CN: "运行所有单元格 (转义输出: ✖ 控制字符: ✖)",
                                            zh_CHT: "運行所有單元格 (轉義輸出: ✖ 控製字符: ✖)",
                                            other: "Run All Cells (Escape: ✖ cntrl: ✖)",
                                        },
                                        click: {
                                            enable: true,
                                            callback: null,
                                            tasks: [
                                                {
                                                    type: 'jupyter-run-all-cells',
                                                    params: { escaped: false, cntrl: false },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        enable: true,
                                        type: { NodeCodeBlock: { enable: true, subtype: { null: true } } },
                                        mode: "button",
                                        icon: "#iconPlay",
                                        label: {
                                            zh_CN: "运行代码 (转义输出: ✔ 控制字符: ✔)",
                                            zh_CHT: "運行代碼 (轉義輸出: ✔ 控製字符: ✔)",
                                            other: "Run Code (Escape: ✔ cntrl: ✔)",
                                        },
                                        click: {
                                            enable: true,
                                            callback: null,
                                            tasks: [
                                                {
                                                    type: 'jupyter-run-cell',
                                                    params: { escaped: true, cntrl: true },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        enable: true,
                                        type: { NodeCodeBlock: { enable: true, subtype: { null: true } } },
                                        mode: "button",
                                        icon: "#iconPlay",
                                        label: {
                                            zh_CN: "运行代码 (转义输出: ✔ 控制字符: ✖)",
                                            zh_CHT: "運行代碼 (轉義輸出: ✔ 控製字符: ✖)",
                                            other: "Run Code (Escape: ✔ cntrl: ✖)",
                                        },
                                        click: {
                                            enable: true,
                                            callback: null,
                                            tasks: [
                                                {
                                                    type: 'jupyter-run-cell',
                                                    params: { escaped: true, cntrl: false },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        enable: true,
                                        type: { NodeCodeBlock: { enable: true, subtype: { null: true } } },
                                        mode: "button",
                                        icon: "#iconPlay",
                                        label: {
                                            zh_CN: "运行代码 (转义输出: ✖ 控制字符: ✔)",
                                            zh_CHT: "運行代碼 (轉義輸出: ✖ 控製字符: ✔)",
                                            other: "Run Code (Escape: ✖ cntrl: ✔)",
                                        },
                                        click: {
                                            enable: true,
                                            callback: null,
                                            tasks: [
                                                {
                                                    type: 'jupyter-run-cell',
                                                    params: { escaped: false, cntrl: true },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        enable: true,
                                        type: { NodeCodeBlock: { enable: true, subtype: { null: true } } },
                                        mode: "button",
                                        icon: "#iconPlay",
                                        label: {
                                            zh_CN: "运行代码 (转义输出: ✖ 控制字符: ✖)",
                                            zh_CHT: "運行代碼 (轉義輸出: ✖ 控製字符: ✖)",
                                            other: "Run Code (Escape: ✖ cntrl: ✖)",
                                        },
                                        click: {
                                            enable: true,
                                            callback: null,
                                            tasks: [
                                                {
                                                    type: 'jupyter-run-cell',
                                                    params: { escaped: false, cntrl: false },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        enable: true,
                                        type: { NodeDocument: { enable: true } },
                                        mode: "button",
                                        icon: "#iconDownload",
                                        accelerator: "*.ipynb",
                                        label: {
                                            zh_CN: "导入 Jupyter 笔记本 (覆盖)",
                                            zh_CHT: "導入 Jupyter 筆記本 (覆蓋)",
                                            other: "Import Jupyter Notebook (Overwrite)",
                                        },
                                        click: {
                                            enable: true,
                                            callback: null,
                                            tasks: [
                                                {
                                                    type: 'file-select',
                                                    params: {
                                                        accept: ['.ipynb'], // 选择文件类型
                                                        multiple: false, // 是否允许多选
                                                        mode: 'w', // 覆盖当前文档
                                                        callback: 'jupyter-import-ipynb', // 处理方法
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        enable: true,
                                        type: { NodeDocument: { enable: true } },
                                        mode: "button",
                                        icon: "#iconDownload",
                                        accelerator: "*.ipynb",
                                        label: {
                                            zh_CN: "导入 Jupyter 笔记本 (追加)",
                                            zh_CHT: "導入 Jupyter 筆記本 (追加)",
                                            other: "Import Jupyter Notebook (Append)",
                                        },
                                        click: {
                                            enable: true,
                                            callback: null,
                                            tasks: [
                                                {
                                                    type: 'file-select',
                                                    params: {
                                                        accept: ['.ipynb'],
                                                        multiple: false,
                                                        mode: 'a', // 在当前文档末尾追加
                                                        callback: 'jupyter-import-ipynb',
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                ],
                            },
                            { // 分享设置
                                enable: (() => {
                                    switch (true) {
                                        case window.location.host === 'localhost':
                                        case window.location.host.endsWith('.localhost'):
                                        case window.location.host === '[::1]':
                                        case /127\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(window.location.host):
                                            /* 环回地址关闭分享 */
                                            return false;
                                        default:
                                            /* 非环回地址开启分享 */
                                            return true;
                                    }
                                })(),
                                prefixSeparator: true,
                                suffixSeparator: false,
                                type: null,
                                id: 'theme-menu-publish',
                                mode: "button",
                                icon: "#iconLanguage",
                                label: {
                                    zh_CN: "分享",
                                    zh_CHT: "分享",
                                    other: "Share",
                                },
                                accelerator: "",
                                click: { enable: false },
                                itemsLoad: true, // 是否加载子菜单
                                itemsIcon: "#iconRight",
                                items: [
                                    {
                                        enable: true,
                                        type: null,
                                        mode: "button",
                                        icon: "#iconLink",
                                        label: {
                                            zh_CN: "复制访问链接 (桌面设备)",
                                            zh_CHT: "複製訪問鏈接 (桌面設備)",
                                            other: "Copy Access Link (Desktop Device)",
                                        },
                                        click: {
                                            enable: true,
                                            callback: null,
                                            tasks: [
                                                {
                                                    type: 'copy-share-link', // 复制分享链接
                                                    params: {
                                                        focus: false,
                                                        platform: 'desktop',
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        enable: true,
                                        type: null,
                                        mode: "button",
                                        icon: "#iconLink",
                                        label: {
                                            zh_CN: "复制访问链接 (移动设备)",
                                            zh_CHT: "複製訪問鏈接 (移動設備)",
                                            other: "Copy Access Link (Mobile Device)",
                                        },
                                        click: {
                                            enable: true,
                                            callback: null,
                                            tasks: [
                                                {
                                                    type: 'copy-share-link', // 复制分享链接
                                                    params: {
                                                        focus: false,
                                                        platform: 'mobile',
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        enable: true,
                                        type: null,
                                        mode: "button",
                                        icon: "#iconLink",
                                        label: {
                                            zh_CN: "复制访问链接 (嵌入网页)",
                                            zh_CHT: "複製訪問鏈接 (嵌入網頁)",
                                            other: "Copy Access Link (Embed in Web)",
                                        },
                                        click: {
                                            enable: true,
                                            callback: null,
                                            tasks: [
                                                {
                                                    type: 'copy-share-link', // 复制分享链接
                                                    params: {
                                                        focus: true,
                                                        platform: 'mobile',
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                ],
                            },
                            { // 发布设置
                                enable: false,
                                prefixSeparator: false,
                                suffixSeparator: false,
                                type: {
                                    NodeDocument: { enable: true },
                                },
                                id: 'theme-menu-publish',
                                mode: "button",
                                icon: "#iconLanguage",
                                label: {
                                    zh_CN: "发布",
                                    zh_CHT: "發布",
                                    other: "Publish",
                                },
                                accelerator: "",
                                click: { enable: false },
                                itemsLoad: true, // 是否加载子菜单
                                itemsIcon: "#iconRight",
                                items: [
                                    {
                                        enable: true,
                                        type: { NodeDocument: { enable: true } },
                                        mode: "button",
                                        icon: "#iconTrashcan",
                                        label: {
                                            zh_CN: "删除访问权限",
                                            zh_CHT: "刪除訪問權限",
                                            other: "Remove Access",
                                        },
                                        click: {
                                            enable: true,
                                            callback: null,
                                            tasks: [
                                                {
                                                    type: 'attr-update', // 覆盖属性值
                                                    params: {
                                                        'custom-publish-access': null,
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        enable: true,
                                        type: { NodeDocument: { enable: true } },
                                        mode: "button",
                                        icon: "#iconLanguage",
                                        label: {
                                            zh_CN: "访问权限: 公开",
                                            zh_CHT: "訪問權限: 公開",
                                            other: "Access: Public",
                                        },
                                        accelerator: "publish-access: public",
                                        click: {
                                            enable: true,
                                            callback: null,
                                            tasks: [
                                                {
                                                    type: 'attr-update', // 覆盖属性值
                                                    params: {
                                                        'custom-publish-access': 'public',
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        enable: true,
                                        type: { NodeDocument: { enable: true } },
                                        mode: "button",
                                        icon: "#iconLock",
                                        label: {
                                            zh_CN: "访问权限: 受保护",
                                            zh_CHT: "訪問權限: 受保護",
                                            other: "Access: Protected",
                                        },
                                        accelerator: "publish-access: protected",
                                        click: {
                                            enable: true,
                                            callback: null,
                                            tasks: [
                                                {
                                                    type: 'attr-update', // 覆盖属性值
                                                    params: {
                                                        'custom-publish-access': 'protected',
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        enable: true,
                                        type: { NodeDocument: { enable: true } },
                                        mode: "button",
                                        icon: "#iconAccount",
                                        label: {
                                            zh_CN: "访问权限: 私有",
                                            zh_CHT: "訪問權限: 私有",
                                            other: "Access: Private",
                                        },
                                        accelerator: "publish-access: private",
                                        click: {
                                            enable: true,
                                            callback: null,
                                            tasks: [
                                                {
                                                    type: 'attr-update', // 覆盖属性值
                                                    params: {
                                                        'custom-publish-access': 'private',
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                    // { // 菜单项中的输入框
                                    //     enable: true,
                                    //     type: null,
                                    //     mode: "input",
                                    //     icon: "#iconSelect",
                                    //     id: "theme-menu-token",
                                    //     value: 'custom.theme.jupyter.server', // eval(value)
                                    //     placeholder: { // 占位符
                                    //         zh_CN: "访问令牌",
                                    //         zh_CHT: "訪問令牌",
                                    //         other: "Token",
                                    //     },
                                    //     click: {
                                    //         enable: true,
                                    //         callback: null,
                                    //         tasks: [
                                    //             {
                                    //                 type: 'save-input-value',
                                    //                 params: {
                                    //                     id: "theme-menu-token",
                                    //                     key: "custom.theme.jupyter.server", // eval(key = value)
                                    //                 },
                                    //             },
                                    //         ],
                                    //     },
                                    // },
                                ],
                            },
                            { // 其他功能
                                enable: true,
                                prefixSeparator: true,
                                suffixSeparator: false,
                                type: null,
                                id: 'theme-menu-block-more',
                                mode: "button",
                                icon: "#iconMore",
                                label: {
                                    zh_CN: "更多",
                                    zh_CHT: "更多",
                                    other: "More",
                                },
                                accelerator: "",
                                click: {
                                    enable: false,
                                },
                                itemsLoad: true,
                                itemsIcon: "#iconRight",
                                items: [ // 子菜单项列表
                                    {
                                        enable: true,
                                        type: null,
                                        mode: "button",
                                        icon: "#iconOpenWindow",
                                        label: {
                                            zh_CN: "在新窗口打开",
                                            zh_CHT: "在新窗口打開",
                                            other: "Open in a New Window",
                                        },
                                        accelerator: () => config.theme.hotkeys.window.open.block.outfocus,
                                        click: {
                                            enable: true,
                                            callback: null,
                                            tasks: [
                                                {
                                                    type: 'window-open',
                                                    params: {},
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        enable: true,
                                        type: null,
                                        mode: "button",
                                        icon: "#iconFocus",
                                        label: {
                                            zh_CN: "在新窗口打开并聚焦",
                                            zh_CHT: "在新窗口打開並聚焦",
                                            other: "Open in a New Window and Focus",
                                        },
                                        accelerator: () => config.theme.hotkeys.window.open.block.infocus,
                                        click: {
                                            enable: true,
                                            callback: null,
                                            tasks: [
                                                {
                                                    type: 'window-open',
                                                    params: {
                                                        focus: true,
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        enable: true,
                                        type: {
                                            NodeAudio: { enable: true },
                                            NodeIFrame: { enable: true },
                                            NodeVideo: { enable: true },
                                            NodeWidget: { enable: true },
                                        },
                                        mode: "button",
                                        icon: "#iconLanguage",
                                        label: {
                                            zh_CN: "在新窗口打开资源",
                                            zh_CHT: "在新窗口打開資源",
                                            other: "Open the resource in a New Window",
                                        },
                                        click: {
                                            enable: true,
                                            callback: null,
                                            tasks: [
                                                {
                                                    type: 'window-open',
                                                    params: {
                                                        src: true,
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        enable: true,
                                        type: null,
                                        mode: "separator",
                                    },
                                    { // @deprecated
                                        enable: false,
                                        type: null,
                                        mode: "button",
                                        icon: "#iconPreview",
                                        label: {
                                            zh_CN: "查看 Markdown 源代码",
                                            zh_CHT: "查看 Markdown 源代碼",
                                            other: "Review the Markdown Source Code",
                                        },
                                        accelerator: () => config.theme.hotkeys.window.open.editor,
                                        click: {
                                            enable: true,
                                            callback: null,
                                            tasks: [
                                                {
                                                    type: 'window-open-editor',
                                                    params: {
                                                        mode: 'block',
                                                        type: 'markdown',
                                                        lang: (() => window.theme.languageMode)(),
                                                        fontFamily: (() => encodeURI(window.siyuan.config.editor.fontFamily))(),
                                                        tabSize: (() => window.siyuan.config.editor.codeTabSpaces)(),
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                    { // @deprecated
                                        enable: false,
                                        type: null,
                                        mode: "button",
                                        icon: "#iconEdit",
                                        label: {
                                            zh_CN: "编辑 Kramdown 源代码",
                                            zh_CHT: "編輯 Kramdown 源代碼",
                                            other: "Edit the Kramdown Source Code",
                                        },
                                        accelerator: () => config.theme.hotkeys.window.open.markdown,
                                        click: {
                                            enable: true,
                                            callback: null,
                                            tasks: [
                                                {
                                                    type: 'window-open-editor',
                                                    params: {
                                                        mode: 'block',
                                                        type: 'kramdown',
                                                        lang: (() => window.theme.languageMode)(),
                                                        fontFamily: (() => encodeURI(window.siyuan.config.editor.fontFamily))(),
                                                        tabSize: (() => window.siyuan.config.editor.codeTabSpaces)(),
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        enable: false,
                                        type: {
                                            NodeDocument: { enable: false },
                                            default: { enable: true },
                                        },
                                        mode: "separator",
                                    },
                                    {
                                        enable: true,
                                        type: {
                                            NodeDocument: { enable: false },
                                            default: { enable: true },
                                        }, mode: "input",
                                        icon: "#iconTheme",
                                        id: 'theme-input-style',
                                        value: {
                                            mode: 'attr',
                                            key: 'style',
                                        },
                                        placeholder: { // 占位符
                                            zh_CN: "块样式",
                                            zh_CHT: "塊樣式",
                                            other: "Block Style",
                                        },
                                        accelerator: 'style',
                                        onchange: { // 为 input 绑定 onchange 事件
                                            enable: true,
                                            callback: null,
                                            tasks: [
                                                {
                                                    type: 'save-input-value',
                                                    params: {
                                                        mode: 'attr',
                                                        key: 'style',
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        enable: true,
                                        type: null,
                                        mode: "separator",
                                    },
                                    {
                                        enable: true,
                                        type: {
                                            NodeDocument: { enable: false },
                                            default: { enable: true },
                                        },
                                        mode: "button",
                                        icon: "#iconUpload",
                                        label: {
                                            zh_CN: "固定到顶部",
                                            zh_CHT: "固定到頂部",
                                            other: "Pin to Top",
                                        },
                                        accelerator: "position: top",
                                        click: {
                                            enable: true,
                                            callback: null,
                                            tasks: [
                                                {
                                                    type: 'attr-switch',
                                                    params: {
                                                        'custom-position': [
                                                            'top',
                                                            null,
                                                        ],
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        enable: true,
                                        type: {
                                            NodeDocument: { enable: false },
                                            default: { enable: true },
                                        },
                                        mode: "button",
                                        icon: "#iconDownload",
                                        label: {
                                            zh_CN: "固定到底部",
                                            zh_CHT: "固定到底部",
                                            other: "Pin to Bottom",
                                        },
                                        accelerator: "position: bottom",
                                        click: {
                                            enable: true,
                                            callback: null,
                                            tasks: [
                                                {
                                                    type: 'attr-switch',
                                                    params: {
                                                        'custom-position': [
                                                            'bottom',
                                                            null,
                                                        ],
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        enable: true,
                                        type: null,
                                        mode: "button",
                                        icon: "#iconBefore",
                                        label: {
                                            zh_CN: "弹幕",
                                            zh_CHT: "彈幕",
                                            other: "Danmaku",
                                        },
                                        accelerator: "render: danmaku",
                                        click: {
                                            enable: true,
                                            callback: null,
                                            tasks: [
                                                {
                                                    type: 'attr-switch',
                                                    params: {
                                                        'custom-render': [
                                                            'danmaku',
                                                            null,
                                                        ],
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        enable: true,
                                        type: null,
                                        mode: "button",
                                        icon: "#iconScrollWrapped",
                                        label: {
                                            zh_CN: "滚屏显示",
                                            zh_CHT: "滾屏顯示",
                                            other: "Scrolling Display",
                                        },
                                        accelerator: "render: scroll",
                                        click: {
                                            enable: true,
                                            callback: null,
                                            tasks: [
                                                {
                                                    type: 'attr-switch',
                                                    params: {
                                                        'custom-render': [
                                                            'scroll',
                                                            null,
                                                        ],
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        enable: true,
                                        type: {
                                            NodeAudio: { enable: true },
                                            NodeIFrame: { enable: true },
                                            NodeVideo: { enable: true },
                                            NodeWidget: { enable: true },
                                        },
                                        mode: "button",
                                        icon: "#iconMenu",
                                        label: {
                                            zh_CN: "全宽显示",
                                            zh_CHT: "全寬顯示",
                                            other: "Full-width Display",
                                        },
                                        accelerator: "width: 100%",
                                        click: {
                                            enable: true,
                                            callback: null,
                                            tasks: [
                                                {
                                                    type: 'attr-switch',
                                                    params: {
                                                        'custom-width': [
                                                            '100%',
                                                            null,
                                                        ],
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        enable: true,
                                        type: null,
                                        mode: "button",
                                        icon: "#iconFullscreen",
                                        label: {
                                            zh_CN: "全屏显示",
                                            zh_CHT: "全屏顯示",
                                            other: "Full-screen Display",
                                        },
                                        accelerator: () => config.theme.hotkeys.fullscreen.iframe,
                                        click: {
                                            enable: true,
                                            callback: null,
                                            tasks: [
                                                {
                                                    type: 'full-screen',
                                                    params: {},
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        enable: true,
                                        type: {
                                            NodeDocument: { enable: true },
                                            NodeBlockQueryEmbed: { enable: true },
                                            NodeBlockquote: { enable: true },
                                            NodeList: { enable: true },
                                            NodeListItem: { enable: true },
                                            NodeSuperBlock: { enable: true },
                                            NodeHeading: { enable: true },
                                            NodeParagraph: { enable: true },
                                            NodeTable: { enable: true },
                                        },
                                        mode: "separator",
                                    },
                                    {
                                        enable: true,
                                        type: {
                                            NodeDocument: { enable: true },
                                            NodeBlockQueryEmbed: { enable: true },
                                            NodeBlockquote: { enable: true },
                                            NodeList: { enable: true },
                                            NodeListItem: { enable: true },
                                            NodeSuperBlock: { enable: true },
                                            NodeHeading: { enable: true },
                                            NodeParagraph: { enable: true },
                                            NodeTable: { enable: true },
                                        },
                                        mode: "button",
                                        icon: "#iconMark",
                                        label: {
                                            zh_CN: "显示标记文本",
                                            zh_CHT: "顯示標記文本",
                                            other: "Display Marked Text",
                                        },
                                        accelerator: "mark: display",
                                        click: {
                                            enable: true,
                                            callback: null,
                                            tasks: [
                                                {
                                                    type: 'attr-switch',
                                                    params: {
                                                        'custom-mark': [
                                                            'display',
                                                            null,
                                                        ],
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        enable: true,
                                        type: {
                                            NodeDocument: { enable: true },
                                            NodeBlockQueryEmbed: { enable: true },
                                            NodeBlockquote: { enable: true },
                                            NodeList: { enable: true },
                                            NodeListItem: { enable: true },
                                            NodeSuperBlock: { enable: true },
                                            NodeHeading: { enable: true },
                                            NodeParagraph: { enable: true },
                                            NodeTable: { enable: true },
                                        },
                                        mode: "button",
                                        icon: "#iconEdit",
                                        label: {
                                            zh_CN: "切换书写模式",
                                            zh_CHT: "切換書寫模式",
                                            other: "Toggle Writing Modes",
                                        },
                                        accelerator: "writing-mode",
                                        click: {
                                            enable: true,
                                            callback: null,
                                            tasks: [
                                                {
                                                    type: 'attr-switch',
                                                    params: {
                                                        'custom-writing-mode': [
                                                            'vertical-rl',
                                                            'vertical-lr',
                                                            'sideways-rl',
                                                            'sideways-lr',
                                                            null,
                                                        ],
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        enable: true,
                                        type: {
                                            NodeDocument: { enable: true },
                                        },
                                        mode: "separator",
                                    },
                                    {
                                        enable: true, // 是否启用子菜单项
                                        type: { // 在哪些块启用菜单项
                                            NodeDocument: {
                                                enable: true, // 是否在该块类型启用菜单项
                                            },
                                        },
                                        mode: "button", // 模式: button, separator
                                        icon: "#iconH1", // 子菜单项图标
                                        label: {
                                            zh_CN: "标题自动编号",
                                            zh_CHT: "標題自動編號",
                                            other: "Automatic Headling Numbering",
                                        },
                                        accelerator: "auto-num-h: 0", // 子菜单项快捷键
                                        click: { // 子菜单项点击事件
                                            enable: true, // 是否启用点击事件
                                            callback: null, // 点击事件回调(优先使用)
                                            // callback: (id) => {}, // 示例
                                            tasks: [ // 点击事件任务列表(次优使用)
                                                {
                                                    type: 'attr-switch', // 任务处理方法名(属性值切换)
                                                    params: { // 任务处理方法参数
                                                        'custom-auto-num-h': [
                                                            '0',
                                                            null,
                                                        ],
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        enable: true,
                                        type: {
                                            NodeDocument: { enable: true },
                                        },
                                        mode: "button",
                                        icon: "#iconImage",
                                        label: {
                                            zh_CN: "图片自动编号",
                                            zh_CHT: "圖片自動編號",
                                            other: "Automatic Picture Numbering",
                                        },
                                        accelerator: "auto-num-f: Fig.",
                                        click: {
                                            enable: true,
                                            callback: null,
                                            tasks: [
                                                {
                                                    type: 'attr-switch',
                                                    params: {
                                                        'custom-auto-num-f': [
                                                            '图',
                                                            '图片',
                                                            'Fig.',
                                                            'figure',
                                                            'Figure',
                                                            'FIGURE',
                                                            null,
                                                        ],
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        enable: true,
                                        type: {
                                            NodeDocument: { enable: true },
                                        },
                                        mode: "button",
                                        icon: "#iconTable",
                                        label: {
                                            zh_CN: "表格自动编号",
                                            zh_CHT: "表格自動編號",
                                            other: "Automatic Table Numbering",
                                        },
                                        accelerator: "auto-num-t: Tab.",
                                        click: {
                                            enable: true,
                                            callback: null,
                                            tasks: [
                                                {
                                                    type: 'attr-switch',
                                                    params: {
                                                        'custom-auto-num-t': [
                                                            '表',
                                                            '表格',
                                                            'Tab.',
                                                            'table',
                                                            'Table',
                                                            'TABLE',
                                                            null,
                                                        ],
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        enable: true,
                                        type: {
                                            NodeDocument: { enable: true },
                                        },
                                        mode: "separator",
                                    },
                                    {
                                        enable: true,
                                        type: {
                                            NodeDocument: { enable: true },
                                        },
                                        mode: "button",
                                        icon: "#iconTrashcan",
                                        label: {
                                            zh_CN: "清除浏览位置记录",
                                            zh_CHT: "清除瀏覽位置記錄",
                                            other: "Clear Browsing Location History",
                                        },
                                        accelerator: "",
                                        click: {
                                            enable: true,
                                            callback: null,
                                            tasks: [
                                                {
                                                    type: 'attr-update', // 覆盖属性值
                                                    params: {
                                                        'custom-location': null,
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        enable: true,
                                        type: {
                                            NodeDocument: { enable: true },
                                        },
                                        mode: "separator",
                                    },
                                    {
                                        enable: true,
                                        type: {
                                            NodeDocument: { enable: true },
                                        },
                                        mode: "button",
                                        icon: "#iconInfo",
                                        label: {
                                            zh_CN: "显示 ID",
                                            zh_CHT: "顯示 ID",
                                            other: "Display ID",
                                        },
                                        accelerator: "render: id",
                                        click: {
                                            enable: true,
                                            callback: null,
                                            tasks: [
                                                {
                                                    type: 'attr-switch',
                                                    params: {
                                                        'custom-render': [
                                                            'id',
                                                            null,
                                                        ],
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        enable: true,
                                        type: {
                                            NodeDocument: { enable: true },
                                        },
                                        mode: "button",
                                        icon: "#iconLink",
                                        label: {
                                            zh_CN: "显示超链接",
                                            zh_CHT: "顯示超鏈接",
                                            other: "Display Hypertext ",
                                        },
                                        accelerator: "render: href",
                                        click: {
                                            enable: true,
                                            callback: null,
                                            tasks: [
                                                {
                                                    type: 'attr-switch',
                                                    params: {
                                                        'custom-render': [
                                                            'href',
                                                            null,
                                                        ],
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        enable: true,
                                        type: {
                                            NodeDocument: { enable: true },
                                        },
                                        mode: "separator",
                                    },
                                    {
                                        enable: true,
                                        type: {
                                            NodeDocument: { enable: true },
                                        },
                                        mode: "button",
                                        icon: "#iconSpreadOdd",
                                        label: {
                                            zh_CN: "显示块序号",
                                            zh_CHT: "顯示塊序號",
                                            other: "Display Block Number",
                                        },
                                        accelerator: "render: index",
                                        click: {
                                            enable: true,
                                            callback: null,
                                            tasks: [
                                                {
                                                    type: 'attr-switch',
                                                    params: {
                                                        'custom-render': [
                                                            'index',
                                                            null,
                                                        ],
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        enable: true,
                                        type: {
                                            NodeDocument: { enable: true },
                                        },
                                        mode: "button",
                                        icon: "#iconMarkdown",
                                        label: {
                                            zh_CN: "显示块内容",
                                            zh_CHT: "顯示塊內容",
                                            other: "Display Block Content",
                                        },
                                        accelerator: "render: content",
                                        click: {
                                            enable: true,
                                            callback: null,
                                            tasks: [
                                                {
                                                    type: 'attr-switch',
                                                    params: {
                                                        'custom-render': [
                                                            'content',
                                                            null,
                                                        ],
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        enable: true,
                                        type: {
                                            NodeDocument: { enable: true },
                                        },
                                        mode: "button",
                                        icon: "#iconMax",
                                        label: {
                                            zh_CN: "显示块轮廓",
                                            zh_CHT: "顯示塊輪廓",
                                            other: "Display Block Outline",
                                        },
                                        accelerator: "render: outline",
                                        click: {
                                            enable: true,
                                            callback: null,
                                            tasks: [
                                                {
                                                    type: 'attr-switch',
                                                    params: {
                                                        'custom-render': [
                                                            'outline',
                                                            null,
                                                        ],
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        enable: false,
                                        type: {
                                            NodeBlockQueryEmbed: { enable: true },
                                        },
                                        mode: "separator",
                                    },
                                    {
                                        enable: false, // deprecated
                                        type: {
                                            NodeBlockQueryEmbed: { enable: true },
                                        },
                                        mode: "button",
                                        icon: "#iconFile",
                                        label: {
                                            zh_CN: "显示查询结果路径",
                                            zh_CHT: "顯示查詢結果路徑",
                                            other: "Display Query Results' Path",
                                        },
                                        click: {
                                            enable: true,
                                            callback: null,
                                            tasks: [
                                                {
                                                    type: 'show-hpath',
                                                    params: {},
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        enable: true,
                                        type: {
                                            NodeDocument: { enable: true },
                                            NodeList: { enable: true },
                                            NodeSuperBlock: { enable: true },
                                            NodeBlockquote: { enable: true },
                                            NodeBlockQueryEmbed: { enable: true },
                                        },
                                        mode: "separator",
                                    },
                                    {
                                        enable: true,
                                        type: {
                                            NodeDocument: { enable: true },
                                            NodeList: { enable: true },
                                            NodeSuperBlock: { enable: true },
                                            NodeBlockquote: { enable: true },
                                            NodeBlockQueryEmbed: { enable: true },
                                        },
                                        mode: "button",
                                        icon: "#iconList",
                                        label: {
                                            zh_CN: "列表-默认视图",
                                            zh_CHT: "列表-默認視圖",
                                            other: "List-Default View",
                                        },
                                        accelerator: "",
                                        click: {
                                            enable: true,
                                            callback: null,
                                            tasks: [
                                                {
                                                    type: 'attr-update', // 覆盖属性值
                                                    params: {
                                                        'custom-type': null,
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        enable: true,
                                        type: {
                                            NodeDocument: { enable: true },
                                            NodeList: { enable: true },
                                            NodeSuperBlock: { enable: true },
                                            NodeBlockquote: { enable: true },
                                            NodeBlockQueryEmbed: { enable: true },
                                        },
                                        mode: "button",
                                        icon: "#iconGraph",
                                        label: {
                                            zh_CN: "列表-脑图视图",
                                            zh_CHT: "列表-腦圖視圖",
                                            other: "List-Mind Map View",
                                        },
                                        accelerator: "type: map",
                                        click: {
                                            enable: true,
                                            callback: null,

                                            tasks: [
                                                {
                                                    type: 'attr-update',
                                                    params: {
                                                        'custom-type': 'map',
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        enable: true,
                                        type: {
                                            NodeDocument: { enable: true },
                                            NodeList: { enable: true },
                                            NodeSuperBlock: { enable: true },
                                            NodeBlockquote: { enable: true },
                                            NodeBlockQueryEmbed: { enable: true },
                                        },
                                        mode: "button",
                                        icon: "#iconTable",
                                        label: {
                                            zh_CN: "列表-表格视图",
                                            zh_CHT: "列表-表格視圖",
                                            other: "List-Table View",
                                        },
                                        accelerator: "type: table",
                                        click: {
                                            enable: true,
                                            callback: null,

                                            tasks: [
                                                {
                                                    type: 'attr-update',
                                                    params: {
                                                        'custom-type': 'table',
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        enable: true,
                                        type: {
                                            NodeDocument: { enable: true },
                                            NodeList: { enable: true },
                                            NodeSuperBlock: { enable: true },
                                            NodeBlockquote: { enable: true },
                                            NodeBlockQueryEmbed: { enable: true },
                                        },
                                        mode: "button",
                                        icon: "#iconSplitLR",
                                        label: {
                                            zh_CN: "列表-看板视图",
                                            zh_CHT: "列表-看板視圖",
                                            other: "List-Board View",
                                        },
                                        accelerator: "type: board",
                                        click: {
                                            enable: true,
                                            callback: null,

                                            tasks: [
                                                {
                                                    type: 'attr-update',
                                                    params: {
                                                        'custom-type': 'board',
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        enable: true,
                                        type: {
                                            NodeTable: { enable: true },
                                        },
                                        mode: "separator",
                                    },
                                    {
                                        enable: true,
                                        type: {
                                            NodeTable: { enable: true },
                                        },
                                        mode: "button",
                                        icon: "#iconFullscreen",
                                        label: {
                                            zh_CN: "默认宽度",
                                            zh_CHT: "默認寬度",
                                            other: "Full Width",
                                        },
                                        accelerator: "",
                                        click: {
                                            enable: true,
                                            callback: null,
                                            tasks: [
                                                {
                                                    type: 'attr-update',
                                                    params: {
                                                        'custom-table-width': null,
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        enable: true,
                                        type: {
                                            NodeTable: { enable: true },
                                        },
                                        mode: "button",
                                        icon: "#iconContract",
                                        label: {
                                            zh_CN: "自动宽度",
                                            zh_CHT: "自動寬度",
                                            other: "Automatic Width",
                                        },
                                        accelerator: "table-width: auto",
                                        click: {
                                            enable: true,
                                            callback: null,
                                            tasks: [
                                                {
                                                    type: 'attr-update',
                                                    params: {
                                                        'custom-table-width': 'auto',
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                    {
                                        enable: true,
                                        type: {
                                            NodeTable: { enable: true },
                                        },
                                        mode: "button",
                                        icon: "#iconPause",
                                        label: {
                                            zh_CN: "全等宽度",
                                            zh_CHT: "全等寬度",
                                            other: "Equal Width",
                                        },
                                        accelerator: "table-width: equal",
                                        click: {
                                            enable: true,
                                            callback: null,
                                            tasks: [
                                                {
                                                    type: 'attr-update',
                                                    params: {
                                                        'custom-table-width': 'equal',
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            tabbar: {
                enable: false, // 标签页菜单功能开关
                items: [ // 标签页菜单项
                    { // 归档所有打开的标签页
                        enable: true,
                        prefixSeparator: true,
                        suffixSeparator: false,
                        id: 'theme-menu-tabbar-archive',
                        mode: "button",
                        icon: "#iconBookmark",
                        label: {
                            zh_CN: "归档页签",
                            zh_CHT: "歸檔頁簽",
                            other: "Archive Tabs",
                        },
                        accelerator: "",
                        click: { enable: false },
                        itemsLoad: true, // 是否加载子菜单
                        itemsIcon: "#iconRight",
                        items: [
                            {
                                enable: true,
                                type: null,
                                mode: "button",
                                icon: "#iconPreview",
                                label: {
                                    zh_CN: "包含未修改的页签",
                                    zh_CHT: "包含未修改的頁簽",
                                    other: "Include Unupdate Tabs",
                                },
                                accelerator: "",
                                click: {
                                    enable: true,
                                    callback: null,
                                    tasks: [
                                        {
                                            type: 'tab-archive', // 归档标签页
                                            params: {
                                                unupdate: true,
                                                message: {
                                                    success: {
                                                        zh_CN: "归档完成，请刷新书签面板查看",
                                                        zh_CHT: "歸檔完成，請刷新書簽面板查看",
                                                        other: "Archive completed, please refresh the bookmarks panel to view",
                                                    },
                                                    error: {
                                                        zh_CN: "归档失败，没有符合条件的页签",
                                                        zh_CHT: "歸檔失敗，沒有符合條件的頁簽",
                                                        other: "Archive failed, no tabs meet the conditions",
                                                    },
                                                },
                                            },
                                        },
                                    ],
                                },
                            },
                            {
                                enable: true,
                                type: null,
                                mode: "button",
                                icon: "#iconEdit",
                                label: {
                                    zh_CN: "不包含未修改的页签",
                                    zh_CHT: "不包含未修改的頁簽",
                                    other: "Not Include Unupdate Tabs",
                                },
                                accelerator: "",
                                click: {
                                    enable: true,
                                    callback: null,
                                    tasks: [
                                        {
                                            type: 'tab-archive', // 归档标签页
                                            params: {
                                                unupdate: false,
                                                message: {
                                                    success: {
                                                        zh_CN: "归档完成，请刷新书签面板查看",
                                                        zh_CHT: "歸檔完成，請刷新書簽面板查看",
                                                        other: "Archive completed, please refresh the bookmarks panel to view",
                                                    },
                                                    error: {
                                                        zh_CN: "归档失败，没有符合条件的页签",
                                                        zh_CHT: "歸檔失敗，沒有符合條件的頁簽",
                                                        other: "Archive failed, no tabs meet the conditions",
                                                    },
                                                },
                                            },
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                ],
            },
        },
        comment: {
            // 批注功能开关
            enable: true,
        },
        hotkeys: {
            // 快捷键
            style: {
                render: {
                    // 渲染(Ctrl + F1)
                    enable: true,
                    CtrlCmd: true,
                    WinCtrl: false,
                    Shift: false,
                    Alt: false,
                    key: 'F1',
                },
                tabbar: {
                    // 纵向排列选项卡(Shift + Alt + B)
                    enable: false,
                    CtrlCmd: false,
                    WinCtrl: false,
                    Shift: true,
                    Alt: true,
                    key: 'B',
                },
                guides: {
                    // 列表辅助线样式(Shift + Alt + G)
                    enable: false,
                    CtrlCmd: false,
                    WinCtrl: false,
                    Shift: true,
                    Alt: true,
                    key: 'G',
                },
                mark: {
                    // 标记文本显示(Shift + Alt + E)
                    enable: false,
                    CtrlCmd: false,
                    WinCtrl: false,
                    Shift: true,
                    Alt: true,
                    key: 'E',
                },
            },
            timestamp: {
                jump: {
                    // 跳转到指定时间点(Ctrl + 单击)
                    enable: true,
                    CtrlCmd: true,
                    WinCtrl: false,
                    Shift: false,
                    Alt: false,
                    type: 'click',
                },
                create: {
                    // 新建时间戳(Ctrl + 鼠标中键)
                    enable: true,
                    CtrlCmd: true,
                    WinCtrl: false,
                    Shift: false,
                    Alt: false,
                    button: 1, // 鼠标中键
                },
            },
            blockattrs: {
                set: {
                    // 设置块属性(Ctrl + 鼠标中键)
                    enable: true,
                    CtrlCmd: true,
                    WinCtrl: false,
                    Shift: false,
                    Alt: false,
                    button: 1, // 鼠标中键
                },
            },
            reload: {
                window: {
                    // 刷新当前窗口(Ctrl + F5)
                    enable: true,
                    CtrlCmd: true,
                    WinCtrl: false,
                    Shift: false,
                    Alt: false,
                    key: 'F5',
                },
                iframe: {
                    // 刷新 iframe/widgets 块 (Ctrl + 单击)
                    enable: true,
                    CtrlCmd: true,
                    WinCtrl: false,
                    Shift: false,
                    Alt: false,
                    type: 'click',
                },
            },
            fullscreen: {
                iframe: {
                    // 全屏 iframe/widgets 块 (双击)
                    enable: true,
                    CtrlCmd: false,
                    WinCtrl: false,
                    Shift: false,
                    Alt: false,
                    type: 'dblclick',
                },
                mark: {
                    // 全屏指定块 (双击块标)
                    enable: true,
                    CtrlCmd: false,
                    WinCtrl: false,
                    Shift: false,
                    Alt: false,
                    type: 'dblclick',
                },
            },
            doc: {
                copy: {
                    // 复制当前文档全文(Shift + Alt + C)
                    enable: false,
                    CtrlCmd: false,
                    WinCtrl: false,
                    Shift: true,
                    Alt: true,
                    key: 'C',
                },
                delete: {
                    // 删除当前文档全文(Shift + Alt + D)
                    enable: false,
                    CtrlCmd: false,
                    WinCtrl: false,
                    Shift: true,
                    Alt: true,
                    key: 'D',
                },
                cut: {
                    // 剪切当前文档全文(Shift + Alt + X)
                    enable: false,
                    CtrlCmd: false,
                    WinCtrl: false,
                    Shift: true,
                    Alt: true,
                    key: 'X',
                },
                heading: {
                    fold: {
                        // 一键折叠当前文档所有标题(Shift + Alt + ↑)
                        enable: false,
                        CtrlCmd: false,
                        WinCtrl: false,
                        Shift: true,
                        Alt: true,
                        key: 'ArrowUp',
                    },
                    unfold: {
                        // 一键折展开当前文档所有标题(Shift + Alt + ↓)
                        enable: false,
                        CtrlCmd: false,
                        WinCtrl: false,
                        Shift: true,
                        Alt: true,
                        key: 'ArrowDown',
                    },
                },
                outline: {
                    u: {
                        // 复制当前文档大纲(无序列表)至剪贴板(Ctrl + Shift + Alt + U)
                        enable: false,
                        CtrlCmd: true,
                        WinCtrl: false,
                        Shift: true,
                        Alt: true,
                        key: 'U',
                    },
                    o: {
                        // 复制当前文档大纲(有序列表)至剪贴板(Ctrl + Shift + Alt + O)
                        enable: false,
                        CtrlCmd: true,
                        WinCtrl: false,
                        Shift: true,
                        Alt: true,
                        key: 'O',
                    },
                    t: {
                        // 复制当前文档大纲(任务列表)至剪贴板(Ctrl + Shift + Alt + T)
                        enable: false,
                        CtrlCmd: true,
                        WinCtrl: false,
                        Shift: true,
                        Alt: true,
                        key: 'T',
                    },
                },
            },
            typewriter: {
                switch: {
                    // 打字机模式开关(Shift + Alt + T)
                    enable: false,
                    CtrlCmd: false,
                    WinCtrl: false,
                    Shift: true,
                    Alt: true,
                    key: 'T',
                },
            },
            invert: {
                // 反色开关(Shift + Alt + I)
                enable: false,
                CtrlCmd: false,
                WinCtrl: false,
                Shift: true,
                Alt: true,
                key: 'I',
            },
            background: {
                image: {
                    web: {
                        // 更换网络背景图片(Shift + Alt + R)
                        enable: false,
                        CtrlCmd: false,
                        WinCtrl: false,
                        Shift: true,
                        Alt: true,
                        key: 'R',
                    },
                    custom: {
                        // 更换自定义背景图片(Ctrl + Shift + Alt + I)
                        enable: false,
                        CtrlCmd: true,
                        WinCtrl: false,
                        Shift: true,
                        Alt: true,
                        key: 'R',
                    },
                },
            },
            window: {
                open: {
                    block: {
                        outfocus: { // @deprecated
                            // 新窗口打开当前块, 否则打开当前文档(Shift + Alt + N)
                            enable: true,
                            CtrlCmd: false,
                            WinCtrl: false,
                            Shift: true,
                            Alt: true,
                            key: 'N',
                        },
                        infocus: { // @deprecated
                            // 新窗口打开当前块并聚焦, 否则打开当前文档(Ctrl + Shift + Alt + N)
                            enable: true,
                            CtrlCmd: true,
                            WinCtrl: false,
                            Shift: true,
                            Alt: true,
                            key: 'N',
                        },
                    },
                    link: {
                        outfocus: { // @deprecated
                            // 新窗口打开链接(鼠标中键)
                            enable: false,
                            CtrlCmd: false,
                            WinCtrl: false,
                            Shift: false,
                            Alt: false,
                            button: 1, // 鼠标中键
                        },
                        infocus: { // @deprecated
                            // 新窗口打开链接并聚焦(Shift + 鼠标中键)
                            enable: false,
                            CtrlCmd: false,
                            WinCtrl: false,
                            Shift: true,
                            Alt: false,
                            button: 1, // 鼠标中键
                        },
                    },
                    editor: { // @deprecated
                        // 新窗口打开编辑器(Alt + 鼠标中键)
                        enable: false,
                        CtrlCmd: false,
                        WinCtrl: false,
                        Shift: false,
                        Alt: true,
                        button: 1, // 鼠标中键
                    },
                    markdown: { // @deprecated
                        // 以 markdown 模式在新窗口打开编辑器(Shift + Alt + 鼠标中键)
                        enable: false,
                        CtrlCmd: false,
                        WinCtrl: false,
                        Shift: true,
                        Alt: true,
                        button: 1, // 鼠标中键
                    },
                },
            },
            wheel: {
                zoom: { // @deprecated
                    // 鼠标滚轮缩放(Ctrl + wheel)
                    enable: false,
                    CtrlCmd: true,
                    WinCtrl: false,
                    Shift: false,
                    Alt: false,
                    type: 'mousewheel',
                },
            },
            location: {
                slider: {
                    goto: {
                        // 跳转到上次浏览位置(鼠标右键单击块滚动条)
                        enable: true,
                        CtrlCmd: false,
                        WinCtrl: false,
                        Shift: false,
                        Alt: false,
                        button: 2, // 鼠标右键
                    },
                },
                record: {
                    // 记录浏览位置(Shift + Alt + L)
                    enable: false,
                    CtrlCmd: false,
                    WinCtrl: false,
                    Shift: true,
                    Alt: true,
                    key: 'L',
                },
                update: {
                    // 更新当前浏览位置(double-click)
                    enable: true,
                    CtrlCmd: false,
                    WinCtrl: false,
                    Shift: false,
                    Alt: false,
                    type: 'dblclick',
                },
                clear: {
                    // 移除浏览位置(Ctrl + Shift + Alt + L)
                    enable: false,
                    CtrlCmd: true,
                    WinCtrl: false,
                    Shift: true,
                    Alt: true,
                    key: 'L',
                },
            },
            dock: {
                fold: {
                    // 一键折叠/展开功能面板 | 专注模式 (Shift + Alt + F)
                    enable: false,
                    CtrlCmd: false,
                    WinCtrl: false,
                    Shift: true,
                    Alt: true,
                    key: 'F',
                },
            },
            menu: {
                block: {
                    // 块菜单开关(Shift + Alt + M)
                    enable: false,
                    CtrlCmd: false,
                    WinCtrl: false,
                    Shift: true,
                    Alt: true,
                    key: 'M',
                },
            },
        },
    },
};

async function loadCustomJs(path = '/widgets/custom.js') {
    try {
        // 合并配置文件 custom.js
        const customjs = await import(path);
        if (customjs?.config?.custom) merge(config.custom, customjs.config.custom);
        if (customjs?.config?.theme) merge(config.theme, customjs.config.theme);
        if (customjs?.callback) await customjs.callback(config);
    } catch (err) {
        console.warn(err);
    } finally {
        console.log(config);
    }
}

await loadCustomJs();

// 用户配置
const custom = {
    theme: {
        toolbar: {
            [config.theme.toolbar.more.id]: {
                default: true,
            }, // 工具栏状态
            [config.theme.location.record.toolbar.id]: { default: false }, // 当前浏览位置
            [config.theme.menu.block.toolbar.id]: { default: false }, // 块功能增强
            [config.theme.style.itemtext.toolbar.id]: { default: false }, // 完整显示文本内容
            [config.theme.style.tabbar.toolbar.id]: { default: false }, // 纵向排列选项卡
            [config.theme.style.guides.toolbar.id]: { default: false }, // 列表辅助线
            [config.theme.style.mark.toolbar.id]: { default: false }, // 显示标记文本
            [config.theme.invert.toolbar.id]: { default: false }, // 反色显示
            [config.theme.typewriter.switch.toolbar.id]: { default: false }, // 打字机模式
            [config.theme.dock.fold.toolbar.id]: { default: false }, // 专注模式
            [config.theme.readonly.toolbar.id]: { default: false }, // 只读模式
        },
        tooldock: {
            position: {
                left: "",
                right: "",
                top: "",
                bottom: "",
                width: "",
                height: "",
            }, // 悬浮工具栏位置
        },
        location: {},
        dock: {},
    },
};

/* 保存用户配置至文件 */
async function saveCustomFile(data = custom, path = config.custom.path) {
    const response = await putFile(path, JSON.stringify(data, undefined, 4));
    // console.log(response);
    return response;
}

async function loadCustomJson(path = config.custom.path) {
    try {
        // 合并配置文件 custom.json
        let customjson = await getFile(path);
        if (customjson) customjson = await customjson.json();
        if (customjson) merge(custom, customjson);
    } catch (err) {
        console.warn(err);
    } finally {
        console.log(custom);
    }
}

await loadCustomJson();
