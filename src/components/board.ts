import { IChessService } from "@/services/chess-service";
import { CustomElement, customElement, resolve, watch } from "aurelia";
import { Square, SQUARES, Piece } from "chess.js";
import { ICustomElementController } from "@aurelia/runtime-html";
import { Square as SquareController } from "./square";

type PieceDetails = Piece & { square: Square };

@customElement("chess-board")
export class Board {
  squares: Square[] = SQUARES;
  pickedUpPiece: (PieceDetails & { element: HTMLElement }) | null = null;
  piecesOnBoard: PieceDetails[] = [];
  possibleSquares: Square[] = [];
  recentMoveSquares: [Square, Square] | null = null;

  constructor() {
    this.updatePiecesOnBoard();
  }

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

  updatePiecesOnBoard() {
    this.piecesOnBoard = this.chessService
      .board()
      .flatMap((item) => item)
      .filter((item) => item);
  }

  protected onpickup(e: CustomEvent, pieceDetails: Piece & { square: Square }) {
    this.pickedUpPiece = { ...pieceDetails, element: e.target as HTMLElement };

    const moves = this.chessService.moves({
      square: this.pickedUpPiece.square,
      verbose: true,
    });

    this.possibleSquares = moves.map((move) => move.to);
    this.recentMoveSquares = null;
  }

  protected ondrop(e: CustomEvent, pieceDetails: Piece & { square: Square }) {
    const dropzoneSquareController = CustomElement.for(e.detail.dropzone, {
      optional: true,
    }) as ICustomElementController<SquareController> | null;

    if (!dropzoneSquareController) return;

    const to = dropzoneSquareController.viewModel.square;

    const executedMove = this.chessService.move({
      from: pieceDetails.square,
      to,
    });

    if (!executedMove) return;

    this.updatePiecesOnBoard();
    this.possibleSquares = [];
    this.recentMoveSquares = [pieceDetails.square, to];
  }
}
