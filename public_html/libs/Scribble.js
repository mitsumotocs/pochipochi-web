export class Scribble {
    canvasElement;
    canvasContext;

    constructor(canvasElement) {
        this.canvasElement = canvasElement;
        this.canvasContext = this.canvasElement.getContext("2d");
        console.log(this.canvasElement, this.canvasContext);
    }

    resize() {
        console.log("resizing canvas...");

    }



}