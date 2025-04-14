import { IChessService } from "@/services/chess-service";
import { customElement, bindable, resolve } from "aurelia";
import { Square as ChessJsSquare } from "chess.js";

@customElement("chess-square")
export class Square {
  @bindable square: ChessJsSquare;

  private chessService = resolve(IChessService);

  protected get isAtTheLeftEdge() {
    return this.square[0] === "a";
  }

  protected get isAtTheBottomEdge() {
    return this.square[1] === "1";
  }

  protected get labelTextColor() {
    return this.chessService.squareColor(this.square) === "light"
      ? "var(--ca-color-teal-800)"
      : "var(--ca-color-teal-50)";
  }

  protected get background() {
    return this.chessService.squareColor(this.square) === "light"
      ? "var(--ca-color-teal-100)"
      : "var(--ca-color-teal-500)";
  }
}
