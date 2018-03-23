import {Vector} from "../vector"
import {Player} from "../player"

export class Red extends Player {
    name: string = "Red";
    turn: number = 1;

    rotate(vector: Vector, radius: number): [number, number] {
        return [this.piece.square.n + vector.x1(radius),
                this.piece.square.m + vector.y1(radius)];
    }
}
