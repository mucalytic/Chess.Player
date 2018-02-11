class Watcher {
    observer: MutationObserver;
    changes: { mutation: MutationRecord, datetime: string }[] = [];

    dd(num: number): string {
        return ("0" + num).slice(-2);
    }

    date(dt: Date): string {
        return `${dt.getFullYear()}-${this.dd(dt.getMonth())}-${this.dd(dt.getDate())}`;
    }

    time(dt: Date): string {
        return `${this.dd(dt.getHours())}:${this.dd(dt.getMinutes())}:${this.dd(dt.getSeconds())}`;
    }

    start(): Watcher {
        this.observer.observe(document.getElementById("board"), {
            characterDataOldValue: true,
            attributeOldValue: true,
            characterData: true,
            attributes: true,
            childList: true,
            subtree: true
        });
        return this;
    }

    constructor() {
        this.observer = new MutationObserver(mutations => {
            mutations.forEach(m => {
                const d = new Date();
                const dt = `${this.date(d)} ${this.time(d)}`;
                this.changes.push({ mutation: m, datetime: dt });
            });
        });
    }
}

var watcher = new Watcher().start();
