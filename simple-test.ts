/// <reference path="./node_modules/rx/ts/rx.d.ts" />

interface IteratorResult<T> {
    done: boolean;
    value: T;
}

interface Iterator<T> {
    next(value?: any): IteratorResult<T>;
    return?(value?: any): IteratorResult<T>;
    throw?(e?: any): IteratorResult<T>;
}

abstract class Player {
    abstract name: string;
    abstract turn: number;

    abstract transform(x: number, y: number, x1: number, y1: number): [number, number];

    static create(dp: string): Player {
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
}

class Red extends Player {
    name: string = "Red";
    turn: number = 1;

    transform(x: number, y: number, x1: number, y1: number): [number, number] {
        return [x + x1, y + y1];
    }
}

class Blue extends Player {
    name: string = "Blue";
    turn: number = 2;

    transform(x: number, y: number, x1: number, y1: number): [number, number] {
        return [x + y1, y - x1];
    }
}

class Yellow extends Player {
    name: string = "Yellow";
    turn: number = 3;

    transform(x: number, y: number, x1: number, y1: number): [number, number] {
        return [x - x1, y - y1];
    }
}

class Green extends Player {
    name: string = "Green";
    turn: number = 4;

    transform(x: number, y: number, x1: number, y1: number): [number, number] {
        return [x - y1, y + x1];
    }
}

class Dead extends Player {
    name: string = "Dead";
    turn: number = 0;

    transform(x: number, y: number): [number, number] {
        throw new Error("Not implemented");
    }
}

class Vector {
    x1: (r?: number) => number;
    y1: (r?: number) => number;

    constructor(x1: (r?: number) => number,
                y1: (r?: number) => number) {
        this.x1 = x1;
        this.y1 = y1;
    }
}

class Radius implements Iterator<number> {
    counter: number;
    max?: number;

    next(): IteratorResult<number> {
        if (!this.max || this.counter < this.max) {
            this.counter++;
            return {
                value: this.counter,
                done: false
            };
        } else {
            this.counter = 0;
            return {
                value: undefined,
                done: true
            };
        }
    }

    reset(): void {
        this.counter = 0;
    }

    constructor(max?: number) {
        this.counter = 0;
        this.max = max;
    }
}

abstract class Piece {
    player: Player;
    dp: string;

    abstract name: string;
    abstract radius: Radius;

    abstract attack(): [Vector, boolean][];
    abstract mobility(): [Vector, boolean][];

    static create(dp: string): Piece {
        switch (dp.charAt(1)) {
            case "R":
                return new Rook(dp);
            case "P":
                return new Pawn(dp);
            case "K":
                return new King(dp);
            case "Q":
                return new Queen(dp);
            case "B":
                return new Bishop(dp);
            case "N":
                return new Knight(dp);
            default:
                return undefined;
        }
    }

    protected constructor(dp: string) {
        this.player = Player.create(dp);
        this.dp = dp;
    }
}

class Rook extends Piece {
    name: string = "Rook";
    radius = new Radius();

    attack(): [Vector, boolean][] {
        return [];
    }

    mobility(): [Vector, boolean][] {
        return [[new Vector(r =>  r, _ => 0), true],
                [new Vector(r => -r, _ => 0), true],
                [new Vector(_ => 0, r =>  r), true],
                [new Vector(_ => 0, r => -r), true]];
     }

    constructor(dp: string) {
        super(dp);
    }
}

class Pawn extends Piece {
    name: string = "Pawn";
    radius = new Radius(2);

    attack(): [Vector, boolean][] {
        return [[new Vector(_ =>  1, _ => 1), true],
                [new Vector(_ => -1, _ => 1), true]];
    }

    mobility(): [Vector, boolean][] {
        return [[new Vector(_ => 0, r => r), true]];
    }

    constructor(dp: string) {
        super(dp);
    }
}

class King extends Piece {
    name: string = "King";
    radius = new Radius(1);

    attack(): [Vector, boolean][] {
         return [];
    }

    mobility(): [Vector, boolean][] {
         return [[new Vector(_ =>  1, _ =>  0), true],
                 [new Vector(_ => -1, _ =>  0), true],
                 [new Vector(_ =>  0, _ =>  1), true],
                 [new Vector(_ =>  0, _ => -1), true],
                 [new Vector(_ =>  1, _ =>  1), true],
                 [new Vector(_ =>  1, _ => -1), true],
                 [new Vector(_ => -1, _ =>  1), true],
                 [new Vector(_ => -1, _ => -1), true]];
    }

