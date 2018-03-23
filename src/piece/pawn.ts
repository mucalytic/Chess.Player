import {Square} from "../square"
import {Vector} from "../vector"
import {Piece} from "../piece"

export class Pawn extends Piece {
    name: string = "Pawn";
    home: [number, number][] =
        [[1, 3], [1, 4], [1, 5], [1, 6], [1, 7], [1, 8], [1, 9], [1, 10]];

    moves(): Vector[] {
        return this.moved()
            ? [new Vector(_ => 0, _ => 1)]
            : [new Vector(_ => 0, _ => 1),
               new Vector(_ => 0, _ => 2)];
    }

    attacks(): Vector[] {
        return [new Vector(r =>  r, r => r),
                new Vector(r => -r, r => r)];
    }

    constructor(dp: string, square: Square) {
        super(dp, square);
        this.max = 1;
    }
}
