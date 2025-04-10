import { IChessService } from "@/services/chess-service";
import { CustomElement, customElement, resolve } from "aurelia";
import { Square, SQUARES, Piece, Move } from "chess.js";
import { ICustomElementController } from "@aurelia/runtime-html";
import { Square as SquareController } from "./square";
import template from "./board.html";
import { Piece as PieceController } from "./piece";
import { PromotionPieceSelector } from "./promotion-piece-selector";

type PieceDetails = Piece & { square: Square };

@customElement({
  name: "chess-board",
  template,
  dependencies: [SquareController, PieceController, PromotionPieceSelector],
})
export class Board {
  squares: Square[] = SQUARES;
  pickedUpPiece: (PieceDetails & { element: HTMLElement }) | null = null;
  piecesOnBoard: PieceDetails[] = [];
  possibleSquares: Square[] = [];
  recentMoveSquares: [Square, Square] | null = null;
  possibleMoves: Move[] = [];
  isPromoting = false;

  constructor() {
    this.updatePiecesOnBoard();
  }

  private attemptedMove: Move | null = null;

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

  protected onpiecepromotioncancel() {
    this.isPromoting = false;
    this.updatePiecesOnBoard();
  }

  protected onpiecepromotionselect(e: any) {
    this.isPromoting = false;
    const selectedPiece = e.detail.selectedPiece as Piece;
    this.executeMove({
      from: this.attemptedMove.from,
      to: this.attemptedMove.to,
      promotion: selectedPiece.type,
    });
  }

  protected onpickup(e: CustomEvent, pieceDetails: Piece & { square: Square }) {
    this.pickedUpPiece = { ...pieceDetails, element: e.target as HTMLElement };

    this.possibleMoves = this.chessService.moves({
      square: this.pickedUpPiece.square,
      verbose: true,
    });

    this.possibleSquares = this.possibleMoves.map((move) => move.to);
    this.recentMoveSquares = null;
  }

  protected ondrop(e: CustomEvent, pieceDetails: Piece & { square: Square }) {
    const dropzoneSquareController = CustomElement.for(e.detail.dropzone, {
      optional: true,
    }) as ICustomElementController<SquareController> | null;

    if (!dropzoneSquareController) return;

    const to = dropzoneSquareController.viewModel.square;

    this.attemptedMove = this.possibleMoves.find((move) => {
      return move.to === to && move.from === pieceDetails.square;
    });

    if (this.attemptedMove.isPromotion()) {
      this.isPromoting = true;
      this.possibleSquares = [];
      return;
    }

    this.executeMove({ from: pieceDetails.square, to });
  }

  protected executeMove(moveDetails: {
    from: Square;
    to: Square;
    promotion?: string;
  }) {
    try {
      this.chessService.move(moveDetails);
      this.updatePiecesOnBoard();
      this.possibleSquares = [];
      this.recentMoveSquares = [moveDetails.from, moveDetails.to];
      this.attemptedMove = null;
    } catch (e) {
      console.error(e);
    }
  }
}
