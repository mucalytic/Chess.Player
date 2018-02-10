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

class Factory {
    turns: Turn[] = [];
    changes: Turn[] = [];

    turn(datetime: string): Turn {
        for (const turn of this.turns) {
            if (turn.datetime === datetime) {
                return turn;
            }
        }
        return null;
    }

    change(datetime: string): Turn {
        for (const change of this.changes) {
            if (change.datetime === datetime) {
                return change;
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
                const change = new Turn(this.turns[i].datetime);
                for (let m = 0; m < 14; m++) {
                    for (let n = 0; n < 14; n++) {
                        const to = this.turns[i].board.squares[m][n];
                        const from = this.turns[i - 1].board.squares[m][n];
                        if (from.piece === undefined && to.piece !== undefined) {
                            change.board.squares[m][n].piece = to.piece;
                            change.board.squares[m][n].change = Change.Added;
                        }
                        if (from.piece !== undefined && to.piece === undefined) {
                            change.board.squares[m][n].piece = from.piece;
                            change.board.squares[m][n].change = Change.Removed;
                        }
                        if (from.piece !== undefined && to.piece !== undefined) {
                            if (from.piece.dp !== to.piece.dp) {
                                change.board.squares[m][n].piece = to.piece;
                                if (to.piece.player.name === "Dead") {
                                    change.board.squares[m][n].change = Change.Died;
                                } else {
                                    change.board.squares[m][n].change = Change.Captured;
                                }
                            }
                        }
                    }
                }
                this.changes.push(change);
            }
        }
        return this;
    }

    show(turns: number): Factory {
        for (let i = 1; i < Math.min(this.turns.length, turns); i++) {
            const turn = this.turns[i];
            console.log(`When: ${turn.datetime}`);
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
                const change = this.change(turn.datetime);
                for (let n = 0; n < 14; n++) {
                    const square = change.board.squares[m][n];
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
// new Factory().process(changesa).analyse().show(10);
