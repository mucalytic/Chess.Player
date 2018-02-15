/// <reference path="./node_modules/rx/ts/rx.d.ts" />

class CountdownHelper {
    utterances: number[];
    enabled: boolean;
    counter: number;

    enable(): void {
        this.enabled = true;
    }

    disable(): void {
        this.enabled = false;
    }

    username(): string {
        return document.getElementById("four-player-username").innerText;
    }

    avatar(nodes: NodeList): Node {
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
                    console.log("Reset happened");
                    this.utterances = [60];
                    this.counter = 60;
                }
            }
        }
    }

    utter(mr: MutationRecord): void {
        if (this.enabled) {
            if (mr.type === "characterData") {
                const timer = mr.target.parentNode.parentNode;
                if (timer) {
                    if (timer instanceof HTMLElement &&
                        timer.classList.contains("player-clock-timer")) {
                        const avatar = this.avatar(timer.childNodes);
                        if (avatar) {
                            if (avatar instanceof HTMLAnchorElement) {
                                if (avatar.pathname === "/member/" + this.username()) {
                                    const c = this.current(mr);
                                    if (this.counter - c > 0 &&
                                        this.counter - c <= 1) {
                                        this.counter = c;
                                    }
                                    if (this.counter % 5 === 0 &&
                                        this.counter !== this.utterances[0]) {
                                        const words = this.counter + " seconds left";
                                        const utterance = new SpeechSynthesisUtterance(words);
                                        utterance.rate = 1.8;
                                        window.speechSynthesis.speak(utterance);
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

    constructor() {
        this.counter = 60;
        this.enabled = false;
        this.utterances = [60];
    }
}

class DomWatcher {
    observer: MutationObserver;
    records: MutationRecord[] = [];
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
                this.records.push(mr);
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
    countdownHelper: CountdownHelper;

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
                                this.countdownHelper.enable();
                                btnOn.style.display = "block";
                                btnOff.style.display = "none";
                            });
                        }
                    }

                    anchorOn.addEventListener("click", () => {
                        this.countdownHelper.disable();
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

    constructor() {
        this.countdownHelper = new CountdownHelper();
        this.domWatcher = new DomWatcher();
        this.rightAlignStartButton();
        this.addStartAiButton();
    }
}

var modifier = new DomModifier();