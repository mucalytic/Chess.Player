Rx.Observable.fromArray(watcher.records)
    .filter(mr => mr.type === "childList" &&
                  mr.target.className.indexOf("board-") === 0)
    .map(mr => mr.addedNodes)
    .forEach(row => {
        console.group();
         for (let i = 0; i < row.length; i++) {
             const line: string[] = [];
             const sqs = row[i].childNodes;
             for (let j = 0; j < sqs.length; j++) {
                 if (sqs[j].className.indexOf("clearfix") !== 0) {
                     let pc = "[]";
                     const pcs = sqs[j].childNodes;
                     for (let k = 0; k < pcs.length; k++) {
                         if (pcs[k].className.indexOf("piece-") === 0) {
                             pc = pcs[k].dataset["piece"];
                         }
                     }
                     line.push(pc);
                 }
             }
             console.log("[ %s ]", line.join(" "));
        }
        console.groupEnd();
    });
