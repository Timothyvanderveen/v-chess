import { defineStore, storeToRefs } from "pinia";
import { useBoardStore } from "./board";

export const useSquareStore = defineStore("square", () => {
  const boardStore = useBoardStore();
  const { boardState } = storeToRefs(boardStore);

  const getColour = (squareId: number): vSquareColour => {
    // if the rank is even then start with black squares
    if (Math.ceil(squareId / 8) % 2 === 0) {
      if (squareId % 2 === 0) {
        return "black";
      } else {
        return "white";
      }
    }
    // if the rank is odd then start with white squares
    if (Math.floor((squareId - 1) / 8) % 2 === 0) {
      if (squareId % 2 === 0) {
        return "white";
      } else {
        return "black";
      }
    }
    throw Error("invalid colour");
  };

  const getPosition = (fileIndex: number, rankIndex: number) => {
    // calculate the translate percentage
    const x = (fileIndex - 1) * 100;
    // since the board starts in lower left corner, count backwards
    const y = (8 - rankIndex) * 100;
    return `${x}% ${y}%`;
  };

  const getFileBySquareIndex = (squareIndex: number): vSquareFileNumber => {
    const file: number | null =
      boardStore.fileArray[(squareIndex - 1) % 8] ?? null;
    if (file === null) throw Error(`invalid file: ${squareIndex}`);
    return file as vSquareFileNumber;
  };

  const getRankBySquareIndex = (squareIndex: number): vSquareRankNumber => {
    const rank: number | null =
      boardStore.rankArray[Math.ceil(squareIndex / 8) - 1];
    if (rank === null) throw Error(`invalid rank: ${squareIndex}`);
    return rank as vSquareRankNumber;
  };

  const getCoordinates = (squareIndex: number) => {
    return parseInt(
      `${getFileBySquareIndex(squareIndex)}${getRankBySquareIndex(squareIndex)}`
    );
  };

  const getPieceState = (squareIndex: number) => {
    return boardState.value[getCoordinates(squareIndex)]?.piece;
  };

  return {
    getColour,
    getPosition,
    getRankBySquareIndex,
    getFileBySquareIndex,
    getCoordinates,
    getPieceState,
  };
});
