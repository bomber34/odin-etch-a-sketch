
const drawAreaDiv = document.getElementById("drawArea");
const gridSizeCtl = document.getElementById("gridSizeCtl");
const SCALE = 100;

const COLORS = ["red", "blue", "green", "beige", "purple"];

function pickRandomColor() {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function initialize() {
    let gridSize = gridSizeCtl.value;
    // clean space
    let childrenOfDrawArea = Array.from(drawAreaDiv.children);
    childrenOfDrawArea.forEach((element) => drawAreaDiv.removeChild(element));

    // setup divs - square of evenly divided drawAreaDiv.clientWidth)
    let widthSize = Math.floor((drawAreaDiv.clientWidth / gridSize) * SCALE - 1) / SCALE;

    let squareAmount = gridSize * gridSize;
    for (let i = 0; i < squareAmount; i++) {
        let square = document.createElement("div");
        square.classList.add("square");
        
        square.setAttribute("style", `width:${widthSize}px; height:${widthSize}px;`); //  background-color: ${color}
        drawAreaDiv.appendChild(square);
    }
    
}

//initialize();
function showAllValues() {
    gridSizeCtl.value = 1;
    for (let i = 0; i < 100; i++) {
        setTimeout(initialize, 1000);
        setTimeout(null, 0);
        gridSizeCtl.value = parseInt(gridSizeCtl.value) + 1;
    }
}

function addOneMoreGrid() {
    gridSizeCtl.value = parseInt(gridSizeCtl.value) +1;
    initialize();
}
gridSizeCtl.value = 1;
//showAllValues();