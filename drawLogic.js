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

// Redraw the grid
function drawGrid() {
    let gridSize = parseInt(gridSizeCtl.value);
    const width = getWidth(gridSize);
    if (gridSize > currentGridSize) {
        growGrid(width, gridSize, Math.abs(gridSize - currentGridSize));
    } else if (gridSize < currentGridSize) {
        shrinkGrid(Math.abs(gridSize - currentGridSize));
    }

    adjustSquareWidth(width);
    currentGridSize = gridSize;
    widthSize = width;
}

function adjustSquareWidth(width) {
    const widthInPixels = `${width}px`;
    drawAreaDiv.childNodes.forEach((child) => {
        child.style.width = widthInPixels;
        child.style.height = widthInPixels;
    })
}

function shrinkGrid(diffLines) {
    for (let i = diffLines * currentGridSize; i > 0; i--) {
        let child = drawAreaDiv.children[drawAreaDiv.children.length-1];
        drawAreaDiv.removeChild(child);
    }

    let index = drawAreaDiv.children.length - 1;
    let shrinkBy = (currentGridSize - diffLines);
    while (index > 0) {
        for (let i = 0; i < diffLines; i++, index--) {
            let child = drawAreaDiv.children[index];
            drawAreaDiv.removeChild(child);
        }
        index -= shrinkBy;
    }

}

function growGrid(width, newGridSize, diffLines) {
    let gridSize = currentGridSize;
    for (let i = 0; i < diffLines; i++) {
        for (let j = 0; j < newGridSize; j++) {
            drawAreaDiv.appendChild(createSquare(width));
        }
    }
    const lastChildIndex = (gridSize * gridSize) - 1;
    let index = lastChildIndex;
    while(index >= 0) {
        for (let i = 0; i < diffLines; i++) {
            drawAreaDiv.children[index].insertAdjacentElement("afterend", createSquare(width));
        }
        index -= gridSize;
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

function fillArea(oldColor, currentSquare) {
    let currentIndex = Array.prototype
                            .indexOf
                            .call(currentSquare.parentNode.children, currentSquare);
    let relativeColumnPos = currentIndex % currentGridSize;
    let squareCol = currentSquare.style.backgroundColor;
    if (squareCol != oldColor) {
        return; // hit color border
    }
    currentSquare.style.backgroundColor = color;
    
    // fill left neighbor
    if (relativeColumnPos > 0) {
        fillArea(oldColor, drawAreaDiv.children[currentIndex-1]);
    }
    // fill right neighbor
    if (relativeColumnPos < (currentGridSize - 1)) {
        fillArea(oldColor, drawAreaDiv.children[currentIndex+1]);
    }
    // fill upper neighbor
    if ((currentIndex - currentGridSize) > 0) {
        fillArea(oldColor, drawAreaDiv.children[currentIndex-currentGridSize]);
    }
    // fill lower neighbor
    if ((currentIndex + currentGridSize) < drawAreaDiv.children.length) {
        fillArea(oldColor, drawAreaDiv.children[currentIndex+currentGridSize]);
    }
}

function getRandomColorString() {
    const MAX_RGB_VALUE = 256;
    const red = Math.floor(Math.random() * MAX_RGB_VALUE).toString(16).padStart(2, "0");
    const green = Math.floor(Math.random() * MAX_RGB_VALUE).toString(16).padStart(2, "0");;
    const blue = Math.floor(Math.random() * MAX_RGB_VALUE).toString(16).padStart(2, "0");;

    const res = `#${red}${green}${blue}`;
    return res;
}

function drawRandomColors() {
    let count = 1;
    let max = drawAreaDiv.children.length
    let addDistance = currentGridSize < 50 ? 50 : 25;

    let distanceInMs = addDistance;
    let indices = Array.from({length: (max)}, (e, i) => i);
    indices = chooseAnimation(indices);
    
    indices.forEach((index) => {
        let randColorThing = getRandomColorString();
        setTimeout(function() {
            drawAreaDiv.children[index].style.backgroundColor = randColorThing;
        }, distanceInMs)
        if (count % currentGridSize == 0) {
            distanceInMs += addDistance;
        }
        count++;
    })
}

function colorSquare(event) {
    let target = event.target
    if (!canColorSquare(target)) {
        return;
    }

    pickColorToDraw()
    colorAction(event, target);
}

function colorAction(event, target) {
    const isMouseDownEvent = event.type == "mousedown";
    const areAllSpecialButtonsPressed = event.ctrlKey && event.altKey && event.shiftKey

    if (isMouseDownEvent && areAllSpecialButtonsPressed) {
        drawRandomColors();
    } else if (isMouseDownEvent && event.ctrlKey) {
        fillArea(target.style.backgroundColor, target);
    } else {
        target.style.backgroundColor = color;
    }
}

function canColorSquare(target) {
    return (isLeftMouseBtnDown || isRightMouseBtnDown) && target != drawAreaDiv;
}

function pickColorToDraw() {
    if (isLeftMouseBtnDown) {
        color = leftColor;
    } else if (isRightMouseBtnDown) {
        color = rightColor;
    }
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
        let sq = event.target
        let currentColor = sq.style.backgroundColor ? sq.style.backgroundColor : "rgb(255,255,255)"
        let rgbValues = currentColor.match(/\d+/g).map((val) => (Math.abs(200 - val)).toString(16).padStart(2, "0")).join("");
        sq.style.borderColor = `#${rgbValues}`;
        

        let borderWidthInPixels = widthSize > 10 ? 5 : Math.floor(widthSize / 2);
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

drawGrid();