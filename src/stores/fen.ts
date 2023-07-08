import { defineStore } from "pinia";
import { useSquareStore } from "./square";

export const useFenStore = defineStore("fen", () => {
  const squareStore = useSquareStore();

  const startingFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

  const parseFenToBoardState = (
    startingFenParam: string | null = null
  ): vBoardState => {
    const fen = startingFenParam ?? startingFen;
    let squareIndex = 64;
    const boardState: vBoardState = {};

    fen.split("").forEach((value) => {
      if (value === "/") {
        return;
      }

      const rankNumber = parseInt(value);
      if (rankNumber) {
        Array.from(Array(rankNumber).keys()).forEach(() => {
          boardState[squareStore.getCoordinates(squareIndex)] = {
            squareIndex,
            piece: null,
          };
          squareIndex--;
        });
      } else {
        boardState[squareStore.getCoordinates(squareIndex)] = {
          squareIndex,
          piece: value as vPieceType,
        };

        squareIndex--;
      }
    });

    return boardState;
  };

  return { parseFenToBoardState };
});
