// CONSTANTS

// ELEMENTS
const topElement = document.querySelector(".top");
const bottomElement = document.querySelector(".bottom");
const sizeButtonElements = document.querySelectorAll("button.size");
const colorButtonElements = document.querySelectorAll("button.color");
const canvasElement = document.querySelector("main>canvas");
const clearButtonElement = document.querySelector(".top-left button:nth-child(1)");

// CONTROL STUFF
clearButtonElement.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasContext.beginPath();
});

// CANVAS STUFF
const canvasContext = canvasElement.getContext("2d");

function resizeCanvas() {
    const topRect = topElement.getBoundingClientRect();
    const bottomRect = bottomElement.getBoundingClientRect();
    canvasElement.width = window.innerWidth;
    canvasElement.height = window.innerHeight - topRect.height - bottomRect.height;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function interpolate(p1, p2, spacing = 5) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dist = Math.hypot(dx, dy);
    const steps = Math.floor(dist / spacing);
    const points = [];
    for (let i = 1; i < steps; i++) {
        const t = i / steps;
        points.push({
            x: p1.x + dx * t,
            y: p1.y + dy * t
        });
    }
    return points;
}

canvasContext.lineCap = "round";
canvasContext.lineJoin = "round";
canvasContext.lineWidth = 5;
canvasContext.strokeStyle = "#fff";

const pointers = new Map();
let needsRedraw = false;

canvasElement.addEventListener("pointerdown", (event) => {
    if (!event.pointerType) return;
    pointers.set(event.pointerId, [{ x: event.offsetX, y: event.offsetY }]);
    needsRedraw = true;
});

canvasElement.addEventListener("pointermove", (event) => {
    if (!pointers.has(event.pointerId)) return;
    //pointers.get(event.pointerId).push({ x: event.offsetX, y: event.offsetY });

    const points = pointers.get(event.pointerId);
    const previousPoints = pointers.get(event.pointerId).at(-1);
    const currentPoints = { x: event.offsetX, y: event.offsetY };
    const newPoints = interpolate(previousPoints, currentPoints);
    newPoints.push(currentPoints);
    points.push(...newPoints);
    console.log(points.length);

    needsRedraw = true;
});

const removeTouch = (event) => {
    pointers.delete(event.pointerId);
};
canvasElement.addEventListener("pointerup", removeTouch);
canvasElement.addEventListener("pointercancel", removeTouch);
canvasElement.addEventListener("pointerout", removeTouch);
canvasElement.addEventListener("pointerleave", removeTouch);

function draw() {
    for (const points of pointers.values()) {
        if (points.length < 2) continue;
        canvasContext.beginPath();
        for (let i = 1; i < points.length; i++) {
            const p1 = points[i - 1];
            const p2 = points[i];
            canvasContext.moveTo(p1.x, p1.y);
            canvasContext.lineTo(p2.x, p2.y);
        }
        canvasContext.stroke();
        //const last = points.at(-1);
        //points.length = 0;
        //points.push(last);

        const lastPoints = points.at(-1);
        points.length = 0;
        points.push(lastPoints);
    }
}

function loop() {
    if (needsRedraw) {
        draw();
        needsRedraw = false;
    }
    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
