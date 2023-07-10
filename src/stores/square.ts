import { defineStore } from "pinia";
import { useBoardStore } from "./board";

export const useSquareStore = defineStore("square", () => {
  // stores
  const boardStore = useBoardStore();

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

  const getFileBySquareIndex = (squareIndex: number): vSquareFileNumber => {
    const file: number | null =
      boardStore.fileArray[Math.ceil(squareIndex / 8) - 1] ?? null;
    if (file === null) throw Error(`invalid file: ${squareIndex}`);
    return file as vSquareFileNumber;
  };

  const getRankBySquareIndex = (squareIndex: number): vSquareRankNumber => {
    const rank: number | null = boardStore.rankArray[(squareIndex - 1) % 8];
    if (rank === null) throw Error(`invalid rank: ${squareIndex}`);
    return rank as vSquareRankNumber;
  };

  const getRankFileObject = (
    squareIndex: number
  ): { file: vSquareFileNumber; rank: vSquareRankNumber } => {
    return {
      rank: getRankBySquareIndex(squareIndex),
      file: getFileBySquareIndex(squareIndex),
    };
  };

  const getSquareIndexByCoordinates = ({
    file,
    rank,
  }: {
    file: vSquareFileNumber;
    rank: vSquareRankNumber;
  }): number => {
    return (
      boardStore.boardState.find((e) => e.file === file && e.rank === rank)
        ?.squareIndex ?? -1
    );
  };

  const hasPiece = (squareIndex: number) => {
    return boardStore.boardState.some(
      (e) => e.piece && e.squareIndex === squareIndex
    );
  };

  const hasOpponentPiece = (squareIndex: number, owner: vPlayerColour) => {
    return boardStore.boardState.some((e) => {
      if (!e.piece) return;
      const isOpponent =
        owner === "white"
          ? e.piece === e.piece.toUpperCase()
          : e.piece === e.piece.toLowerCase();

      return e.piece && e.squareIndex === squareIndex && isOpponent;
    });
  };

  const getCoordinates = (squareIndex: number) => {
    if (squareIndex === 0) {
      return squareIndex;
    }

    return parseInt(
      `${getRankBySquareIndex(squareIndex)}${getFileBySquareIndex(squareIndex)}`
    );
  };

  return {
    getColour,
    getRankBySquareIndex,
    getFileBySquareIndex,
    getCoordinates,
    getRankFileObject,
    hasPiece,
    hasOpponentPiece,
    getSquareIndexByCoordinates,
  };
});
