<template>
  <div ref="chessboard" class="v-chessboard">
    <div class="v-chessboard__squares">
      <vSquare
        v-for="squareIndex in squareArray"
        :key="squareIndex"
        :square-index="squareIndex"
        :colour="getColour(squareIndex)"
        :file="getFileBySquareIndex(squareIndex)"
        :rank="getRankBySquareIndex(squareIndex)"
      />
    </div>

    <div class="v-chessboard__pieces">
      <vChessPiece
        v-for="(piece, id) in pieceCollection"
        :key="id"
        :piece-type="piece.type"
        :square-index="piece.squareIndex"
      />
    </div>

    <div class="v-chessboard__coordinates">
      <div class="v-chessboard__coordinates--files">
        <span v-for="file in fileLetterArray" :key="file">
          {{ file.toUpperCase() }}
        </span>
      </div>
      <div class="v-chessboard__coordinates--ranks">
        <span v-for="rank in rankArray" :key="rank">
          {{ rank }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import vSquare from "./vSquare.vue";
import vChessPiece from "./vChessPiece.vue";
import { useSquareStore } from "@/stores/square";
import { useBoardStore } from "@/stores/board";
import { onMounted, ref, type Ref } from "vue";
import { usePieceStore } from "@/stores/piece";
import { storeToRefs } from "pinia";

// stores
const { getColour, getRankBySquareIndex, getFileBySquareIndex } =
  useSquareStore();

const {
  populateBoardState,
  squareArray,
  rankArray,
  fileLetterArray,
  unselectPiece,
} = useBoardStore();
const { activeSquare } = storeToRefs(useBoardStore());

const { movePiece } = usePieceStore();
const { pieceCollection } = storeToRefs(usePieceStore());

// html

const chessboard: Ref<HTMLElement | null> = ref(null);

// board state

onMounted(() => {
  populateBoardState();
});

// events

onMounted(() => {
  chessboard.value?.addEventListener("mousedown", (e) => {
    const element = document.elementFromPoint(
      e.clientX,
      e.clientY
    ) as HTMLElement;

    if (element?.classList.contains("v-piece")) {
      e.preventDefault();

      const squareIndex = parseInt(
        element.parentElement?.dataset.squareIndex as string
      );

      if (activeSquare.value) {
        movePiece(squareIndex, activeSquare.value);
      } else {
        activeSquare.value = squareIndex;
        return;
      }
    }

    if (element?.classList.contains("v-square")) {
      e.preventDefault();

      const squareIndex = parseInt(element?.dataset.squareIndex as string);

      if (activeSquare.value) {
        movePiece(squareIndex, activeSquare.value);
      }
    }

    unselectPiece();
  });
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
