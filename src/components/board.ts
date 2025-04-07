import { IChessService } from "@/services/chess-service";
import { customElement, resolve } from "aurelia";
import { Square, SQUARES } from "chess.js";

@customElement("chess-board")
export class Board {
  squares: Square[] = SQUARES;

  private chessService: IChessService = resolve(IChessService);

  protected boardRef: HTMLElement;

  protected pieceStyle(square: Square) {
    // prettier-ignore
    const colIndex = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8 }[square[0]];
    const rowIndex = parseInt(square[1]);

    const leftInPercentage = (colIndex - 1) * (1 / 8) * 100;
    const topInPercentage = (8 - rowIndex) * (1 / 8) * 100;

    return {
      top: `${topInPercentage}%`,
      left: `${leftInPercentage}%`,
    };
  }

  get pieces() {
    return this.chessService
      .board()
      .flatMap((item) => item)
      .filter((item) => item);
  }
}
