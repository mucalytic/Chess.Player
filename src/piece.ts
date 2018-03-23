import {Candidates} from "./candidates"
import {Yellow} from "./player/yellow"
import {Green} from "./player/green"
import {Blue} from "./player/blue"
import {Dead} from "./player/dead"
import {Red} from "./player/red"
import {Player} from "./player"
import {Square} from "./square"
import {Vector} from "./vector"

export abstract class Piece {
    candidates: Candidates;
    square: Square;
    player: Player;
    code: string;
    max: number;

    abstract name: string;
    abstract home: [number, number][];
    abstract attacks(): Vector[];
    abstract moves(): Vector[];

    moved(): boolean {
        const pivot = this.player.pivot();
        return this.home.every(h => pivot[0] !== h[0] && pivot[1] !== h[1]);
    }

    createPlayer(code: string): Player {
        switch (code.charAt(0)) {
            case "w":
                return new Red(this);
            case "g":
                return new Blue(this);
            case "b":
                return new Yellow(this);
            case "r":
                return new Green(this);
            case "d":
                return new Dead(this);
            default:
                return undefined;
        }
    }

    scale(vector: Vector, radius: number, traverse: (vector: Vector, radius: number, square: Square) => void): void {
        if (!this.max || radius <= this.max) {
            const [x2, y2] = this.player.rotate(vector, radius);
            this.square.board.squares
                .filter(s => s.x === x2 && s.y === y2)
                .forEach(s => traverse(vector, radius, s));
        }
    }

    createCandidates(): void {
        const move = (vector: Vector, radius: number, square: Square) => {
            if (!square.piece) {
                this.candidates.moves.push(square);
                this.scale(vector, radius + 1, move);
            }
        };

        const attack = (vector: Vector, radius: number, square: Square) => {
            this.candidates.attacks.push(square);
            if (!square.piece) {
                this.scale(vector, radius + 1, attack);
            }
        };

        this.moves().forEach(v => this.scale(v, 1, move));
        this.attacks().forEach(v => this.scale(v, 1, attack));
    }

    colouriseCandidates(): void {
        if (this.candidates.moves.length > 0) {
            this.candidates.moves.forEach(s => {
                this.colouriseMovementSquares(s);
            });
        } else {
            this.candidates.attacks.forEach(s => {
                this.colouriseMovementSquares(s);
            });
        }
    }

    colouriseMovementSquares(square: Square): void {
        const candidates =
            this.square.board.squares
                .filter(s => s.hasPiece())
                .map(s => s.piece)
                .filter(p => p !== this)
                .filter(p => p.candidates.attacks.some(s => s === this.square));

        const allies = candidates.filter(p => p.player.playing());

        square.element.classList.add("cp-mod");
        square.element.style.backgroundColor =
            this.square.board.colourHelper.getColour(square.element,
                (allies.length >= (candidates.length - allies.length)));
    }

    colouriseAttackerSquares(): void {
        this.square.board.squares
            .filter(s => s.hasPiece())
            .map(s => s.piece)
            .filter(p => !p.player.playing())
            .filter(p => p.candidates.attacks.some(s => s === this.square))
            .map(p => p.square)
            .forEach(s => {
                s.element.classList.add("cp-mod");
                s.element.style.backgroundColor =
                    this.square.board.colourHelper.getColour(s.element, false);
            });
    }

    constructor(code: string, square: Square) {
        this.player = this.createPlayer(code);
        this.candidates = ({
            attacks: [],
            moves: []
        });
        this.square = square;
        this.code = code;
    }
}
