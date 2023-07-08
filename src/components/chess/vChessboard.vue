<template>
  <div class="v-chessboard">
    <div
      class="v-chessboard__squares"
      @click="
        boardStore.updateBoardState('3B3K/1r6/5N2/p3kP2/2pn2Q1/1P1n4/P2R1R1b/8')
      "
    >
      <vSquare
        v-for="squareIndex in boardStore.squareArray"
        :key="squareIndex"
        :square-index="squareIndex"
        :colour="getColour(squareIndex)"
        :file="getFileBySquareIndex(squareIndex)"
        :rank="getRankBySquareIndex(squareIndex)"
      />
    </div>

    <div class="v-chessboard__pieces">
      <vChessPiece
        v-for="(pieceState, id) in boardStore.boardState.filter((e) => e.piece)"
        :key="id"
        :piece-type="pieceState.piece!"
        :file="getFileBySquareIndex(pieceState.squareIndex)"
        :rank="getRankBySquareIndex(pieceState.squareIndex)"
      />
    </div>

    <div class="v-chessboard__coordinates">
      <div class="v-chessboard__coordinates--files">
        <span v-for="file in boardStore.fileLetterArray" :key="file">
          {{ file.toUpperCase() }}
        </span>
      </div>
      <div class="v-chessboard__coordinates--ranks">
        <span v-for="rank in boardStore.rankArray" :key="rank">
          {{ rank }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// imports
import vSquare from "./vSquare.vue";
import vChessPiece from "./vChessPiece.vue";
import { useSquareStore } from "@/stores/square";
import { useBoardStore } from "@/stores/board";
import { onMounted } from "vue";

// stores
const { getColour, getRankBySquareIndex, getFileBySquareIndex } =
  useSquareStore();
const boardStore = useBoardStore();

onMounted(() => {
  boardStore.populateBoardState();
});
</script>

<style lang="scss">
.v-chessboard {
  width: 600px;
  aspect-ratio: 1/1;
  position: relative;

  .v-chessboard__coordinates--ranks,
  .v-chessboard__coordinates--files {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;

    span {
      font-size: 3vmin;
      color: #ababab;
      text-align: center;
      height: fit-content;
      width: fit-content;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .v-chessboard__pieces {
    height: 100%;
    aspect-ratio: 1/1;

    img {
      width: 12.5%;
      aspect-ratio: 1/1;
    }
  }

  .v-chessboard__coordinates--files {
    bottom: -4vmin;
    height: 3vmin;
    width: 100%;

    span {
      height: 3vmin;
      width: 12.5%;
    }
  }
  .v-chessboard__coordinates--ranks {
    left: -4vmin;
    bottom: 0;
    flex-direction: column-reverse;
    height: 100%;

    span {
      height: 12.5%;
      width: 3vmin;
    }
  }
}
</style>