    constructor(dp: string) {
        super(dp);
    }
}

class Queen extends Piece {
    name: string = "Queen";
    radius = new Radius();

    attack(): [Vector, boolean][] {
         return [];
    }

    mobility(): [Vector, boolean][] {
        return [[new Vector(r =>  r, _ =>  0), true],
                [new Vector(r => -r, _ =>  0), true],
                [new Vector(_ =>  0, r =>  r), true],
                [new Vector(_ =>  0, r => -r), true],
                [new Vector(r =>  r, r =>  r), true],
                [new Vector(r =>  r, r => -r), true],
                [new Vector(r => -r, r =>  r), true],
                [new Vector(r => -r, r => -r), true]];
    }

    constructor(dp: string) {
        super(dp);
    }
}

class Bishop extends Piece {
    name: string = "Bishop";
    radius = new Radius();

    attack(): [Vector, boolean][] {
         return [];
    }

    mobility(): [Vector, boolean][] {
        return [[new Vector(r =>  r, r =>  r), true],
                [new Vector(r =>  r, r => -r), true],
                [new Vector(r => -r, r =>  r), true],
                [new Vector(r => -r, r => -r), true]];
    }

    constructor(dp: string) {
        super(dp);
    }
}

class Knight extends Piece {
    name: string = "Knight";
    radius = new Radius(1);

    attack(): [Vector, boolean][] {
         return [];
    }

    mobility(): [Vector, boolean][] {
        return [[new Vector(_ =>  2, _ =>  1), true],
                [new Vector(_ =>  2, _ => -1), true],
                [new Vector(_ => -2, _ =>  1), true],
                [new Vector(_ => -2, _ => -1), true],
                [new Vector(_ =>  1, _ =>  2), true],
                [new Vector(_ =>  1, _ => -2), true],
                [new Vector(_ => -1, _ =>  2), true],
                [new Vector(_ => -1, _ => -2), true]];
    }

    constructor(dp: string) {
        super(dp);
    }
}

class Square {
    m: number;
    n: number;
    piece?: Piece;
    candidates: Piece[] = [];

    static coords(code: string): [number, number] {
        const m = parseInt(code.slice(1)) - 1;
        const n = code.charCodeAt(0) - 97;
        return [m, n];
    }

    char(n: number): string {
        return String.fromCharCode(n + 97);
    }

    code(): string {
        return `${this.char(this.n)}${this.m + 1}`;
    }

    accessible(): boolean {
        return (this.m >= 3 && this.m <= 10 && this.n >= 0 && this.n <= 2) ||
               (this.m >= 0 && this.m <= 13 && this.n >= 3 && this.n <= 10) ||
               (this.m >= 3 && this.m <= 10 && this.n >= 11 && this.n <= 13);
    }

    constructor(m: number, n: number) {
        this.m = m;
        this.n = n;
        return this;
    }
}

class Board {
    squares: Square[][] = [];

    square(code: string): Square {
        const c = Square.coords(code);
        return this.squares[c[0]][c[1]];
    }

    valid(x: number, y: number): boolean {
        return (x >= 0 && x <= 13 && y >= 0 && y <= 13);
    }

    constructor() {
        for (let m = 0; m < 14; m++) {
            this.squares[m] = [];
            for (let n = 0; n < 14; n++) {
                this.squares[m][n] = new Square(m, n);
            }
        }
    }
}

class Turn {
    index: number;
    board = new Board();

    constructor(index: number) {
        this.index = index;
    }
}

class Factory {
    turns: Turn[] = [];

    piece(nodes: NodeList): Node {
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if (node instanceof HTMLElement &&
                node.className.indexOf("piece-") === 0) {
                return node;
            }
        }
        return undefined;
    }

    create(turn: Turn, mr: MutationRecord): void {
        const row = mr.addedNodes;
        if (row.length >= 14) {
            for (let m = 0; m < 14; m++) {
                for (let n = 0; n < 14; n++) {
                    const col = row[m].childNodes[n];
                    if (col instanceof HTMLElement) {
                        const node = this.piece(col.childNodes);
                        if (node) {
                            const dp = node.attributes["data-piece"];
                            const ds = col.attributes["data-square"];
                            if (dp && ds) {
                                const piece = Piece.create(dp.value);
                                turn.board.square(ds.value).piece = piece;
                            }
                        }
                    }
                }
            }
        }
    }

