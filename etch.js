const container = document.querySelector('#container');
for (let i = 0; i < 16; i++) {
    const row = document.createElement('div');
    row.classList.add('row');
    for (let j = 0; j < 16; j++) {
        const pixel = document.createElement('div');
        pixel.classList.add('pixel')
        pixel.addEventListener('mouseover', e => pixelEventListener(e))
        row.appendChild(pixel);
    }
    container.appendChild(row);
}

function pixelEventListener(e) {
    e.target.classList.add('pixel-colored')
}