import { config } from './config.js';
import {
    custom,
    saveCustomFile,
} from '../../public/custom.js';

const server_input = document.getElementById(config.jupyter.id.server.input);
const cookie_input = document.getElementById(config.jupyter.id.cookies.input);
const token_input = document.getElementById(config.jupyter.id.token.input);
const server_test = document.getElementById(config.jupyter.id.server.test);

server_test.href = custom.jupyter.server;

document.getElementById(config.jupyter.id.server.input).value = custom.jupyter.server;
document.getElementById(config.jupyter.id.cookies.input).value = custom.jupyter.cookies;
document.getElementById(config.jupyter.id.token.input).value = custom.jupyter.token;

document.getElementById(config.jupyter.id.server.button).addEventListener('click', async () => {
    const server = server_input.value;
    try {
        const server_url = new URL(server);
        custom.jupyter.server = server_url.origin;
        server_test.href = server_url.origin;
        server_input.value = server_url.origin;
        saveCustomFile(custom);
    }
    catch (err) {
        console.warn(err);
        server_input.value = "";
    }
});

document.getElementById(config.jupyter.id.cookies.button).addEventListener('click', async () => {
    const cookies = cookie_input.value;
    custom.jupyter.cookies = cookies;
    saveCustomFile(custom);
});

document.getElementById(config.jupyter.id.token.button).addEventListener('click', async () => {
    const token = token_input.value;
    custom.jupyter.token = token;
    saveCustomFile(custom);
});
