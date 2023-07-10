import { defineStore } from "pinia";
import { useFenStore } from "./fen";
import { useSquareStore } from "./square";
import { type Ref, ref } from "vue";

export const useBoardStore = defineStore("board", () => {
  // stores
  const { parseFenToBoardState } = useFenStore();
  const squareStore = useSquareStore();

  // constants
  const squareArray = Array.from(Array(64).keys()).map((e) => ++e);
  const rankArray = Array.from(Array(8).keys()).map((e) => ++e);
  const fileArray = Array.from(Array(8).keys()).map((e) => ++e);
  const fileLetterArray = "abcdefgh".split("");

  // board state
  const boardState: Ref<vBoardState> = ref([]);
  const availableMoveCollection: Ref<Array<AvailableMoveCollection>> = ref([]);
  const hoveringSquare = ref(0);
  const activeSquare = ref(0);

  const populateBoardState = (fen: string | null = null) => {
    boardState.value = parseFenToBoardState(fen);
  };

  const updateBoardState = (fen: string | null = null) => {
    const newBoardState = parseFenToBoardState(fen);
    boardState.value.forEach((value, key) => {
      boardState.value[key] = newBoardState[key];
    });
  };

  const getPosition = (squareIndex: number) => {
    // calculate the translate percentage
    const x = (squareStore.getRankBySquareIndex(squareIndex) - 1) * 100;
    // since the board starts in lower left corner, count backwards
    const y = (8 - squareStore.getFileBySquareIndex(squareIndex)) * 100;
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
    hoveringSquare,
    activeSquare,
    availableMoveCollection,
  };
});
