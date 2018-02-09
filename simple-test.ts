class Player {
    name: string;
    map = {
        "b": "Yellow",
        "r": "Green",
        "g": "Blue",
        "d": "Dead",
        "w": "Red"
    };

    equals(player: Player): boolean {
        if (player === undefined) {
            return false;
        } else {
            return this.name === player.name;
        }
    }

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

    equals(piece: Piece): boolean {
        if (piece === undefined) {
            return false;
        } else {
            return this.name === piece.name &&
                this.player.equals(piece.player);
        }
    }

    constructor(dp: string) {
        this.name = this.map[dp.charAt(1)];
        this.player = new Player(dp);
        this.dp = dp;
    }
}

class Square {
    piece: Piece;
    code: string;
    m: number;
    n: number;

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
    added: Board;
    removed: Board;
    datetime: string;

    constructor(datetime: string) {
        this.removed = new Board();
        this.added = new Board();
        this.datetime = datetime;
    }
}

class Change {
    from: Square;
    to: Square;

    constructor(from: Square, to: Square) {
        this.from = from;
        this.to = to;
    }
}

class Factory {
    turns: Turn[] = [];
    changes: Change[] = [];

    turn(datetime: string): Turn {
        for (const turn of this.turns) {
            if (turn.datetime === datetime) {
                return turn;
            }
        }
        return null;
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
                            if (turn.added.squares[m][n].code === code) {
                                turn.added.squares[m][n].piece = new Piece(dpa);
                            }
                        }
                    }
                }
                if (change.mutation.removedNodes.length === 1) {
                    const dpr = change.mutation.removedNodes[0].attributes["data-piece"].value;
                    for (let m = 0; m < 14; m++) {
                        for (let n = 0; n < 14; n++) {
                            if (turn.removed.squares[m][n].code === code) {
                                turn.removed.squares[m][n].piece = new Piece(dpr);
                            }
                        }
                    }
                }
            }
        }
        return this;
    }

    analyse(): Factory {
        if (this.turns.length > 2) {
            for (let i = 1; i < this.turns.length; i++) {
                for (let m = 0; m < 14; m++) {
                    for (let n = 0; n < 14; n++) {
                        const from = this.turns[i].added.squares[m][n];
                        const to = this.turns[i - 1].added.squares[m][n];
                        if (from.piece !== undefined) {
                            if (!from.piece.equals(to.piece)) {
                                this.changes.push(new Change(from, to));
                            }
                        }
                    }
                }
            }
        }
        return this;
    }

    show(turns: number): Factory {
        for (let i = 1; i < Math.min(this.turns.length, turns); i++) {
            console.log(`When: ${this.turns[i].datetime}`);
            for (let m = 0; m < 14; m++) {
                let line: string = "[ ";
                for (let n = 0; n < 14; n++) {
                    const square = this.turns[i].added.squares[m][n];
                    if (square.piece === undefined) {
                        line += "[]";
                    } else {
                        line += square.piece.dp;
                    }
                    line += " ";
                }
                line += "] | [ ";
                for (let n = 0; n < 14; n++) {
                    const square = this.turns[i].removed.squares[m][n];
                    if (square.piece === undefined) {
                        line += "[]";
                    } else {
                        line += square.piece.dp;
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
// new Factory().process(changesa).show();
