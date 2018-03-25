import {Vector} from "../vector"
import {Player} from "../player"

export class Blue extends Player {
    name: string = "Blue";
    turn: number = 2;
    
    pivot(): [number, number] {
        return [13 - this.piece.square.y,
                     this.piece.square.x];
    }

    rotate(vector: Vector, radius: number): [number, number] {
        return [this.piece.square.x + vector.y1(radius),
                this.piece.square.y - vector.x1(radius)];
    }
}
