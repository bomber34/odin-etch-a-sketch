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
const MAX_RGB_VALUE_INT = (256**3) - 1;

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
        shrinkGrid(gridSize, Math.abs(gridSize - currentGridSize));
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

function shrinkGrid(newGridSize, diffLines) {
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

function createSquare(width) {
    let square = document.createElement("div");
    square.classList.add("square");
    square.style.backgroundColor = "#FFFFFF";
    return square;
}

function getWidth(gridSize) {
    const SCALE = 100;
    // setup divs - square of evenly divided drawAreaDiv.clientWidth)
    let width = drawAreaDiv.clientWidth / gridSize;

    // Ensure that due to float inprecision, there is no empty column or overdraw
    if (width != Math.floor(width)) {
        width = Math.floor(width * SCALE - 1) / SCALE;
    }
    return width;
}

function oldDraw() {
    let gridSize = gridSizeCtl.value;
    // clean space
    let childrenOfDrawArea = Array.from(drawAreaDiv.children);
    childrenOfDrawArea.forEach((element) => drawAreaDiv.removeChild(element));

    // setup divs - square of evenly divided drawAreaDiv.clientWidth)
    widthSize = getWidth(gridSize);

    let squareAmount = gridSize * gridSize;
    for (let i = 0; i < squareAmount; i++) {
        let square = createSquare(widthSize);
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
    let rgbValues = [0, 0, 0].map((val) => Math.floor(Math.random() * MAX_RGB_VALUE));
    return toHexString(rgbValues);
}

function shuffle(a) {
    let j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function createMatrix(arr, chunkSize) {
    const rows = [];
    for (let i = 0; i < arr.length; i+= chunkSize) {
        rows.push(arr.slice(i, i+chunkSize));
    }
    return rows;
}

function createSpiral(matrix) {
    let numRows = matrix.length;
    let spiral = [];
    if (numRows == 0) {
        return spiral;
    }
    let numCols = matrix[0].length;
    if (numRows == 1 && numCols == 1) {
        return matrix[0][0];
    }

    let firstRow = matrix[0];
    let lastRow = matrix[matrix.length - 1];
    let firstCol = matrix.map((row) => row[0]).slice(1, numCols-1);
    let lastCol = matrix.map((row) => row[row.length - 1]).slice(1, numCols-1);
    
    let innerMatrix = matrix.slice(1, matrix.length-1).map((row) => row.slice(1, row.length-1));
    return spiral.concat(firstRow)
        .concat(firstCol)
        .concat(lastRow.reverse())
        .concat(lastCol.reverse())
        .concat(createSpiral(innerMatrix));
}

function transposeMatrix(matrix) {
    return matrix[0].map((col, c) => matrix.map((row, r) => matrix[r][c]));
}

function chooseAnimation(indices) {
    const LINES = 0;
    const RANDOM_COLORING = 1;
    const REVERSE_LINES = 2;
    const TRANSPOSE = 3;
    const TRANSPOSE_REVERSE = 4;
    const SPIRAL = 5;
    const REVERSE_SPIRAL = 6;
    const ANIMATION_OPTIONS = [LINES, RANDOM_COLORING, REVERSE_LINES, TRANSPOSE, TRANSPOSE_REVERSE, SPIRAL, REVERSE_SPIRAL];

    let chosenDrawStyle = FORCED_ANIMATION_STYLE >= 0 && FORCED_ANIMATION_STYLE < ANIMATION_OPTIONS.length
                            ? FORCED_ANIMATION_STYLE : Math.floor(Math.random() * ANIMATION_OPTIONS.length);

    switch (chosenDrawStyle) {
        case LINES:
            break;
        case RANDOM_COLORING:
            indices = shuffle(indices);
            break;
        case REVERSE_LINES:
            indices = indices.reverse();
            break;
        case TRANSPOSE:
            indices = transposeMatrix(createMatrix(indices, currentGridSize)).flat();
            break;
        case TRANSPOSE_REVERSE:
            indices = transposeMatrix(createMatrix(indices.reverse(), currentGridSize)).flat();
            break;
        case SPIRAL:
            indices = createSpiral(createMatrix(indices, currentGridSize)).flat();
            break;
        case REVERSE_SPIRAL:
            indices = createSpiral(createMatrix(indices, currentGridSize)).flat().reverse();
            break;
    }
    return indices;
}

function toHexString(rgbValues) {
    return `#${rgbValues.map((val) => val.toString(16).padStart(2, "0")).join("")}`;
}

function extractRbgIntValues(col) {
    return col.match(/\d+/g).map((val) => parseInt(val));
}

function getNextColor(gradientColor, step) {
    let rgbValues = extractRbgIntValues(gradientColor);
    let val = (rgbValues[2] + (rgbValues[1] * 256) + (rgbValues[0] * (256**2)) + step) % MAX_RGB_VALUE_INT;
    
    rgbValues[2] = val % 256;
    rgbValues[1] = Math.floor(val / 256) % 256;
    rgbValues[0] = Math.floor(val / (256 ** 2)) % 256;
    return toHexString(rgbValues);
}

function hexStringToRgbValues(col) {
    let hexVals = col.substr(1, col.length);
    let red = hexVals.slice(0, 2);
    let green = hexVals.slice(2, 4);
    let blue = hexVals.slice(4, 6);
    return [red, green, blue].map((val) => parseInt(val, 16));
}

function getRgbIntValue(hexString) {
    let rgbValues = hexStringToRgbValues(hexString);
    let rgbIntVal = rgbValues[2] + (rgbValues[1] * 256) + (rgbValues[0] * (256**2));
    return rgbIntVal;
}

function rgbIntValueToHextString(rgbIntVal) {
    let rgbValues = new Array(3);
    rgbValues[2] = rgbIntVal % 256;
    rgbValues[1] = Math.floor(rgbIntVal / 256) % 256;
    rgbValues[0] = Math.floor(rgbIntVal / (256 ** 2)) % 256;
    return toHexString(rgbValues);
}

function getGradient(step) {
    const RED = 0;
    const GREEN = 1;
    const BLUE = 2;

    let len = drawAreaDiv.children.length;
    let gradientColors = new Array(len);
    gradientColors[0] = hexStringToRgbValues(leftColor);
    gradientColors[len-1] = hexStringToRgbValues(rightColor);
    let redStep = gradientColors[len-1][RED] - gradientColors[0][RED];
    redStep /= step;
    let greenStep = gradientColors[len-1][GREEN] - gradientColors[0][GREEN];
    greenStep /= step;
    let blueStep = gradientColors[len-1][BLUE] - gradientColors[0][BLUE];
    blueStep /= step;
    let nextRgb = gradientColors[0].slice();
    for (let i = 1; i < len-2; i++) {
        nextRgb[RED] += redStep;
        nextRgb[GREEN] += greenStep;
        nextRgb[BLUE] += blueStep;
        gradientColors[i] = nextRgb.slice().map((val) => Math.floor(val));
    }
    return gradientColors.map((val) => toHexString(val));
}

function drawGradient() {
    let count = 1;
    let max = drawAreaDiv.children.length
    let addDistance = currentGridSize < 50 ? 50 : 25;
    let distanceInMs = addDistance;
    let indices = Array.from({length: (max)}, (e, i) => i);

    const shouldUseLinesAnimation = FORCED_ANIMATION_STYLE < 0 || FORCED_ANIMATION_STYLE > 6;
    FORCED_ANIMATION_STYLE = shouldUseLinesAnimation ? 0 : FORCED_ANIMATION_STYLE;
    indices = chooseAnimation(indices);
    FORCED_ANIMATION_STYLE = shouldUseLinesAnimation ? -1 : FORCED_ANIMATION_STYLE;

    const step = Math.floor(MAX_RGB_VALUE_INT / drawAreaDiv.children.length);
    const rgbVals = getGradient(max);
    let i = 0;
    for (index of indices) {
        /*
        colorGradient = getNextColor("rgb" + hexStringToRgbValues(colorGradient), step);
        */

        drawAsync(index, rgbVals[i], distanceInMs);
        if (count % currentGridSize == 0) {
            distanceInMs += addDistance;
        }
        count++;
        i++;
    }
}

function drawAsync(index, col, distanceInMs) {
    setTimeout(function() {
        drawAreaDiv.children[index].style.backgroundColor = col;
    }, distanceInMs)
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
        let rgbValues = extractRbgIntValues(currentColor).map((val) => (Math.abs(200 - val)).toString(16)).join("");
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