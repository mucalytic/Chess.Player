import {Vector} from "../vector"
import {Player} from "../player"

export class Yellow extends Player {
    name: string = "Yellow";
    turn: number = 3;
    
    pivot(): [number, number] {
        return [this.piece.square.x,
           13 - this.piece.square.y];
    }

    rotate(vector: Vector, radius: number): [number, number] {
        return [this.piece.square.x - vector.x1(radius),
                this.piece.square.y - vector.y1(radius)];
    }
}
