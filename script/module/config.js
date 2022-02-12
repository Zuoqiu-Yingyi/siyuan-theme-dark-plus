/* 配置文件(可以被 data/widgets/custom.js 覆盖) */

export var config = {
    token: '', // API token, 无需填写
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
    hotkeys: {
        // 快捷键
        style: {
            render: {
                // 渲染
                ctrlKey: true,
                metaKey: true,
                shiftKey: false,
                altKey: false,
                key: 'F1',
            },
        },
        timestamp: {
            jump: {
                // 跳转到指定时间点
                ctrlKey: true,
                metaKey: true,
                shiftKey: false,
                altKey: false,
                type: 'click',
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

