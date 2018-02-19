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

    abstract transform(x: number,  y: number,
                      x1: number, y1: number): [number, number];

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

    transform(x: number,  y: number,
             x1: number, y1: number): [number, number] {
        return [x + x1, y + y1];
    }
}

class Blue extends Player {
    name: string = "Blue";
    turn: number = 2;

    transform(x: number,  y: number,
             x1: number, y1: number): [number, number] {
        return [x + y1, y - x1];
    }
}

class Yellow extends Player {
    name: string = "Yellow";
    turn: number = 3;

    transform(x: number,  y: number,
             x1: number, y1: number): [number, number] {
        return [x - x1, y - y1];
    }
}

class Green extends Player {
    name: string = "Green";
    turn: number = 4;

    transform(x: number,  y: number,
             x1: number, y1: number): [number, number] {
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
    coords: [number, number];
    player: Player;
    dp: string;

    abstract name: string;
    abstract radius: Radius;
    abstract home: [number, number][];

    abstract attack(): [Vector, boolean][];
    abstract mobility(): [Vector, boolean][];

    moved(): boolean {
        let moved = true;
        const [x2, y2] = this.player.transform(this.coords[1], this.coords[0], 0, 0);
        for (let i = 0; i < this.home.length; i++) {
            if (this.home[i][0] === x2 &&
                this.home[i][1] === y2) {
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

class Rook extends Piece {
    name: string = "Rook";
    radius = new Radius();
    home: [number, number][] =
        [[0, 3], [0, 10]];

    attack(): [Vector, boolean][] {
        return [];
    }

    mobility(): [Vector, boolean][] {
        return [[new Vector(r =>  r, _ =>  0), true],
                [new Vector(r => -r, _ =>  0), true],
                [new Vector(_ =>  0, r =>  r), true],
                [new Vector(_ =>  0, r => -r), true]];
    }
}

class Pawn extends Piece {
    name: string = "Pawn";
    radius = new Radius(1);
    home: [number, number][] =
        [[1, 3], [1, 4], [1, 5], [1, 6], [1, 7], [1, 8], [1, 9], [1, 10]];

    attack(): [Vector, boolean][] {
        return [[new Vector(_ =>  1, _ => 1), true],
                [new Vector(_ => -1, _ => 1), true]];
    }

    mobility(): [Vector, boolean][] {
        return this.moved()
            ? [[new Vector(_ => 0, _ => 1), true],
               [new Vector(_ => 0, _ => 2), true]]
            : [[new Vector(_ => 0, _ => 1), true]];
    }
}

class King extends Piece {
    name: string = "King";
    radius = new Radius(1);
    home: [number, number][] =
        this.player instanceof Red ||
        this.player instanceof Yellow
            ? [[0, 7]]
            : [[0, 6]];

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
}

class Queen extends Piece {
    name: string = "Queen";
    radius = new Radius();
    home: [number, number][] =
        this.player instanceof Red ||
        this.player instanceof Yellow
            ? [[0, 6]]
            : [[0, 7]];

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
}

class Bishop extends Piece {
    name: string = "Bishop";
    radius = new Radius();
    home: [number, number][] =
        [[0, 5], [0, 8]];

    attack(): [Vector, boolean][] {
        return [];
    }

    mobility(): [Vector, boolean][] {
        return [[new Vector(r =>  r, r =>  r), true],
                [new Vector(r =>  r, r => -r), true],
                [new Vector(r => -r, r =>  r), true],
                [new Vector(r => -r, r => -r), true]];
    }
}

class Knight extends Piece {
    name: string = "Knight";
    radius = new Radius(1);
    home: [number, number][] =
        [[0, 4], [0, 9]];

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
                                const piece = Piece.create(dp.value, ds.value);
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

    remaining(moves: [Vector, boolean][]): number {
        let remaining = 0;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i][1]) {
                remaining++;
            }
        }
        return remaining;
    }

    radius(turn: Turn, piece: Piece, vectors: [Vector, boolean][],
           noAttacks: boolean, m: number, n: number): void {
        for (; ;) {
            let radius = piece.radius.next();
            const remaining = this.remaining(vectors);
            if (radius.done || radius.value > 14 || remaining === 0) {
                piece.radius.reset();
                break;
            }
            for (let j = 0; j < vectors.length; j++) {
                this.vector(turn, piece, vectors[j], noAttacks, m, n, radius.value);
            }
        }
    }

    vector(turn: Turn, piece: Piece, vector: [Vector, boolean],
           noAttacks: boolean, m: number, n: number, radius: number): void {
        if (vector[1]) {
            const x1 = vector[0].x1(radius);
            const y1 = vector[0].y1(radius);
            const [x2, y2] = piece.player.transform(n, m, x1, y1);
            if (turn.board.valid(x2, y2) &&
                turn.board.squares[y2][x2].accessible()) {
                if (turn.board.squares[y2][x2].piece) {
                    if (noAttacks) {
                        turn.board.squares[y2][x2].candidates.push(piece);
                    }
                    vector[1] = false;
                } else {
                    turn.board.squares[y2][x2].candidates.push(piece);
                }
            } else {
                vector[1] = false;
            }
        }
    }

    analyse(turn: Turn): void {
        for (let m = 0; m < 14; m++) {
            for (let n = 0; n < 14; n++) {
                const square = turn.board.squares[m][n];
                const accessible = square.accessible();
                if (accessible) {
                    const piece = square.piece;
                    if (piece) {
                        if (!(piece.player instanceof Dead)) {
                            this.radius(turn, piece, piece.mobility(), true, m, n);
                            this.radius(turn, piece, piece.attack(), false, m, n);
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
                if (square.accessible()) {
                    row.push(square.piece ? square.piece.dp : "[]");
                } else {
                    row.push("  ");
                }
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
