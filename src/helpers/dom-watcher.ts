import {CountdownHelper} from "./countdown-helper"
import { AnalysisHelper } from "./analysis-helper";

export class DomWatcher {
    observer: MutationObserver;
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
                this.checkForBoardUpdate(mr);
                this.countdown.reset(mr);
                this.countdown.utter(mr);
            });
        });
    }

    checkForBoardUpdate(mr: MutationRecord): void {
        (<any>document).records.push(mr);
        if (mr.type === "childList" &&
            mr.target instanceof HTMLElement &&
            mr.target.className.indexOf("board-") === 0) {
            new AnalysisHelper().showHangingPieces();
        }
    }

    constructor() {
        (<any>document).records = [];
        this.createDocumentBodyObserverSubscription();
        this.observer.observe(document.body, this.init);
    }
}
