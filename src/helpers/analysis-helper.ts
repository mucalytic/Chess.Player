import {Knight} from "../piece/knight"
import {Bishop} from "../piece/bishop"
import {Queen} from "../piece/queen"
import {King} from "../piece/king"
import {Rook} from "../piece/rook"
import {Pawn} from "../piece/pawn"
import {Dead} from "../player/dead"
import {Vector} from "../vector"
import {Square} from "../square"
import {Player} from "../player"
import {Board} from "../board"
import {Piece} from "../piece"

export class AnalysisHelper {
    colours: string[] = ["red", "blue", "yellow", "green"];
    board = new Board();
    username: string;

    setOriginSquare(target: EventTarget): void {
        const originSquareElement = this.getThisSquareElement(event.target);
        const ds = originSquareElement.attributes["data-square"];
        if (!ds) {
            return;
        }
        const element = document.getElementById("four-player-username");
        const origin = element.attributes["origin"];
        if (origin) {
            origin.value = ds.value;
        } else {
            element.setAttribute("origin", ds.value);
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

    showMovesAndEnemies(target: EventTarget): void {
        if (!this.username) {
            return;
        }
        const boardElement = this.getBoardElement();
        if (!boardElement) {
            return;
        }
        const originSquareElement = this.getOriginSquareElement(boardElement);
        if (!originSquareElement) {
            return;
        }
        const targetSquareElement = this.getThisSquareElement(target);
        if (!targetSquareElement) {
            return;
        }
        this.clearCandidatesFromSquares(boardElement);
        this.cleanColouredSquares(boardElement);
        this.createBoard(boardElement);
        const ds = originSquareElement.attributes["data-square"];
        if (!ds) {
            return;
        }
        const originSquare = this.board.square(ds.value);
        if (!originSquare.piece) {
            return;
        }
        if (originSquare.piece.player.name.toLowerCase() !== this.username) {
            return;
        }
        this.analyseSquares(boardElement);
        this.colouriseSquares(boardElement, originSquareElement, targetSquareElement);
    }

    showHangingPieces(): void {
        if (!this.username) {
            return;
        }
        const boardElement = this.getBoardElement();
        if (!boardElement) {
            return;
        }
        this.clearCandidatesFromSquares(boardElement);
        this.cleanColouredSquares(boardElement);
        this.createBoard(boardElement);
        this.analyseSquares(boardElement);
        this.colouriseSquaresWithHangingPieces(boardElement);
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
        if (!mods) {
            return;
        }
        const row = boardElement.children;
        if (row.length < 14) {
            return;
        }
        const codes = mods.value.split(",");
        for (let i = 0; i < codes.length; i++) {
            searchLoop:
            for (let m = 0; m < 14; m++) {
                for (let n = 0; n < 14; n++) {
                    const element = row[m].children[n];
                    const ds = element.attributes["data-square"];
                    if (!ds || !(element instanceof HTMLElement)) {
                        continue;
                    }
                    if (ds.value !== codes[i]) {
                        continue;
                    }
                    element.style.backgroundColor = null;
                    break searchLoop;
                }
            }
        }
        element.removeAttribute("modifications");
    }

    clearCandidatesFromSquares(boardElement: HTMLElement): void {
        const row = boardElement.children;
        if (row.length < 14) {
            return;
        }
        for (let m = 0; m < 14; m++) {
            for (let n = 0; n < 14; n++) {
                const element = row[m].children[n];
                if (element.attributes["attacks"]) {
                    element.removeAttribute("attacks");
                }
                if (element.attributes["moves"]) {
                    element.removeAttribute("moves");
                }
            }
        }
    }

    createBoard(boardElement: HTMLElement): void {
        const row = boardElement.children;
        if (row.length < 14) {
            return;
        }
        for (let m = 0; m < 14; m++) {
            for (let n = 0; n < 14; n++) {
                const element = row[m].children[n];
                if (!(element instanceof HTMLElement)) {
                    continue;
                }
                const ds = element.attributes["data-square"];
                if (!ds) {
                    continue;
                }
                const square = this.board.square(ds.value);
                const child = this.getPieceElement(element.children);
                if (!child) {
                    continue;
                }
                const dp = child.attributes["data-piece"];
                if (!dp) {
                    continue;
                }
                square.piece = this.createPiece(dp.value, ds.value);
            }
        }
    }

    createPiece(dp: string, code: string): Piece {
        switch (dp.charAt(1)) {
            case "R":
                return new Rook(dp, code);
            case "P":
                return new Pawn(dp, code);
            case "K":
                return new King(dp, code);
            case "Q":
            case "D":
                return new Queen(dp, code);
            case "B":
                return new Bishop(dp, code);
            case "N":
                return new Knight(dp, code);
            default:
                return undefined;
        }
    }

    analyseSquares(boardElement: HTMLElement): void {
        const row = boardElement.children;
        if (row.length < 14) {
            return;
        }
        for (let m = 0; m < 14; m++) {
            for (let n = 0; n < 14; n++) {
                const element = row[m].children[n];
                if (!(element instanceof HTMLElement)) {
                    continue;
                }
                const ds = element.attributes["data-square"];
                if (!ds) {
                    continue;
                }
                const square = this.board.square(ds.value);
                if (!square.accessible()) {
                    continue;
                }
                const piece = square.piece;
                if (!piece) {
                    continue;
                }
                if (piece.player instanceof Dead) {
                    continue;
                }
                this.checkRadius(boardElement, square);
            }
        }
    }

    checkRadius(boardElement: HTMLElement, pieceSquare: Square): void {
        this.checkAttackRadius(boardElement, pieceSquare);
        this.checkMoveRadius(boardElement, pieceSquare);
    }

    checkAttackRadius(boardElement: HTMLElement, pieceSquare: Square): void {
        const piece = pieceSquare.piece;
        let vectors = piece.attacks();
        let radius = piece.radius();
        while (!radius.done && radius.value <= 14 && this.remaining(vectors) > 0) {
            for (let j = 0; j < vectors.length; j++) {
                this.checkAttackVector(boardElement, pieceSquare, vectors[j], radius.value);
            }
            radius = piece.radius();
        }
    }

    checkMoveRadius(boardElement: HTMLElement, pieceSquare: Square): void {
        const piece = pieceSquare.piece;
        let vectors = piece.moves();
        let radius = piece.radius();
        while (!radius.done && radius.value <= 14 && this.remaining(vectors) > 0) {
            for (let j = 0; j < vectors.length; j++) {
                this.checkMoveVector(boardElement, pieceSquare, vectors[j], radius.value);
            }
            radius = piece.radius();
        }
    }

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
        if (!element) {
            return;
        }
        const attacks = element.attributes["attacks"];
        if (attacks) {
            attacks.value = `${attacks.value},${pieceSquare.code()}`;
        } else {
            element.setAttribute("attacks", pieceSquare.code());
        }
    }

    setMoveCandidate(boardElement: HTMLElement, pieceSquare: Square, targetSquare: Square): void {
        const element = this.getSquareElement(boardElement, targetSquare.code());
        if (!element) {
            return;
        }
        const moves = element.attributes["moves"];
        if (moves) {
            moves.value = `${moves.value},${pieceSquare.code()}`;
        } else {
            element.setAttribute("moves", pieceSquare.code());
        }
    }

    getSquareElement(boardElement: HTMLElement, code: string): HTMLElement {
        const row = boardElement.children;
        if (row.length < 14) {
            return undefined;
        }
        let squareElement: HTMLElement;
        rowLoop:
        for (let m = 0; m < 14; m++) {
            for (let n = 0; n < 14; n++) {
                const element = row[m].children[n];
                if (!(element instanceof HTMLElement)) {
                    continue;
                }
                if (!element.classList.contains(`square-${code}`)) {
                    continue;
                }
                squareElement = element;
                break rowLoop;
            }
        }
        return squareElement;
    }

    isTargetSquareValid(boardElement: HTMLElement,
                        originSquareElement: HTMLElement,
                        targetSquareElement: HTMLElement): boolean {
        const row = boardElement.children;
        if (row.length < 14) {
            return false;
        }
        const ds = originSquareElement.attributes["data-square"];
        if (!ds) {
            return false;
        }
        const originSquare = this.board.square(ds.value);
        const piece = originSquare.piece;
        if (!piece) {
            return false;
        }
        let codes: string[];
        if (piece.moves().length > 0) {
            const moves = targetSquareElement.attributes["moves"];
            if (!moves) {
                return false;
            }
            codes = moves.value.split(",");
        } else {
            const attacks = targetSquareElement.attributes["attacks"];
            if (!attacks) {
                return false;
            }
            codes = attacks.value.split(",");
        }
        if (codes.length === 0) {
            return false;
        }
        if (codes.indexOf(ds.value) === -1) {
            return false;
        }
       return true;
    }

    colouriseSquares(boardElement: HTMLElement,
                     originSquareElement: HTMLElement,
                     targetSquareElement: HTMLElement): void {
        const row = boardElement.children;
        if (row.length < 14) {
            return;
        }
        this.colouriseMovementSquares(row, boardElement, originSquareElement);
        if (!this.isTargetSquareValid(boardElement,
            originSquareElement, targetSquareElement)) {
            return;
        }
        this.colouriseEnemySquares(row, targetSquareElement);
    }
    
    colouriseMovementSquares(row: HTMLCollection,
                             boardElement: HTMLElement,
                             originSquareElement: HTMLElement): void {
        const dso: Attr = originSquareElement.attributes["data-square"];
        if (!dso) {
            return;
        }
        const originSquare = this.board.square(dso.value);
        const piece = originSquare.piece;
        if (!piece) {
            return;
        }
        for (let m = 0; m < 14; m++) {
            for (let n = 0; n < 14; n++) {
                const element = row[m].children[n];
                const ds: Attr = element.attributes["data-square"];
                if (!ds || !(element instanceof HTMLElement)) {
                    continue;
                }
                const square = this.board.square(ds.value);
                if (square.piece) {
                    if (square.piece.player.name.toLowerCase() === this.username) {
                        continue;
                    }
                }
                let moveCodes: string[];
                if (piece.moves().length !== 0) {
                    const moves: Attr = element.attributes["moves"];
                    if (!moves) {
                        continue;
                    }
                    moveCodes = moves.value.split(",");
                } else {
                    const attacks: Attr = element.attributes["attacks"];
                    if (!attacks) {
                        continue;
                    }
                    moveCodes = attacks.value.split(",");
                }
                if (moveCodes.length === 0) {
                    continue;
                }
                if (moveCodes.indexOf(dso.value) === -1) {
                    continue;
                }
                let attackCodes: string[] = [];
                const attacks: Attr = element.attributes["attacks"];
                if (attacks) {
                    attackCodes = attacks.value.split(",");
                }
                const index = attackCodes.indexOf(dso.value);
                if (index !== -1) {
                    attackCodes.splice(index, 1);
                }
                const friendly = this.isFriendlySquare(boardElement, attackCodes);
                const colour = this.getColour(element, friendly);
                element.style.backgroundColor = colour;
                this.addCodeToModifiedSquares(ds.value);
            }
        }
    }
    
    colouriseEnemySquares(row: HTMLCollection,
                          targetSquareElement: HTMLElement): void {
        let attacks: Attr = targetSquareElement.attributes["attacks"];
        if (!attacks) {
            return;
        }
        const codes = attacks.value.split(",");
        if (codes.length == 0) {
            return;
        }
        const dst: Attr = targetSquareElement.attributes["data-square"];
        if (!dst) {
            return;
        }
        const index = codes.indexOf(dst.value);
        if (index !== -1) {
            codes.splice(index, 1);
        }
        for (let i = 0; i < codes.length; i++) {
            searchLoop:
            for (let m = 0; m < 14; m++) {
                for (let n = 0; n < 14; n++) {
                    const element = row[m].children[n];
                    const ds: Attr = element.attributes["data-square"];
                    if (!ds || !(element instanceof HTMLElement)) {
                        continue;
                    }
                    if (ds.value !== codes[i]) {
                        continue;
                    }
                    const square = this.board.square(ds.value);
                    const piece = square.piece;
                    if (!piece) {
                        continue;
                    }
                    if (piece.player.name.toLowerCase() === this.username) {
                        continue;
                    }
                    const colour = this.getColour(element, false);
                    element.style.backgroundColor = colour;
                    this.addCodeToModifiedSquares(ds.value);
                    break searchLoop;
                }
            }
        }
    }

    colouriseSquaresWithHangingPieces(boardElement: HTMLElement): void {
        const row = boardElement.children;
        if (row.length < 14) {
            return;
        }
        let friends = 0;
        let enemies = 0;
        for (let m = 0; m < 14; m++) {
            for (let n = 0; n < 14; n++) {
                const element = row[m].children[n];
                const ds: Attr = element.attributes["data-square"];
                if (!ds || !(element instanceof HTMLElement)) {
                    continue;
                }
                const square = this.board.square(ds.value);
                const piece = square.piece;
                if (!piece) {
                    continue;
                }
                const attacks: Attr = element.attributes["attacks"];
                if (!attacks) {
                    continue;
                }
                const attackCodes = attacks.value.split(",");
                const hanging = this.doesSquareHaveHangingPiece(boardElement, piece.player, attackCodes);
                if (hanging) {
                    const colour = this.getColour(element, !hanging);
                    element.style.backgroundColor = colour;
                }
            }
        }
    }

    doesSquareHaveHangingPiece(boardElement: HTMLElement, player: Player, codes: string[]): boolean {
        const row = boardElement.children;
        if (row.length < 14) {
            return false;
        }
        for (let i = 0; i < codes.length; i++) {
            for (let m = 0; m < 14; m++) {
                for (let n = 0; n < 14; n++) {
                    const element = row[m].children[n];
                    const ds: Attr = element.attributes["data-square"];
                    if (!ds || !(element instanceof HTMLElement)) {
                        continue;
                    }
                    if (ds.value !== codes[i]) {
                        continue;
                    }
                    const square = this.board.square(ds.value);
                    const piece = square.piece;
                    if (!piece) {
                        continue;
                    }
                    if (piece.player.name === player.name) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    isFriendlySquare(boardElement: HTMLElement, codes: string[]): boolean {
        const row = boardElement.children;
        if (row.length < 14) {
            return false;
        }
        let friends = 0;
        let enemies = 0;
        for (let i = 0; i < codes.length; i++) {
            for (let m = 0; m < 14; m++) {
                for (let n = 0; n < 14; n++) {
                    const element = row[m].children[n];
                    const ds: Attr = element.attributes["data-square"];
                    if (!ds || !(element instanceof HTMLElement)) {
                        continue;
                    }
                    if (ds.value !== codes[i]) {
                        continue;
                    }
                    const square = this.board.square(ds.value);
                    const piece = square.piece;
                    if (!piece) {
                        continue;
                    }
                    if (piece.player.name.toLowerCase() === this.username) {
                        friends++;
                    } else {
                        enemies++;
                    }
                }
            }
        }
        if (friends === 0 && enemies === 0) {
            return true;
        }
        return friends > enemies;
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
            if (!(element instanceof HTMLAnchorElement)) {
                continue;
            }
            if (element.href.indexOf(username) === -1) {
                continue;
            }
            const parent = element.parentElement;
            for (let j = 0; j < parent.classList.length; j++) {
                for (let k = 0; k < this.colours.length; k++) {
                    if (this.colours[k] !== parent.classList[j]) {
                        continue;
                    }
                    return this.colours[k];
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

    getPieceElement(elements: HTMLCollection): HTMLElement {
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            if (element instanceof HTMLElement &&
                element.className.indexOf("piece-") === 0) {
                return element;
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
