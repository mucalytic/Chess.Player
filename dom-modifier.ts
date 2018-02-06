import { CountdownHelper } from "./chess-player";

export class DomModifier {
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
    }

    constructor() {
        this.countdownHelper = new CountdownHelper();
    }
}
