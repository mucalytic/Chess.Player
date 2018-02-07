class CountdownHelper {
    private readonly clock: HTMLElement;

    public start(): void {
        this.clock.addEventListener("DOMSubtreeModified", this.utter);
    }

    public stop(): void {
        this.clock.removeEventListener("DOMSubtreeModified", this.utter);
    }

    private utter(): void {
        const clock = CountdownHelper.getClock();
        const hs = clock.innerHTML.split(":").map(s => parseFloat(s));
        if (hs[0] !== 1 && hs[1] % 5 === 0) {
            const utterance = new SpeechSynthesisUtterance(hs[1] + " seconds left");
            utterance.rate = 1.8;
            window.speechSynthesis.speak(utterance);
        }
        console.log(JSON.stringify(hs));
    }

    static getClock(): HTMLElement {
        const clock = document.getElementsByClassName("clock")[0];
        if (clock instanceof HTMLElement) {
            return clock;
        }
    }

    constructor() {
        this.clock = CountdownHelper.getClock();
    }
}

class DomModifier {
    private readonly countdownHelper: CountdownHelper;

    public addStartAiButton() : DomModifier {
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
                                btnOn.style.display = "block";
                                btnOff.style.display = "none";
                                this.countdownHelper.stop();
                            });
                        }
                    }

                    anchorOn.addEventListener("click", () => {
                        btnOff.style.display = "block";
                        btnOn.style.display = "none";
                        this.countdownHelper.start();
                    });
                }

                btnNewGame.parentNode.appendChild(btnOn);
                btnNewGame.parentNode.appendChild(btnOff);
            }
        }
        return this;
    }

    public rightAlignStartButton() : DomModifier {
        let head = document.getElementsByTagName("head")[0];
        if (head instanceof HTMLElement) {
            let text = document.createTextNode(".btns-container { float: right; }")
            let style = document.createElement("style");
            if (style instanceof HTMLElement) {
                style.type = "text/css";
                style.appendChild(text);
            }
            head.appendChild(style);
        }
        return this;
    }

    constructor() {
        this.countdownHelper = new CountdownHelper();
    }
}

new DomModifier()
    .rightAlignStartButton()
    .addStartAiButton();
