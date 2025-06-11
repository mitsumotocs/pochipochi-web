// CONTROL STUFF

const sizeButtonElements = document.querySelectorAll("button.size");
const colorButtonElements = document.querySelectorAll("button.color");
let size, color;

for (const element of sizeButtonElements) {
    element.firstElementChild.style.fontSize = element.dataset.size;

    element.addEventListener("pointerdown", (event) => {
        for (const element of sizeButtonElements) {
            if (element !== event.target.closest("button.selectable")) {
                element.classList.remove("selected");
                continue;
            }

            element.classList.add("selected");
            size = element.dataset.size;
            console.log(`size updated: ${size}`);
        }
    });
}

for (const element of colorButtonElements) {
    element.firstElementChild.style.color = element.dataset.color;

    element.addEventListener("pointerdown", (event) => {
        for (const element of colorButtonElements) {
            if (element !== event.target.closest("button.selectable")) {
                element.classList.remove("selected");
                continue;
            }

            element.classList.add("selected");
            color = element.dataset.color;
            console.log(`color updated: ${color}`);
        }
    });
}

// CANVAS STUFF
const canvasElement = document.querySelector("main>canvas");
const canvasContext = canvasElement.getContext("2d");

// !NOT WORKING PROPERLY
function resizeCanvas() {
    const rect = canvasElement.getBoundingClientRect();
    canvasElement.width = rect.width;
    canvasElement.height = rect.height;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();