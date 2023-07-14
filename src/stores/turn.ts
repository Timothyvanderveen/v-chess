import { defineStore } from "pinia";
import { type Ref, ref, reactive } from "vue";

export const useTurnStore = defineStore("turn", () => {
  const turnCollection: Ref<Array<ChessTurn>> = ref([]);
  const currentPlayerTurn: Ref<vPlayerColour> = ref("white");

  const turnTimer = reactive({
    white: 0,
    black: 0,
  });

  const setNextPlayerTurn = (player?: vSquareColour) =>
    (currentPlayerTurn.value =
      (player ?? currentPlayerTurn.value) === "white" ? "black" : "white");

  const makeTurn = (player: vSquareColour, to: number, from: number) => {
    turnCollection.value.push({
      player: player,
      to,
      from,
      timestamp: turnTimer[player],
    });

    setNextPlayerTurn();
  };

  return {
    turnCollection,
    currentPlayerTurn,
    turnTimer,
    setNextPlayerTurn,
    makeTurn,
  };
});
