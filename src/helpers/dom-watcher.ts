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
            new AnalysisHelper().showHangingPieces();
            mrs.forEach(mr => {
                this.countdown.reset(mr);
                this.countdown.utter(mr);
            });
        });
    }

    constructor() {
        this.createDocumentBodyObserverSubscription();
        this.observer.observe(document.body, this.init);
    }
}
