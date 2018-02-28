import {Vector} from "../vector"
import {Piece} from "../piece"

export class Pawn extends Piece {
    name: string = "Pawn";
    home: [number, number][] =
        [[1, 3], [1, 4], [1, 5], [1, 6], [1, 7], [1, 8], [1, 9], [1, 10]];

    moves(): [Vector, boolean][] {
        return this.moved()
            ? [[new Vector(_ => 0, _ => 1), true]]
            : [[new Vector(_ => 0, _ => 1), true],
               [new Vector(_ => 0, _ => 2), true]];
    }

    attacks(): [Vector, boolean][] {
        return [[new Vector(r =>  r, r => r), true],
                [new Vector(r => -r, r => r), true]];
    }

    constructor(dp: string, code: string) {
        super(dp, code);
        this.max = 1;
    }
}
