'use-strict'
let gridSize = 16;
let color = '#000000';
let isDrawingAllowed = false;

// DOM-nodes stored in memory
const nodes = {
    // Toolbar
    picker: {
        primary: document.querySelector('#color-picker')
    },
    palette: {
        buttonAdd: document.querySelector('button[name="palette-add"'),
        buttonRemove: document.querySelector('button[name="palette-remove"'),
        buttonClear: document.querySelector('button[name="palette-clear"'),
        body: document.querySelector('#color-palette-body')
    },
    gridSizer: {
        container: document.querySelector('#grid-sizer-container'),
        slider: document.querySelector('#grid-sizer'),
        label: document.querySelector('#grid-sizer-container').querySelector('label'),
        button: document.querySelector('#grid-sizer-container').querySelector('button')
    },
    options: {
        toggleGridLines: document.querySelector('button[name="toggle-grid-lines"]')
    },
    // Canvas
    canvas: document.querySelector('#canvas')

}

function initEventListeners() {
    // Toolbar
    // Color picker
    nodes.picker.primary.addEventListener('input', e => {
        color = nodes.picker.primary.value;
    });
    // Palette
    nodes.palette.buttonAdd.addEventListener('click', e => {
        addToPalette();
    })
    nodes.palette.buttonRemove.addEventListener('click', e => {
        removeFromPalette();
    })
    nodes.palette.buttonClear.addEventListener('click', e => {
        clearPalette();
    })
    // Options
    nodes.options.toggleGridLines.addEventListener('click', e => {
        toggleGridLines();
    })
    // Grid sizer
    nodes.gridSizer.slider.addEventListener('input', e => {
        const val = e.target.value;
        nodes.gridSizer.label.textContent = `${val} x ${val}`;
    });
    nodes.gridSizer.button.addEventListener('click', e => {
        gridSize = nodes.gridSizer.slider.value;
        updateGrid();
    })    

    // Canvas 
    nodes.canvas.addEventListener('mousedown', e => {
        e.preventDefault();
        isDrawingAllowed = true;
    });
    nodes.canvas.addEventListener('mouseup', e => {
        e.preventDefault();
        isDrawingAllowed = false;
    });
}

// Palette functions
function addToPalette() {
    // Create palette element
    const paletteItem = document.createElement('div');
    paletteItem.classList.add('palette-item');
    paletteItem.style['background-color'] = color;
    paletteItem.setAttribute('data-hex', color);
    
    paletteItem.addEventListener('click', e => {
        color = e.target.getAttribute('data-hex');
        nodes.picker.primary.value = color;
        if (nodes.palette.selectedPalette) nodes.palette.selectedPalette.classList.remove('selected-palette');
        nodes.palette.selectedPalette = e.target;
        e.target.classList.add('selected-palette')

    })

    // Add node to DOM
    const child = nodes.palette.body.appendChild(paletteItem);
    // Update classlists and memory (nodes)
    if (nodes.palette.selectedPalette) nodes.palette.selectedPalette.classList.remove('selected-palette');
    nodes.palette.selectedPalette = child;
    child.classList.add('selected-palette');
}

function removeFromPalette() {
    if(nodes.palette.selectedPalette) {
        // Remove from DOM, then from nodes
        nodes.palette.selectedPalette.remove();
        delete nodes.palette.selectedPalette;
    }
}

function clearPalette() {
    nodes.palette.body.textContent = '';
}

// Options functions
function toggleGridLines() {
    nodes.canvas.classList.toggle('hide-grid-lines')
}

// Canvas functions
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

function pixelEventListener(e) {
    if(!isDrawingAllowed) return
    const pixel = e.target;
    pixel.style['background-color'] = color;
}

initEventListeners();
updateGrid();