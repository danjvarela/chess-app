import { DI } from "aurelia";
import { Chess } from "chess.js";

export class ChessService extends Chess {}

export const IChessService = DI.createInterface<IChessService>(
  "IChessService",
  (x) => x.singleton(ChessService),
);

export type IChessService = ChessService;
