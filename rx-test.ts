/// <reference path="./node_modules/rx/ts/rx.d.ts" />

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
        this.subject = new Rx.Subject();
        this.observer = new MutationObserver(mrs => {
            mrs.forEach(mr => this.subject.onNext(mr));
        });
        this.subscription = this.subject
            .subscribe(
                mr => this.records.push(mr),
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
