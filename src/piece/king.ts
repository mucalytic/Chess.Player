import {Yellow} from "../player/yellow"
import {Red} from "../player/red"
import {Vector} from "../vector"
import {Piece} from "../piece"

export class King extends Piece {
    name: string = "King";
    home: [number, number][] =
        this.player instanceof Red ||
        this.player instanceof Yellow
            ? [[0, 7]]
            : [[0, 6]];

    moves(): [Vector, boolean][] {
        return [];
    }

    attacks(): [Vector, boolean][] {
        return [[new Vector(_ =>  1, _ =>  0), true],
                [new Vector(_ => -1, _ =>  0), true],
                [new Vector(_ =>  0, _ =>  1), true],
                [new Vector(_ =>  0, _ => -1), true],
                [new Vector(_ =>  1, _ =>  1), true],
                [new Vector(_ =>  1, _ => -1), true],
                [new Vector(_ => -1, _ =>  1), true],
                [new Vector(_ => -1, _ => -1), true]];
    }

    constructor(dp: string, code: string) {
        super(dp, code);
        this.max = 1;
    }
}
