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
const {
  getColour,
  getRankBySquareIndex,
  getFileBySquareIndex,
  hasOpponentPiece,
} = useSquareStore();

const {
  populateBoardState,
  squareArray,
  rankArray,
  fileLetterArray,
  unselectPiece,
  squareIsMoveable,
  squareIsTakeable,
} = useBoardStore();

const { activeSquare } = storeToRefs(useBoardStore());

const { movePiece, startCantMoveAnimation, getOwner, getPieceElement } =
  usePieceStore();
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

      const activePiece = getPieceElement(activeSquare.value);
      const currentPiece = element;

      if (!activePiece) {
        activeSquare.value = squareIndex;
        return;
      }

      if (!currentPiece) {
        return;
      }

      const activePieceType = activePiece.dataset.pieceType as vPieceType;
      const currentPieceType = currentPiece.dataset.pieceType as vPieceType;

      if (
        getOwner(currentPieceType) === getOwner(activePieceType) &&
        activeSquare.value
      ) {
        activeSquare.value = squareIndex;
        return;
      }

      if (activeSquare.value && activePiece) {
        if (
          hasOpponentPiece(squareIndex, getOwner(activePieceType)) &&
          squareIsTakeable(squareIndex)
        ) {
          movePiece(squareIndex, activeSquare.value);
        } else {
          startCantMoveAnimation(activeSquare.value);
          return;
        }
      }
    }

    if (element?.classList.contains("v-square")) {
      e.preventDefault();

      const squareIndex = parseInt(element?.dataset.squareIndex as string);

      if (activeSquare.value && squareIsMoveable(squareIndex)) {
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
