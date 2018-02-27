import {Player} from "../player"

export class Red extends Player {
    name: string = "Red";
    turn: number = 1;

    rotate(x: number,  y: number,
          x1: number, y1: number): [number, number] {
        return [x + x1, y + y1];
    }
}
