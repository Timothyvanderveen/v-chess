<template>
  <div class="v-piece__wrapper" :style="{ translate: getPosition }">
    <img v-if="pieceType" :src="pieceImage" class="v-piece" draggable="false" />
  </div>
</template>

<script setup lang="ts">
// imports
import { useBoardStore } from "@/stores/board";
import { usePieceStore } from "@/stores/piece";
import { type PropType, computed } from "vue";

// store
const { getOwner } = usePieceStore();
const boardStore = useBoardStore();

// piece logic

const getPosition = computed(() =>
  boardStore.getPosition(props.file, props.rank)
);

const props = defineProps({
  pieceType: {
    type: String as PropType<vPieceType>,
    required: true,
  },
  file: {
    type: Number as PropType<vSquareFileNumber>,
    required: true,
  },
  rank: {
    type: Number as PropType<vSquareRankNumber>,
    required: true,
  },
});

const isWhite = computed(() => getOwner(props.pieceType) === "white");

const pieceImage = computed(() => {
  const fileName = `${
    isWhite.value ? "w" : "b"
  }${props.pieceType.toUpperCase()}`;

  return new URL(
    `../../assets/img/chesspieces/${fileName}.svg`,
    import.meta.url
  ).href;
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

  .v-piece {
    width: 80%;
    user-select: none;
    cursor: pointer;

    transition: scale 0.2s ease-in-out;

    &:hover {
      scale: 1.2;
    }
  }
}
</style>
