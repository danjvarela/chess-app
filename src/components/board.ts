import { IChessService } from "@/services/chess-service";
import { customElement, resolve } from "aurelia";
import { Square, SQUARES } from "chess.js";

@customElement("chess-board")
export class Board {
  squares: Square[] = SQUARES;

  private chessService: IChessService = resolve(IChessService);

  protected boardRef: HTMLElement;

  get pieces() {
    return this.chessService
      .board()
      .flatMap((item) => item)
      .filter((item) => item);
  }

  get pieceStyle() {
    return  {} 
  }
}
