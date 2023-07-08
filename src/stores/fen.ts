import { defineStore } from "pinia";
import { useSquareStore } from "./square";

export const useFenStore = defineStore("fen", () => {
  const squareStore = useSquareStore();

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
            boardState.push({
              coordinates: squareStore.getCoordinates(squareIndex),
              piece: null,
              squareIndex,
            });
            squareIndex++;
          });
        } else {
          boardState.push({
            coordinates: squareStore.getCoordinates(squareIndex),
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
