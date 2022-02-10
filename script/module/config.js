/* 配置文件(可以被 data/widgets/custom.js 覆盖) */

export var config = {
    token: '', // API token, 无需填写
    styles: [
        // 渲染的自定义样式
        'font-size',
    ],
    hotkeys: {
        // 快捷键
        render: {
            // 渲染
            ctrlKey: true,
            metaKey: true,
            shiftKey: false,
            altKey: false,
            key: 'F1',
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

