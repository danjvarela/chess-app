import { customElement, bindable } from "aurelia";
import {
  BISHOP,
  BLACK,
  KING,
  KNIGHT,
  PAWN,
  Piece as ChessJsPiece,
  QUEEN,
  ROOK,
  WHITE,
} from "chess.js";

import blackBishop from "@/assets/pieces/black-bishop.png";
import blackKing from "@/assets/pieces/black-king.png";
import blackKnight from "@/assets/pieces/black-knight.png";
import blackPawn from "@/assets/pieces/black-pawn.png";
import blackQueen from "@/assets/pieces/black-queen.png";
import blackRook from "@/assets/pieces/black-rook.png";
import whiteBishop from "@/assets/pieces/white-bishop.png";
import whiteKing from "@/assets/pieces/white-king.png";
import whiteKnight from "@/assets/pieces/white-knight.png";
import whitePawn from "@/assets/pieces/white-pawn.png";
import whiteQueen from "@/assets/pieces/white-queen.png";
import whiteRook from "@/assets/pieces/white-rook.png";

@customElement("chess-piece")
export class Piece {
  @bindable piece: ChessJsPiece;

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
