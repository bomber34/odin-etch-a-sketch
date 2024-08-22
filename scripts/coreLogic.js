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

function createSquare() {
    let square = document.createElement("div");
    square.classList.add("square");
    square.style.backgroundColor = "#FFFFFF";
    return square;
}