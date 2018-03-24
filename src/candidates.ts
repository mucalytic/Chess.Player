import {Square} from "./square"
import {Piece} from "./piece"

export interface SquareCandidates {
    attacks: Piece[],
    moves: Piece[]
}

export interface PieceCandidates {
    attacks: Square[],
    moves: Square[]
}