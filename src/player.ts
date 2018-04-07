import {Vector} from "./vector"
import {Piece} from "./piece"

export abstract class Player {
    piece: Piece;

    abstract name: string;
    abstract turn: number;

    abstract pivot(): [number, number];
    abstract rotate(vector: Vector, radius: number): [number, number];

    isPlaying(): boolean {
        const element = document.getElementById("four-player-username");
        if (element) {
            if (this.piece.square.board.testing &&
                this.name.toLowerCase() === "red") {
                return true;
            }
            return [].slice
                .call(document.getElementsByClassName("player-avatar"))
                .filter(e => e instanceof HTMLAnchorElement)
                .filter(e => e.href.indexOf(element.innerText) !== -1)
                .map(e => e.parentElement)
                .some(e => [].slice
                    .call(e.classList)
                    .some(c => c === this.name.toLowerCase()));
        }
        return false;
    }

    constructor(piece: Piece) {
        this.piece = piece;
    }
}
