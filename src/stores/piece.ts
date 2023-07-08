import { defineStore } from "pinia";

export const usePieceStore = defineStore("piece", () => {
  const getOwner = (pieceType: vPieceType) => {
    if (pieceType.toUpperCase() === pieceType) {
      return "white";
    }
    if (pieceType.toLowerCase() === pieceType) {
      return "black";
    }
    throw new Error(`invalid piece type: ${pieceType}`);
  };

  return {
    getOwner,
  };
});
