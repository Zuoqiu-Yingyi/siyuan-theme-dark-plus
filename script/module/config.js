/* 配置文件(可以被 data/widgets/custom.js 覆盖) */

import { merge } from '/appearance/themes/Dark+/script/utils/misc.js';

export var config = {
    token: '', // API token, 无需填写
    regs: {
        // 正则表达式
        url: /^siyuan:\/\/blocks\/\d{14}\-[0-9a-z]{7}$/, // 思源 URL Scheme 正则表达式
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
        },
        iframe: {
            enable: true, // 是否启用 iframe 重新加载
        },
    },
    doc: {
        enable: true, // 是否启用文档扩展功能
        copy: {
            enable: true, // 是否启用当前文档全文复制功能
        },
        delete: {
            enable: true, // 是否启用当前文档全文删除功能
        },
        cut: {
            enable: true, // 是否启用当前文档全文剪切功能
        },
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

