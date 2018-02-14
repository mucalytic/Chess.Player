var GameOverTest = (function () {
    function GameOverTest() {
    }
    GameOverTest.prototype.child = function (node) {
        if (node.childNodes.length === 1) {
            if (node instanceof HTMLElement &&
                node.classList.contains("game-over-container")) {
                return [node, true];
            }
            return [node, false];
        }
        return undefined;
    };
    GameOverTest.prototype.start = function () {
        var _this = this;
        Rx.Observable.fromArray(watcher.records)
            .filter(function (mr) { return mr.type === "childList" &&
            mr.target instanceof HTMLDivElement &&
            mr.target.classList.length === 0 &&
            mr.addedNodes.length === 1 &&
            mr.addedNodes[0] instanceof HTMLElement &&
            mr.addedNodes[0].classList.contains("modal-container"); })
            .map(function (mr) { return mr.addedNodes[0]; })
            .forEach(function (mc) {
            var res = _this.child(mc);
            while (res && !res[1]) {
                res = _this.child(mc);
            }
            if (res) {
                console.log("%O", res);
            }
        });
    };
    return GameOverTest;
}());
new GameOverTest().start();
