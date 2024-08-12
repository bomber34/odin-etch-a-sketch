
const drawAreaDiv = document.getElementById("drawArea");
const body = document.querySelector("body");
const leftColorPicker = document.getElementById("gridLeftBtnColor");
const rightColorPicker = document.getElementById("gridRightBtnColor");
const gridSizeCtl = document.getElementById("gridSizeCtl");
const gridSizeNumberInput = document.getElementById("gridSizeNumberInput")
const SCALE = 100;
let widthSize = 1;
let isLeftMouseBtnDown = false;
let isRightMouseBtnDown = false;
let leftColor = "#000000";
let rightColor = "#FFFFFF";
const LEFT_MOUSE_BUTTON = 0;
const RIGHT_MOUSE_BUTTON = 2;

const COLORS = ["black", "red", "blue", "green", "beige", "purple"];
let color = COLORS[0];

function pickRandomColor() {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function onColorChange(isLeft) {
    if (isLeft) {
        leftColor = leftColorPicker.value;
    } else {
        rightColor = rightColorPicker.value
    }
}

function onChangeNumberInput() {
    gridSizeCtl.value = gridSizeNumberInput.value;
    initializeGrid();
}

function onChangeRangeInput() {
    gridSizeNumberInput.value = gridSizeCtl.value ;
    initializeGrid();
}

// Redraw the grid
function initializeGrid() {
    let gridSize = gridSizeCtl.value;
    // clean space
    let childrenOfDrawArea = Array.from(drawAreaDiv.children);
    childrenOfDrawArea.forEach((element) => drawAreaDiv.removeChild(element));

    // setup divs - square of evenly divided drawAreaDiv.clientWidth)
    widthSize = drawAreaDiv.clientWidth / gridSize;
    
    // Ensure that due to float inprecision, there is no empty column or overdraw
    if (widthSize != Math.floor(widthSize)) {
        widthSize = Math.floor(widthSize * SCALE - 1) / SCALE;
    }

    let squareAmount = gridSize * gridSize;
    for (let i = 0; i < squareAmount; i++) {
        let square = document.createElement("div");
        square.classList.add("square");
        square.style.width = widthSize + "px";
        square.style.height = widthSize + "px";
        drawAreaDiv.appendChild(square);
    }
    
}

function checkSingleClick(event) {
    if (event.type == "mousedown") {
        if (event.button == LEFT_MOUSE_BUTTON) {
            isLeftMouseBtnDown = true;
        } else if (event.button == RIGHT_MOUSE_BUTTON) {
            isRightMouseBtnDown = true;
        }
    }
}

function colorSquare(event) {
    let target = event.target
    if (!(isLeftMouseBtnDown || isRightMouseBtnDown) || target == drawAreaDiv) {
        return;
    }

    if (isLeftMouseBtnDown) {
        color = leftColor;
    } else if (isRightMouseBtnDown) {
        color = rightColor;
    }

    target.style.backgroundColor = color;
}

drawAreaDiv.addEventListener("mousemove", (event) => {
    colorSquare(event)
})

drawAreaDiv.addEventListener("mousedown", (event) => {
    checkSingleClick(event);
    colorSquare(event);
})

drawAreaDiv.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    return false;
});

// general mouse down listener site wide;
body.addEventListener("mousedown", (event) => {
    if (event.button == LEFT_MOUSE_BUTTON) {
        isLeftMouseBtnDown = true;
    }

    if (event.button == RIGHT_MOUSE_BUTTON) {
        isRightMouseBtnDown = true;
    }
})

body.addEventListener("mouseup", (event) => {
    if (event.button == LEFT_MOUSE_BUTTON) {
        isLeftMouseBtnDown = false;
    }

    if (event.button == RIGHT_MOUSE_BUTTON) {
        isRightMouseBtnDown = false;
    }
})

leftColorPicker.value = leftColor;
rightColorPicker.value = rightColor;

initializeGrid();