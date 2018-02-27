export class Vector {
    x1: (r?: number) => number;
    y1: (r?: number) => number;

    constructor(x1: (r?: number) => number,
                y1: (r?: number) => number) {
        this.x1 = x1;
        this.y1 = y1;
    }
}
