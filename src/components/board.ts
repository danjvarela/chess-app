import { IChessService } from "@/services/chess-service";
import { customElement, resolve } from "aurelia";
import { Square, SQUARES, Piece } from "chess.js";

type PieceDetails = Piece & { square: Square };

@customElement("chess-board")
export class Board {
  squares: Square[] = SQUARES;
  pickedUpPiece: (PieceDetails & { element: HTMLElement }) | null = null;

  private chessService: IChessService = resolve(IChessService);

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

  protected onpickup(e: CustomEvent, pieceDetails: Piece & { square: Square }) {
    this.pickedUpPiece = { ...pieceDetails, element: e.target as HTMLElement };
  }

  protected get possibleSquares() {
    if (!this.pickedUpPiece) return [];
    return this.chessService.moves({ square: this.pickedUpPiece.square });
  }
}
