
let gridSize = 16;
let color = '#000000';
let isDrawingAllowed = false;

const nodes = {
    canvas: document.querySelector('#canvas'),
    picker: document.querySelector('#color-picker'),
}

function initEventListeners() {
    nodes.picker.addEventListener('input', e => {
        color = nodes.picker.value;
    });
    nodes.canvas.addEventListener('mousedown', e => {
        e.preventDefault();
        isDrawingAllowed = true;
    });
    nodes.canvas.addEventListener('mouseup', e => {
        e.preventDefault();
        isDrawingAllowed = false;
    });
}

function updateGrid() {
    nodes.canvas.style['grid-template-columns'] = `repeat(${gridSize}, 1fr)`
    nodes.canvas.replaceChildren();
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const pixel = document.createElement('div');
            pixel.classList.add('pixel')
            pixel.addEventListener('mouseover', e => pixelEventListener(e))
            nodes.canvas.appendChild(pixel);
        }
    }
}

function toggleGridLines() {
    console.log(nodes.canvas.style['grid-gap'])
    nodes.canvas.classList.toggle('hide-grid-lines')

}

function pixelEventListener(e) {
    if(!isDrawingAllowed) return
    const pixel = e.target;
    pixel.style['background-color'] = color;
}

function promptGridSize() {
    let valid = false;
    do {
        inp = prompt('Enter grid size (1-100)');
        if (inp >= 1 && inp <= 100) {
            valid = true;
        }
    } while (!valid);
    gridSize = Math.floor(inp);
    updateGrid();
}

initEventListeners();
updateGrid();