import {Vector} from "../vector"
import {Player} from "../player"

export class Dead extends Player {
    name: string = "Dead";
    turn: number = 0;

    rotate(vector: Vector, radius: number): [number, number] {
        throw new Error("Not implemented");
    }
}
