import {
    url,
    config,
    i18n,
} from './config.js';
import { custom } from '../../public/custom.js';
import {
    jupyter,
    getBlockAttrs,
    setBlockAttrs,
} from './api.js';
import {
    promptFormat,
    URL2DataURL,
} from './utils.js';

const sessions_create_kernel_select = document.getElementById(config.jupyter.id.session.create.select);
const sessions_create_refresh_button = document.getElementById(config.jupyter.id.session.create.refresh);

const sessions_create_kernel_image = document.getElementById(config.jupyter.id.session.create.image);
const sessions_create_language_span = document.getElementById(config.jupyter.id.session.create.language);

const sessions_create_name_input = document.getElementById(config.jupyter.id.session.create.name);
const sessions_create_path_input = document.getElementById(config.jupyter.id.session.create.path);
const sessions_create_create_button = document.getElementById(config.jupyter.id.session.create.create);

const sessions_manage_session_select = document.getElementById(config.jupyter.id.session.manage.select);
const sessions_manage_refresh_button = document.getElementById(config.jupyter.id.session.manage.refresh);
const sessions_manage_name_input = document.getElementById(config.jupyter.id.session.manage.name);
const sessions_manage_path_input = document.getElementById(config.jupyter.id.session.manage.path);
const sessions_manage_update_button = document.getElementById(config.jupyter.id.session.manage.update);

const sessions_manage_state_span = document.getElementById(config.jupyter.id.session.manage.state);
const sessions_manage_kernel_image = document.getElementById(config.jupyter.id.session.manage.image);
const sessions_manage_kernel_name_span = document.getElementById(config.jupyter.id.session.manage.kernel);

const sessions_manage_start_button = document.getElementById(config.jupyter.id.session.manage.start);
const sessions_manage_interrupt_button = document.getElementById(config.jupyter.id.session.manage.interrupt);
const sessions_manage_restart_button = document.getElementById(config.jupyter.id.session.manage.restart);
const sessions_manage_close_button = document.getElementById(config.jupyter.id.session.manage.close);

const id = url.searchParams.get('id'); // 文档 ID
const lang = url.searchParams.get('lang'); // 用户语言

var attrs = await getBlockAttrs(id);
var kernelspecs, sessions, session, kernel;

/* 初始化 */
function init() {
    if (kernelspecs && sessions) {
        if (attrs[config.jupyter.attrs.kernel.name]) { 
            sessions_create_kernel_select.value = attrs[config.jupyter.attrs.kernel.name];
            renderKernelspecInfo(kernelspecs.kernelspecs[sessions_create_kernel_select.value]);
        }
        if (attrs[config.jupyter.attrs.session.name])
            sessions_create_name_input.value = attrs[config.jupyter.attrs.session.name];
        if (attrs[config.jupyter.attrs.session.path])
            sessions_create_path_input.value = attrs[config.jupyter.attrs.session.path];
        if (attrs[config.jupyter.attrs.kernel.id]) {
            session = sessions.find(session => session.kernel.id === attrs[config.jupyter.attrs.kernel.id]);
            if (session) {
                sessions_manage_session_select.value = session.id;
                renderSessionInfo(session);
            }
        }
    }
    else setTimeout(init, 250);
}

/* 重定向至全局设置页面 */
function redirect() {
    alert(i18n('jupyter-server-auth-faild', lang));
    let url = new URL(location.href);
    url.pathname = config.jupyter.path.global;
    location.href = url.href;
}

/* 获得内核可读名字 */
function getKernelDisplayName(kernelName) {
    return kernelspecs?.kernelspecs?.[kernelName]?.spec?.display_name
}

/* 更新内核下拉选择器 */
function updateKernelspecsSelector(kernelspecs, selector, defaultKernel) {
    selector.innerHTML = '';
    for (const kernelspec in kernelspecs) {
        const defaultSelected = kernelspecs[kernelspec].name === defaultKernel ? true : false;
        selector.appendChild(new Option(
            getKernelDisplayName(kernelspec),
            kernelspecs[kernelspec].name),
            undefined,
            defaultSelected,
        );
    }
    selector.dispatchEvent(new Event('change'));
}

/* 更新会话下拉选择器 */
function updateSessionsSelector(sessions, selector, defaultSession) {
    selector.innerHTML = '';
    for (const session of sessions) {
        const defaultSelected = session.id === defaultSession.id ? true : false;
        selector.appendChild(new Option(
            session.name,
            session.id,
            undefined,
            defaultSelected,
        ));
    }
    selector.dispatchEvent(new Event('change'));
}

/* 更新思源文档块属性 */
function updateDocAttrs(del = false) {
    console.log(del);
    let attrs;
    if (del) {
        // 删除会话
        attrs = {
            [config.jupyter.attrs.kernel.id]: '',
            [config.jupyter.attrs.session.id]: '',
            [config.jupyter.attrs.other.prompt]: 'No Kernel',
        };
    }
    else if (session) {
        // 非删除会话
        const kernel_id = session.kernel.id;
        const kernel_name = session.kernel.name;
        const kernel_display_name = getKernelDisplayName(kernel_name);
        const kernel_state = session.kernel.execution_state;
        const kernel_language = kernelspecs.kernelspecs[kernel_name].spec.language;
        const session_id = session.id;
        const session_name = sessions_manage_name_input.value;
        const session_path = sessions_manage_path_input.value;
        attrs = {
            [config.jupyter.attrs.kernel.id]: kernel_id,
            [config.jupyter.attrs.kernel.name]: kernel_name,
            [config.jupyter.attrs.kernel.display_name]: kernel_display_name,
            [config.jupyter.attrs.kernel.language]: kernel_language,
            [config.jupyter.attrs.session.id]: session_id,
            [config.jupyter.attrs.session.name]: session_name,
            [config.jupyter.attrs.session.path]: session_path,
            [config.jupyter.attrs.other.prompt]: promptFormat(
                kernel_language,
                kernel_display_name,
                i18n(kernel_state, lang)
            ),
        };
        localStorage.setItem("local-codelang", kernel_language);
    }
    else return;
    setBlockAttrs(id, attrs);
}

