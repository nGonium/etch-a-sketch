'use-strict'
let gridSize = 16;
let color = '#000000';
let isDrawingAllowed = false;

const nodes = {
    canvas: document.querySelector('#canvas'),
    picker: document.querySelector('#color-picker'),
    palette: document.querySelector('#color-palette')
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

function addToPalette() {
    let el = document.createElement('div');
    el.classList.add('palette-item');
    el.style['background-color'] = color;
    el.setAttribute('data-hex', color)
    el.addEventListener('click', e => {
        color = e.target.getAttribute('data-hex');
        nodes.picker.value = color;
        if (nodes.selectedPalette) nodes.selectedPalette.classList.remove('selected-palette');
        nodes.selectedPalette = e.target;
        e.target.classList.add('selected-palette')

    })
    el.addEventListener('contextmenu', e => {
        e.preventDefault()
        e.target.remove();
    })
    let child = nodes.palette.appendChild(el);
    if (nodes.selectedPalette) nodes.selectedPalette.classList.remove('selected-palette');
    nodes.selectedPalette = child;
    child.classList.add('selected-palette');
}

function removeFromPalette() {
    if(nodes.selectedPalette) {
        nodes.selectedPalette.remove();
        delete nodes.selectedPalette;
    }
}

function clearPalette() {
    nodes.palette.textContent = '';
}

initEventListeners();
updateGrid();