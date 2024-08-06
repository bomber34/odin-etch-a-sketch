
const drawAreaDiv = document.getElementById("drawArea");
const gridSizeCtl = document.getElementById("gridSizeCtl");
const gridSizeNumberInput = document.getElementById("gridSizeNumberInput")
const SCALE = 100;

const COLORS = ["black", "red", "blue", "green", "beige", "purple"];
let color = COLORS[0];


function pickRandomColor() {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
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
    let widthSize = drawAreaDiv.clientWidth / gridSize;
    
    // Ensure that due to float inprecision, there is no empty column or overdraw
    if (widthSize != Math.floor(widthSize)) {
        widthSize = Math.floor(widthSize * SCALE - 1) / SCALE;
    }

    let squareAmount = gridSize * gridSize;
    for (let i = 0; i < squareAmount; i++) {
        let square = document.createElement("div");
        square.classList.add("square");
        
        square.setAttribute("style", `width:${widthSize}px; height:${widthSize}px;`); //  background-color: ${color}
        drawAreaDiv.appendChild(square);
    }
    
}

initializeGrid();