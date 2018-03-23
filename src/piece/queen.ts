import {Yellow} from "../player/yellow"
import {Red} from "../player/red"
import {Vector} from "../vector"
import {Piece} from "../piece"

export class Queen extends Piece {
    name: string = "Queen";
    home: [number, number][] =
        this.player instanceof Red ||
        this.player instanceof Yellow
            ? [[0, 6]]
            : [[0, 7]];

    moves(): Vector[] {
        return [];
    }

    attacks(): Vector[] {
        return [new Vector(r =>  r, _ =>  0),
                new Vector(r => -r, _ =>  0),
                new Vector(_ =>  0, r =>  r),
                new Vector(_ =>  0, r => -r),
                new Vector(r =>  r, r =>  r),
                new Vector(r =>  r, r => -r),
                new Vector(r => -r, r =>  r),
                new Vector(r => -r, r => -r)];
    }
}
