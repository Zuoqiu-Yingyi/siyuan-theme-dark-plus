/* 配置文件(可以被 data/widgets/custom.js 覆盖) */

import { merge } from './../utils/misc.js';
import {
    getFile,
    putFile,
} from './../utils/api.js';

export var config = {
    token: '', // API token, 无需填写
    custom: {
        // 自定义配置
        path: '/data/widgets/custom.json', // 自定义配置文件路径
    },
    theme: {
        regs: {
            // 正则表达式
            url: /^siyuan:\/\/blocks\/(\d{14}\-[0-9a-z]{7})\/*(?:(?:\?)(\w+=\w+)(?:(?:\&)(\w+=\w+))+)?$/, // 思源 URL Scheme 正则表达式
            time: /^(\d+)(:[0-5]?[0-9]){0,2}(\.\d*)?$/, // 时间戳正则表达式
            id: /^\d{14}\-[0-9a-z]{7}$/, // 块 ID 正则表达式
            fontsize: /(?<=\.b3-typography|protyle-wysiwyg|protyle-title\s*\{\s*font-size\s*:\s*)(\d+)(?=px(?:\s+\!important)?(?:\s*;|\}))/,
            winpath: /^\/\w\:\/.*$/, // Windows 路径正则表达式
        },
        goto: {
            enable: true, // 是否启用使用 URL 参数跳转指定块功能
        },
        style: {
            enable: true, // 是否启用自定义样式渲染
            save: {
                enable: false, // 是否启用保存自定义样式
            },
            guides: {
                enable: true, // 是否启用辅助样式
                toolbar: { // 菜单栏
                    enable: true,
                    id: 'toolbar-theme-style-guides',
                    hotkey: () => config.theme.hotkeys.style.guides,
                    label: {
                        zh_CN: '列表辅助线',
                        zh_CNT: null,
                        fr_FR: null,
                        en_US: null,
                        other: 'List Guides',
                    },
                    icon: '#iconIndent',
                    index: -3,
                },
                elements: {
                    // 应用辅助线样式的元素
                    list: {
                        // 列表辅助线
                        enable: true,
                        style: {
                            id: 'theme-style-guides-elements-list-style',
                            href: '/appearance/themes/Dark+/style/dynamic-module/guides-list.css', // 样式文件 URL
                        },
                    },
                },
            },
            render: {
                enable: false, // 是否启用自定义样式渲染
                toolbar: { // 菜单栏
                    enable: true,
                    id: 'toolbar-theme-style-render',
                    hotkey: () => config.theme.hotkeys.style.render,
                    label: {
                        zh_CN: '渲染自定义样式',
                        zh_CNT: null,
                        fr_FR: null,
                        en_US: null,
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
            jump: {
                enable: true, // 是否启用跳转
            },
            create: {
                enable: true, // 是否启用生成时间戳
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
                    id: 'toolbar-theme-reload-window',
                    hotkey: () => config.theme.hotkeys.reload.window,
                    label: {
                        zh_CN: '重新加载窗口',
                        zh_CNT: null,
                        fr_FR: null,
                        en_US: null,
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
        doc: {
            enable: true, // 是否启用文档扩展功能
            outline: {
                enable: true, // 是否启用当前文档大纲复制功能
                u: {
                    enable: true, // 无序列表
                    toolbar: { // 菜单栏
                        enable: true,
                        id: 'toolbar-theme-doc-outline-u',
                        hotkey: () => config.theme.hotkeys.doc.outline.u,
                        label: {
                            zh_CN: '复制当前文档大纲为无序列表',
                            zh_CNT: null,
                            fr_FR: null,
                            en_US: null,
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
                        id: 'toolbar-theme-doc-outline-o',
                        hotkey: () => config.theme.hotkeys.doc.outline.o,
                        label: {
                            zh_CN: '复制当前文档大纲为有序列表',
                            zh_CNT: null,
                            fr_FR: null,
                            en_US: null,
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
                        id: 'toolbar-theme-doc-outline-t',
                        hotkey: () => config.theme.hotkeys.doc.outline.t,
                        label: {
                            zh_CN: '复制当前文档大纲为任务列表',
                            zh_CNT: null,
                            fr_FR: null,
                            en_US: null,
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
                headline: {
                    enable: false, // 是否在列表中添加标题级别标志
                    handler: (level, enable) => (enable ? `${'#'.repeat(level)} ` : ''),
                },
                top: 'h', // 大纲最顶层块类型('d': 文档块, 'h': 标题块)
            },
            copy: {
                enable: true, // 是否启用当前文档全文复制功能
                toolbar: { // 菜单栏
                    enable: true,
                    id: 'toolbar-theme-doc-copy',
                    hotkey: () => config.theme.hotkeys.doc.copy,
                    label: {
                        zh_CN: '复制当前文档内容 (Markdown)',
                        zh_CNT: null,
                        fr_FR: null,
                        en_US: null,
                        other: 'Copy the Current Document Content (Markdown)',
                    },
                    icon: '#iconCopy',
                    index: 10,
                },
            },
            delete: {
                enable: true, // 是否启用当前文档全文删除功能
                toolbar: { // 菜单栏
                    enable: false,
                    id: 'toolbar-theme-doc-delete',
                    hotkey: () => config.theme.hotkeys.doc.delete,
                    label: {
                        zh_CN: '删除当前文档内容',
                        zh_CNT: null,
                        fr_FR: null,
                        en_US: null,
                        other: 'Delete the Current Document Content',
                    },
                    icon: '#iconTrashcan',
                    index: 12,
                },
            },
            cut: {
                enable: true, // 是否启用当前文档全文剪切功能
                toolbar: { // 菜单栏
                    enable: false,
                    id: 'toolbar-theme-doc-cut',
                    hotkey: () => config.theme.hotkeys.doc.cut,
                    label: {
                        zh_CN: '剪切当前文档内容 (Markdown)',
                        zh_CNT: null,
                        fr_FR: null,
                        en_US: null,
                        other: 'Cut the Current Document Content (Markdown)',
                    },
                    icon: '#iconCut',
                    index: 11,
                },
            },
        },
        typewriter: {
            // 打字机模式开关
            enable: true,
            switch: {
                enable: true, // 是否启用打字机模式开关
                toolbar: { // 菜单栏
                    enable: true,
                    id: 'toolbar-theme-typewriter-switch',
                    hotkey: () => config.theme.hotkeys.typewriter.switch,
                    label: {
                        zh_CN: '打字机模式',
                        zh_CNT: null,
                        fr_FR: null,
                        en_US: null,
                        other: 'Typewriter Mode',
                    },
                    icon: '#iconKeymap',
                    index: -1,
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
                id: 'toolbar-theme-invert',
                hotkey: () => config.theme.hotkeys.invert,
                label: {
                    zh_CN: '反色显示',
                    zh_CNT: null,
                    fr_FR: null,
                    en_US: null,
                    other: 'Display in Inverse Color',
                },
                icon: '#iconMoon',
                index: -2,
            },
            elements: {
                // 反色元素
                img: {
                    // 图片反色
                    enable: true,
                    style: {
                        id: 'theme-invert-elements-img-style',
                        innerHTML: 'img:not(.emoji, .thumbnailImage), div.thumbnailSelectionRing {filter: invert(100%);}div.protyle-background__icon>img,span.b3-list-item__icon>img {filter: none;}', // 样式标签内容
                    },
                },
                viewer: {
                    // PDF 预览反色
                    enable: true,
                    style: {
                        id: 'theme-invert-elements-viewer-style',
                        innerHTML: '#viewer {filter: invert(100%);}',
                    },
                },
                iframe: {
                    // iframe 反色
                    enable: true,
                    style: {
                        id: 'theme-invert-elements-iframe-style',
                        innerHTML: 'iframe {filter: invert(100%);}',
                    },
                },
                video: {
                    // 视频反色
                    enable: true,
                    style: {
                        id: 'theme-invert-elements-video-style',
                        innerHTML: 'video {filter: invert(100%);}',
                    },
                },
            },
        },
        background: {
            // 背景图片功能开关
            enable: true,
            image: {
                enable: true, // 是否启用背景图片更改功能
                web: {
                    enable: true, // 网络背景图片
                    toolbar: { // 菜单栏
                        enable: true,
                        id: 'toolbar-theme-background-image-web',
                        hotkey: () => config.theme.hotkeys.background.image.web,
                        label: {
                            zh_CN: '更换背景图片 (网络)',
                            zh_CNT: null,
                            fr_FR: null,
                            en_US: null,
                            other: 'Change Background Image (Web)',
                        },
                        icon: '#iconImage',
                        index: 5,
                    },
                    random: true, // 是否随机切换网络背景图片 URL
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
                custom: {
                    enable: true, // 自定义背景图片
                    toolbar: { // 菜单栏
                        enable: true,
                        id: 'toolbar-theme-background-image-custom',
                        hotkey: () => config.theme.hotkeys.background.image.custom,
                        label: {
                            zh_CN: '更换背景图片 (自定义)',
                            zh_CNT: null,
                            fr_FR: null,
                            en_US: null,
                            other: 'Change Background Image (Custom)',
                        },
                        icon: '#iconImage',
                        index: 6,
                    },
                    random: true, // 是否随机选择自定义背景图片
                    default: false, // 是否默认使用自定义背景图片
                    light: [ // 自定义亮色背景图片 URL 列表
                        '/appearance/themes/Dark+/image/light/background (01).jpeg',
                        '/appearance/themes/Dark+/image/light/background (02).jpeg',
                        '/appearance/themes/Dark+/image/light/background (03).jpeg',
                        '/appearance/themes/Dark+/image/light/background (04).jpeg',
                        '/appearance/themes/Dark+/image/light/background (05).jpeg',
                        '/appearance/themes/Dark+/image/light/background (06).jpeg',
                    ],
                    dark: [ // 自定义暗色背景图片 URL 列表
                        '/appearance/themes/Dark+/image/background (01).jpg',
                        '/appearance/themes/Dark+/image/background (02).jpg',
                        '/appearance/themes/Dark+/image/background (03).jpg',
                        '/appearance/themes/Dark+/image/background (04).jpg',
                        '/appearance/themes/Dark+/image/background (05).jpg',
                        '/appearance/themes/Dark+/image/background (06).jpg',
                        '/appearance/themes/Dark+/image/background (07).jpg',
                        '/appearance/themes/Dark+/image/background (08).jpg',
                        '/appearance/themes/Dark+/image/background (09).jpg',
                        '/appearance/themes/Dark+/image/background (10).jpg',
                        '/appearance/themes/Dark+/image/background (11).jpg',
                        '/appearance/themes/Dark+/image/background (12).jpg',
                    ],
                },
            },
        },
        window: {
            enable: true, // 窗口功能开关
            open: {
                enable: true, // 打开窗口功能开关
                windowParams: {
                    // 窗口参数
                    width: 720, // 窗口宽度
                    height: 480, // 窗口高度
                    frame: true, // 是否显示边缘框
                    fullscreen: false, // 是否全屏显示
                    alwaysOnTop: true, // 是否置顶显示
                    autoHideMenuBar: true, // 是否隐藏菜单栏(使用 Alt 显示)
                    webPreferences: {
                        webSecurity: false, // 是否启用 Web 安全
                        nodeIntegration: true, // 是否启用 Node.js 内置模块
                        // defaultFontFamily: { // 默认字体
                        //     standard: window.siyuan.config.editor.fontFamily,
                        // },
                    },
                },
                panel: {
                    enable: true, // 打开一个新窗口
                    url: null, // 新窗口的 URL, 值 null 则为 '/stage/build/desktop/'
                    toolbar: { // 菜单栏
                        enable: true,
                        id: 'toolbar-theme-window-open-panel',
                        label: {
                            zh_CN: '打开一个新窗口',
                            zh_CNT: null,
                            fr_FR: null,
                            en_US: null,
                            other: 'Open a New Window',
                        },
                        icon: '#iconExport',
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
                            id: 'toolbar-theme-window-open-block-outfocus',
                            hotkey: () => config.theme.hotkeys.window.open.block.outfocus,
                            label: {
                                zh_CN: '在新窗口打开当前块',
                                zh_CNT: null,
                                fr_FR: null,
                                en_US: null,
                                other: 'Open the Current Block in a New Window',
                            },
                            icon: '#iconExport',
                            index: 2,
                        },
                    },
                    infocus: {
                        // 新窗口打开当前块并聚焦, 否则打开当前文档
                        enable: true,
                        toolbar: { // 菜单栏
                            enable: true,
                            id: 'toolbar-theme-window-open-block-infocus',
                            hotkey: () => config.theme.hotkeys.window.open.block.infocus,
                            label: {
                                zh_CN: '在新窗口打开当前块并聚焦',
                                zh_CNT: null,
                                fr_FR: null,
                                en_US: null,
                                other: 'Open the Current Block in a New Window and Focus',
                            },
                            icon: '#iconExport',
                            index: 3,
                        },
                    },
                },
                link: {
                    enable: true, // 新窗口打开当链接/块引用
                    outfocus: {
                        enable: true, // 不聚焦
                    },
                    infocus: {
                        enable: true, // 聚焦
                    },
                },
                editor: {
                    enable: true, // 启用新窗口打开当编辑器
                    labels: {
                        openFile: { zh_CN: '打开文件', other: 'Open File', },
                        open: { zh_CN: '打开', other: 'Open', },
                    },
                    path: {
                        // 路径
                        index: '/appearance/themes/Dark+/app/editor/', // 编辑器路径
                        temp: {
                            // 临时文件路径
                            relative: '/temp/editor/', // 临时文件相对路径
                            absolute: `${window.siyuan.config.system.workspaceDir}temp/editor/`.replaceAll('\\', '/').replaceAll('//', '/'), // 临时文件绝对路径
                        },
                    }
                },
            },
        },
        wheel: {
            enable: true, // 滚轮功能开关
            zoom: {
                enable: true, // 滚轮缩放功能开关
                threshold: 100, // 滚轮缩放阈值
                min: 9, // 最小字号(px)
                max: 72, // 最大字号(px)
            },
        },
        menu: {
            enable: true, // 菜单功能开关
            block: {
                enable: true, // 块菜单功能开关
                toolbar: { // 菜单栏
                    enable: true,
                    id: 'toolbar-theme-menu-block',
                    hotkey: () => config.theme.hotkeys.menu.block,
                    label: {
                        zh_CN: '块菜单增强',
                        zh_CNT: null,
                        fr_FR: null,
                        en_US: null,
                        other: 'Block Menu Enhancements',
                    },
                    icon: '#iconMenu',
                    index: -4,
                },
                items: [ // 块菜单项
                    { // 常用字体设置
                        enable: true, // 是否启用菜单项
                        prefixSeparator: true, // 是否添加前缀分隔线
                        suffixSeparator: false, // 是否添加后缀分隔线
                        type: null, // 哪些类型的块启用, 值 null 则全部启用
                        id: 'theme-menu-block-common-font', // 菜单项 ID
                        mode: "button",  // 菜单项类型
                        icon: "#iconFont",  // 菜单项图标
                        label: {  // 菜单项标签
                            zh_CN: "常用字体",
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
                                    other: "Default Font",
                                    style: `font-family: "${window.siyuan.config.editor.fontFamily}"`,
                                },
                                accelerator: window.siyuan.config.editor.fontFamily,
                                click: {
                                    enable: true,
                                    callback: null,
                                    tasks: [
                                        {
                                            type: 'attr-replace',
                                            params: {
                                                'style': {
                                                    regexp: /\s*font-family:.*?;/g,
                                                    substr: '',
                                                },
                                            },
                                        },
                                        {
                                            type: 'attr-update',
                                            params: {
                                                'custom-font-family': null,
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
                        type: null,
                        id: 'theme-menu-block-other-font',
                        mode: "button",
                        icon: "#iconFont",
                        label: {
                            zh_CN: "其他字体",
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
                                        item: () => config.theme.menu.block.items[1],
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
                                icon: "#iconExport",
                                label: {
                                    zh_CN: "在新窗口打开",
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
                                    NodeAudio: {
                                        enable: true,
                                    },
                                    NodeBlockQueryEmbed: {
                                        enable: true,
                                    },
                                    NodeCodeBlock: {
                                        enable: true,
                                    },
                                    NodeHTMLBlock: {
                                        enable: true,
                                    },
                                    NodeHeading: {
                                        enable: true,
                                    },
                                    NodeIFrame: {
                                        enable: true,
                                    },
                                    NodeMathBlock: {
                                        enable: true,
                                    },
                                    NodeParagraph: {
                                        enable: true,
                                    },
                                    NodeTable: {
                                        enable: true,
                                    },
                                    NodeVideo: {
                                        enable: true,
                                    },
                                },
                                mode: "button",
                                icon: "#iconCode",
                                label: {
                                    zh_CN: "在编辑器中打开",
                                    other: "Open in the Editor",
                                },
                                accelerator: "",
                                click: {
                                    enable: true,
                                    callback: null,
                                    tasks: [
                                        {
                                            type: 'window-open-editor',
                                            params: {
                                                mode: 'block',
                                                lang: (() => window.theme.languageMode)(),
                                                // theme: window.siyuan.config.appearance.mode,
                                                fontFamily: (() => encodeURI(window.siyuan.config.editor.fontFamily))(),
                                                tabSize: (() => window.siyuan.config.editor.codeTabSpaces)(),
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
                                type: null,
                                mode: "button",
                                icon: "#iconBefore",
                                label: {
                                    zh_CN: "弹幕",
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
                                    NodeDocument: {
                                        enable: true,
                                    },
                                    NodeBlockQueryEmbed: {
                                        enable: true,
                                    },
                                    NodeBlockquote: {
                                        enable: true,
                                    },
                                    NodeList: {
                                        enable: true,
                                    },
                                    NodeListItem: {
                                        enable: true,
                                    },
                                    NodeSuperBlock: {
                                        enable: true,
                                    },
                                    NodeHeading: {
                                        enable: true,
                                    },
                                    NodeParagraph: {
                                        enable: true,
                                    },
                                    NodeTable: {
                                        enable: true,
                                    },
                                },
                                mode: "separator",
                            },
                            {
                                enable: true,
                                type: {
                                    NodeDocument: {
                                        enable: true,
                                    },
                                    NodeBlockQueryEmbed: {
                                        enable: true,
                                    },
                                    NodeBlockquote: {
                                        enable: true,
                                    },
                                    NodeList: {
                                        enable: true,
                                    },
                                    NodeListItem: {
                                        enable: true,
                                    },
                                    NodeSuperBlock: {
                                        enable: true,
                                    },
                                    NodeHeading: {
                                        enable: true,
                                    },
                                    NodeParagraph: {
                                        enable: true,
                                    },
                                    NodeTable: {
                                        enable: true,
                                    },
                                },
                                mode: "button",
                                icon: "#iconScrollWrapped",
                                label: {
                                    zh_CN: "显示标记文本",
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
                                    NodeDocument: {
                                        enable: true,
                                    },
                                    NodeBlockQueryEmbed: {
                                        enable: true,
                                    },
                                    NodeBlockquote: {
                                        enable: true,
                                    },
                                    NodeList: {
                                        enable: true,
                                    },
                                    NodeListItem: {
                                        enable: true,
                                    },
                                    NodeSuperBlock: {
                                        enable: true,
                                    },
                                    NodeHeading: {
                                        enable: true,
                                    },
                                    NodeParagraph: {
                                        enable: true,
                                    },
                                    NodeTable: {
                                        enable: true,
                                    },
                                },
                                mode: "button",
                                icon: "#iconScrollWrapped",
                                label: {
                                    zh_CN: "显示标记文本",
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
                                    NodeDocument: {
                                        enable: true,
                                    },
                                    NodeList: {
                                        enable: true,
                                    },
                                    NodeTable: {
                                        enable: true,
                                    },
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
                                    NodeDocument: {
                                        enable: true,
                                    },
                                },
                                mode: "button",
                                icon: "#iconImage",
                                label: {
                                    zh_CN: "图片自动编号",
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
                                    NodeDocument: {
                                        enable: true,
                                    },
                                },
                                mode: "button",
                                icon: "#iconTable",
                                label: {
                                    zh_CN: "表格自动编号",
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
                                    NodeDocument: {
                                        enable: true,
                                    },
                                },
                                mode: "separator",
                            },
                            {
                                enable: true,
                                type: {
                                    NodeDocument: {
                                        enable: true,
                                    },
                                },
                                mode: "button",
                                icon: "#iconInfo",
                                label: {
                                    zh_CN: "显示 ID",
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
                                    NodeDocument: {
                                        enable: true,
                                    },
                                },
                                mode: "button",
                                icon: "#iconLink",
                                label: {
                                    zh_CN: "显示超链接",
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
                                    NodeDocument: {
                                        enable: true,
                                    },
                                },
                                mode: "separator",
                            },
                            {
                                enable: true,
                                type: {
                                    NodeDocument: {
                                        enable: true,
                                    },
                                },
                                mode: "button",
                                icon: "#iconSpreadOdd",
                                label: {
                                    zh_CN: "显示块序号",
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
                                    NodeDocument: {
                                        enable: true,
                                    },
                                },
                                mode: "button",
                                icon: "#iconMarkdown",
                                label: {
                                    zh_CN: "显示块内容",
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
                                    NodeDocument: {
                                        enable: true,
                                    },
                                },
                                mode: "button",
                                icon: "#iconMax",
                                label: {
                                    zh_CN: "显示块轮廓",
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
                                enable: true,
                                type: {
                                    NodeList: {
                                        enable: true, // 是否在该块类型启用菜单项
                                        subtype: { // 是否在该子类型启用菜单项
                                            u: true,
                                            o: true,
                                            t: true,
                                        },
                                    },
                                },
                                mode: "button",
                                icon: "#iconIndent",
                                label: {
                                    zh_CN: "列表辅助线",
                                    other: "List Guides",
                                },
                                accelerator: "list-guides: 1",
                                click: {
                                    enable: true,
                                    callback: null,
                                    tasks: [
                                        {
                                            type: 'attr-switch',
                                            params: {
                                                'custom-list-guides': [
                                                    '1',
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
                                    NodeDocument: {
                                        enable: true,
                                    },
                                    NodeList: {
                                        enable: true,
                                    },
                                    NodeSuperBlock: {
                                        enable: true,
                                    },
                                    NodeBlockquote: {
                                        enable: true,
                                    },
                                    NodeBlockQueryEmbed: {
                                        enable: true,
                                    },
                                },
                                mode: "separator",
                            },
                            {
                                enable: true,
                                type: {
                                    NodeDocument: {
                                        enable: true,
                                    },
                                    NodeList: {
                                        enable: true,
                                    },
                                    NodeSuperBlock: {
                                        enable: true,
                                    },
                                    NodeBlockquote: {
                                        enable: true,
                                    },
                                    NodeBlockQueryEmbed: {
                                        enable: true,
                                    },
                                },
                                mode: "button",
                                icon: "#iconList",
                                label: {
                                    zh_CN: "列表-默认视图",
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
                                    NodeDocument: {
                                        enable: true,
                                    },
                                    NodeList: {
                                        enable: true,
                                    },
                                    NodeSuperBlock: {
                                        enable: true,
                                    },
                                    NodeBlockquote: {
                                        enable: true,
                                    },
                                    NodeBlockQueryEmbed: {
                                        enable: true,
                                    },
                                },
                                mode: "button",
                                icon: "#iconGraph",
                                label: {
                                    zh_CN: "列表-脑图视图",
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
                                    NodeDocument: {
                                        enable: true,
                                    },
                                    NodeList: {
                                        enable: true,
                                    },
                                    NodeSuperBlock: {
                                        enable: true,
                                    },
                                    NodeBlockquote: {
                                        enable: true,
                                    },
                                    NodeBlockQueryEmbed: {
                                        enable: true,
                                    },
                                },
                                mode: "button",
                                icon: "#iconTable",
                                label: {
                                    zh_CN: "列表-表格视图",
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
                                    NodeTable: {
                                        enable: true,
                                    },
                                },
                                mode: "button",
                                icon: "#iconFullscreen",
                                label: {
                                    zh_CN: "默认宽度",
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
                                    NodeTable: {
                                        enable: true,
                                    },
                                },
                                mode: "button",
                                icon: "#iconContract",
                                label: {
                                    zh_CN: "自动宽度",
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
                                    NodeTable: {
                                        enable: true,
                                    },
                                },
                                mode: "button",
                                icon: "#iconPause",
                                label: {
                                    zh_CN: "全等宽度",
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
                    CtrlCmd: true,
                    WinCtrl: false,
                    Shift: false,
                    Alt: false,
                    key: 'F1',
                },
                guides: {
                    // 辅助样式(Shift + Alt + G)
                    CtrlCmd: false,
                    WinCtrl: false,
                    Shift: true,
                    Alt: true,
                    key: 'G',
                },
            },
            timestamp: {
                jump: {
                    // 跳转到指定时间点(Ctrl + 单击)
                    CtrlCmd: true,
                    WinCtrl: false,
                    Shift: false,
                    Alt: false,
                    type: 'click',
                },
                create: {
                    // 新建时间戳(Ctrl + 鼠标中键)
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
                    CtrlCmd: true,
                    WinCtrl: false,
                    Shift: false,
                    Alt: false,
                    key: 'F5',
                },
                iframe: {
                    // 刷新 iframe 块(Ctrl + 单击)
                    CtrlCmd: true,
                    WinCtrl: false,
                    Shift: false,
                    Alt: false,
                    type: 'click',
                },
            },
            doc: {
                copy: {
                    // 复制当前文档全文(Shift + Alt + C)
                    CtrlCmd: false,
                    WinCtrl: false,
                    Shift: true,
                    Alt: true,
                    key: 'C',
                },
                delete: {
                    // 删除当前文档全文(Shift + Alt + D)
                    CtrlCmd: false,
                    WinCtrl: false,
                    Shift: true,
                    Alt: true,
                    key: 'D',
                },
                cut: {
                    // 剪切当前文档全文(Shift + Alt + X)
                    CtrlCmd: false,
                    WinCtrl: false,
                    Shift: true,
                    Alt: true,
                    key: 'X',
                },
                outline: {
                    u: {
                        // 复制当前文档大纲(无序列表)至剪贴板(Ctrl + Shift + Alt + U)
                        CtrlCmd: true,
                        WinCtrl: false,
                        Shift: true,
                        Alt: true,
                        key: 'U',
                    },
                    o: {
                        // 复制当前文档大纲(有序列表)至剪贴板(Ctrl + Shift + Alt + O)
                        CtrlCmd: true,
                        WinCtrl: false,
                        Shift: true,
                        Alt: true,
                        key: 'O',
                    },
                    t: {
                        // 复制当前文档大纲(任务列表)至剪贴板(Ctrl + Shift + Alt + T)
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
                    CtrlCmd: false,
                    WinCtrl: false,
                    Shift: true,
                    Alt: true,
                    key: 'T',
                },
            },
            invert: {
                // 反色开关(Shift + Alt + I)
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
                        CtrlCmd: false,
                        WinCtrl: false,
                        Shift: true,
                        Alt: true,
                        key: 'R',
                    },
                    custom: {
                        // 更换自定义背景图片(Ctrl + Shift + Alt + I)
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
                        outfocus: {
                            // 新窗口打开当前块, 否则打开当前文档(Shift + Alt + N)
                            CtrlCmd: false,
                            WinCtrl: false,
                            Shift: true,
                            Alt: true,
                            key: 'N',
                        },
                        infocus: {
                            // 新窗口打开当前块并聚焦, 否则打开当前文档(Ctrl + Shift + Alt + N)
                            CtrlCmd: true,
                            WinCtrl: false,
                            Shift: true,
                            Alt: true,
                            key: 'N',
                        },
                    },
                    link: {
                        outfocus: {
                            // 新窗口打开链接(鼠标中键)
                            CtrlCmd: false,
                            WinCtrl: false,
                            Shift: false,
                            Alt: false,
                            button: 1, // 鼠标中键
                        },
                        infocus: {
                            // 新窗口打开链接并聚焦(Shift + 鼠标中键)
                            CtrlCmd: false,
                            WinCtrl: false,
                            Shift: true,
                            Alt: false,
                            button: 1, // 鼠标中键
                        },
                    },
                    editor: {
                        // 新窗口打开编辑器(Shift + 鼠标中键)
                        CtrlCmd: false,
                        WinCtrl: false,
                        Shift: false,
                        Alt: true,
                        button: 1, // 鼠标中键
                    },
                },
            },
            menu: {
                block: {
                    // 块菜单开关(Shift + Alt + M)
                    CtrlCmd: false,
                    WinCtrl: false,
                    Shift: true,
                    Alt: true,
                    key: 'M',
                },
            },
            wheel: {
                zoom: {
                    // 鼠标滚轮缩放(Ctrl + wheel)
                    CtrlCmd: true,
                    WinCtrl: false,
                    Shift: false,
                    Alt: false,
                    type: 'mousewheel',
                },
            },
        },
    },
};

export var custom = {
    theme: {
        toolbar: {
        },
    },
};

export async function saveCustomFile(custom, path = config.custom.path) {
    const r = await putFile(path, JSON.stringify(custom, undefined, 4));
    // console.log(r);
}

try {
    let temp = await import('/widgets/custom.js');
    if (temp.config != null) {
        config = merge(config, temp.config);
    }
    custom.theme.toolbar[config.theme.menu.block.toolbar.id] = { default: false };
    custom.theme.toolbar[config.theme.style.guides.toolbar.id] = { default: false };
    custom.theme.toolbar[config.theme.invert.toolbar.id] = { default: false };
    custom.theme.toolbar[config.theme.typewriter.switch.toolbar.id] = { default: false };
    temp = await getFile(config.custom.path);
    temp = await temp.json();
    custom = merge(custom, temp);
} catch (err) {
    console.log(err);
} finally {
    console.log(config);
    console.log(custom);
}
