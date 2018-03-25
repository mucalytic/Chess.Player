import {PieceCandidates} from "./candidates"
import {Yellow} from "./player/yellow"
import {Green} from "./player/green"
import {Blue} from "./player/blue"
import {Dead} from "./player/dead"
import {Red} from "./player/red"
import {Player} from "./player"
import {Square} from "./square"
import {Vector} from "./vector"

export abstract class Piece {
    candidates: PieceCandidates;
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
        return this.home.every(h => pivot[0] !== h[0] || pivot[1] !== h[1]);
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
                square.candidates.moves.push(this);
                this.candidates.moves.push(square);
                this.scale(vector, radius + 1, move);
            }
        };

        const attack = (vector: Vector, radius: number, square: Square) => {
            this.candidates.attacks.push(square);
            square.candidates.attacks.push(this);
            if (!square.piece) {
                this.scale(vector, radius + 1, attack);
            }
        };

        this.moves().forEach(v => this.scale(v, 1, move));
        this.attacks().forEach(v => this.scale(v, 1, attack));
    }

    colouriseCandidates(): void {
        const colouriseMovementSquares = (square: Square) => {
            const attackers =
                square.candidates.attacks
                    .filter(p => p.square.code !== this.square.code);
            square.element.classList.add("cp-mod");
            square.element.style.backgroundColor =
                square.board.colourHelper
                    .getColour(square.element,
                        attackers.filter(p => p.player.playing()).length >=
                        attackers.filter(p => !p.player.playing()).length);
        }    

        if (this.candidates.moves.length > 0) {
            this.candidates.moves
                .filter(s => !s.hasPiece() ||
                             !s.piece.player.playing())    
                .forEach(colouriseMovementSquares);
        } else {
            this.candidates.attacks
                .filter(s => !s.hasPiece() ||
                             !s.piece.player.playing())
                .forEach(colouriseMovementSquares);
        }
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
