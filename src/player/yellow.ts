import {Vector} from "../vector"
import {Player} from "../player"

export class Yellow extends Player {
    name: string = "Yellow";
    turn: number = 3;

    rotate(vector: Vector, radius: number): [number, number] {
        return [this.piece.square.n - vector.x1(radius),
                this.piece.square.m - vector.y1(radius)];
    }
}
