enum Change {
    Added,
    Removed,
    Captured,
    Died
}

class Player {
    name: string;
    map = {
        "b": "Yellow",
        "r": "Green",
        "g": "Blue",
        "d": "Dead",
        "w": "Red"
    };

    constructor(dp: string) {
        this.name = this.map[dp.charAt(0)];
    }
}

class Piece {
    dp: string;
    name: string;
    player: Player;
    map = {
        "R": "Rook",
        "P": "Pawn",
        "K": "King",
        "Q": "Queen",
        "B": "Bishop",
        "N": "Knight"
    };

    constructor(dp: string) {
        this.name = this.map[dp.charAt(1)];
        this.player = new Player(dp);
        this.dp = dp;
    }
}

class Square {
    m: number;
    n: number;
    code: string;
    piece: Piece;
    change: Change;

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
    variances: Variance[] = [];
    corrections: Turn[] = [];

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
                    const dpa = change.mutation.addedNodes[0].attributes["data-piece"].value;
                    for (let m = 0; m < 14; m++) {
                        for (let n = 0; n < 14; n++) {
                            if (turn.board.squares[m][n].code === code) {
                                turn.board.squares[m][n].piece = new Piece(dpa);
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
