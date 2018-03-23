import {Vector} from "../vector"
import {Player} from "../player"

export class Dead extends Player {
    name: string = "Dead";
    turn: number = 0;
    
    pivot(): [number, number] {
        throw new Error("Not implemented");
    }

    rotate(vector: Vector, radius: number): [number, number] {
        throw new Error("Not implemented");
    }
}
