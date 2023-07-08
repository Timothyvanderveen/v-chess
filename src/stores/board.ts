import { defineStore } from "pinia";
import { useFenStore } from "./fen";
import { computed, reactive, ref, type Ref } from "vue";
import { usePieceStore } from "./piece";

export const useBoardStore = defineStore("board", () => {
  // stores
  const { parseFenToBoardState } = useFenStore();

  // constants
  const squareArray = Array.from(Array(64).keys()).map((e) => ++e);
  const rankArray = Array.from(Array(8).keys()).map((e) => ++e);
  const fileArray = Array.from(Array(8).keys()).map((e) => ++e);
  const fileLetterArray = "abcdefgh".split("");

  // board state
  const boardState: Ref<vBoardState> = ref([]);

  const populateBoardState = (fen: string | null = null) => {
    boardState.value = parseFenToBoardState(fen);
  };

  const updateBoardState = (fen: string | null = null) => {
    const newBoardState = parseFenToBoardState(fen);
    boardState.value.forEach((value, key) => {
      boardState.value[key] = newBoardState[key];
    });
  };

  const getPosition = (file: number, rank: number) => {
    // calculate the translate percentage
    const x = (file - 1) * 100;
    // since the board starts in lower left corner, count backwards
    const y = (8 - rank) * 100;
    return `${x}% ${y}%`;
  };

  return {
    squareArray,
    rankArray,
    fileArray,
    boardState,
    populateBoardState,
    fileLetterArray,
    updateBoardState,
    getPosition,
  };
});
