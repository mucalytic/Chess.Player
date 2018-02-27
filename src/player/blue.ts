import {Player} from "../player"

export class Blue extends Player {
    name: string = "Blue";
    turn: number = 2;

    rotate(x: number,  y: number,
          x1: number, y1: number): [number, number] {
        return [x + y1, y - x1];
    }
}
