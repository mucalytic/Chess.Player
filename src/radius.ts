export class Radius implements IterableIterator<number> {
    counter: number;
    max?: number;

    [Symbol.iterator]() {
        return this;
    }

    next(): IteratorResult<number> {
        if (!this.max || this.counter < this.max) {
            this.counter++;
            return {
                value: this.counter,
                done: false
            };
        } else {
            this.counter = 0;
            return {
                value: undefined,
                done: true
            };
        }
    }

    return(): IteratorResult<number> {
        this.counter = 0;
        return {
            value: undefined,
            done: true
        };
    }

    constructor(max?: number) {
        this.counter = 0;
        this.max = max;
    }
}
