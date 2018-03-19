import {Piece} from "./piece"

export class Square {
    m: number;
    n: number;
    piece: Piece;
    element: HTMLDivElement;

    char(n: number): string {
        return String.fromCharCode(n + 97);
    }

    code(): string {
        return `${this.char(this.n)}${this.m + 1}`;
    }

    accessible(): boolean {
        return (this.m >= 3 && this.m <= 10 && this.n >= 0 && this.n <= 2) ||
               (this.m >= 0 && this.m <= 13 && this.n >= 3 && this.n <= 10) ||
               (this.m >= 3 && this.m <= 10 && this.n >= 11 && this.n <= 13);
    }

    static coords(code: string): [number, number] {
        const m = parseInt(code.slice(1)) - 1;
        const n = code.charCodeAt(0) - 97;
        return [m, n];
    }

    constructor(m: number, n: number) {
        this.m = m;
        this.n = n;
        return this;
    }
}
