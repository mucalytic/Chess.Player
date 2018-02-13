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

class Player {
    name: string;

    constructor(dp: string) {
        switch (dp.charAt(0)) {
            case "w":
                this.name = "Red";
                break;
            case "g":
                this.name = "Blue";
                break;
            case "d":
                this.name = "Dead";
                break;
            case "r":
                this.name = "Green";
                break;
            case "b":
                this.name = "Yellow";
                break;
            default:
                this.name = undefined;
        }
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
    abstract radius: Radius;
    abstract jump: boolean;
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
                return null;
        }
    }

    protected constructor(dp: string) {
        this.player = new Player(dp);
        this.dp = dp;
    }
}

class Rook extends Piece {
    name: string = "Rook";
    jump: boolean = false;
    radius = new Radius();
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
    code: string;
    piece?: Piece;
    change?: string;

    convert(code: string): number[] {
        return [code.charCodeAt(0), parseInt(code.slice(1))];
    }

    constructor(code: string) {
        [this.m, this.n] = this.convert(code);
        this.code = code;
    }
}

class Board {
    squares: Square[][] = [];

    add(sq: Square): void {
        this.squares[sq.m][sq.n] = sq;
    }
}

class Turn {
    diff: Diff;
    added: Board;
    removed: Board;
    index: number;

    constructor(index: number) {
        this.index = index;
        this.diff = new Diff();
        this.added = new Board();
        this.removed = new Board();
    }
}

class Diff extends Board {
    deaths: Square[] = [];
    captures: Square[] = [];
    removals: Square[] = [];
    additions: Square[] = [];
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

    process(changes: MutationRecord[]): Factory {
        Rx.Observable.fromArray(changes)
            .filter(mr => mr.type === "childList" &&
                          mr.target instanceof HTMLElement &&
                          mr.target.className.indexOf("board-") === 0)
            .scan((mrc: [MutationRecord, number], mr: MutationRecord) => {
                const res: [MutationRecord, number] = [mr, ++mrc[1]];
                return res;
            }, [undefined, 0])
            .forEach(mrc => {
                let mr: MutationRecord;
                let index: number;
                [mr, index] = mrc;
                const turn = new Turn(index);
                this.turns.push(turn);
                for (let m = 0; m < 14; m++) {
                    const aro: NodeList = mr[m].addedNodes;
                    const rro: NodeList = mr[m].removedNodes;
                    for (let n = 0; n < 14; n++) {
                        const aco: Node = aro[m].childNodes[n];
                        const rco: Node = rro[m].childNodes[n];
                        if (aco instanceof HTMLElement &&
                            rco instanceof HTMLElement) {
                            const apn = this.piece(aco.childNodes);
                            const rpn = this.piece(rco.childNodes);
                            const dsq = new Square(aco.dataset["square"]);
                            const asq = new Square(aco.dataset["square"]);
                            const rsq = new Square(rco.dataset["square"]);
                            if (apn) {
                                asq.piece = Piece.create(apn.attributes["data-piece"].value);
                            }
                            if (rpn) {
                                rsq.piece = Piece.create(rpn.attributes["data-piece"].value);
                            }
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
                            turn.removed.add(rsq);
                            turn.added.add(asq);
                            turn.diff.add(dsq);
                        }
                    }
                }
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
