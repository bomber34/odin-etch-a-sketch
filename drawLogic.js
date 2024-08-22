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
    let rgbValues = [0, 0, 0].map((val) => Math.floor(Math.random() * MAX_RGB_VALUE));
    return toHexString(rgbValues);
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

function getGradientBetweenTwoColors(start, end, arr, leftCol, rightCol) {
    const RED = 0;
    const GREEN = 1;
    const BLUE = 2;
    let step = end - start;
    arr[start] = hexStringToRgbValues(leftCol);
    arr[end] = hexStringToRgbValues(rightCol);
    let redStep = arr[end][RED] - arr[start][RED];
    redStep /= step;
    let greenStep = arr[end][GREEN] - arr[start][GREEN];
    greenStep /= step;
    let blueStep = arr[end][BLUE] - arr[start][BLUE];
    blueStep /= step;
    let nextRgb = arr[start].slice();
    for (let i = start+1; i < end; i++) {
        nextRgb[RED] += redStep;
        nextRgb[GREEN] += greenStep;
        nextRgb[BLUE] += blueStep;
        arr[i] = nextRgb.slice().map((val) => Math.floor(val));
    }

    for (let i = start; i <= end; i++) {
        arr[i] = toHexString(arr[i]);
    }
    return arr;
}

function getRainbowGradient() {
    const RAINBOW_HEX_VALS = ["#ffffff", "#ff0000", "#ffa500", "#ffff00", "#00ff00", "#0000ff", "#4b0082", "800080", "#000000"];
    let len = drawAreaDiv.children.length;
    let gradientColors = new Array(len);
    let current = 0;
    let step = (len-1) / (RAINBOW_HEX_VALS.length-1);
    let next = current + step;
    for (let i = 0; i < RAINBOW_HEX_VALS.length-1; i++) {
        let left = RAINBOW_HEX_VALS[i];
        let right = RAINBOW_HEX_VALS[i+1];
        getGradientBetweenTwoColors(Math.floor(current), Math.floor(next), gradientColors, left, right);
        current = next;
        next += step;
    }
    return gradientColors;
}

function getGradientBetweenSelectedColors(step) {
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
    for (let i = 1; i < len-1; i++) {
        nextRgb[RED] += redStep;
        nextRgb[GREEN] += greenStep;
        nextRgb[BLUE] += blueStep;
        gradientColors[i] = nextRgb.slice().map((val) => Math.floor(val));
    }
    return gradientColors.map((val) => toHexString(val));
}

function drawGradient(isRainbow = true) {
    let count = 1;
    let max = drawAreaDiv.children.length
    let addDistance = currentGridSize < 50 ? 50 : 25;
    let distanceInMs = addDistance;
    let indices = Array.from({length: (max)}, (e, i) => i);

    const shouldUseLinesAnimation = FORCED_ANIMATION_STYLE < 0 || FORCED_ANIMATION_STYLE > 6;
    FORCED_ANIMATION_STYLE = shouldUseLinesAnimation ? 0 : FORCED_ANIMATION_STYLE;
    indices = chooseAnimation(indices);
    FORCED_ANIMATION_STYLE = shouldUseLinesAnimation ? -1 : FORCED_ANIMATION_STYLE;

    const rgbVals = isRainbow ? getRainbowGradient() : getGradientBetweenSelectedColors(drawAreaDiv.children.length);
    let i = 0;
    for (index of indices) {
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