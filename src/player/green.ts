import {Player} from "../player"

export class Green extends Player {
    name: string = "Green";
    turn: number = 4;

    rotate(x: number,  y: number,
          x1: number, y1: number): [number, number] {
        return [x - y1, y + x1];
    }
}
