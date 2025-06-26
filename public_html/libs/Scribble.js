export class Scribble {
    canvasElement;
    canvasContext;
    boundResize;

    constructor(canvasElement) {
        this.canvasElement = canvasElement;
        this.canvasContext = this.canvasElement.getContext("2d");
        console.log(this.canvasElement, this.canvasContext);

        this.boundResize = this.resize.bind(this);
        
        window.addEventListener("resize", this.resize.bind(this));
        this.resize();
    }

    enable() {
        
    }

    disable() {

    }

    resize() {
        const { width, height } = this.canvasElement.getBoundingClientRect();
        console.log(`resizing canvas: W = ${width} / H = ${height}`);
        this.canvasElement.width = width;
        this.canvasElement.height = height;
    }

    startDrawing() {
        
    }

    
}