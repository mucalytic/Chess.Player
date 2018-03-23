import {Vector} from "../vector"
import {Player} from "../player"

export class Red extends Player {
    name: string = "Red";
    turn: number = 1;
    
    pivot(): [number, number] {
        return [this.piece.square.x,
                this.piece.square.y];
    }

    rotate(vector: Vector, radius: number): [number, number] {
        return [this.piece.square.x + vector.x1(radius),
                this.piece.square.y + vector.y1(radius)];
    }
}
