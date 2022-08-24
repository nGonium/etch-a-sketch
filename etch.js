const container = document.querySelector('#container');
let gridSize = 16;
let color = '#000000';
let isDrawingAllowed = false;
const colorNodes = {
    container: document.querySelector('#color-container'),
    picker: document.querySelector('#color-picker'),
    preview: document.querySelector('.color-preview')
}

function initEventListeners() {
    colorNodes.picker.addEventListener('input', e => {
        color = colorNodes.picker.value;
    });
    container.addEventListener('mousedown', e => {
        e.preventDefault();
        isDrawingAllowed = true;
    });
    container.addEventListener('mouseup', e => {
        e.preventDefault();
        isDrawingAllowed = false;
    });
}

function updateGrid() {
    container.replaceChildren();
    for (let i = 0; i < gridSize; i++) {
        const row = document.createElement('div');
        row.classList.add('row');
        for (let j = 0; j < gridSize; j++) {
            const pixel = document.createElement('div');
            pixel.classList.add('pixel')
            pixel.addEventListener('mouseover', e => pixelEventListener(e))
            row.appendChild(pixel);
        }
        container.appendChild(row);
    }
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