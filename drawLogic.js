
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
let currentGridSize = 0;

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
    let gridSize = parseInt(gridSizeCtl.value);
    const width = getWidth(gridSize);
    if (gridSize > currentGridSize) {
        growGrid(width, gridSize, Math.abs(gridSize - currentGridSize));
    } else if (gridSize < currentGridSize) {
        shrinkGrid(gridSize, Math.abs(gridSize - currentGridSize));
    }

    adjustSquareWidth(width);
    currentGridSize = gridSize;
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
    while(index > 0) {
        for (let i = 0; i < diffLines; i++) {
            drawAreaDiv.children[index].insertAdjacentElement("afterend", createSquare(width));
        }
        index -= gridSize;
    }
}

function createSquare(width) {
    let square = document.createElement("div");
        square.classList.add("square");
        square.style.width = width + "px";
        square.style.height = width + "px";
    return square
}

function getWidth(gridSize) {
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

drawAreaDiv.addEventListener("mouseover", (event) => {
    if (event.target.classList.contains("square")) {
        let sq = event.target
        let currentColor = sq.style.backgroundColor ? sq.style.backgroundColor : "rgb(255,255,255)"
        let rgbValues = currentColor.match(/\d+/g).map((val) => (Math.abs(200 - val)).toString(16)).join("");
        sq.style.borderColor = `#${rgbValues}`;
        sq.style.borderWidth = "5px";
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

initializeGrid();