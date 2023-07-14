import { defineStore, storeToRefs } from "pinia";
import { useBoardStore } from "./board";
import { usePieceStore } from "./piece";

export const useSquareStore = defineStore("square", () => {
  // stores

  const boardStore = useBoardStore();

  const { getPieceCollectionEntries } = usePieceStore();
  const { pieceCollection } = storeToRefs(usePieceStore());

  // square information

  const getColour = (squareIndex: number): vSquareColour => {
    const { file, rank } = getRankFileObject(squareIndex);

    if ((file + rank) % 2 === 0) {
      return "black";
    } else {
      return "white";
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
    return getPieceCollectionEntries().some((entries) => {
      return entries[1].squareIndex === squareIndex;
    });
  };

  const hasOpponentPiece = (squareIndex: number, owner: vPlayerColour) => {
    let opponentPiece: vPieceType | null = null;

    getPieceCollectionEntries().some((entries) => {
      const isOpponent =
        owner === "white"
          ? entries[1].type === entries[1].type.toLowerCase()
          : entries[1].type === entries[1].type.toUpperCase();

      if (entries[1].squareIndex === squareIndex && isOpponent) {
        opponentPiece = entries[1].type;
        return true;
      }
    });

    return opponentPiece;
  };

  const getCoordinates = (squareIndex: number) => {
    if (squareIndex === 0) {
      return squareIndex;
    }

    return parseInt(
      `${getRankBySquareIndex(squareIndex)}${getFileBySquareIndex(squareIndex)}`
    );
  };

  const squareIsMoveable = (squareIndex: number) => {
    return getPieceCollectionEntries().some(([_key, value]) => {
      return value.moves.includes(squareIndex);
    });
  };

  const squareIsTakeable = (squareIndex: number) => {
    return getPieceCollectionEntries().some(([_key, value]) => {
      return value.takes.includes(squareIndex);
    });
  };

  const squareIsTakeableByPiece = (squareIndex: number, pieceId: number) => {
    return pieceCollection.value[pieceId].takes.includes(squareIndex);
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
    getPieceCollectionEntries,
    squareIsMoveable,
    squareIsTakeable,
    squareIsMoveableByPiece,
    squareIsTakeableByPiece,
  };
});
