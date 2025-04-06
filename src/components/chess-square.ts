import { IChessService } from "@/services/chess-service";
import { bindable, resolve } from "aurelia";
import { Square } from "chess.js";

export type SquareColor = "light" | "dark";

export class ChessSquare {
  @bindable id: Square;
  chessService: IChessService = resolve(IChessService);

  get color(): SquareColor {
    // prettier-ignore
    const evenRowColors: Array<SquareColor> = [ "light", "dark", "light", "dark", "light", "dark", "light", "dark" ];
    // prettier-ignore
    const oddRowColors: Array<SquareColor> = [ "dark", "light", "dark", "light", "dark", "light", "dark", "light" ];
    // prettier-ignore
    const colIndex = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8 }[this.id[0]];

    const rowIndex = parseInt(this.id[1]);

    return rowIndex % 2 === 0
      ? evenRowColors[colIndex - 1]
      : oddRowColors[colIndex - 1];
  }

  get piece() {
    return this.chessService.get(this.id);
  }
}
