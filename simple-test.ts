enum Change {
    Added,
    Removed,
    Captured,
    Died
}

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
    names = {
        "b": "Yellow",
        "r": "Green",
        "g": "Blue",
        "d": "Dead",
        "w": "Red"
    };

    constructor(dp: string) {
        this.name = this.names[dp.charAt(0)];
    }
}

class Vector {
    dx: (x: number, r?: number) => number;
    dy: (y: number, r?: number) => number;

    constructor(dx: (x: number, r?: number) => number,
                dy: (x: number, r?: number) => number) {
        this.dx = dx;
        this.dy = dy;
    }
}

class Radius implements Iterator<number> {
    counter: number = 0;
    max?: number;

    next(): IteratorResult<number> {
        if (this.max === undefined ||
           (this.max !== undefined &&
            this.counter < this.max)) {
            this.counter++;
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
        const player = new Player(dp);
        switch (dp.charAt(1)) {
            case "R":
                return new Rook(player);
            case "P":
                return new Pawn(player);
            case "K":
                return new King(player);
            case "Q":
                return new Queen(player);
            case "B":
                return new Bishop(player);
            case "N":
                return new Knight(player);
            default:
                return null;
        }
    }

    protected constructor(player: Player) {
        this.player = player;
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

    constructor(player: Player) {
        super(player);
    }
}

class Pawn extends Piece {
    name: string = "Pawn";
    jump: boolean = false;
    radius = new Radius(2);
    mobility: Vector[] =
        [new Vector((x) => x, (y, r) => y + r)];

    constructor(player: Player) {
        super(player);
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

    constructor(player: Player) {
        super(player);
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

    constructor(player: Player) {
        super(player);
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

    constructor(player: Player) {
        super(player);
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

    constructor(player: Player) {
        super(player);
    }
}

class Square {
    m: number;
    n: number;
    code: string;
    piece?: Piece;
    change?: Change;

    convert(m: number, n: number): string {
        return `${String.fromCharCode(n + 97)}${m + 1}`;
    }

    constructor(m: number, n: number) {
        this.code = this.convert(m, n);
        this.m = m;
        this.n = n;
    }
}

class Board {
    squares: Square[][];

    constructor() {
        this.squares = [];
        for (let m = 0; m < 14; m++) {
            this.squares[m] = [];
            for (let n = 0; n < 14; n++) {
                this.squares[m][n] = new Square(m, n);
            }
        }
    }
}

class Turn {
    board: Board;
    datetime: string;

    constructor(datetime: string) {
        this.datetime = datetime;
        this.board = new Board();
    }
}

class Variance extends Turn {
    additions: number = 0;
    captures: number = 0;
    removals: number = 0;
    deaths: number = 0;
}

class Factory {
    turns: Turn[] = [];
    corrections: Turn[] = [];
    variances: Variance[] = [];

    turn(datetime: string): Turn {
        for (const turn of this.turns) {
            if (turn.datetime === datetime) {
                return turn;
            }
        }
        return null;
    }

    variance(datetime: string): Variance {
        for (const variance of this.variances) {
            if (variance.datetime === datetime) {
                return variance;
            }
        }
        return null;
    }

    map(change: Change): string {
        switch (change) {
            case Change.Added:
                return "+";
            case Change.Removed:
                return "-";
            case Change.Captured:
                return "*";
            case Change.Died:
                return "x";
            default:
                return " ";
        }
    }

    process(changes: { mutation: MutationRecord, datetime: string }[]): Factory {
        for (const change of changes) {
            if (change.mutation.type === "childList" &&
                change.mutation.target.attributes["data-square"]) {
                let turn = this.turn(change.datetime);
                if (turn == null) {
                    turn = new Turn(change.datetime);
                    this.turns.push(turn);
                }
                const code = change.mutation.target.attributes["data-square"].value;
                if (change.mutation.addedNodes.length === 1) {
                    const dp = change.mutation.addedNodes[0].attributes["data-piece"].value;
                    for (let m = 0; m < 14; m++) {
                        for (let n = 0; n < 14; n++) {
                            if (turn.board.squares[m][n].code === code) {
                                turn.board.squares[m][n].piece = Piece.create(dp);
                            }
                        }
                    }
                }
            }
        }
        return this;
    }

    analyse(): Factory {
        if (this.turns.length > 1) {
            for (let i = 1; i < this.turns.length; i++) {
                const variance = new Variance(this.turns[i].datetime);
                for (let m = 0; m < 14; m++) {
                    for (let n = 0; n < 14; n++) {
                        const to = this.turns[i].board.squares[m][n];
                        const from = this.turns[i - 1].board.squares[m][n];
                        if (from.piece === undefined && to.piece !== undefined) {
                            variance.board.squares[m][n].piece = to.piece;
                            variance.board.squares[m][n].change = Change.Added;
                            variance.additions++;
                        }
                        if (from.piece !== undefined && to.piece === undefined) {
                            variance.board.squares[m][n].piece = from.piece;
                            variance.board.squares[m][n].change = Change.Removed;
                            variance.removals++;
                        }
                        if (from.piece !== undefined && to.piece !== undefined) {
                            if (from.piece.dp !== to.piece.dp) {
                                variance.board.squares[m][n].piece = to.piece;
                                if (to.piece.player.name === "Dead") {
                                    variance.board.squares[m][n].change = Change.Died;
                                    variance.deaths++;
                                } else {
                                    variance.board.squares[m][n].change = Change.Captured;
                                    variance.captures++;
                                }
                            }
                        }
                    }
                }
                this.variances.push(variance);
            }
        }
        return this;
    }

    /* -there can be 0, 1 or 2 additions (+) to the board every turn
     *   0 because of a piece being taken by another piece
     *   1 because of a piece being moved
     *   2 because of castling
     * -in cases where 1 or 2 additions are made, there can be a
     *  mismatch with the number of removals (-). this is always
     *  corrected the next turn, but the correction needs to be
     *  predicted to ensure accurate state
     * -need to know what each piece's moves are so i can work
     *  out where an added piece came from
     */
    correct(): Factory {
        for (let m = 0; m < 14; m++) {
            for (let n = 0; n < 14; n++) {
            }
        }
        return this;
    }

    apply(): Factory {
        return this;
    }

    header(turn: Turn, variance: Variance): string {
        return "When: " +
               turn.datetime +
               "                         " +
               "Additions: " +
               variance.additions +
               "     " +
               "Removals: " +
               variance.removals +
               "     " +
               "Captures: " +
               variance.captures +
               "     " +
               "Deaths: " +
               variance.deaths;
    }

    show(turns: number): Factory {
        for (let i = 1; i < Math.min(this.turns.length, turns); i++) {
            const turn = this.turns[i];
            const variance = this.variance(turn.datetime);
            console.log(this.header(turn, variance));
            for (let m = 0; m < 14; m++) {
                let line: string = "[ ";
                for (let n = 0; n < 14; n++) {
                    const square = turn.board.squares[m][n];
                    if (square.piece === undefined) {
                        line += "[]";
                    } else {
                        line += square.piece.dp;
                    }
                    line += " ";
                }
                line += "]  |  [ ";
                for (let n = 0; n < 14; n++) {
                    const square = variance.board.squares[m][n];
                    if (square.piece === undefined) {
                        line += "[ ]";
                    } else {
                        line += square.piece.dp;
                        line += this.map(square.change);
                    }
                    line += " ";
                }
                line += "]";
                console.log(line);
            }
            console.log("");
        }
        return this;
    }
}

// usage:
// new Factory().process(changesa).analyse().correct().show(10);
