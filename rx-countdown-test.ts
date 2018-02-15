/// <reference path="./node_modules/rx/ts/rx.d.ts" />

class CountdownHelper {
    counter: number = 60;
    utterances: number[] = [60];

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

class DomManipulator {
    src: string = "https://rawgit.com/Reactive-Extensions/RxJS/master/dist/rx.all.min.js";

    addScriptTags(src: string): void {
        const scripts: NodeListOf<HTMLScriptElement> = document.getElementsByTagName("script");
        for (let i = 0; i < scripts.length; i++) {
            if (scripts[i].src === src) {
                return;
            }
        }
        const script = document.createElement("script");
        document.body.appendChild(script);
        script.src = src;
    }

    constructor() {
        this.addScriptTags(this.src);
    }
}

class DomWatcher {
    observer: MutationObserver;
    subscription: Rx.IDisposable;
    records: MutationRecord[] = [];
    countdown = new CountdownHelper();
    subject: Rx.Subject<MutationRecord>;
    init: MutationObserverInit = {
        characterDataOldValue: true,
        attributeOldValue: true,
        characterData: true,
        attributes: true,
        childList: true,
        subtree: true
    };

    createDocumentBodyObserverSubscription(): void {
        this.subject = new Rx.Subject<MutationRecord>();
        this.observer = new MutationObserver(mrs => {
            mrs.forEach(mr => this.subject.onNext(mr));
        });
        this.subscription = this.subject
            .subscribe(
                mr => {
                    this.records.push(mr);
                    this.countdown.reset(mr);
                    this.countdown.utter(mr);
                },
                ex => {
                    console.log("Rx: Exception: %o", ex);
                    this.observer.disconnect();
                },
                () => {
                    console.log("Rx: Completed");
                    this.observer.disconnect();
                });
    }

    constructor() {
        this.createDocumentBodyObserverSubscription();
        this.observer.observe(document.body, this.init);
    }
}

var manipulator = new DomManipulator();

//This code works with http://example.com/
//var watcher = new DomWatcher();