/* 渲染内核信息 */
function renderKernelspecInfo(kernelspec) {
    const src = `${custom.jupyter.server}${kernelspec.resources[`logo-32x32`]}`;
    // sessions_create_kernel_image.src = src;
    setTimeout(async () => URL2DataURL(src, sessions_create_kernel_image), 0);
    sessions_create_language_span.innerText = kernelspec.spec.language;
}

/* 渲染会话信息 */
function renderSessionInfo(session) {
    if (session) {
        // 非删除会话
        sessions_manage_name_input.value = session.name;
        sessions_manage_path_input.value = session.path;
        sessions_manage_state_span.innerText = session.kernel.execution_state;
        if (kernelspecs && kernelspecs.kernelspecs[session.kernel.name]) {
            const src = `${custom.jupyter.server}${kernelspecs.kernelspecs[session.kernel.name].resources[`logo-32x32`]}`;
            // sessions_manage_kernel_image.src = src;
            setTimeout(async () => URL2DataURL(src, sessions_manage_kernel_image), 0);
            sessions_manage_kernel_name_span.innerText = session.kernel.name;
        }
    }
    else {
        sessions_manage_name_input.value = null;
        sessions_manage_path_input.value = null;
        sessions_manage_state_span.innerText = null;
        sessions_manage_kernel_image.src = null;
        sessions_manage_kernel_name_span.innerText = null;
    }
}

/* 刷新当前可用内核 */
sessions_create_refresh_button.addEventListener('click', async () => {
    kernelspecs = await jupyter.kernelspecs.get();

    if (kernelspecs) {
        updateKernelspecsSelector(
            kernelspecs.kernelspecs,
            sessions_create_kernel_select,
            kernelspecs.default,
        );
    }
    else redirect();
});

/* 新建会话 */
sessions_create_create_button.addEventListener('click', async () => {
    const kernel_name = sessions_create_kernel_select.value;
    const name = sessions_create_name_input.value;
    const path = sessions_create_path_input.value;
    if (kernel_name && name && path) {
        session = await jupyter.sessions.post({
            path: path,
            name: name,
            type: 'console',
            kernel: {
                name: kernel_name,
            },
        });
        if (session) {
            console.log(
                `${i18n('session', lang)}:\n`,
                session,
            );
            sessions_manage_refresh_button.click();
        }
        else redirect();
    }
    else {
        alert(i18n('incomplete', lang));
    }
});

/* 更换内核后显示内核的信息 */
sessions_create_kernel_select.addEventListener('change', () => {
    renderKernelspecInfo(kernelspecs.kernelspecs[sessions_create_kernel_select.value]);
});

/* 更换会话后显示会话的信息 */
sessions_manage_session_select.addEventListener('change', () => {
    session = sessions.find(session => session.id === sessions_manage_session_select.value);
    renderSessionInfo(session);
});

/* 刷新当前活动会话 */
sessions_manage_refresh_button.addEventListener('click', async () => {
    sessions = await jupyter.sessions.get();
    console.log(
        `${i18n('sessions', lang)}:\n`,
        sessions,
    );
    updateSessionsSelector(
        sessions,
        sessions_manage_session_select,
        session ? session : sessions.length ? sessions[0] : {},
    );
});

/* 更新会话信息 */
sessions_manage_update_button.addEventListener('click', async () => {
    const session_id = sessions_manage_session_select.value;
    const session_name = sessions_manage_name_input.value;
    const session_path = sessions_manage_path_input.value;
    if (session_id && session_name && session_path) {
        session = await jupyter.sessions.patch(
            session_id,
            {
                name: session_name,
                path: session_path,
            },
        );
        console.log(
            `${i18n('session', lang)}:\n`,
            session,
        );
        sessions_manage_refresh_button.click();
        setTimeout(updateDocAttrs, 1000);
    }
    else {
        alert(i18n('incomplete', lang));
    }
});

/* 关联文档与会话 */
sessions_manage_start_button.addEventListener('click', _ => updateDocAttrs());

/* 中止当前会话内核运行 */
sessions_manage_interrupt_button.addEventListener('click', async () => {
    const r = await jupyter.kernels.interrupt(session.kernel.id);
    if (r && r.status === 204) {
        console.log(
            `${i18n('interrupt', lang)}:\n`,
            r,
        );
        sessions_manage_refresh_button.click();
        setTimeout(updateDocAttrs, 1000);
    }
    else redirect();
});

/* 重启当前会话内核 */
sessions_manage_restart_button.addEventListener('click', async () => {
    kernel = await jupyter.kernels.restart(session.kernel.id);
    if (kernel) {
        console.log(
            `${i18n('restart', lang)}:\n`,
            kernel,
        );
        sessions_manage_refresh_button.click();
        setTimeout(updateDocAttrs, 1000);
    }
    else redirect();
});

/* 关闭当前会话内核 */
sessions_manage_close_button.addEventListener('click', async () => {
    const r = await jupyter.sessions.delete(session.id);
    if (r && r.status === 204) {
        console.log(
            `${i18n('close', lang)}:\n`,
            session,
        );
        session = null;
        sessions_manage_refresh_button.click();
        setTimeout(() => updateDocAttrs(true), 1000);
    }
    else redirect();
});

sessions_create_refresh_button.click(); // 刷新内核列表
sessions_manage_refresh_button.click(); // 刷新会话列表
setTimeout(init, 0);
