/* 配置文件(可以被 data/widgets/custom.js 覆盖) */

import { merge } from './../utils/misc.js';

export var config = {
    token: '', // API token, 无需填写
    theme: {
        regs: {
            // 正则表达式
            url: /^siyuan:\/\/blocks\/(\d{14}\-[0-9a-z]{7})\/*(?:(?:\?)(\w+=\w+)(?:(?:\&)(\w+=\w+))+)?$/, // 思源 URL Scheme 正则表达式
            time: /^(\d+)(:[0-5]?[0-9]){0,2}(\.\d*)?$/, // 时间戳正则表达式
            id: /^\d{14}\-[0-9a-z]{7}$/, // 块 ID 正则表达式
        },
        goto: {
            enable: true, // 是否启用使用 URL 参数跳转指定块功能
        },
        style: {
            enable: false, // 是否启用自定义样式渲染
            save: {
                enable: true, // 是否启用保存自定义样式
            },
            render: {
                enable: true, // 是否启用自定义样式渲染
                toolbar: { // 菜单栏
                    enable: true,
                    id: 'theme-style-render',
                    label: '渲染自定义样式 [Ctrl + F1]\nRender custom styles',
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
                    id: 'theme-reload-window',
                    label: '重新加载窗口 [Ctrl + F5]\nReload the window',
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
                        id: 'theme-doc-outline-u',
                        label: '复制当前文档大纲为无序列表 [Ctrl + Shift + Alt + U]\nCopy the current document outline as an unordered list',
                        icon: '#iconList',
                        index: 7,
                    },
                },
                o: {
                    enable: true, // 有序列表
                    toolbar: { // 菜单栏
                        enable: true,
                        id: 'theme-doc-outline-o',
                        label: '复制当前文档大纲为有序列表 [Ctrl + Shift + Alt + O]\nCopy the current document outline as an ordered list',
                        icon: '#iconOrderedList',
                        index: 8,
                    },
                },
                t: {
                    enable: true, // 任务列表
                    toolbar: { // 菜单栏
                        enable: true,
                        id: 'theme-doc-outline-t',
                        label: '复制当前文档大纲为任务列表 [Ctrl + Shift + Alt + T]\nCopy the current document outline as a task list',
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
                    id: 'theme-doc-copy',
                    label: '复制当前文档内容 (Markdown) [Shift + Alt + C]\nCopy the current document content (Markdown)',
                    icon: '#iconCopy',
                    index: 10,
                },
            },
            delete: {
                enable: true, // 是否启用当前文档全文删除功能
                toolbar: { // 菜单栏
                    enable: false,
                    id: 'theme-doc-delete',
                    label: '删除当前文档内容 [Shift + Alt + D]\nDelete the current document content',
                    icon: '#iconTrashcan',
                    index: 12,
                },
            },
            cut: {
                enable: true, // 是否启用当前文档全文剪切功能
                toolbar: { // 菜单栏
                    enable: false,
                    id: 'theme-doc-cut',
                    label: '剪切当前文档内容 (Markdown) [Shift + Alt + X]\nDelete the current document content (Markdown)',
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
                    id: 'theme-typewriter-switch',
                    label: '打字机模式 [Shift + Alt + T]\nTypewriter mode',
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
                id: 'theme-invert',
                label: '反色显示 [Shift + Alt + I]\nDisplay in reverse color',
                icon: '#iconMoon',
                index: -2,
            },
            img: {
                // 图片反色
                enable: true,
                style: {
                    id: 'theme-invert-img-style', // 图片反色 ID
                    innerHTML: 'img:not(.emoji, .thumbnailImage), div.thumbnailSelectionRing {filter: invert(100%);}div.protyle-background__icon>img,span.b3-list-item__icon>img {filter: none;}', // 样式标签内容
                },
            },
            viewer: {
                // PDF 预览反色
                enable: true,
                style: {
                    id: 'theme-invert-viewer-style', // 图片反色 ID
                    innerHTML: '#viewer {filter: invert(100%);}', // 样式标签内容
                },
            },
            iframe: {
                // iframe 反色
                enable: true,
                style: {
                    id: 'theme-invert-iframe-style', // 图片反色 ID
                    innerHTML: 'iframe {filter: invert(100%);}', // 样式标签内容
                },
            },
            video: {
                // 视频反色
                enable: true,
                style: {
                    id: 'theme-invert-video-style', // 图片反色 ID
                    innerHTML: 'video {filter: invert(100%);}', // 样式标签内容
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
                        id: 'theme-background-image-random',
                        label: '更换背景图片 (网络) [Shift + Alt + R]\nChange background image (Web)',
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
                        id: 'theme-background-image-custom',
                        label: '更换背景图片 (自定义) [Ctrl + Shift + Alt + R]\nChange background image (Custom)',
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
                    fullscreen: false // 是否全屏显示
                },
                panel: {
                    enable: true, // 打开一个新窗口
                    url: null, // 新窗口的 URL, 值 null 则为 '/stage/build/desktop/'
                    toolbar: { // 菜单栏
                        enable: true,
                        id: 'theme-window-open-panel',
                        label: '打开一个新窗口\nOpen a new window',
                        icon: '#iconExport',
                        index: 1,
                    },
                },
                block: {
                    // 新窗口打开当前块, 否则打开当前文档
                    enable: true,
                    outfocus: {
                        // 新窗口打开当前块, 否则打开当前文档
                        enable: true,
                        toolbar: { // 菜单栏
                            enable: true,
                            id: 'theme-window-open-block-outfocus',
                            label: '在新窗口打开当前块 [Shift + Alt + N]\nOpen the current block in a new window',
                            icon: '#iconExport',
                            index: 2,
                        },
                    },
                    infocus: {
                        // 新窗口打开当前块并聚焦, 否则打开当前文档
                        enable: true,
                        toolbar: { // 菜单栏
                            enable: true,
                            id: 'theme-window-open-block-infocus',
                            label: '在新窗口打开当前块并聚焦 [Ctrl + Shift + Alt + N]\nOpen the current block in a new window and focuses',
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
                create: {
                    // 新建时间戳(Ctrl + 鼠标中键)
                    ctrlKey: true,
                    metaKey: true,
                    shiftKey: false,
                    altKey: false,
                    button: 1, // 鼠标中键
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
                },
            },
            reload: {
                window: {
                    // 刷新当前窗口(Ctrl + F5)
                    ctrlKey: true,
                    metaKey: true,
                    shiftKey: false,
                    altKey: false,
                    key: 'F5',
                },
                iframe: {
                    // 刷新 iframe 块(Ctrl + 单击)
                    ctrlKey: true,
                    metaKey: true,
                    shiftKey: false,
                    altKey: false,
                    type: 'click',
                },
            },
            doc: {
                copy: {
                    // 复制当前文档全文(Shift + Alt + C)
                    ctrlKey: false,
                    metaKey: false,
                    shiftKey: true,
                    altKey: true,
                    key: 'C',
                },
                delete: {
                    // 删除当前文档全文(Shift + Alt + D)
                    ctrlKey: false,
                    metaKey: false,
                    shiftKey: true,
                    altKey: true,
                    key: 'D',
                },
                cut: {
                    // 剪切当前文档全文(Shift + Alt + X)
                    ctrlKey: false,
                    metaKey: false,
                    shiftKey: true,
                    altKey: true,
                    key: 'X',
                },
                outline: {
                    u: {
                        // 复制当前文档大纲(无序列表)至剪贴板(Ctrl + Shift + Alt + U)
                        ctrlKey: true,
                        metaKey: true,
                        shiftKey: true,
                        altKey: true,
                        key: 'U',
                    },
                    o: {
                        // 复制当前文档大纲(有序列表)至剪贴板(Ctrl + Shift + Alt + O)
                        ctrlKey: true,
                        metaKey: true,
                        shiftKey: true,
                        altKey: true,
                        key: 'O',
                    },
                    t: {
                        // 复制当前文档大纲(任务列表)至剪贴板(Ctrl + Shift + Alt + T)
                        ctrlKey: true,
                        metaKey: true,
                        shiftKey: true,
                        altKey: true,
                        key: 'T',
                    },
                },
            },
            typewriter: {
                switch: {
                    // 打字机模式开关(Shift + Alt + T)
                    ctrlKey: false,
                    metaKey: false,
                    shiftKey: true,
                    altKey: true,
                    key: 'T',
                },
            },
            invert: {
                switch: {
                    // 反色开关(Shift + Alt + I)
                    ctrlKey: false,
                    metaKey: false,
                    shiftKey: true,
                    altKey: true,
                    key: 'I',
                },
            },
            background: {
                image: {
                    web: {
                        // 更换网络背景图片(Shift + Alt + R)
                        ctrlKey: false,
                        metaKey: false,
                        shiftKey: true,
                        altKey: true,
                        key: 'R',
                    },
                    custom: {
                        // 更换自定义背景图片(Ctrl + Shift + Alt + I)
                        ctrlKey: true,
                        metaKey: true,
                        shiftKey: true,
                        altKey: true,
                        key: 'R',
                    },
                },
            },
            window: {
                open: {
                    block: {
                        outfocus: {
                            // 新窗口打开当前块, 否则打开当前文档(Shift + Alt + N)
                            ctrlKey: false,
                            metaKey: false,
                            shiftKey: true,
                            altKey: true,
                            key: 'N',
                        },
                        infocus: {
                            // 新窗口打开当前块并聚焦, 否则打开当前文档(Ctrl + Shift + Alt + N)
                            ctrlKey: true,
                            metaKey: true,
                            shiftKey: true,
                            altKey: true,
                            key: 'N',
                        },
                    },
                    link: {
                        outfocus: {
                            // 新窗口打开链接(鼠标中键)
                            ctrlKey: false,
                            metaKey: false,
                            shiftKey: false,
                            altKey: false,
                            button: 1, // 鼠标中键
                        },
                        infocus: {
                            // 新窗口打开链接并聚焦(Shift + 鼠标中键)
                            ctrlKey: false,
                            metaKey: false,
                            shiftKey: true,
                            altKey: false,
                            button: 1, // 鼠标中键
                        },
                    },
                },
            },
        },
    },
};

try {
    let custom = await import('/widgets/custom.js');
    if (custom.config != null) {
        config = merge(config, custom.config);
    }
} catch (err) {
    console.log(err);
} finally {
    console.log(config);
}
