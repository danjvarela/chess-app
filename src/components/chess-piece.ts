import { bindable } from "aurelia";
import {
  BISHOP,
  BLACK,
  KING,
  KNIGHT,
  PAWN,
  Piece,
  QUEEN,
  ROOK,
  WHITE,
} from "chess.js";
import blackBishop from "@/assets/pieces/black-bishop.svg";
import blackKing from "@/assets/pieces/black-king.svg";
import blackKnight from "@/assets/pieces/black-knight.svg";
import blackPawn from "@/assets/pieces/black-pawn.svg";
import blackQueen from "@/assets/pieces/black-queen.svg";
import blackRook from "@/assets/pieces/black-rook.svg";
import whiteBishop from "@/assets/pieces/white-bishop.svg";
import whiteKing from "@/assets/pieces/white-king.svg";
import whiteKnight from "@/assets/pieces/white-knight.svg";
import whitePawn from "@/assets/pieces/white-pawn.svg";
import whiteQueen from "@/assets/pieces/white-queen.svg";
import whiteRook from "@/assets/pieces/white-rook.svg";

export class ChessPiece {
  @bindable piece: Piece;

  get pieceSrc() {
    if (!this.piece) return;

    return {
      [BLACK]: {
        [PAWN]: blackPawn,
        [KNIGHT]: blackKnight,
        [BISHOP]: blackBishop,
        [ROOK]: blackRook,
        [QUEEN]: blackQueen,
        [KING]: blackKing,
      },
      [WHITE]: {
        [PAWN]: whitePawn,
        [KNIGHT]: whiteKnight,
        [BISHOP]: whiteBishop,
        [ROOK]: whiteRook,
        [QUEEN]: whiteQueen,
        [KING]: whiteKing,
      },
    }[this.piece.color][this.piece.type];
  }
}
