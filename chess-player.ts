export class CountdownHelper {
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
