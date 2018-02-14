/// <reference path="./node_modules/rx/ts/rx.d.ts" />

class GameOverTest {
    child(node: Node): [Node, boolean] {
        if (node.childNodes.length === 1) {
            if (node instanceof HTMLElement &&
                node.classList.contains("game-over-container")) {
                return [node, true];
            }
            return [node, false];
        }
        return undefined;
    }

    start(): void {
        Rx.Observable.fromArray(watcher.records)
            .filter(mr => mr.type === "childList" &&
                          mr.target instanceof HTMLDivElement &&
                          mr.target.classList.length === 0 &&
                          mr.addedNodes.length === 1 &&
                          mr.addedNodes[0] instanceof HTMLElement &&
                          mr.addedNodes[0].classList.contains("modal-container"))
            .map(mr => mr.addedNodes[0])
            .forEach(mc => {
                let res = this.child(mc);
                while (res && !res[1]) {
                    res = this.child(mc);
                }
                if (res) {
                    console.log("%O", res);
                }
            });
    }
}

new GameOverTest().start();
