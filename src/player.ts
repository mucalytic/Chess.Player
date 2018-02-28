export abstract class Player {
    abstract name: string;
    abstract turn: number;

    abstract rotate(x: number,  y: number,
                   x1: number, y1: number): [number, number];
}
