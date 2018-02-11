class CountdownHelper {
    private readonly countdown: MutationObserver;
    private readonly gameover: MutationObserver;

    options: MutationObserverInit = {
        characterData: true,
        attributes: true,
        childList: true,
        subtree: true
    };

    utterances: number[];
    counter: number;

    start(): void {
        this.reset();
        this.countdown.observe(document.getElementsByClassName("clock")[0], this.options);
        this.gameover.observe(document.getElementsByClassName("game-over-container")[0], this.options);
        console.log("countdown observer started");
    }

    stop(): void {
        this.countdown.disconnect();
        console.log("countdown observer stopped");
    }

    reset(): void {
        this.counter = 60;
        this.utterances = [60];
        console.log("counters reset");
    }

    constructor() {
        this.countdown = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                const c = parseFloat(mutation.target.textContent.trim().split(":")[1]);
                if (this.counter - c > 0 && this.counter - c <= 1) {
                    this.counter = c;
                }
                if (this.counter % 5 === 0 && this.counter !== this.utterances[0]) {
                    const words = this.counter + " seconds left";
                    const utterance = new SpeechSynthesisUtterance(words);
                    utterance.rate = 1.8;
                    window.speechSynthesis.speak(utterance);
                    this.utterances.unshift(this.counter);
                }
            });
        });
        this.gameover = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                console.log(mutation);
                this.reset();
            });
        });
    }
}

class DomModifier {
    private readonly countdownHelper: CountdownHelper;

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

    public rightAlignStartButton(): DomModifier {
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

    constructor() {
        this.countdownHelper = new CountdownHelper();
    }
}

new DomModifier()
    .rightAlignStartButton()
    .addStartAiButton();
