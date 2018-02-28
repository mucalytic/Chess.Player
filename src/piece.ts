import {Yellow} from "./player/yellow"
import {Green} from "./player/green"
import {Blue} from "./player/blue"
import {Dead} from "./player/dead"
import {Red} from "./player/red"
import {Player} from "./player"
import {Square} from "./square"
import {Vector} from "./vector"

export abstract class Piece {
    coords: [number, number];
    counter: number;
    player: Player;
    max: number;
    dp: string;

    abstract name: string;
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

    radius(): { value: number, done: boolean } {
        while(!this.max || this.counter < this.max) {
            this.counter++;
            return {
                value: this.counter,
                done: false
            };
        }
        this.counter = 0;
        return {
            value: undefined,
            done: true
        };
    }

    createPlayer(dp: string): Player {
        switch (dp.charAt(0)) {
            case "w":
                return new Red();
            case "g":
                return new Blue();
            case "b":
                return new Yellow();
            case "r":
                return new Green();
            case "d":
                return new Dead();
            default:
                return undefined;
        }
    }

    constructor(dp: string, code: string) {
        this.player = this.createPlayer(dp);
        this.coords = Square.coords(code);
        this.counter = 0;
        this.dp = dp;
    }
}
