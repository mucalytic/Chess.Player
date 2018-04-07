import {ColourHelper} from "./helpers/colour-helper"
import {Dead} from "./player/dead"
import {Square} from "./square"

export class Board {
    origin: Square;
    target: Square;
    squares: Square[];
    colourHelper = new ColourHelper();

    createSquares(): void {
        this.squares = [].slice
            .call([].slice
                .call(document.body.getElementsByTagName("div"))
                .filter(e => e.className.indexOf("board-") === 0)[0].children)
            .reduce((es, a) => {
                [].slice
                    .call(a.children)
                    .filter(e => e.className.indexOf("square-") === 0)
                    .forEach(e => es.push(e));
                return es;
            }, [])
            .map(e => new Square(this, e))
            .filter(s => s.valid);
    }

    cleanColouredSquares(): void {
        this.squares
            .map(s => s.element)
            .filter(e => 
                [].slice
                    .call(e.classList)
                    .some(c => c.indexOf("cp-mod") !== -1))
            .forEach(e => {
                e.style.backgroundColor = null;
                e.classList.remove("cp-mod");
            });
    }

    setCandidateSquares(code?: string): void {
        this.squares
            .filter(s => s.hasPiece())
            .filter(s => !s.piece.isDead())
            .map(s => s.piece)
            .forEach(p => p.createCandidates(code));
    }

    colouriseSquaresWithHangingPieces(): Board {
        const squares = this.squares
            .filter(s => s.hasPiece())
            .filter(s => s.isHanging())
            .filter(s => !s.isEnclosed())
            .filter(s => !s.piece.isDead());
        squares
            .filter(s => !s.piece.player.isPlaying())
            .forEach(s => {
                s.element.classList.add("cp-mod");
                s.element.style.backgroundColor =
                    this.colourHelper.getColour(s.element, true);
            });
        squares
            .filter(s => s.piece.player.isPlaying())
            .forEach(s => {
                s.element.classList.add("cp-mod");
                s.element.style.backgroundColor =
                    this.colourHelper.getColour(s.element, false);
            });
        return this;
    }

    constructor(code?: string) {
        this.createSquares();
        this.cleanColouredSquares();
        this.setCandidateSquares(code);
    }
}
