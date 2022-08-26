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
            this.rgb = Color.strToRgb(this.value);
            console.log(this.rgb);
        }
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

    }
}