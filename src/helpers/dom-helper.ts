export class DomHelper {
    getSquareCode(target: EventTarget): string {
        const element = this.getSquareElement(target);
        if (element) {
            const ds = element.attributes["data-square"];
            if (ds) {
                return ds.value;
            }
        }
        return undefined;
    }

    getSquareElement(target: EventTarget): Element {
        return target instanceof Element
            ? this.getSquareElementRecursive(target)
            : undefined;
    }

    getSquareElementRecursive(element: Element): Element {
        return [].slice
            .call(element.classList)
            .every(e => e.indexOf("square-") === -1)
                ? element.parentElement
                    ? this.getSquareElementRecursive(element.parentElement)
                    : undefined
                : element;
    }

    getOriginSquareCode(): string {
        const element = document.getElementById("four-player-username");
        const origin = element.attributes["origin"];
        if (origin) {
            return origin.value;
        }
        return undefined;
    }
    
    setOriginSquare(target: EventTarget): string {
        const originSquareElement = this.getSquareElement(event.target);
        if (originSquareElement) {
            const ds = originSquareElement.attributes["data-square"];
            if (ds) {
                const element = document.getElementById("four-player-username");
                const origin = element.attributes["origin"];
                if (origin) {
                    origin.value = ds.value;
                } else {
                    element.setAttribute("origin", ds.value);
                }
                return ds.value;
            }
        }
        return undefined;
    }

    resetOriginSquare(): void {
        const element = document.getElementById("four-player-username");
        if (element.attributes["origin"]) {
            element.removeAttribute("origin");
        }
    }
}
