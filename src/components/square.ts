import { customElement, bindable } from "aurelia";
import { Square as ChessJsSquare } from "chess.js";

type SquareType = "light" | "dark";

@customElement("chess-square")
export class Square {
  @bindable square: ChessJsSquare;

  get type(): SquareType {
    // prettier-ignore
    const evenRowColors: Array<SquareType> = [ "light", "dark", "light", "dark", "light", "dark", "light", "dark" ];
    // prettier-ignore
    const oddRowColors: Array<SquareType> = [ "dark", "light", "dark", "light", "dark", "light", "dark", "light" ];
    // prettier-ignore
    const colIndex = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8 }[this.square[0]];

    const rowIndex = parseInt(this.square[1]);

    return rowIndex % 2 === 0
      ? evenRowColors[colIndex - 1]
      : oddRowColors[colIndex - 1];
  }

  protected get background() {
    return this.type === "light"
      ? "var(--ca-color-teal-100)"
      : "var(--ca-color-teal-500)";
  }
}
