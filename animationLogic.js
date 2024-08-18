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