import {AnalysisHelper} from "./analysis-helper"
import {DomWatcher} from "./dom-watcher"

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
        const helper = new AnalysisHelper();
        helper.showMovesAndEnemies(event.target);
        helper.showHangingPieces(event.target);
    }

    down(event: Event) {
        const helper = new AnalysisHelper();
        helper.setOriginSquare(event.target);
        helper.showMovesAndEnemies(event.target);
    }

    up(event: Event) {
        const helper = new AnalysisHelper();
        helper.resetOriginSquareAndCleanSquares();
        helper.showHangingPieces(event.target);
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
