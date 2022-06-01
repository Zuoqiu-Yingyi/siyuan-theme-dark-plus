import {
    config,
    custom,
    saveCustomFile,
} from './config.js';

document.getElementById(config.jupyter.id.server.input).value = custom.jupyter.server;
document.getElementById(config.jupyter.id.cookies.input).value = custom.jupyter.cookies;

document.getElementById(config.jupyter.id.server.button).addEventListener('click', async () => {
    const server = document.getElementById(config.jupyter.id.server.input).value;
    custom.jupyter.server = server;
    saveCustomFile(custom);
});
document.getElementById(config.jupyter.id.cookies.button).addEventListener('click', async () => {
    const cookies = document.getElementById(config.jupyter.id.cookies.input).value;
    custom.jupyter.cookies = cookies;
    saveCustomFile(custom);
});
