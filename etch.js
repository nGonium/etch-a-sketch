const container = document.querySelector('#container');
let gridSize = 16;
let color = '#000000'

const colorNodes = {
    container: document.querySelector('#color-picker'),
    sliders: document.querySelector('#color-picker').querySelectorAll('input[type="range"]'),
    button: document.querySelector('button[name=color-btn]'),
    preview: document.querySelector('.color-preview')
}

function initEventListeners() {
    for(slider of colorNodes.sliders) {
        slider.addEventListener('input', e => {
            setColor();
        })
    }
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

function setColor() {
    const colorArr = [];
    for(color of colorNodes.sliders){
        colorArr.push(color.value);
    }
    color = rgbToHex(colorArr);
    colorNodes.preview.style['background-color'] = color;
}

function rgbToHex(values) {
    const hexArr = [0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F']
    let hex = '#'
    for (val of values) {
        hex += hexArr[Math.floor(val / 16)];
        hex += hexArr[val % 16];
    }
    return hex;
}

initEventListeners();
updateGrid();