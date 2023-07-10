import { defineStore, storeToRefs } from "pinia";
import { useBoardStore } from "./board";
import { usePieceStore } from "./piece";

export const useSquareStore = defineStore("square", () => {
  // stores

  const boardStore = useBoardStore();

  const { pieceCollection } = storeToRefs(usePieceStore());

  // square information

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
    const squareIndex = boardStore.boardState.find((e) => {
      return e.file === file && e.rank === rank;
    })?.squareIndex;

    if (!squareIndex) {
      throw new Error(`invalid coordinates: ${file}:${rank}`);
    }

    return squareIndex;
  };

  const hasPiece = (squareIndex: number) => {
    return Object.entries(pieceCollection.value).some((entries) => {
      return entries[1].squareIndex === squareIndex;
    });
  };

  const hasOpponentPiece = (squareIndex: number, owner: vPlayerColour) => {
    return Object.entries(pieceCollection.value).some((entries) => {
      const isOpponent =
        owner === "white"
          ? entries[1].type === entries[1].type.toLowerCase()
          : entries[1].type === entries[1].type.toUpperCase();

      return entries[1].squareIndex === squareIndex && isOpponent;
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
