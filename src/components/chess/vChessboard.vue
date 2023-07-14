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
        :id="parseInt(id.toString())"
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
import { useTurnStore } from "@/stores/turn";

// stores
const {
  getColour,
  getRankBySquareIndex,
  getFileBySquareIndex,
  hasOpponentPiece,
} = useSquareStore();

const { populateBoardState, squareArray, rankArray, fileLetterArray } =
  useBoardStore();
const { availableMoveArray, availableTakeArray } = storeToRefs(useBoardStore());

const { currentPlayerTurn } = storeToRefs(useTurnStore());

const { movePiece, startCantMoveAnimation, getOwner, unselectPiece } =
  usePieceStore();
const { pieceCollection, activePiece, activePieceId } = storeToRefs(
  usePieceStore()
);

// html

const chessboard: Ref<HTMLElement | null> = ref(null);

// board state

onMounted(() => {
  populateBoardState();
});

// events

// TODO move logic
onMounted(() => {
  chessboard.value?.addEventListener("mousedown", (e) => {
    const element = document.elementFromPoint(
      e.clientX,
      e.clientY
    ) as HTMLElement;

    if (element?.classList.contains("v-piece")) {
      e.preventDefault();

      const clickedPieceObject = {
        element,
        type: element.dataset.pieceType as vPieceType,
        owner: getOwner(element.dataset.pieceType as vPieceType),
        id: parseInt(element.dataset.id as string),
        squareIndex: parseInt(
          element.parentElement?.dataset.squareIndex as string
        ),
      };

      const noPieceSelected = !activePiece.value;
      const isCurrentPlayerPiece =
        clickedPieceObject.owner === currentPlayerTurn.value;
      const selectedOwnPiece =
        clickedPieceObject.owner === activePiece.value?.owner;

      if ((noPieceSelected && isCurrentPlayerPiece) || selectedOwnPiece) {
        activePieceId.value = clickedPieceObject.id;
        return;
      }

      if (activePiece.value) {
        if (
          hasOpponentPiece(
            clickedPieceObject.squareIndex,
            activePiece.value.owner
          ) &&
          availableTakeArray.value.includes(clickedPieceObject.squareIndex)
        ) {
          movePiece(
            clickedPieceObject.squareIndex,
            activePiece.value.squareIndex
          );
        } else {
          startCantMoveAnimation(activePiece.value.squareIndex);
          return;
        }
      }
    }

    if (element?.classList.contains("v-square")) {
      e.preventDefault();

      const squareIndex = parseInt(element?.dataset.squareIndex as string);

      if (activePiece.value && availableMoveArray.value.includes(squareIndex)) {
        movePiece(squareIndex, activePiece.value.squareIndex);
      } else {
        startCantMoveAnimation(squareIndex);
        unselectPiece();
      }
    }

    activePieceId.value = null;
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
