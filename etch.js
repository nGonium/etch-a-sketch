const container = document.querySelector('#container');
let gridSize = 16;
let color = '#000000';
let isDrawingAllowed = false;
const colorNodes = {
    container: document.querySelector('#color-picker'),
    rgb: document.querySelector('.rgb').querySelectorAll('input[type="range"]'),
    hsl: document.querySelector('.hsl').querySelectorAll('input[type="range"]'),
    preview: document.querySelector('.color-preview')
}

function initEventListeners() {
    for(slider of colorNodes.rgb) {
        slider.addEventListener('input', e => {
            setColor(colorNodes.rgb);
        })
    }
    for(slider of colorNodes.hsl) {
        slider.addEventListener('input', e => {
            setColor(colorNodes.hsl);
        })
    }
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

function setColor(sliders) {
    let colorArr = [];
    for(let slider of sliders){
        colorArr.push(slider.value);
    }
    if(sliders === colorNodes.hsl) {
        colorArr = hslToRgb(colorArr);
    }
    color = rgbToHex(colorArr);
    colorNodes.preview.style['background-color'] = color;
}

function rgbToHex(values) {
    const hexArr = [0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F'];
    let hex = '#';
    for (val of values) {
        hex += hexArr[Math.floor(val / 16)];
        hex += hexArr[val % 16];
    }
    return hex;
}

function hslToRgb(values) {
    const [h, s, l] = values;
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
hslToRgb([1,2,3])
initEventListeners();
updateGrid();