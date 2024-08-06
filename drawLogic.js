let gridSize = 16;
const drawAreaDiv = document.getElementById("drawArea");


function initialize() {
    // clean space
    let childrenOfDrawArea = Array.from(drawAreaDiv.children);
    childrenOfDrawArea.forEach((element) => drawAreaDiv.removeChild(element));

    // setup divs - square of evenly divided drawAreaDiv.clientWidth)
    let widthSize = drawAreaDiv.clientWidth / gridSize;
    let squareAmount = gridSize * gridSize;
    for (let i = 0; i < squareAmount; i++) {
        let square = document.createElement("div");
        square.classList.add("square");
        square.setAttribute("style", `width:${widthSize}px; height:${widthSize}px`);
        drawAreaDiv.appendChild(square);
    }
    
}

initialize();