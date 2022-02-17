/* 配置文件(可以被 data/widgets/custom.js 覆盖) */

export var config = {
    token: '', // API token, 无需填写
    regs: {
        // 正则表达式
        url: /^siyuan:\/\/blocks\/\d{14}\-[0-9a-z]{7}$/, // 思源 URL Scheme 正则表达式
        time: /^(\d+)(:[0-5]?[0-9]){0,2}(\.\d*)?$/, // 时间戳正则表达式
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
            create: {
                // 新建时间戳
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
    },
};

try {
    let custom = await import('/widgets/custom.js');
    config = custom.config;
} catch (err) {
    console.log(err);
} finally {
    console.log(config);
}

