import { defineStore } from "pinia";
import { useSquareStore } from "./square";
import { usePieceStore } from "./piece";

export const useFenStore = defineStore("fen", () => {
  // stores
  const squareStore = useSquareStore();
  const { addPiece } = usePieceStore();

  // fen parsing

  // const startingFen = "q1r5/B2pQ3/8/R1P1K3/7p/2k3Pp/R4n1P/r7 w - - 0 1";
  const startingFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

  const parseFenToBoardState = (
    startingFenParam: string | null = null
  ): vBoardState => {
    const fen = startingFenParam ?? startingFen;
    let squareIndex = 1;
    const boardState: vBoardState = [];

    // reverse fuckery needed because FEN starts at rank 8 (?) but still counts LTR (??)
    // TODO use whole FEN, not just position
    fen
      .split(" ")[0]
      .split("/")
      .map((e) => e.split("").reverse().join(""))
      .join("/")
      .split("")
      .reverse()
      .forEach((value) => {
        if (value === "/") {
          return;
        }

        const rankNumber = parseInt(value);
        if (rankNumber) {
          Array.from(Array(rankNumber).keys()).forEach(() => {
            const { rank, file } = squareStore.getRankFileObject(squareIndex);
            boardState.push({
              rank,
              file,
              squareIndex,
            });
            squareIndex++;
          });
        } else {
          const { rank, file } = squareStore.getRankFileObject(squareIndex);
          boardState.push({
            rank,
            file,
            squareIndex,
          });

          addPiece({ squareIndex, pieceType: value as vPieceType });

          squareIndex++;
        }
      });

    return boardState;
  };

  return { parseFenToBoardState };
});
