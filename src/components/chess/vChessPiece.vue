<template>
  <div
    class="v-piece__wrapper"
    :style="{ translate: getPosition }"
    :data-square-index="props.squareIndex"
    :class="{
      active: props.id === activePieceId,
      hovering: hoveringSquare === squareIndex,
    }"
  >
    <img
      v-if="pieceType"
      ref="chessPiece"
      :src="pieceImage"
      class="v-piece"
      draggable="false"
      :data-piece-type="props.pieceType"
      :data-id="props.id"
    />
  </div>
</template>

<script setup lang="ts">
import { useBoardStore } from "@/stores/board";
import { usePieceStore } from "@/stores/piece/index";
import { useSquareStore } from "@/stores/square";
import { storeToRefs } from "pinia";
import { type PropType, computed, ref, type Ref, watch } from "vue";
import MoveLogic from "@/stores/piece/classes/MoveLogic";

// props

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  pieceType: {
    type: String as PropType<vPieceType>,
    required: true,
  },
  squareIndex: {
    type: Number,
    required: true,
  },
});

// store

const { getOwner } = usePieceStore();
const { activePieceId } = storeToRefs(usePieceStore());

const boardStore = useBoardStore();
const { hoveringSquare } = storeToRefs(boardStore);

const { getRankBySquareIndex, getFileBySquareIndex } = useSquareStore();

// element

const chessPiece: Ref<HTMLElement | null> = ref(null);

const pieceImage = computed(() => {
  const fileName = `${
    getOwner(props.pieceType) === "white" ? "w" : "b"
  }${props.pieceType.toUpperCase()}`;

  return new URL(
    `../../assets/img/chesspieces/${fileName}.svg`,
    import.meta.url
  ).href;
});

const getPosition = computed(() => {
  const x = (getFileBySquareIndex(props.squareIndex) - 1) * 100;
  const y = (8 - getRankBySquareIndex(props.squareIndex)) * 100;
  return `${x}% ${y}%`;
});

// moves

watch(
  () => activePieceId.value,
  (to) => {
    if (to === props.id) {
      moveLogic.setAvailableMoves();
    }
  }
);

watch(
  () => props.squareIndex,
  (to) => {
    moveLogic.squareIndex = to;
  }
);

const moveLogic = new MoveLogic({
  playerColour: getOwner(props.pieceType),
  pieceType: props.pieceType,
  squareIndex: props.squareIndex,
});
</script>

<style lang="scss" scoped>
.v-piece__wrapper {
  width: 12.5%;
  aspect-ratio: 1/1;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: translate 0.2s ease-in-out;

  &.active .v-piece {
    scale: 1.2;
  }

  .v-piece {
    width: 80%;
    user-select: none;
    cursor: pointer;
    transition: scale 0.2s ease-in-out;
  }

  &.hovering .v-piece {
    scale: 1.2;
  }
}
</style>
