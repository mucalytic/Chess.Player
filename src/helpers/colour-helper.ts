export class ColourHelper {
    getColour(element: HTMLElement, friendly: boolean): string {
        let rgb: { r: number, g: number, b: number};
        var bgc = window
            .getComputedStyle(element, null)
            .getPropertyValue("background-color");
        if (bgc.indexOf("#") === 0) {
            rgb = this.hexToRgb(bgc);
        }
        if (bgc.indexOf("rgb") === 0) {
            const vals = bgc
                .substring(4, bgc.length -1)
                .split(", ");
            rgb = {
                r: parseInt(vals[0]),
                g: parseInt(vals[1]),
                b: parseInt(vals[2])
            };
        };
        if (friendly) {
            return `rgb(${rgb.r}, 255, ${rgb.b})`;
        } else {
            return `rgb(255, ${rgb.g}, ${rgb.b})`;
        }
    }
    
    hexToRgb(hex: string): {r, g, b} {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, (m, r, g, b) => {
            return r + r + g + g + b + b;
        });
    
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
}

