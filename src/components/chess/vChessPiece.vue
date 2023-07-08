<template>
  <div
    class="v-piece__wrapper"
    :style="{ translate: getPosition }"
    :data-square-index="props.squareIndex"
  >
    <img
      v-if="pieceType"
      ref="chessPiece"
      :src="pieceImage"
      class="v-piece"
      draggable="false"
    />
  </div>
</template>

<script setup lang="ts">
// imports
import { useBoardStore } from "@/stores/board";
import { usePieceStore } from "@/stores/piece";
import { useSquareStore } from "@/stores/square";
import { storeToRefs } from "pinia";
import { type PropType, computed, onMounted, ref, type Ref, watch } from "vue";

// props
const props = defineProps({
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
const boardStore = useBoardStore();
const { hoveringSquare, activeSquare } = storeToRefs(boardStore);
const { getRankBySquareIndex, getFileBySquareIndex } = useSquareStore();

// element manipulation
const chessPiece: Ref<HTMLElement | null> = ref(null);

onMounted(() => {
  chessPiece.value?.addEventListener("mouseenter", () => {
    if (!activeSquare.value) {
      hoveringSquare.value = props.squareIndex;
    }
  });
  chessPiece.value?.addEventListener(
    "mouseleave",
    () => (hoveringSquare.value = activeSquare.value)
  );
});

const pieceImage = computed(() => {
  const fileName = `${
    isWhite.value ? "w" : "b"
  }${props.pieceType.toUpperCase()}`;

  return new URL(
    `../../assets/img/chesspieces/${fileName}.svg`,
    import.meta.url
  ).href;
});

// piece logic

const getPosition = computed(() => boardStore.getPosition(props.squareIndex));

const isWhite = computed(() => getOwner(props.pieceType) === "white");

const { getRankFileObject } = useSquareStore();
const { availableSquares } = storeToRefs(useBoardStore());

watch(
  () => activeSquare.value,
  (to) => {
    if (to === props.squareIndex) {
      setAvailableSquares();
    }
  }
);

const setAvailableSquares = () => {
  availableSquares.value = [];
  if (props.pieceType.toLowerCase() === "p") {
    const { file, rank } = getRankFileObject(props.squareIndex);

    availableSquares.value.push(
      parseInt(`${rank}${file + (isWhite.value ? 1 : -1)}`)
    );

    if (file === 2 || file === 7) {
      availableSquares.value.push(
        parseInt(`${rank}${file + (isWhite.value ? 2 : -2)}`)
      );
    }
  }
};
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

    &:hover,
    &.active {
      scale: 1.2;
    }
  }
}
</style>
