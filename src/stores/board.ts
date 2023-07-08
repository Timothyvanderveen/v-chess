import { defineStore } from "pinia";
import { useFenStore } from "./fen";
import { reactive } from "vue";

export const useBoardStore = defineStore("board", () => {
  const { parseFenToBoardState } = useFenStore();

  const squareArray = Array.from(Array(64).keys()).map((e) => ++e);
  const rankArray = Array.from(Array(8).keys()).map((e) => ++e);
  const fileArray = Array.from(Array(8).keys()).map((e) => ++e);

  // board state

  const boardState: vBoardState = reactive({});

  const populateBoardState = () => {
    Object.assign(boardState, parseFenToBoardState());

    console.log(boardState);
  };

  return { squareArray, rankArray, fileArray, boardState, populateBoardState };
});
