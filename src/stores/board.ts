import { defineStore } from 'pinia';
import { useFenStore } from './fen';
import { type Ref, ref } from 'vue';

export const useBoardStore = defineStore('board', () => {
  // stores
  const { parseFenToBoardState } = useFenStore();

  // constants

  const squareArray = Array.from(Array(64).keys()).map((e) => ++e);
  const rankArray = Array.from(Array(8).keys()).map((e) => ++e);
  const fileArray = Array.from(Array(8).keys()).map((e) => ++e);
  const fileLetterArray = 'abcdefgh'.split('');

  // legality checks

  const rankFileExceedsBoardBounds = ({ rank, file }: RankFileObject) =>
    Math.max(file, rank) > 8 || Math.min(file, rank) < 1;

  // board state

  const boardState: Ref<vBoardState> = ref([]);
  const availableMoveArray: Ref<Array<number>> = ref([]);
  const availableTakeArray: Ref<Array<number>> = ref([]);
  const lastAvailableMoveArray: Ref<Array<number>> = ref([]);
  const lastAvailableTakeArray: Ref<Array<number>> = ref([]);
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
    lastAvailableMoveArray,
    lastAvailableTakeArray,
    rankFileExceedsBoardBounds,
  };
});
