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
    counter: number = 0;
    max?: number;

    next(): IteratorResult<number> {
        if (!this.max || (this.max && this.max >= ++this.counter)) {
            return {
                value: this.counter,
                done: false
            };
        } else {
            return {
                value: null,
                done: true
            };
        }
    }

    constructor(max?: number) {
        this.max = max;
    }
}

abstract class Piece {
    player: Player;
    dp: string;

    abstract name: string;
    abstract jump: boolean;
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
    jump: boolean = false;
    radius = new Radius();
    attack: Vector[] =
        [new Vector((x, r) => x + r, (y) => y),
         new Vector((x, r) => x - r, (y) => y),
         new Vector((x) => x, (y, r) => y + r),
         new Vector((x) => x, (y, r) => y - r)];
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
    jump: boolean = false;
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
    jump: boolean = false;
    radius = new Radius(1);
    attack: Vector[] =
        [new Vector((x) => x + 1, (y) => y),
         new Vector((x) => x - 1, (y) => y),
         new Vector((x) => x, (y) => y + 1),
         new Vector((x) => x, (y) => y - 1),
         new Vector((x) => x + 1, (y) => y + 1),
         new Vector((x) => x + 1, (y) => y - 1),
         new Vector((x) => x - 1, (y) => y + 1),
         new Vector((x) => x - 1, (y) => y - 1)];
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
    jump: boolean = false;
    radius = new Radius();
    attack: Vector[] =
        [new Vector((x, r) => x + r, (y) => y),
         new Vector((x, r) => x - r, (y) => y),
         new Vector((x) => x, (y, r) => y + r),
         new Vector((x) => x, (y, r) => y - r),
         new Vector((x, r) => x + r, (y, r) => y + r),
         new Vector((x, r) => x + r, (y, r) => y - r),
         new Vector((x, r) => x - r, (y, r) => y + r),
         new Vector((x, r) => x - r, (y, r) => y - r)];
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
    jump: boolean = false;
    radius = new Radius();
    attack: Vector[] =
        [new Vector((x, r) => x + r, (y, r) => y + r),
         new Vector((x, r) => x + r, (y, r) => y - r),
         new Vector((x, r) => x - r, (y, r) => y + r),
         new Vector((x, r) => x - r, (y, r) => y - r)];
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
    jump: boolean = true;
    radius = new Radius(1);
    attack: Vector[] =
        [new Vector((x) => x + 2, (y) => y + 1),
         new Vector((x) => x + 2, (y) => y - 1),
         new Vector((x) => x - 2, (y) => y + 1),
         new Vector((x) => x - 2, (y) => y - 1),
         new Vector((x) => x + 1, (y) => y + 2),
         new Vector((x) => x + 1, (y) => y - 2),
         new Vector((x) => x - 1, (y) => y + 2),
         new Vector((x) => x - 1, (y) => y - 2)];
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

    code(m: number, n: number): string {
        return `${this.char(n)}${m + 1}`;
    }

    accessible(m: number, n: number): boolean {
        return (m >= 4 && m <= 11 && n >= 1 && n <= 3) ||
               (m >= 1 && m <= 14 && n >= 4 && n <= 11) ||
               (m >= 4 && m <= 11 && n >= 12 && n <= 14);
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

class Board {
    squares: Square[][] = [];

    square(code: string): Square {
        const c = Square.coords(code);
        return this.squares[c[0]][c[1]];
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

class Turn {
    index: number;
    diff = new Diff();
    added = new Board();
    removed = new Board();

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

    createAddedAndRemovedBoards(turn: Turn, mr: MutationRecord): void {
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
                        if (asq.piece.player.name === "Dead") {
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

    process(changes: MutationRecord[]): Factory {
        Rx.Observable.fromArray(changes)
            .filter(mr => mr.type === "childList" &&
                          mr.target instanceof HTMLElement &&
                          mr.target.className.indexOf("board-") === 0)
            .scan((mrc: [MutationRecord, number], mr: MutationRecord) => {
                const res: [MutationRecord, number] = [mr, ++mrc[1]];
                return res;
            }, [undefined, 0])
            .subscribe(mrc => {
                const turn = new Turn(mrc[1]);
                this.createAddedAndRemovedBoards(turn, mrc[0]);
                this.createDiffBoard(turn);
                this.turns.push(turn);
            });
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
            for (let m = 0; m < 14; m++) {
                const row: string[] = ["|"];
                for (let n = 0; n < 14; n++) {
                    const square = turn.added.squares[m][n];
                    row.push(square.piece ? square.piece.dp : "[]");
                }
                row.push("|");
                for (let n = 0; n < 14; n++) {
                    const square = turn.removed.squares[m][n];
                    row.push(square.piece ? square.piece.dp : "[]");
                }
                row.push("|");
                for (let n = 0; n < 14; n++) {
                    const square = turn.diff.squares[m][n];
                    row.push(square.piece ? square.piece.dp + square.change : "[ ]");
                }
                row.push("|");
                console.log(row.join(" "));
            }
            console.groupEnd();
        }
        return this;
    }
}

//new Factory().process(watcher.records).show(500);
