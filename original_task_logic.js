// page elements
const drawAreaDiv = document.getElementById("drawArea");

// page variables
let currentGridSize = 16;
let color = "#000000";

function drawGrid() {
    let gridSize = currentGridSize;
    // clean space
    let childrenOfDrawArea = Array.from(drawAreaDiv.children);
    childrenOfDrawArea.forEach((element) => drawAreaDiv.removeChild(element));

    // setup divs - square of evenly divided drawAreaDiv.clientWidth)
    widthSize = `${getWidth(gridSize)}px`;

    let squareAmount = gridSize * gridSize;
    for (let i = 0; i < squareAmount; i++) {
        let square = createSquare();
        square.style.width = widthSize;
        square.style.height = widthSize;
        drawAreaDiv.appendChild(square);
    }
}

function onChangeGridSize() {
    let userInput = prompt("Change GridSize by typing in a number between 1 and 100!");
    let chosenValue = parseInt(userInput);
    if (userInput > 0 && userInput <= 100) {
        currentGridSize = chosenValue;
        drawGrid();
    }
}

drawGrid();