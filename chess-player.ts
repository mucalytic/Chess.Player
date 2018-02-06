class CountdownHelper {
    private readonly clock: HTMLElement;

    start() {
        this.clock.addEventListener("DOMSubtreeModified", () => this.utter());
    }

    stop() {
        this.clock.removeEventListener("DOMSubtreeModified", () => this.utter());
    }

    utter() {
        const html = this.clock.innerHTML;
        const hs = html.split(":").map(s => parseFloat(s));
        if (hs[0] !== 1 && hs[1] % 5 === 0) {
            const utterance = new SpeechSynthesisUtterance(hs[1] + " seconds left");
            utterance.rate = 1.8;
            window.speechSynthesis.speak(utterance);
        }
        console.log(JSON.parse(JSON.stringify(hs)));
    }

    constructor() {
        const elem = document.getElementsByClassName("clock")[0];
        if (elem instanceof HTMLElement) {
            this.clock = elem;
        }
    }
}

class DomModifier {
    private readonly countdownHelper: CountdownHelper;

    addStartAiButton() {
        const btnNg = document.getElementsByClassName("btns-container")[0];
        if (btnNg instanceof HTMLElement) {
            btnNg.style.cssFloat = "right";

            const btnAi = btnNg.cloneNode(true);
            if (btnAi instanceof HTMLElement) {
                btnAi.style.cssFloat = "left";
                btnAi.style.marginRight = "12px";

                const anchor = btnAi.firstChild;
                if (anchor.nodeName === "A") {
                    if (anchor instanceof HTMLElement) {
                        anchor.innerText = "Start AI";
                        anchor.classList.remove("new-game-btn");
                        anchor.addEventListener("click", () => this.countdownHelper.start());
                    }
                }
                btnNg.parentNode.appendChild(btnAi);
            }
        }
        return this;
    }

    rightAlignStartButton() {
        let head = document.getElementsByTagName("head")[0];
        if (head instanceof HTMLElement) {
            let style = document.createElement("style");
            if (style instanceof HTMLElement) {
                style.type = "text/css";
                style.appendChild(document.createTextNode(".btns-container { float: right; }"));
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
