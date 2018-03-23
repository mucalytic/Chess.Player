import {Vector} from "../vector"
import {Player} from "../player"

export class Blue extends Player {
    name: string = "Blue";
    turn: number = 2;

    rotate(vector: Vector, radius: number): [number, number] {
        return [this.piece.square.n + vector.x1(radius),
                this.piece.square.m - vector.y1(radius)];
    }
}
