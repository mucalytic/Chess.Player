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

    abstract rotate(x: number,  y: number,
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

    rotate(x: number,  y: number,
          x1: number, y1: number): [number, number] {
        return [x + x1, y + y1];
    }
}

class Blue extends Player {
    name: string = "Blue";
    turn: number = 2;

    rotate(x: number,  y: number,
          x1: number, y1: number): [number, number] {
        return [x + y1, y - x1];
    }
}

class Yellow extends Player {
    name: string = "Yellow";
    turn: number = 3;

    rotate(x: number,  y: number,
          x1: number, y1: number): [number, number] {
        return [x - x1, y - y1];
    }
}

class Green extends Player {
    name: string = "Green";
    turn: number = 4;

    rotate(x: number,  y: number,
          x1: number, y1: number): [number, number] {
        return [x - y1, y + x1];
    }
}

class Dead extends Player {
    name: string = "Dead";
    turn: number = 0;

    rotate(x: number, y: number): [number, number] {
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
    abstract moves(): [Vector, boolean][];
    abstract attacks(): [Vector, boolean][];

    moved(): boolean {
        let moved = true;
        for (let i = 0; i < this.home.length; i++) {
            const m1 = this.home[i][0] - 6.5;
            const n1 = this.home[i][1] - 6.5;
            const [x2, y2] = this.player.rotate(6.5, 6.5, n1, m1);
            if (this.coords[1] === x2 &&
                this.coords[0] === y2) {
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

    moves(): [Vector, boolean][] {
        return [];
    }

    attacks(): [Vector, boolean][] {
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

    moves(): [Vector, boolean][] {
        return this.moved()
            ? [[new Vector(_ => 0, _ => 1), true]]
            : [[new Vector(_ => 0, _ => 1), true],
               [new Vector(_ => 0, _ => 2), true]];
    }

    attacks(): [Vector, boolean][] {
        return [[new Vector(r =>  r, r => r), true],
                [new Vector(r => -r, r => r), true]];
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

    moves(): [Vector, boolean][] {
        return [];
    }

    attacks(): [Vector, boolean][] {
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

    moves(): [Vector, boolean][] {
        return [];
    }

    attacks(): [Vector, boolean][] {
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

    moves(): [Vector, boolean][] {
        return [];
    }

    attacks(): [Vector, boolean][] {
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

    moves(): [Vector, boolean][] {
        return [];
    }

    attacks(): [Vector, boolean][] {
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
    piece: Piece;

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

    static coords(code: string): [number, number] {
        const m = parseInt(code.slice(1)) - 1;
        const n = code.charCodeAt(0) - 97;
        return [m, n];
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

class CountdownHelper {
    counter: number = 60;
    enabled: boolean = false;
    utterances: number[] = [60];

    username(): string {
        return document.getElementById("four-player-username").innerText;
    }

    avatar(nodes: HTMLCollection): Node {
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if (node instanceof HTMLElement &&
                node.classList.contains("player-avatar")) {
                return node;
            }
        }
        return undefined;
    }

    current(mr: MutationRecord): number {
        return parseFloat(mr.oldValue.trim().split(":")[1]);
    }

    reset(mr: MutationRecord): void {
        if (mr.type === "childList" &&
            mr.target instanceof HTMLDivElement &&
            mr.target.classList.length === 0 &&
            mr.addedNodes.length === 1) {
            const modal = mr.addedNodes[0];
            if (modal instanceof HTMLElement &&
                modal.classList.contains("modal-container")) {
                const go = modal.querySelector(".game-over-container");
                if (go) {
                    this.utterances = [60];
                    this.counter = 60;
                }
            }
        }
    }

    words(): string {
        return this.counter <= 5
            ? this.counter.toString()
            : `${this.counter} seconds left`;
    }

    utterance(): SpeechSynthesisUtterance {
        return this.rate(new SpeechSynthesisUtterance(this.words()));
    }

    rate(utterance: SpeechSynthesisUtterance): SpeechSynthesisUtterance {
        utterance.rate = 1.8;
        return utterance;
    }

    utter(mr: MutationRecord): void {
        if (this.enabled) {
            if (mr.type === "characterData") {
                const timer = mr.target.parentNode.parentNode;
                if (timer) {
                    if (timer instanceof HTMLElement &&
                        timer.classList.contains("player-clock-timer")) {
                        const avatar = this.avatar(timer.children);
                        if (avatar) {
                            if (avatar instanceof HTMLAnchorElement) {
                                if (avatar.pathname === "/member/" + this.username()) {
                                    const c = this.current(mr);
                                    if (this.counter - c > 0 &&
                                        this.counter - c <= 1) {
                                        this.counter = c;
                                    }
                                    if (((this.counter <= 5 &&
                                          this.counter % 1 === 0) ||
                                         (this.counter > 5 &&
                                          this.counter % 5 === 0)) &&
                                          this.counter !== this.utterances[0]) {
                                        window.speechSynthesis.speak(this.utterance());
                                        this.utterances.unshift(this.counter);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

class AnalysisHelper {
    colours: string[] = ["red", "blue", "yellow", "green"];
    board = new Board();
    username: string;

    setOriginSquare(target: EventTarget): void {
        const originSquareElement = this.getThisSquareElement(event.target);
        const ds = originSquareElement.attributes["data-square"];
        if (ds) {
            const element = document.getElementById("four-player-username");
            const origin = element.attributes["origin"];
            if (origin) {
                origin.value = ds.value;
            } else {
                element.setAttribute("origin", ds.value);
            }
        }
    }

    getOriginSquareElement(boardElement: HTMLElement): HTMLElement {
        const element = document.getElementById("four-player-username");
        const origin = element.attributes["origin"];
        if (origin) {
            return this.getSquareElement(boardElement, origin.value);
        }
        return undefined;
    }

    resetOriginSquareAndCleanSquares(): void {
        const element = document.getElementById("four-player-username");
        if (element.attributes["origin"]) {
            element.removeAttribute("origin");
        }
        const boardElement = this.getBoardElement();
        this.clearCandidatesFromSquares(boardElement);
        this.cleanColouredSquares(boardElement);
    }

    showEnemies(target: EventTarget): void {
        if (this.username) {
            const boardElement = this.getBoardElement();
            const originSquareElement = this.getOriginSquareElement(boardElement);
            if (originSquareElement) {
                const targetSquareElement = this.getThisSquareElement(target);
                if (boardElement && targetSquareElement) {
                    this.clearCandidatesFromSquares(boardElement);
                    this.cleanColouredSquares(boardElement);
                    this.createBoard(boardElement);
                    this.analyseSquares(boardElement, originSquareElement);
                    this.colouriseSquares(boardElement, targetSquareElement);
                }
            }
        }
    }

    getThisSquareElement(target: EventTarget): HTMLElement {
        let squareElement: HTMLElement;
        if (target instanceof HTMLElement) {
            if (target.className.indexOf("piece-") !== -1) {
                squareElement = target.parentElement;
            }
            if (!squareElement) {
                squareElement = target;
            }
            if (squareElement.className.indexOf("square-") !== -1) {
                return squareElement;
            }
        }
        return undefined;
    }

    getBoardElement() : HTMLElement {
        let boardElement: HTMLElement;
        const elements = document.body.getElementsByTagName("div");
        for (let i = 0; i < elements.length; i++) {
            if (elements[i].className.indexOf("board-") === 0) {
                const element = elements[i];
                if (element instanceof HTMLElement) {
                    boardElement = element;
                    break;
                }
            }
        }
        return boardElement;
    }

    cleanColouredSquares(boardElement: HTMLElement): void {
        const element = document.getElementById("four-player-username");
        const mods = element.attributes["modifications"];
        if (mods) {
            const row = boardElement.children;
            if (row.length >= 14) {
                const codes = mods.value.split(",");
                for (let i = 0; i < codes.length; i++) {
                    searchLoop:
                    for (let m = 0; m < 14; m++) {
                        for (let n = 0; n < 14; n++) {
                            const element = row[m].children[n];
                            const ds = element.attributes["data-square"];
                            if (ds && element instanceof HTMLElement) {
                                if (ds.value === codes[i]) {
                                    element.style.backgroundColor = null;
                                    break searchLoop;
                                }
                            }
                        }
                    }
                }
            }
            element.removeAttribute("modifications");
        }
    }

    clearCandidatesFromSquares(boardElement: HTMLElement): void {
        const row = boardElement.children;
        if (row.length >= 14) {
            for (let m = 0; m < 14; m++) {
                for (let n = 0; n < 14; n++) {
                    const element = row[m].children[n];
                    if (element.attributes["friends"]) {
                        element.removeAttribute("friends");
                    }
                    if (element.attributes["enemies"]) {
                        element.removeAttribute("enemies");
                    }
                    if (element.attributes["moves"]) {
                        element.removeAttribute("moves");
                    }
                }
            }
        }
    }

    createBoard(boardElement: HTMLElement): void {
        const row = boardElement.children;
        if (row.length >= 14) {
            for (let m = 0; m < 14; m++) {
                for (let n = 0; n < 14; n++) {
                    const element = row[m].children[n];
                    if (element instanceof HTMLElement) {
                        const ds = element.attributes["data-square"];
                        if (ds) {
                            const square = this.board.square(ds.value);
                            const child = this.pieceNode(element.children);
                            if (child) {
                                const dp = child.attributes["data-piece"];
                                if (dp) {
                                    square.piece = Piece.create(dp.value, ds.value);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // go to every square on the board and if there is
    // a piece on it, find out all the possible squares
    // it can occupy and add the piece as a candidate
    // (friend or enemy) to the current player
    analyseSquares(boardElement: HTMLElement, originSquareElement: HTMLElement): void {
        const row = boardElement.children;
        if (row.length >= 14) {
            for (let m = 0; m < 14; m++) {
                for (let n = 0; n < 14; n++) {
                    const element = row[m].children[n];
                    if (element instanceof HTMLElement) {
                        const ds = element.attributes["data-square"];
                        if (ds) {
                            const square = this.board.square(ds.value);
                            const accessible = square.accessible();
                            if (accessible) {
                                const piece = square.piece;
                                if (piece) {
                                    if (!(piece.player instanceof Dead)) {
                                        this.checkRadius(boardElement, square);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // check all the squares the piece can occupy for a
    // given radius from the piece's current location
    // pieceSquare: the square that the piece whose 
    // radius we are checking is currently located
    checkRadius(boardElement: HTMLElement, pieceSquare: Square): void {
        this.checkAttackRadius(boardElement, pieceSquare);
        this.checkMoveRadius(boardElement, pieceSquare);
    }

    checkAttackRadius(boardElement: HTMLElement, pieceSquare: Square): void {
        const piece = pieceSquare.piece;
        let vectors = piece.attacks();
        for (; ;) {
            let radius = piece.radius.next();
            const remaining = this.remaining(vectors);
            if (radius.done || radius.value > 14 || remaining === 0) {
                piece.radius.reset();
                break;
            }
            for (let j = 0; j < vectors.length; j++) {
                this.checkAttackVector(boardElement, pieceSquare, vectors[j], radius.value);
            }
        }
    }

    checkMoveRadius(boardElement: HTMLElement, pieceSquare: Square): void {
        const piece = pieceSquare.piece;
        let vectors = piece.moves();
        for (; ;) {
            let radius = piece.radius.next();
            const remaining = this.remaining(vectors);
            if (radius.done || radius.value > 14 || remaining === 0) {
                piece.radius.reset();
                break;
            }
            for (let j = 0; j < vectors.length; j++) {
                this.checkMoveVector(boardElement, pieceSquare, vectors[j], radius.value);
            }
        }
    }

    // get the square for the given radius relating the
    // vector representing the piece's direction of travel
    // and rotate it depending on the piece's player
    checkAttackVector(boardElement: HTMLElement, pieceSquare: Square,
        vector: [Vector, boolean], radius: number): void {
        if (vector[1]) {
            const x1 = vector[0].x1(radius);
            const y1 = vector[0].y1(radius);
            const [x2, y2] = pieceSquare.piece.player.rotate(pieceSquare.n, pieceSquare.m, x1, y1);
            if (!this.board.valid(x2, y2)) {
                vector[1] = false;
                return;
            }
            const targetSquare = this.board.squares[y2][x2];
            if (!targetSquare.accessible()) {
                vector[1] = false;
                return;
            }
            this.setAttackCandidate(boardElement, pieceSquare, targetSquare);
            if (targetSquare.piece) {
                vector[1] = false;
            }
        }
    }

    checkMoveVector(boardElement: HTMLElement, pieceSquare: Square,
        vector: [Vector, boolean], radius: number): void {
        if (vector[1]) {
            const x1 = vector[0].x1(radius);
            const y1 = vector[0].y1(radius);
            const [x2, y2] = pieceSquare.piece.player.rotate(pieceSquare.n, pieceSquare.m, x1, y1);
            if (!this.board.valid(x2, y2)) {
                vector[1] = false;
                return;
            }
            const targetSquare = this.board.squares[y2][x2];
            if (!targetSquare.accessible()) {
                vector[1] = false;
                return;
            }
            if (!targetSquare.piece) {
                this.setMoveCandidate(boardElement, pieceSquare, targetSquare);
            } else {
                vector[1] = false;
            }
        }
    }

    setAttackCandidate(boardElement: HTMLElement, pieceSquare: Square, targetSquare: Square): void {
        const element = this.getSquareElement(boardElement, targetSquare.code());
        if (element) {
            if (this.username === pieceSquare.piece.player.name.toLowerCase()) {
                let friends: Attr = element.attributes["friends"];
                if (friends) {
                    friends.value = `${friends.value},${pieceSquare.code()}`;
                } else {
                    element.setAttribute("friends", pieceSquare.code());
                }
            } else {
                let enemies: Attr = element.attributes["enemies"];
                if (enemies) {
                    enemies.value = `${enemies.value},${pieceSquare.code()}`;
                } else {
                    element.setAttribute("enemies", pieceSquare.code());
                }
            }
        }
    }

    setMoveCandidate(boardElement: HTMLElement, pieceSquare: Square, targetSquare: Square): void {
        const element = this.getSquareElement(boardElement, targetSquare.code());
        if (element) {
            let moves: Attr = element.attributes["moves"];
            if (moves) {
                moves.value = `${moves.value},${pieceSquare.code()}`;
            } else {
                element.setAttribute("moves", pieceSquare.code());
            }
        }
    }

    getSquareElement(boardElement: HTMLElement, code: string): HTMLElement {
        const row = boardElement.children;
        let squareElement: HTMLElement;
        if (row.length >= 14) {
            rowLoop:
            for (let m = 0; m < 14; m++) {
                for (let n = 0; n < 14; n++) {
                    const element = row[m].children[n];
                    if (element instanceof HTMLElement) {
                        if (element.classList.contains(`square-${code}`)) {
                            squareElement = element;
                            break rowLoop;
                        }
                    }
                }
            }
        }
        return squareElement;
    }

    colouriseSquares(boardElement: HTMLElement, targetSquareElement: HTMLElement): void {
        const ds = targetSquareElement.attributes["data-square"];
        if (ds) {
            this.addCodeToModifiedSquares(ds.value);
            if (this.friendly(targetSquareElement)) {
                const colour = this.getColour(targetSquareElement, true);
                targetSquareElement.style.backgroundColor = colour;
            } else {
                let enemies: Attr = targetSquareElement.attributes["enemies"];
                if (enemies) {
                    let colour = this.getColour(targetSquareElement, false);
                    targetSquareElement.style.backgroundColor = colour;
                    const row = boardElement.children;
                    if (row.length >= 14) {
                        const codes = enemies.value.split(",");
                        for (let i = 0; i < codes.length; i++) {
                            searchLoop:
                            for (let m = 0; m < 14; m++) {
                                for (let n = 0; n < 14; n++) {
                                    const element = row[m].children[n];
                                    const ds = element.attributes["data-square"];
                                    if (ds && element instanceof HTMLElement) {
                                        if (ds.value === codes[i]) {
                                            colour = this.getColour(element, false);
                                            element.style.backgroundColor = colour;
                                            this.addCodeToModifiedSquares(ds.value);
                                            break searchLoop;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    getColour(element: HTMLElement, friendly: boolean): string {
        let rgb: { r: number, g: number, b: number};
        var bgc = window
            .getComputedStyle(element, null)
            .getPropertyValue("background-color");
        if (bgc.indexOf("#") === 0) {
            rgb = this.hexToRgb(bgc);
        }
        if (bgc.indexOf("rgb") === 0) {
            const vals = bgc
                .substring(4, bgc.length -1)
                .split(", ");
            rgb = {
                r: parseInt(vals[0]),
                g: parseInt(vals[1]),
                b: parseInt(vals[2])
            };
        };
        if (friendly) {
            return `rgb(${rgb.r}, 255, ${rgb.b})`;
        } else {
            return `rgb(255, ${rgb.g}, ${rgb.b})`;
        }
    }

    friendly(element: HTMLElement): boolean {
        let friends: Attr = element.attributes["friends"];
        let enemies: Attr = element.attributes["enemies"];
        if (!friends && !enemies) {
            return true;
        } else if (friends && !enemies) {
            return true;
        } else if (enemies && !friends) {
            return false;
        } else {
            return friends.value.split(",").length > enemies.value.split(",").length;
        }
    }

    addCodeToModifiedSquares(code: string) : void {
        const element = document.getElementById("four-player-username");
        const mods = element.attributes["modifications"];
        if (mods) {
            mods.value = `${mods.value},${code}`;
        } else {
            element.setAttribute("modifications", code);
        }
    }

    show(): void {
        for (let m = 0; m < 14; m++) {
            const row: string[] = ["|"];
            for (let n = 0; n < 14; n++) {
                const square = this.board.squares[m][n];
                if (square.accessible()) {
                    row.push(square.piece ? square.piece.dp : "[]");
                } else {
                    row.push("  ");
                }
            }
            row.push("|");
            const s = this.board.squares;
            console.log(row.join(" ") +
                "%O %O %O %O %O %O %O %O %O %O %O %O %O %O |",
                s[m][0], s[m][1], s[m][2], s[m][3], s[m][4],
                s[m][5], s[m][6], s[m][7], s[m][8], s[m][9],
                s[m][10], s[m][11], s[m][12], s[m][13]);
        }
    }

    getUsername(): string {
        const username = document.getElementById("four-player-username").innerText;
        const elements = document.body.getElementsByClassName("player-avatar");
        for (let i = 0 ; i < elements.length; i++) {
            const element = elements[i];
            if (element instanceof HTMLAnchorElement) {
                if (element.href.indexOf(username) !== -1) {
                    const parent = element.parentElement;
                    for (let j = 0; j < parent.classList.length; j++) {
                        for (let k = 0; k < this.colours.length; k++) {
                            if (this.colours[k] === parent.classList[j]) {
                                return this.colours[k];
                            }
                        }
                    }
                }
            }
        }
        return undefined;
    }

    hexToRgb(hex: string): {r, g, b} {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, (m, r, g, b) => {
            return r + r + g + g + b + b;
        });
    
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
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

    pieceNode(nodes: HTMLCollection): Node {
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if (node instanceof HTMLElement &&
                node.className.indexOf("piece-") === 0) {
                return node;
            }
        }
        return undefined;
    }

    constructor() {
        const username = this.getUsername();
        if (username) {
            this.username = username;
        } else {
            this.username = "red";
        }
    }
}

class DomWatcher {
    observer: MutationObserver;
    countdown = new CountdownHelper();
    init: MutationObserverInit = {
        characterDataOldValue: true,
        attributeOldValue: true,
        characterData: true,
        attributes: true,
        childList: true,
        subtree: true
    };

    createDocumentBodyObserverSubscription(): void {
        this.observer = new MutationObserver(mrs => {
            mrs.forEach(mr => {
                this.countdown.reset(mr);
                this.countdown.utter(mr);
            });
        });
    }

    constructor() {
        this.createDocumentBodyObserverSubscription();
        this.observer.observe(document.body, this.init);
    }
}

class DomModifier {
    domWatcher: DomWatcher;

    addStartAiButton(): DomModifier {
        const btnNewGame = document.getElementsByClassName("btns-container")[0];
        if (btnNewGame instanceof HTMLElement) {
            btnNewGame.style.cssFloat = "right";

            const btnOn = btnNewGame.cloneNode(true);
            if (btnOn instanceof HTMLElement) {
                btnOn.style.cssFloat = "left";
                btnOn.style.marginRight = "12px";

                const anchorOn = btnOn.firstChild;
                if (anchorOn.nodeName === "A") {
                    if (anchorOn instanceof HTMLElement) {
                        anchorOn.innerText = "Start AI";
                        anchorOn.classList.remove("new-game-btn");
                    }
                }

                const btnOff = btnOn.cloneNode(true);
                if (btnOff instanceof HTMLElement) {
                    btnOff.style.display = "none";

                    const anchorOff = btnOff.firstChild;
                    if (anchorOff.nodeName === "A") {
                        if (anchorOff instanceof HTMLElement) {
                            anchorOff.innerText = "Stop AI";
                            anchorOff.style.color = "#b4b4b3";
                            anchorOff.style.borderBottom = "#272422";
                            anchorOff.style.backgroundColor = "#272422";
                            anchorOff.addEventListener("click", () => {
                                this.domWatcher.countdown.enabled = false;
                                btnOff.style.display = "none";
                                btnOn.style.display = "block";
                            });
                        }
                    }

                    anchorOn.addEventListener("click", () => {
                        this.domWatcher.countdown.enabled = true;
                        btnOff.style.display = "block";
                        btnOn.style.display = "none";
                    });
                }

                btnNewGame.parentNode.appendChild(btnOn);
                btnNewGame.parentNode.appendChild(btnOff);
            }
        }
        return this;
    }

    rightAlignStartButton(): DomModifier {
        const head = document.getElementsByTagName("head")[0];
        if (head instanceof HTMLElement) {
            const text = document.createTextNode(".btns-container { float: right; }");
            const style = document.createElement("style");
            if (style instanceof HTMLElement) {
                style.type = "text/css";
                style.appendChild(text);
            }
            head.appendChild(style);
        }
        return this;
    }

    watchMouseOvers(): DomModifier {
        return this;
    }

    over(event: Event): void {
        new AnalysisHelper().showEnemies(event.target);
    }

    down(event: Event) {
        new AnalysisHelper().setOriginSquare(event.target);
    }

    up(event: Event) {
        new AnalysisHelper().resetOriginSquareAndCleanSquares();
    }

    constructor() {
        document.body.addEventListener("mouseover", this.over);
        document.body.addEventListener("mousedown", this.down);
        document.body.addEventListener("mouseup", this.up);
        window.addEventListener("keydown", e => {
            if (!e.repeat &&
                 e.key === "q" || e.key === "Q") {
                console.log("q key pressed");
                // show hanging pieces and their attackers
                // add hidden field to dom with affected elements
            }
        });
        window.addEventListener("keyup", e => {
            if (e.key === "q" || e.key === "Q") {
                console.log("q key released");
                // clear effects on elements for hanging pieces
                // remove hidden field from dom
            }
        });
        this.domWatcher = new DomWatcher();
        this.rightAlignStartButton();
        this.addStartAiButton();
    }
}

var modifier = new DomModifier();