    process(mrs: MutationRecord[]): Factory {
        let index = 0;
        for (let mr of mrs) {
            if (mr.type === "childList" &&
                mr.target instanceof HTMLElement &&
                mr.target.className.indexOf("board-") === 0) {
                const turn = new Turn(++index);
                console.log(`turn:${index}`);
                this.create(turn, mr);
                this.analyse(turn);
                this.show(turn);
                this.turns.push(turn);
            }
        }
        return this;
    }

    remaining(moves: [Vector, boolean][]) : number {
        let remaining = 0;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i][1]) {
                remaining++;
            }
        }
        return remaining;
    }

    candidates(square: Square): void {
        let candidates: string[] = [];
        for (let k = 0; k < square.candidates.length; k++) {
            candidates.push(`${square.candidates[k].player.name} ${square.candidates[k].name}`);
        }
        console.log(`candidates:${candidates.join(", ")}`);
    }

    attacks(turn: Turn, piece: Piece, m: number, n: number): void {
    }

    moves(turn: Turn, piece: Piece, m: number, n: number): void {
        const moves = piece.mobility();
        console.log("begin radius loop");
        for (;;) {
            let radius = piece.radius.next();
            console.log(`radius.done:${radius.done}`);
            console.log(`radius.value:${radius.value}`);
            const remaining = this.remaining(moves);
            console.log(`remaining:${remaining}`);
            if (radius.done || radius.value > 14 || remaining === 0) {
                console.log("breaking out of radius loop");
                piece.radius.reset();
                break;
            }
            console.log("begin move loop");
            for (let j = 0; j < moves.length; j++) {
                if (moves[j][1]) {
                    const x1 = moves[j][0].x1(radius.value);
                    const y1 = moves[j][0].y1(radius.value);
                    console.log(`x1:${x1}, y1:${y1}`);
                    const [x2, y2] = piece.player.transform(n, m, x1, y1);
                    console.log(`x2:${x2}, y2:${y2}`);
                    if (turn.board.valid(x2, y2)) {
                        const target = turn.board.squares[y2][x2];
                        if (target.accessible()) {
                            console.log(`target:m[${target.m}], n[${target.n}], code:${target.code()}`);
                            target.candidates.push(piece);
                            this.candidates(target);
                            if (target.piece) {
                                moves[j][1] = false;
                                console.log("target square has a piece");
                            }
                        } else {
                            moves[j][1] = false;
                            console.log("target square is not accessible");
                        }
                    } else {
                        moves[j][1] = false;
                        console.log("target square is out of bounds");
                    }
                }
            }
            console.log("end move loop");
        }
        console.log("end radius loop");
    }

    analyse(turn: Turn): void {
        for (let m = 0; m < 14; m++) {
            for (let n = 0; n < 14; n++) {
                const square = turn.board.squares[m][n];
                console.log(`square:m[${square.m}], n[${square.n}]`);
                const accessible = square.accessible();
                console.log(`accessible:${accessible}`);
                if (accessible) {
                    const piece = square.piece;
                    if (piece) {
                        console.log(`piece:${piece.player.name} ${piece.name}`);
                        if (!(piece.player instanceof Dead)) {
                            this.attacks(turn, piece, m, n);
                            this.moves(turn, piece, m, n);
                        }
                    }
                }
            }
        }
    }

    show(turn: Turn): void {
        for (let m = 0; m < 14; m++) {
            const row: string[] = ["|"];
            for (let n = 0; n < 14; n++) {
                const square = turn.board.squares[m][n];
                row.push(square.piece ? square.piece.dp : "[]");
            }
            row.push("|");
            const s = turn.board.squares;
            console.log(row.join(" ") +
                "%O %O %O %O %O %O %O %O %O %O %O %O %O %O |",
                s[m][0], s[m][1], s[m][2], s[m][3], s[m][4],
                s[m][5], s[m][6], s[m][7], s[m][8], s[m][9],
                s[m][10], s[m][11], s[m][12], s[m][13]);
        }
        console.groupEnd();
    }
}

//new Factory().process(modifier.domWatcher.records);
