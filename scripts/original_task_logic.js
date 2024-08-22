// page elements
const drawAreaDiv = document.getElementById("drawArea");

// page variables
let currentGridSize = 16;
let hasOpacityEffect = false;
let hasFadeEffect = false;
let hasRandomColorEffect = false;
const BLACK = "#000000";
const RANDOM_COLOR_LIST = ["black", "red", "green", "blue", "yellow", "purple", "orange", "turquoise", "khaki"];

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
        square.style.borderWidth = "1px";
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

function onChangeCheckBoxOpacityEffect() {
    hasOpacityEffect = !hasOpacityEffect;
}

function onChangeCheckBoxRandomColors() {
    hasRandomColorEffect = !hasRandomColorEffect;
}

function onChangeCheckBoxFadeInput() {
    hasFadeEffect = !hasFadeEffect;
}

drawAreaDiv.addEventListener("mouseover", (event) => {
    if (event.target.classList.contains("square")) {
        let sq = event.target;
        if (hasRandomColorEffect) {
            sq.style.backgroundColor = RANDOM_COLOR_LIST[Math.floor(Math.random() * RANDOM_COLOR_LIST.length)];
        } else {
            sq.style.backgroundColor = BLACK;
        }

        if (hasOpacityEffect) {
            let currentOpacity = parseFloat(sq.style.opacity) ? parseFloat(sq.style.opacity) : 0.0;
            currentOpacity = Math.floor((currentOpacity * 100) + 10) / 100;
            currentOpacity = Math.min(1.0, currentOpacity);
            sq.style.opacity = `${currentOpacity}`;
        } else {
            sq.style.opacity = "";
        }
    }
})

drawAreaDiv.addEventListener("mouseout", (event) => {
    if (hasFadeEffect && event.target.classList.contains("square")) {
        let sq = event.target;
        setTimeout(() => {
            sq.style.backgroundColor = "";
            sq.style.opacity = "";
        }, 1000);
    }
})


document.getElementById("opacityEffectCheckBox").checked = hasOpacityEffect;
document.getElementById("fadeEffectCheckBox").checked = hasFadeEffect;
document.getElementById("randomColEffectCheckBox").checked = hasRandomColorEffect;

drawGrid();