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
        this.player = new Player(dp);
        this.name = this.map[dp.charAt(1)];
    }
}

class Square {
    piece: Piece;
    code: string;
    m: number;
    n: number;

    convert(m: number, n: number): string {
        return `${String.fromCharCode(n + 97)}${n + 1}`;
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
        for (let m = 0; m < 14; m++) {
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
    turns: Turn[];

    turn(datetime: string): Turn {
        for (const turn of this.turns) {
            if (turn.datetime === datetime) {
                return turn;
            }
        }
    }

    process(changes: { mutation: MutationRecord, datetime: string }[]): void {
        for (const change of changes) {
            if (change.mutation.type === "childList" &&
                change.mutation.addedNodes.length === 1 &&
                change.mutation.target.attributes["data-square"]) {

                let turn = this.turn(change.datetime);
                if (turn == null) {
                    turn = new Turn(change.datetime);
                    this.turns.push(turn);
                }

                const dp = change.mutation.addedNodes[0].attributes["data-piece"].value;
                const code = change.mutation.target.attributes["data-square"].value;

                for (let m = 0; m < 14; m++) {
                    for (let n = 0; n < 14; n++) {
                        if (turn.board.squares[m][n].code === code) {
                            turn.board.squares[m][n].piece = new Piece(dp);
                            break;
                        }
                    }
                }
            }
        }
    }
}

// usage:
// new Factory().process(changesa).boards;
