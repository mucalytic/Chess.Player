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

    abstract transform(x: number, y: number): [number, number];

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

    transform(x: number, y: number): [number, number] {
        return [x, y];
    }
}

class Blue extends Player {
    name: string = "Blue";
    turn: number = 2;

    transform(x: number, y: number): [number, number] {
        return [-y, x];
    }
}

class Yellow extends Player {
    name: string = "Yellow";
    turn: number = 3;

    transform(x: number, y: number): [number, number] {
        return [-x, -y];
    }
}

class Green extends Player {
    name: string = "Green";
    turn: number = 4;

    transform(x: number, y: number): [number, number] {
        return [y, -x];
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
    dx: (x: number, r?: number) => number;
    dy: (y: number, r?: number) => number;

    constructor(dx: (x: number, r?: number) => number,
                dy: (y: number, r?: number) => number) {
        this.dx = dx;
        this.dy = dy;
    }
}

class Radius implements Iterator<number> {
    counter: number;
    max?: number;

    next(): IteratorResult<number> {
        if (!this.max || this.max >= this.counter) {
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
    abstract attack: Vector[];
    abstract mobility: Vector[];

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
    attack: Vector[] = [];
    mobility: Vector[] =
        [new Vector((x, r) => x + r, (y) => y),
         new Vector((x, r) => x - r, (y) => y),
         new Vector((x) => x, (y, r) => y + r),
         new Vector((x) => x, (y, r) => y - r)];

    constructor(dp: string) {
        super(dp);
    }
}

class Pawn extends Piece {
    name: string = "Pawn";
    radius = new Radius(2);
    attack: Vector[] =
        [new Vector((x) => x + 1, (y) => y + 1),
         new Vector((x) => x - 1, (y) => y + 1)];
    mobility: Vector[] =
        [new Vector((x) => x, (y, r) => y + r)];

    constructor(dp: string) {
        super(dp);
    }
}

class King extends Piece {
    name: string = "King";
    radius = new Radius(1);
    attack: Vector[] = [];
    mobility: Vector[] =
        [new Vector((x) => x + 1, (y) => y),
         new Vector((x) => x - 1, (y) => y),
         new Vector((x) => x, (y) => y + 1),
         new Vector((x) => x, (y) => y - 1),
         new Vector((x) => x + 1, (y) => y + 1),
         new Vector((x) => x + 1, (y) => y - 1),
         new Vector((x) => x - 1, (y) => y + 1),
         new Vector((x) => x - 1, (y) => y - 1)];

    constructor(dp: string) {
        super(dp);
    }
}

class Queen extends Piece {
    name: string = "Queen";
    radius = new Radius();
    attack: Vector[] = [];
    mobility: Vector[] =
        [new Vector((x, r) => x + r, (y) => y),
         new Vector((x, r) => x - r, (y) => y),
         new Vector((x) => x, (y, r) => y + r),
         new Vector((x) => x, (y, r) => y - r),
         new Vector((x, r) => x + r, (y, r) => y + r),
         new Vector((x, r) => x + r, (y, r) => y - r),
         new Vector((x, r) => x - r, (y, r) => y + r),
         new Vector((x, r) => x - r, (y, r) => y - r)];

    constructor(dp: string) {
        super(dp);
    }
}

class Bishop extends Piece {
    name: string = "Bishop";
    radius = new Radius();
    attack: Vector[] = [];
    mobility: Vector[] =
        [new Vector((x, r) => x + r, (y, r) => y + r),
         new Vector((x, r) => x + r, (y, r) => y - r),
         new Vector((x, r) => x - r, (y, r) => y + r),
         new Vector((x, r) => x - r, (y, r) => y - r)];

    constructor(dp: string) {
        super(dp);
    }
}

class Knight extends Piece {
    name: string = "Knight";
    radius = new Radius(1);
    attack: Vector[] = [];
    mobility: Vector[] =
        [new Vector((x) => x + 2, (y) => y + 1),
         new Vector((x) => x + 2, (y) => y - 1),
         new Vector((x) => x - 2, (y) => y + 1),
         new Vector((x) => x - 2, (y) => y - 1),
         new Vector((x) => x + 1, (y) => y + 2),
         new Vector((x) => x + 1, (y) => y - 2),
         new Vector((x) => x - 1, (y) => y + 2),
         new Vector((x) => x - 1, (y) => y - 2)];

    constructor(dp: string) {
        super(dp);
    }
}

class Square {
    m: number;
    n: number;
    piece?: Piece;

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

class DiffSquare extends Square {
    change?: string;
}

class AnalysisSquare extends Square {
    candidates: Piece[] = [];
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

class Diff {
    deaths: Square[] = [];
    captures: Square[] = [];
    removals: Square[] = [];
    additions: Square[] = [];
    squares: DiffSquare[][] = [];

    square(code: string): DiffSquare {
        const c = DiffSquare.coords(code);
        return this.squares[c[0]][c[1]];
    }

    constructor() {
        for (let m = 0; m < 14; m++) {
            this.squares[m] = [];
            for (let n = 0; n < 14; n++) {
                this.squares[m][n] = new DiffSquare(m, n);
            }
        }
    }
}

class Analysis {
    squares: AnalysisSquare[][] = [];

    square(code: string): AnalysisSquare {
        const c = AnalysisSquare.coords(code);
        return this.squares[c[0]][c[1]];
    }

    constructor() {
        for (let m = 0; m < 14; m++) {
            this.squares[m] = [];
            for (let n = 0; n < 14; n++) {
                this.squares[m][n] = new AnalysisSquare(m, n);
            }
        }
    }}

class Turn {
    index: number;
    diff = new Diff();
    added = new Board();
    removed = new Board();
    analysis = new Analysis();

    constructor(index: number) {
        this.index = index;
    }
}

class Factory {
    log: string[];
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

    createBoards(turn: Turn, mr: MutationRecord): void {
        const rro = mr.removedNodes;
        const aro = mr.addedNodes;
        if (aro.length >= 14 &&
            rro.length >= 14) {
            for (let m = 0; m < 14; m++) {
                for (let n = 0; n < 14; n++) {
                    const aco = aro[m].childNodes[n];
                    const rco = rro[m].childNodes[n];
                    if (aco instanceof HTMLElement &&
                        rco instanceof HTMLElement) {
                        const apn = this.piece(aco.childNodes);
                        const rpn = this.piece(rco.childNodes);
                        if (apn) {
                            const dp = apn.attributes["data-piece"];
                            const ds = aco.attributes["data-square"];
                            if (dp && ds) {
                                const pc = Piece.create(dp.value);
                                turn.added.square(ds.value).piece = pc;
                            }
                        }
                        if (rpn) {
                            const dp = rpn.attributes["data-piece"];
                            const ds = rco.attributes["data-square"];
                            if (dp && ds) {
                                const pc = Piece.create(dp.value);
                                turn.removed.square(ds.value).piece = pc;
                            }
                        }
                    }
                }
            }
        }
    }

    createDiffBoard(turn: Turn): void {
        for (let m = 0; m < 14; m++) {
            for (let n = 0; n < 14; n++) {
                const rsq = turn.removed.squares[m][n];
                const asq = turn.added.squares[m][n];
                const dsq = turn.diff.squares[m][n];
                if (!rsq.piece && asq.piece) {
                    turn.diff.additions.push(asq);
                    dsq.piece = asq.piece;
                    dsq.change = "+";
                }
                if (rsq.piece && !asq.piece) {
                    turn.diff.removals.push(rsq);
                    dsq.piece = rsq.piece;
                    dsq.change = "-";
                }
                if (rsq.piece && asq.piece) {
                    if (rsq.piece.dp !== asq.piece.dp) {
                        dsq.piece = asq.piece;
                        if (asq.piece.player instanceof Dead) {
                            turn.diff.deaths.push(asq);
                            dsq.change = "x";
                        } else {
                            turn.diff.captures.push(asq);
                            dsq.change = "*";
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
                this.createBoards(turn, mr);
                this.createDiffBoard(turn);
                this.turns.push(turn);
            }
        }
        return this;
    }

    analyse(): Factory {
        this.log = [];
        for (let i = 1; i < this.turns.length; i++) {
            this.log.push(`turn:${i}`);
            const analysis = new Analysis();
            const turn = this.turns[i];
            const board = turn.added;
            this.log.push("analysing")
            for (let m = 0; m < 14; m++) {
                for (let n = 0; n < 14; n++) {
                    const square = board.squares[m][n];
                    this.log.push(`square:m[${square.m}], n[${square.n}]`);
                    const accessible = square.accessible();
                    this.log.push(`accessible:${accessible}`);
                    if (accessible) {
                        const piece = square.piece;
                        if (piece) {
                            const player = piece.player;
                            this.log.push(`piece:${player.name} ${piece.name}`);
                            if (!(player instanceof Dead)) {
                                const [x, y] = player.transform(n, m);
                                this.log.push(`x:${x}, y:${y}`);
                                for (let move of piece.mobility) {
                                    this.log.push("begin move loop");
                                    let restricted = false;
                                    for (;;) {
                                        this.log.push("begin radius loop");
                                        let result = piece.radius.next();
                                        this.log.push(`restricted:${restricted}`);
                                        this.log.push(`result.done:${result.done}`);
                                        if (result.done || restricted) {
                                            this.log.push("breaking out of radius loop");
                                            break;
                                        }
                                        const radius = result.value;
                                        const dy = move.dy(y, radius);
                                        const dx = move.dx(x, radius);
                                        this.log.push(`radius:${radius}, dx:${dx}, dy:${dy}`);
                                        if (board.valid(dx, dy)) {
                                            const target = board.squares[dy][dx];
                                            this.log.push(`target:m[${target.m}], n[${target.n}]`);
                                            if (target.accessible()) {
                                                const code = target.code();
                                                const goal = analysis.square(code);
                                                this.log.push(`code:${code}, goal:m[${goal.m}], n[${goal.n}]`);
                                                goal.candidates.push(piece);
                                                let list: string[] = [];
                                                for (let candidate in goal.candidates) {
                                                    list.push(`${player.name} ${piece.name}`);
                                                }
                                                this.log.push(`candidates:${list.join(", ")}`);
                                                if (target.piece) {
                                                    restricted = true;
                                                    this.log.push("goal has a piece. restricted set to true");
                                                }
                                            } else {
                                                restricted = true;
                                                this.log.push("target not accessible. restricted set to true");
                                            }
                                        } else {
                                            restricted = true;
                                            this.log.push("square not valid. restricted set to true");
                                        }
                                        this.log.push("end radius loop");
                                    }
                                    this.log.push("end move loop");
                                }
                            }
                        }
                    }
                }
            }
            turn.analysis = analysis;
        }
        return this;
    }

    header(turn: Turn): string {
        return "Index: " +
               turn.index +
               "; Additions: " +
               turn.diff.additions.length +
               "; Removals: " +
                turn.diff.removals.length +
               "; Captures: " +
                turn.diff.captures.length +
               "; Deaths: " +
                turn.diff.deaths.length;
    }

    show(turns: number): Factory {
        for (let i = 1; i < Math.min(this.turns.length, turns); i++) {
            const turn = this.turns[i];
            console.group(this.header(turn));
            console.log("                                      " +
                        "                                      " +
                        "                              0   1   " +
                        "2   3   4   5   6   7   8   9  10  11  12  13");
            for (let m = 0; m < 14; m++) {
                const row: string[] = ["|"];
                for (let n = 0; n < 14; n++) {
                    const square = turn.added.squares[m][n];
                    row.push(square.piece ? square.piece.dp : "[]");
                }
                row.push("|");
                for (let n = 0; n < 14; n++) {
                    const square = turn.diff.squares[m][n];
                    row.push(square.piece ? square.piece.dp + square.change : "[ ]");
                }
                row.push("|");
                const s = turn.analysis.squares;
                console.log(row.join(" ") +
                    "%i %O %O %O %O %O %O %O %O %O %O %O %O %O %O |",
                    m, s[m][0], s[m][1], s[m][2], s[m][3], s[m][4],
                       s[m][5], s[m][6], s[m][7], s[m][8], s[m][9],
                       s[m][10], s[m][11], s[m][12], s[m][13]);
            }
            console.groupEnd();
        }
        return this;
    }
}

//new Factory().process(modifier.domWatcher.records).analyse().show(500);
