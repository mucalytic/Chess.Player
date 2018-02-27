import {Knight} from "./piece/knight"
import {Bishop} from "./piece/bishop"
import {Queen} from "./piece/queen"
import {King} from "./piece/king"
import {Rook} from "./piece/rook"
import {Pawn} from "./piece/pawn"
import {Player} from "./player"
import {Square} from "./square"
import {Radius} from "./radius"
import {Vector} from "./vector"

export abstract class Piece {
    coords: [number, number];
    player: Player;
    dp: string;

    abstract name: string;
    abstract radius: Radius;
    abstract home: [number, number][];
    abstract moves(): [Vector, boolean][];
    abstract attacks(): [Vector, boolean][];

    moved(): boolean {
        let moved = true;
        for (let i = 0; i < this.home.length; i++) {
            const m1 = this.home[i][0] - 6.5;
            const n1 = this.home[i][1] - 6.5;
            const [x2, y2] = this.player.rotate(6.5, 6.5, n1, m1);
            if (this.coords[1] === x2 &&
                this.coords[0] === y2) {
                moved = false;
                break;
            }
        }
        return moved;
    }

    static create(dp: string, code: string): Piece {
        switch (dp.charAt(1)) {
            case "R":
                return new Rook(dp, code);
            case "P":
                return new Pawn(dp, code);
            case "K":
                return new King(dp, code);
            case "Q":
                return new Queen(dp, code);
            case "B":
                return new Bishop(dp, code);
            case "N":
                return new Knight(dp, code);
            default:
                return undefined;
        }
    }

    protected constructor(dp: string, code: string) {
        this.coords = Square.coords(code);
        this.player = Player.create(dp);
        this.dp = dp;
    }
}
