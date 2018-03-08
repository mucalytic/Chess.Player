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
        (<any>document).records = [];
        this.observer = new MutationObserver(mrs => {
            mrs.forEach(mr => {
                (<any>document).records.push(mr);
                this.countdown.reset(mr);
                this.countdown.utter(mr);
            });
        });
    }

    checkForBoardUpdate(mr: MutationRecord): void {
        if (mr.type === "childList" &&
            mr.target instanceof HTMLElement &&
            mr.target.className.indexOf("board-") === 0) {
            new AnalysisHelper().showHangingPieces();
        }
    }

    constructor() {
        this.createDocumentBodyObserverSubscription();
        this.observer.observe(document.body, this.init);
    }
}
