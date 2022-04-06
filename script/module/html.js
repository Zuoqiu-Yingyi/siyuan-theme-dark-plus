/* 在 HTML 块中使用的小工具 */

function runcmd(commands) {
    if (window.confirm(commands)) {
        commands = `start powershell -c ${commands.replaceAll('\n', '; ')}pause`;
        require('child_process').exec(commands, null);
    }
}
