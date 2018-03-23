import {Vector} from "../vector"
import {Piece} from "../piece"

export class Rook extends Piece {
    name: string = "Rook";
    home: [number, number][] =
        [[0, 3], [0, 10]];

    moves(): Vector[] {
        return [];
    }

    attacks(): Vector[] {
        return [new Vector(r =>  r, _ =>  0),
                new Vector(r => -r, _ =>  0),
                new Vector(_ =>  0, r =>  r),
                new Vector(_ =>  0, r => -r)];
    }
}
