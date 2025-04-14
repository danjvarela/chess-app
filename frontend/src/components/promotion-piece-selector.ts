import { resolve, customElement, INode } from "aurelia";
import { IChessService } from "@/services/chess-service";
import { Piece, PieceSymbol } from "chess.js";
import template from "./promotion-piece-selector.html";
import { Piece as PieceController } from "./piece";

@customElement({
  name: "promotion-piece-selector",
  template,
  dependencies: [PieceController],
})
export class PromotionPieceSelector {
  static EVENTS = {
    PIECE_PROMOTION_CANCEL: "piece-promotion-cancel" as const,
    PIECE_PROMOTION_SELECT: "piece-promotion-select" as const,
  };
  private chessService: IChessService = resolve(IChessService);
  ref: HTMLElement = resolve(INode) as HTMLElement;

  get pieces() {
    const turn = this.chessService.turn();
    return (["q", "r", "n", "b"] as PieceSymbol[]).map(
      (pieceSymbol) => ({ type: pieceSymbol, color: turn }) satisfies Piece,
    );
  }

  protected onselect(selectedPiece: Piece) {
    const promotionPieceSelectEvent = new CustomEvent(
      PromotionPieceSelector.EVENTS.PIECE_PROMOTION_SELECT,
      {
        detail: {
          selectedPiece,
        },
        bubbles: false,
        cancelable: false,
      },
    );
    this.ref?.dispatchEvent(promotionPieceSelectEvent);
  }

  protected oncancel() {
    const promotionPieceCancelEvent = new CustomEvent(
      PromotionPieceSelector.EVENTS.PIECE_PROMOTION_CANCEL,
      {
        bubbles: false,
        cancelable: false,
      },
    );
    this.ref?.dispatchEvent(promotionPieceCancelEvent);
  }
}
