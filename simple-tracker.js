var DomManipulator = (function () {
    function DomManipulator() {
        this.src = "https://rawgit.com/Reactive-Extensions/RxJS/master/dist/rx.all.min.js";
        this.addScriptTags(this.src);
    }
    DomManipulator.prototype.addScriptTags = function (src) {
        var scripts = document.getElementsByTagName("script");
        for (var i = 0; i < scripts.length; i++) {
            if (scripts[i].src === src) {
                return;
            }
        }
        var script = document.createElement("script");
        document.body.appendChild(script);
        script.src = src;
    };
    return DomManipulator;
}());
var DomWatcher = (function () {
    function DomWatcher() {
        this.records = [];
        this.init = {
            characterDataOldValue: true,
            attributeOldValue: true,
            characterData: true,
            attributes: true,
            childList: true,
            subtree: true
        };
        this.createDocumentBodyObserverSubscription();
        this.observer.observe(document.body, this.init);
    }
    DomWatcher.prototype.createDocumentBodyObserverSubscription = function () {
        var _this = this;
        this.subject = new Rx.Subject();
        this.observer = new MutationObserver(function (mrs) {
            mrs.forEach(function (mr) { return _this.subject.onNext(mr); });
        });
        this.subscription = this.subject
            .subscribe(function (mr) { return _this.records.push(mr); }, function (ex) {
            console.log("Rx: Exception: %o", ex);
            _this.observer.disconnect();
        }, function () {
            console.log("Rx: Completed");
            _this.observer.disconnect();
        });
    };
    return DomWatcher;
}());
var manipulator = new DomManipulator();
