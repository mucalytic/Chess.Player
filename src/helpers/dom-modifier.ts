import {DomWatcher} from "./dom-watcher"
import {DomHelper} from "./dom-helper"
import {Board} from "../board"

export class DomModifier {
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

    over(event: Event): void {
        const board = new Board();
        board.colouriseSquaresWithHangingPieces();
        const helper = new DomHelper();
        const originCode = helper.getOriginSquareCode();
        if (originCode) {
            const squares = board.squares.filter(s => s.code === originCode);
            if (squares.length === 1 && squares[0].hasPiece()) {
                squares[0].piece.colouriseCandidates();
            }
            const squareCode = helper.getSquareCode(event.target);
            if (squareCode && squareCode !== originCode) {
                board.squares
                    .filter(s => s.code === squareCode)
                    .filter(s => s.hasPiece())
                    .filter(s => s.candidates.attacks.length > 0)
                    .forEach(s => s.colouriseAttackerSquares());
            }
        }
    }

    down(event: Event) {
        let board: Board;
        const code = new DomHelper().setOriginSquare(event.target);
        if (code) {
            board = new Board(code);
            board.squares
                .filter(s => s.code === code)
                .filter(s => s.hasPiece())
                .filter(s => s.piece.player.isPlaying())
                .forEach(s => s.piece.colouriseCandidates());
        } else {
            board = new Board();
        }
        board.colouriseSquaresWithHangingPieces();
    }

    up(event: Event) {
        new DomHelper().resetOriginSquare();
        new Board().colouriseSquaresWithHangingPieces();
    }

    constructor() {
        document.body.addEventListener("mouseover", this.over);
        document.body.addEventListener("mousedown", this.down);
        document.body.addEventListener("mouseup", this.up);

        this.domWatcher = new DomWatcher();
        this.rightAlignStartButton();
        this.addStartAiButton();
    }
}
