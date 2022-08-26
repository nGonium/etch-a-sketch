'use-strict'
let gridSize = 16;
let toolSelected = 'pen';
let color = '#000000';
let isDrawingAllowed = false;

// Imported, change with import modules once learned
class Color {
    constructor(type, value) {
        if (type === 'hex') {
            // value => #000000
            this.hex = value;
        } else if (type === 'rgb') {
            // value => [r, g, b]
            this.rgb = value;
            this.hex = Color.rgbToHex(this.rgb);
        } else if (type === 'hsl') {
            // value => [h, s, l]
            this.hsl = value;
            this.rgb = Color.hslToRgb(this.hsl);
            this.hex = Color.rgbToHex(this.rgb);
        } else if (type === 'rgbStr') {
            this.rgb = Color.strToRgb(value);
        }
    }

    addShade(isDarken = true, alpha = 0.1) {
        const shadeFactor = isDarken ? 0 : 255
        for(let i in this.rgb) {
            const val = this.rgb[i];
            this.rgb[i] += (shadeFactor - this.rgb[i]) * alpha;
        }
        console.log(this.rgb);
    }

    getRgbStr() {
        return `rgb(${this.rgb.join(', ')})`
    }

    static rgbToHex(rgb) {
        const hexArr = [0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F'];
        let hex = '#';
        for (let val of rgb) {
            hex += hexArr[Math.floor(val / 16)];
            hex += hexArr[val % 16];
        }
        return hex;
    }
    
    static hslToRgb(hsl) {
        const [h, s, l] = hsl;
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs( Math.abs((h / 60) % 2 - 1) ) );
        const m = l - c / 2;
        let r, g, b;
    
        if (0 <= h && h < 60) {
            [r, g, b] = [c, x, 0];
        } else if (60 <= h && h < 120) {
            [r, g, b] = [x, c, 0];
        } else if (120 <= h && h < 180) {
            [r, g, b] = [0, c, x];
        } else if (180 <= h && h < 240) {
            [r, g, b] = [0, x, c];
        } else if (240 <= h && h < 300) {
            [r, g, b] = [x, 0, c];
        } else if (300 <= h && h <= 360) {
            [r, g, b] = [c, 0, x];
        } 
    
        return [
            Math.floor((r + m) * 255),
            Math.floor((g + m) * 255),
            Math.floor((b + m) * 255)
        ]
    }

    static strToRgb(str) {
        return str.slice(4, -1).split(', ').map(el => Number(el))
    }
}

// DOM-nodes stored in memory
const nodes = {
    // Toolbar
    picker: {
        switch: document.querySelector('#color-picker-switch'),
        primary: document.querySelector('#color-picker-primary'),
        secondary: document.querySelector('#color-picker-secondary'),
        picker: document.querySelector('button[name="color-picker"')
    },
    palette: {
        buttonAdd: document.querySelector('button[name="palette-add"'),
        buttonRemove: document.querySelector('button[name="palette-remove"'),
        buttonClear: document.querySelector('button[name="palette-clear"'),
        body: document.querySelector('#color-palette-body')
    },
    tools: {
        pen: document.querySelector('label[for="pen"]'),
        eraser: document.querySelector('label[for="eraser"]'),
        shadePlus: document.querySelector('label[for="shade-plus"]'),
        shadeMin: document.querySelector('label[for="shade-minus"]'),
        random: document.querySelector('label[for="random"]')
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
    nodes.picker.switch.addEventListener('click', e => {
        nodes.picker.primary.value = nodes.picker.secondary.value;
        nodes.picker.secondary.value = color;
        color = nodes.picker.primary.value;
    });
    nodes.picker.primary.addEventListener('input', e => {
        color = nodes.picker.primary.value;
    });
    nodes.picker.picker.addEventListener('click', e => {
        toolSelected = 'picker';
    })
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
    // Tools
    nodes.tools.pen.addEventListener('click', e => {
        toolSelected = 'pen';
    })
    nodes.tools.eraser.addEventListener('click', e => {
        toolSelected = 'eraser';
    })
    nodes.tools.shadePlus.addEventListener('click', e => {
        toolSelected = 'shadePlus';
    })
    nodes.tools.shadeMin.addEventListener('click', e => {
        toolSelected = 'shadeMin';
    })
    nodes.tools.random.addEventListener('click', e => {
        toolSelected = 'random';
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
            pixel.addEventListener('mouseenter', e => pixelEventListener(e))
            pixel.addEventListener('mousedown', e => pixelEventListener(e))
            nodes.canvas.appendChild(pixel);
        }
    }
}

function pixelEventListener(e) {
    if (isDrawingAllowed || e.type === 'mousedown') {
        const pixel = e.target;
        if (toolSelected === 'pen') {
            pixel.style['background-color'] = color;
        } else if (toolSelected === 'eraser') {
            pixel.style.removeProperty('background-color');
        } else if (toolSelected === 'shadePlus') {
            let pixelColor = new Color('rgbStr', pixel.style['background-color'])
            pixelColor.addShade(true);
            pixel.style['background-color'] = pixelColor.getRgbStr();
        } else if (toolSelected === 'shadeMin') {
            let pixelColor = new Color('rgbStr', pixel.style['background-color'])
            pixelColor.addShade(false);
            pixel.style['background-color'] = pixelColor.getRgbStr();
        } else if (toolSelected === 'random') {
            pixel.style['background-color'] = `rgb(${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)}, ${Math.floor(Math.random()*256)}`;
        } else if (toolSelected === 'picker') {
            color = pixel.style['background-color'];
            toolSelected = 'pen';
            console.log(color);
        }
    }
}

console.log(nodes);
initEventListeners();
updateGrid();