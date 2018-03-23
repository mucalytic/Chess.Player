import {Vector} from "../vector"
import {Player} from "../player"

export class Green extends Player {
    name: string = "Green";
    turn: number = 4;
    
    pivot(): [number, number] {
        return [13 - this.piece.square.y,
                     this.piece.square.x];
    }

    rotate(vector: Vector, radius: number): [number, number] {
        return [this.piece.square.x - vector.x1(radius),
                this.piece.square.y + vector.y1(radius)];
    }
}
