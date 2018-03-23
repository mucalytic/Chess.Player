import {Vector} from "../vector"
import {Piece} from "../piece"

export class Bishop extends Piece {
    name: string = "Bishop";
    home: [number, number][] =
        [[5, 0], [8, 0]];

    moves(): Vector[] {
        return [];
    }

    attacks(): Vector[] {
        return [new Vector(r =>  r, r =>  r),
                new Vector(r =>  r, r => -r),
                new Vector(r => -r, r =>  r),
                new Vector(r => -r, r => -r)];
    }
}
