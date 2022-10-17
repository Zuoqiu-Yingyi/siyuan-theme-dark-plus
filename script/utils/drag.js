class Drag {
    status;
    constructor() {
        this.status = {
            drag: { // 拖拽
                position: { // 拖动点相对于拖拽元素的位置
                    x: null,
                    y: null,
                },
                size: { // 拖拽目标尺寸
                    width: null,
                    height: null,
                },
            },
            flags: {
                dragging: false, // 是否正在拖拽
            },
        };

        this.handler = {
            /**
             * 拖拽移动事件处理
             * @params {Event} e: 鼠标事件
             * @params {HTMLElement} draggable: 可拖拽的区域
             * @params {HTMLElement} target: 操作的目标元素
             * @params {HTMLElement} stage: 在哪个元素内拖拽
             */
            move: (e, draggable, target, stage) => {
                // console.log(e);
                /* 子窗口左上角将要移动到的位置坐标 */
                let x = e.clientX - this.status.drag.position.x;
                let y = e.clientY - this.status.drag.position.y;

                /* 子窗口左上角可以可以移动到区域边缘 */
                let window_width = stage.clientWidth - target.offsetWidth;
                let window_height = stage.clientHeight - target.offsetHeight;

                x = (x < 0) ? 0 : x;                          // 当子窗口移动到主窗口最左边时
                x = (x > window_width) ? window_width : x;    // 当子窗口移动到主窗口最右边时
                y = (y < 0) ? 0 : y;                          // 当子窗口移动到主窗口最上边时
                y = (y > window_height) ? window_height : y;  // 当子窗口移动到主窗口最下边时

                // target.style.left = `${x}px`;
                // target.style.top = `${y}px`;
                target.style.left = `${100 * x / document.documentElement.offsetWidth}vw`;
                target.style.top = `${100 * y / document.documentElement.offsetHeight}vh`;
            },
            resize: (e, draggable, target, stage) => {
                const size = this.calcSize(e, draggable, target, stage);
                target.style.width = `${100 * size.width / document.documentElement.offsetWidth}vw`;
                target.style.height = `${100 * size.height / document.documentElement.offsetHeight}vh`;
            },
            rewidth: (e, draggable, target, stage) => {
                const size = this.calcSize(e, draggable, target, stage);
                target.style.width = `${100 * size.width / document.documentElement.offsetWidth}vw`;
            },
            reheight: (e, draggable, target, stage) => {
                const size = this.calcSize(e, draggable, target, stage);
                target.style.height = `${100 * size.height / document.documentElement.offsetHeight}vh`;
            },
        };
    }

    /* 子窗口尺寸拖动调整功能 */
    calcSize(e, draggable, target, stage) { // 计算子窗口应该调整到的尺寸
        /** 计算窗口将要调整到的宽度
         *  鼠标当前位置(应优化为控件的中轴) - 窗口左边位置
         *      = 鼠标相对于窗口左边的横向偏移量
         *  鼠标相对于窗口左边的横向偏移量 - 拖动前鼠标相对于窗口左边的横向偏移量
         *      = 鼠标宽度变化量
         *  原宽度 - 鼠标宽度变化量
         *      = 当前应当设置的宽度
         */
        let width = this.status.drag.size.width + (e.clientX - target.offsetLeft - this.status.drag.position.x);
        /* 窗口宽度上限: 页面可视宽度 - 窗口左边位置 */
        const max_width = stage.clientWidth - target.offsetLeft;
        width = (width < 0) ? 0 : width; // 当子窗口移动到主窗口最左边时
        width = (width > max_width) ? max_width : width; // 当子窗口移动到主窗口最右边时

        let height = this.status.drag.size.height + (e.clientY - target.offsetTop - this.status.drag.position.y);
        /* 窗口高度上限: 页面可视高度 - 窗口上边位置 */
        const max_height = stage.clientHeight - target.offsetTop;
        height = (height < 0) ? 0 : height; // 当子窗口移动到主窗口最上边时
        height = (height > max_height) ? max_height : height; // 当子窗口移动到主窗口最下边时
        return {
            width,
            height,
        };
    }

    /**
     * 开始拖拽
     * @params {Event} e: 鼠标事件
     * @params {HTMLElement} draggable: 可拖拽的区域
     * @params {HTMLElement} target: 拖拽的目标元素
     * @params {HTMLElement} stage: 在哪个元素内拖拽
     * @params {function} mousemoveHandler: 鼠标移动事件的处理器
     * @params {function} final: 拖动完成回调方法
     */
    start(
        e,
        draggable,
        target,
        stage,
        mousemoveHandler,
        final,
    ) {
        /* 取消其他默认事件处理 */
        e.preventDefault();
        e.stopPropagation();

        this.status.flags.dragging = true; // 正在拖拽
        /* 记录鼠标与窗口的相对位置 */
        this.status.drag.position.x = e.clientX - target.offsetLeft; // 鼠标相对于子窗口左上角的横向偏移量(鼠标横坐标 - this.status 的 左侧偏移量)
        this.status.drag.position.y = e.clientY - target.offsetTop; // 鼠标相对于子窗口左上角的纵向偏移量(鼠标纵坐标 - this.status 的 上侧偏移量)
        this.status.drag.size.width = target.offsetWidth; // 窗口宽度
        this.status.drag.size.height = target.offsetHeight; // 窗口高度

        /* 避免 mousemove 事件在 iframe 中无法触发 */
        // REF [在 iframe 上无法捕获 mousemove](https://blog.csdn.net/DongFuPanda/article/details/109533365)
        stage.querySelectorAll('iframe').forEach(iframe => iframe.style.pointerEvents = 'none');

        stage.addEventListener("mousemove", mousemoveHandler, true);
        stage.addEventListener("mouseup", e => {
            this.stop(e, stage, mousemoveHandler)
            mousemoveHandler(e); // 处理最终结果
            if (typeof final === 'function') final(e, this);
        }, { capture: true, once: true }); // 松开按键结束拖拽
    }


    /**
     * 结束拖拽
     * @params {Event} e: 鼠标事件
     * @params {HTMLElement} stage: 在哪个元素内拖拽
     * @params {function} mousemoveHandler: 鼠标移动事件的处理器
     */
    stop(e, stage, mousemoveHandler) {
        /* 取消其他默认事件处理 */
        e.preventDefault();
        e.stopPropagation();

        if (this.status.flags.dragging) { // 如果多个停止条件触发, 只关注第一个
            this.status.flags.dragging = false;
            stage.querySelectorAll('iframe').forEach(iframe => iframe.style.pointerEvents = 'auto');

            stage.removeEventListener("mousemove", mousemoveHandler, true);
        }
    }

    /**
     * 注册拖拽功能
     * @params {HTMLElement} draggable: 可拖拽的区域
     * @params {HTMLElement} target: 拖拽的目标元素
     * @params {HTMLElement} stage: 在哪个元素内拖拽
     * @params {function} mousemoveHandler: 鼠标移动事件的处理器
     * @params {function} preproccess: 预处理方法
     * @params {function} postproccess: 后处理方法
     * @params {function} final: 拖动完成回调方法
     */
    register(
        draggable,
        target,
        stage,
        handler,
        preproccess = null,
        postproccess = null,
        final = null,
    ) {
        const eventHandler = e => {
            /* 取消其他默认事件处理 */
            e.preventDefault();
            e.stopPropagation();

            if (typeof preproccess === 'function') preproccess(e, this);
            handler(e, draggable, target, stage);
            if (typeof postproccess === 'function') postproccess(e, this);
        };

        draggable.addEventListener("mousedown", e => this.start(
            e,
            draggable,
            target,
            stage,
            eventHandler,
            final,
        ), true);
    }
}
export const drag = new Drag();
