import {Vector} from "../vector"
import {Radius} from "../radius"
import {Piece} from "../piece"

export class Knight extends Piece {
    name: string = "Knight";
    radius = new Radius(1);
    home: [number, number][] =
        [[0, 4], [0, 9]];

    moves(): [Vector, boolean][] {
        return [];
    }

    attacks(): [Vector, boolean][] {
        return [[new Vector(_ =>  2, _ =>  1), true],
                [new Vector(_ =>  2, _ => -1), true],
                [new Vector(_ => -2, _ =>  1), true],
                [new Vector(_ => -2, _ => -1), true],
                [new Vector(_ =>  1, _ =>  2), true],
                [new Vector(_ =>  1, _ => -2), true],
                [new Vector(_ => -1, _ =>  2), true],
                [new Vector(_ => -1, _ => -2), true]];
    }
}
