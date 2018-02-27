export class CountdownHelper {
    counter: number = 60;
    enabled: boolean = false;
    utterances: number[] = [60];

    username(): string {
        return document.getElementById("four-player-username").innerText;
    }

    avatar(nodes: HTMLCollection): Node {
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
                    this.utterances = [60];
                    this.counter = 60;
                }
            }
        }
    }

    words(): string {
        return this.counter <= 5
            ? this.counter.toString()
            : `${this.counter} seconds left`;
    }

    utterance(): SpeechSynthesisUtterance {
        return this.rate(new SpeechSynthesisUtterance(this.words()));
    }

    rate(utterance: SpeechSynthesisUtterance): SpeechSynthesisUtterance {
        utterance.rate = 1.8;
        return utterance;
    }

    utter(mr: MutationRecord): void {
        if (this.enabled) {
            if (mr.type === "characterData") {
                const timer = mr.target.parentNode.parentNode;
                if (timer) {
                    if (timer instanceof HTMLElement &&
                        timer.classList.contains("player-clock-timer")) {
                        const avatar = this.avatar(timer.children);
                        if (avatar) {
                            if (avatar instanceof HTMLAnchorElement) {
                                if (avatar.pathname === "/member/" + this.username()) {
                                    const c = this.current(mr);
                                    if (this.counter - c > 0 &&
                                        this.counter - c <= 1) {
                                        this.counter = c;
                                    }
                                    if (((this.counter <= 5 &&
                                          this.counter % 1 === 0) ||
                                         (this.counter > 5 &&
                                          this.counter % 5 === 0)) &&
                                          this.counter !== this.utterances[0]) {
                                        window.speechSynthesis.speak(this.utterance());
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
}
