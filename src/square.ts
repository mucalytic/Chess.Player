import {Knight} from "./piece/knight"
import {Bishop} from "./piece/bishop"
import {Queen} from "./piece/queen"
import {King} from "./piece/king"
import {Rook} from "./piece/rook"
import {Pawn} from "./piece/pawn"
import {Piece} from "./piece"
import {Board} from "./board"

export class Square {
    m: number;
    n: number;
    code: string;
    piece: Piece;
    board: Board;
    valid: boolean;
    element: HTMLDivElement;

    hasPiece(): boolean {
        return this.piece !== null && this.piece !== undefined;
    }

    createPiece(): void {
        const codes: string[] = [].slice
            .call(this.element.children)
            .filter(e => e instanceof HTMLElement &&
                         e.className.indexOf("piece-") === 0)
            .map(e => e.attributes["data-piece"]);
        if (codes.length === 1) {
            switch (codes[0].charAt(1)) {
                case "R":
                    this.piece = new Rook(codes[0], this);
                case "P":
                    this.piece = new Pawn(codes[0], this);
                case "K":
                    this.piece = new King(codes[0], this);
                case "Q":
                case "D":
                    this.piece = new Queen(codes[0], this);
                case "B":
                    this.piece = new Bishop(codes[0], this);
                case "N":
                    this.piece = new Knight(codes[0], this);
            }
        }
    }


    isEnclosed(): boolean {
        return this.board.squares
            .filter(s => Math.abs(this.m - s.m) === 1 &&
                         Math.abs(this.n - s.n) === 1)
            .every(s => s.hasPiece());
    }

    isCovered(): boolean {
        return this.board.squares
            .filter(s => s.hasPiece())
            .map(s => s.piece)
            .filter(p => p.player.playing())
            .some(p => p.candidates.attacks.some(s => s === this));
    }

    constructor(board: Board, element: Element) {
        this.board = board;
        if (element instanceof HTMLDivElement) {
            this.element = element;
            this.code = element.attributes["data-square"];
            if (this.code) {
                this.m = parseInt(this.code.slice(1)) - 1;
                this.n = this.code.charCodeAt(0) - 97;
                this.createPiece();
                this.valid = [].slice
                    .call(element.classList)
                    .every(c => c.indexOf("blank-") === -1);
            }
        }
    }
}
