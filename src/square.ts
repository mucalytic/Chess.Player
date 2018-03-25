import {SquareCandidates} from "./candidates";
import {Knight} from "./piece/knight"
import {Bishop} from "./piece/bishop"
import {Queen} from "./piece/queen"
import {King} from "./piece/king"
import {Rook} from "./piece/rook"
import {Pawn} from "./piece/pawn"
import {Piece} from "./piece"
import {Board} from "./board"

export class Square {
    x: number;
    y: number;
    code: string;
    piece: Piece;
    board: Board;
    valid: boolean;
    element: HTMLDivElement;
    candidates: SquareCandidates;

    hasPiece(): boolean {
        return this.piece !== null && this.piece !== undefined;
    }

    createPiece(): Piece {
        return [].slice
            .call(this.element.children)
            .filter(e => e instanceof HTMLElement &&
                         e.className.indexOf("piece-") === 0)
            .map(e => e.attributes["data-piece"])
            .filter(a => a !== null && a !== undefined)
            .map(a => a.value)
            .map(c => {
                switch (c.charAt(1)) {
                    case "R":
                        return new Rook(c, this);
                    case "P":
                        return new Pawn(c, this);
                    case "K":
                        return new King(c, this);
                    case "Q":
                    case "D":
                        return new Queen(c, this);
                    case "B":
                        return new Bishop(c, this);
                    case "N":
                        return new Knight(c, this);
                }
            })[0];
    }

    isEnclosed(): boolean {
        return this.board.squares
            .filter(s => Math.abs(this.x - s.x) === 1 &&
                         Math.abs(this.y - s.y) === 1)
            .every(s => s.hasPiece());
    }

    isCovered(): boolean {
        return this.board.squares
            .filter(s => s.hasPiece())
            .map(s => s.piece)
            .filter(p => p.player.name === this.piece.player.name)
            .some(p => p.candidates.attacks.some(s => s === this));
    }

    colouriseAttackerSquares(): void {
        this.candidates.attacks
            // .filter(p => !p.player.playing())
            .map(p => p.square)
            .forEach(s => {
                s.element.classList.add("cp-mod");
                s.element.style.backgroundColor =
                    this.board.colourHelper.getColour(s.element, false);
            });
    }

    constructor(board: Board, element: Element) {
        this.board = board;
        this.candidates = ({
            attacks: [],
            moves: []
        });
        if (element instanceof HTMLDivElement) {
            this.element = element;
            const ds = element.attributes["data-square"];
            if (ds) {
                this.code = ds.value;
                this.y = parseInt(this.code.slice(1)) - 1;
                this.x = this.code.charCodeAt(0) - 97;
                this.piece = this.createPiece();
                this.valid = [].slice
                    .call(element.classList)
                    .every(c => c.indexOf("blank-") === -1);
            }
        }
    }
}
