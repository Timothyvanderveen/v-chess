import { defineStore } from "pinia";
import { useFenStore } from "./fen";
import { type Ref, ref } from "vue";

export const useBoardStore = defineStore("board", () => {
  // stores
  const { parseFenToBoardState } = useFenStore();
  // const squareStore = useSquareStore();

  // constants

  const squareArray = Array.from(Array(64).keys()).map((e) => ++e);
  const rankArray = Array.from(Array(8).keys()).map((e) => ++e);
  const fileArray = Array.from(Array(8).keys()).map((e) => ++e);
  const fileLetterArray = "abcdefgh".split("");

  // board state

  const boardState: Ref<vBoardState> = ref([]);
  const availableMoveArray: Ref<Array<number>> = ref([]);
  const availableTakeArray: Ref<Array<number>> = ref([]);
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

  const unselectPiece = () => {
    activeSquare.value = 0;
    hoveringSquare.value = 0;
    availableMoveArray.value = [];
    availableTakeArray.value = [];
  };

  const squareIsMoveable = (squareIndex: number) =>
    availableMoveArray.value.includes(squareIndex) ||
    availableTakeArray.value.includes(squareIndex);

  const squareIsTakeable = (squareIndex: number) =>
    availableTakeArray.value.includes(squareIndex);

  return {
    squareArray,
    rankArray,
    fileArray,
    boardState,
    populateBoardState,
    fileLetterArray,
    updateBoardState,
    hoveringSquare,
    activeSquare,
    availableMoveArray,
    availableTakeArray,
    unselectPiece,
    squareIsMoveable,
    squareIsTakeable,
  };
});
