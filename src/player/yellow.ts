import {Player} from "../player"

export class Yellow extends Player {
    name: string = "Yellow";
    turn: number = 3;

    rotate(x: number,  y: number,
          x1: number, y1: number): [number, number] {
        return [x - x1, y - y1];
    }
}
