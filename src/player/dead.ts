import {Player} from "../player"

export class Dead extends Player {
    name: string = "Dead";
    turn: number = 0;

    rotate(x: number, y: number): [number, number] {
        throw new Error("Not implemented");
    }
}
