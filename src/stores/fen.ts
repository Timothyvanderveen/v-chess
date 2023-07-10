import { defineStore } from "pinia";
import { useSquareStore } from "./square";
import { useBoardStore } from "./board";

export const useFenStore = defineStore("fen", () => {
  const squareStore = useSquareStore();
  const { getRankFileObject } = useSquareStore();

  const startingFen = "4R3/1P3r2/p7/2pK3P/r5Bp/5Q1R/2p3PP/1k6 w - - 0 1";
  // const startingFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

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
        const { rank, file } = getRankFileObject(squareIndex);
        if (rankNumber) {
          Array.from(Array(rankNumber).keys()).forEach(() => {
            boardState.push({
              rank,
              file,
              piece: null,
              squareIndex,
            });
            squareIndex++;
          });
        } else {
          boardState.push({
            rank,
            file,
            piece: value as vPieceType,
            squareIndex,
          });

          squareIndex++;
        }
      });

    return boardState;
  };

  return { parseFenToBoardState };
});
