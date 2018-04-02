import {Square} from "../square"
import {Vector} from "../vector"
import {Piece} from "../piece"

export class Knight extends Piece {
    value = 3;
    name = "Knight";
    home: [number, number][] =
        [[4, 0], [9, 0]];

    moves(): Vector[] {
        return [];
    }

    attacks(): Vector[] {
        return [new Vector(_ =>  2, _ =>  1),
                new Vector(_ =>  2, _ => -1),
                new Vector(_ => -2, _ =>  1),
                new Vector(_ => -2, _ => -1),
                new Vector(_ =>  1, _ =>  2),
                new Vector(_ =>  1, _ => -2),
                new Vector(_ => -1, _ =>  2),
                new Vector(_ => -1, _ => -2)];
    }

    constructor(dp: string, square: Square) {
        super(dp, square);
        this.max = 1;
    }
}
