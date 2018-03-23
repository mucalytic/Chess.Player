import {Yellow} from "../player/yellow"
import {Red} from "../player/red"
import {Square} from "../square"
import {Vector} from "../vector"
import {Piece} from "../piece"

export class King extends Piece {
    name: string = "King";
    home: [number, number][] =
        this.player instanceof Red ||
        this.player instanceof Yellow
            ? [[7, 0]]
            : [[6, 0]];

    moves(): Vector[] {
        return [];
    }

    attacks(): Vector[] {
        return [new Vector(_ =>  1, _ =>  0),
                new Vector(_ => -1, _ =>  0),
                new Vector(_ =>  0, _ =>  1),
                new Vector(_ =>  0, _ => -1),
                new Vector(_ =>  1, _ =>  1),
                new Vector(_ =>  1, _ => -1),
                new Vector(_ => -1, _ =>  1),
                new Vector(_ => -1, _ => -1)];
    }

    constructor(dp: string, square: Square) {
        super(dp, square);
        this.max = 1;
    }
}
