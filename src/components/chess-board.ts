import { Square, SQUARES } from "chess.js";

export class ChessBoard {
  squares: Square[] = SQUARES;

  bound() {
    console.log("xxx squares", this.squares);
  }
}
