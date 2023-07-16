import { defineStore } from "pinia";
import { useSquareStore } from "./square";
import { usePieceStore } from "./piece";
import { useTurnStore } from "./turn";

export const useFenStore = defineStore("fen", () => {
  // stores
  const squareStore = useSquareStore();
  const { addPiece } = usePieceStore();

  const { setNextPlayerTurn } = useTurnStore();

  // fen parsing

  // const startingFen = "8/3k4/5q2/8/5Q2/8/3K4/8 w - - 0 1";
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

    if (fen.split(" ")[1] === "b") {
      setNextPlayerTurn();
    }

    return boardState;
  };

  return { parseFenToBoardState };
});
