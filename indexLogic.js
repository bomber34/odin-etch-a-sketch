// elements
const drawAreaDiv = document.getElementById("drawArea");
const body = document.querySelector("body");
const leftColorPicker = document.getElementById("gridLeftBtnColor");
const rightColorPicker = document.getElementById("gridRightBtnColor");
const gridSizeCtl = document.getElementById("gridSizeCtl");
const gridSizeNumberInput = document.getElementById("gridSizeNumberInput");

// constants
const LEFT_MOUSE_BUTTON = 0;
const RIGHT_MOUSE_BUTTON = 2;

// global variables
let widthSize = 1;
let isLeftMouseBtnDown = false;
let isRightMouseBtnDown = false;
let leftColor = "#000000";
let rightColor = "#FFFFFF";
let currentGridSize = 0;
let color = leftColor;
let FORCED_ANIMATION_STYLE = -1;

function onColorChange(isLeft) {
    if (isLeft) {
        leftColor = leftColorPicker.value;
    } else {
        rightColor = rightColorPicker.value
    }
}

function onChangeNumberInput() {
    gridSizeCtl.value = gridSizeNumberInput.value;
    drawGrid();
}

function onChangeRangeInput() {
    gridSizeNumberInput.value = gridSizeCtl.value ;
    drawGrid();
}

drawAreaDiv.addEventListener("mousemove", (event) => {
    colorSquare(event)
})

drawAreaDiv.addEventListener("mousedown", (event) => {
    checkSingleClick(event);
    colorSquare(event);
})

drawAreaDiv.addEventListener("mouseover", (event) => {
    if (event.target.classList.contains("square")) {
        const MAX_BORDER_SIZE = 5;
        const WIDTH_BORDER_SIZE_THRESHOLD = MAX_BORDER_SIZE * 2;
        let sq = event.target
        let currentColor = sq.style.backgroundColor ? sq.style.backgroundColor : "rgb(255,255,255)"
        let rgbValues = currentColor.match(/\d+/g).map((val) => (Math.abs(200 - val)).toString(16).padStart(2, "0")).join("");
        sq.style.borderColor = `#${rgbValues}`;
        

        let borderWidthInPixels = widthSize > WIDTH_BORDER_SIZE_THRESHOLD ? MAX_BORDER_SIZE : Math.floor(widthSize / 2);
        sq.style.borderWidth = `${borderWidthInPixels}px`;
    }
})

drawAreaDiv.addEventListener("mouseout", (event) => {
    if (event.target.classList.contains("square")) {
        let sq = event.target
        sq.style.borderColor = "";
        sq.style.borderWidth = "";
    }
})

// general mouse down listener site wide;
body.addEventListener("contextmenu", (event) => {
    const target = event.target;
    if (target.classList.contains("square") || target == drawAreaDiv) {
        event.preventDefault();
        return false;
    }
    isRightMouseBtnDown = false;
});

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
console.log("Hello there stranger! You can force specific animations by setting FORCED_ANIMATION_STYLE to an int between 0 and 6 inclusive")
drawGrid();