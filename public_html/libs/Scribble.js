export class Scribble {
    static DEFAULT_OPTIONS = {
        someFlag: true,
        anotherFlag: true,
    };
    options = {};

    canvasElement;
    canvasContext;



    points = new Map();
    needsRedraw = false;
    isDrawing = false;
    rafId;



    eventHandlers = new Map();




    constructor(canvasElement, options = {}) {
        this.options = { ...Scribble.DEFAULT_OPTIONS, ...options };
        console.log(this.options);

        this.canvasElement = canvasElement;
        this.canvasContext = this.canvasElement.getContext("2d");
        //console.log(this.canvasElement, this.canvasContext);

        this.canvasContext.lineCap = "round";
        this.canvasContext.lineJoin = "round";
        this.canvasContext.lineWidth = 5;
        this.canvasContext.strokeStyle = "#000";


        this.eventHandlers.set(window, [
            ["resize", this.resize.bind(this)],
        ]);
        this.eventHandlers.set(this.canvasElement, [
            ["pointerdown", this.startDrawing.bind(this)],
            ["pointermove", this.whileDrawing.bind(this)],
            ["pointerup", this.endDrawing.bind(this)],
            ["pointerout", this.endDrawing.bind(this)],
            ["pointerleave", this.endDrawing.bind(this)],
            ["pointercancel", this.endDrawing.bind(this)],
        ]);

        this.enable();
    }

    enable() {
        for (const [element, eventHandlers] of this.eventHandlers) {
            for (const eventHandler of eventHandlers) {
                const [type, listener] = eventHandler;
                element.addEventListener(type, listener);
            }
        }

        this.resize();

        this.rafId = window.requestAnimationFrame(this.draw.bind(this));
    }

    disable() {
        for (const [element, eventHandlers] of this.eventHandlers) {
            for (const eventHandler of eventHandlers) {
                const [type, listener] = eventHandler;
                element.removeEventListener(type, listener);
            }
        }

        this.points.clear();
        this.needsRedraw = false;
        this.isDrawing = false;

        window.cancelAnimationFrame(this.rafId);
    }

    resize() {
        const { width, height } = this.canvasElement.getBoundingClientRect();
        console.log(`resizing canvas: W = ${width} / H = ${height}`);
        this.canvasElement.width = width;
        this.canvasElement.height = height;
    }

    startDrawing(event) {
        if (!event.pointerId) return;

        console.log("start drawing from:", this.getPointFrom(event));
        this.points.set(event.pointerId, [this.getPointFrom(event)]);
        this.needsRedraw = true;
        this.isDrawing = true;
    }

    endDrawing(event) {
        if (!this.isDrawing) return;

        this.points.delete(event.pointerId);
        this.isDrawing = false;
        console.log("end drawing");
    }

    whileDrawing(event) {
        if (!event.pointerId || !this.points.has(event.pointerId)) return;

        this.points.get(event.pointerId).push(this.getPointFrom(event));

        this.needsRedraw = true;
    }

    getPointFrom(event) {
        const canvasRect = this.canvasElement.getBoundingClientRect();

        return {
            x: event.clientX - canvasRect.left,
            y: event.clientY - canvasRect.top,
        };
    }

    draw() {
        if (this.needsRedraw) {
            for (const points of this.points.values()) {
                //console.log(points);
                if (points.length < 2) continue;

                this.canvasContext.beginPath();
                for (let i = 1; i < points.length; i++) {
                    const point1 = points.at(i - 1);
                    const point2 = points.at(i);
                    this.canvasContext.moveTo(point1.x, point1.y);
                    this.canvasContext.lineTo(point2.x, point2.y);
                }
                this.canvasContext.stroke();

                const lastPoint = points.at(-1);
                points.length = 0;
                points.push(lastPoint);
            }

            this.needsRedraw = false;
        }

        this.rafId = window.requestAnimationFrame(this.draw.bind(this));
    }

    /*
    static interpolatePoints(point1, point2, spacing = 5) {

    }
    */
}