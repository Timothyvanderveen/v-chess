import { defineStore, storeToRefs } from "pinia";
import { useBoardStore } from "./board";
import { reactive } from "vue";

export const usePieceStore = defineStore("piece", () => {
  // stores

  const { availableMoveArray, availableTakeArray } = storeToRefs(
    useBoardStore()
  );

  // piece information

  const getOwner = (pieceType: vPieceType) => {
    if (pieceType.toUpperCase() === pieceType) {
      return "white";
    }
    if (pieceType.toLowerCase() === pieceType) {
      return "black";
    }
    throw new Error(`invalid piece type: ${pieceType}`);
  };

  const hasMove = (squareIndex: number) => {
    return (
      availableMoveArray.value.includes(squareIndex) ||
      availableTakeArray.value.includes(squareIndex)
    );
  };

  // piece collection

  const pieceCollection: vPieceCollection = reactive({});

  let IDcounter = 0;
  const createID = (): number => {
    return ++IDcounter;
  };

  const addPiece = ({
    squareIndex,
    pieceType,
  }: {
    squareIndex: number;
    pieceType: vPieceType;
  }) => {
    pieceCollection[createID()] = {
      owner: getOwner(pieceType),
      type: pieceType,
      squareIndex,
    };
  };

  const removePiece = (squareIndex: number) => {
    Object.entries(pieceCollection).some(([key, value]) => {
      if (value.squareIndex === squareIndex) {
        delete pieceCollection[parseInt(key) as number];
        return true;
      }
    });
  };

  const movePiece = (to: number, from: number) => {
    let toKey = -1;
    let fromKey = -1;

    Object.entries(pieceCollection).forEach(function ([key, value]) {
      if (value.squareIndex === from) {
        fromKey = parseInt(key);
        // pieceCollection[parseInt(key) as number].squareIndex = to;
      }

      if (value.squareIndex === to) {
        toKey = parseInt(key);
        // removePiece(value.squareIndex);
      }
    });

    if (toKey && pieceCollection[toKey]) {
      removePiece(pieceCollection[toKey].squareIndex);
    }
    if (fromKey && pieceCollection[fromKey]) {
      pieceCollection[fromKey].squareIndex = to;
    }
  };

  const getPieceElement = (squareIndex: number): HTMLElement | null => {
    return document.querySelector(
      `.v-piece__wrapper[data-square-index="${squareIndex}"] .v-piece`
    );
  };

  const startCantMoveAnimation = (squareIndex: number) => {
    getPieceElement(squareIndex)?.animate(
      [
        { transform: "rotate(0) scale(1)" },
        { transform: "rotate(15deg) scale(1.1)" },
        { transform: "rotate(-15deg) scale(1.1)" },
        { transform: "rotate(15deg) scale(1.1)" },
        { transform: "rotate(0) scale(1)" },
      ],
      {
        duration: 500,
      }
    );
  };

  return {
    getOwner,
    hasMove,
    pieceCollection,
    addPiece,
    removePiece,
    movePiece,
    startCantMoveAnimation,
    getPieceElement,
  };
});
