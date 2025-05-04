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
      alt="#TODO"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, onMounted, type PropType, type Ref, ref, watch } from 'vue';
import { useBoardStore } from '~/stores/board';
import { usePieceStore } from '~/stores/piece';
import { useSquareStore } from '~/stores/square';

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

const { getOwner, createMoveLogic } = usePieceStore();
const { activePieceId, affectedPiecesByMoveArray } = storeToRefs(usePieceStore());

const boardStore = useBoardStore();
const { hoveringSquare, availableMoveArray, availableTakeArray } = storeToRefs(boardStore);

const { getRankBySquareIndex, getFileBySquareIndex } = useSquareStore();

// element

const chessPiece: Ref<HTMLElement | null> = ref(null);

const pieceImage = computed(() => {
  const fileName = `${
    getOwner(props.pieceType) === 'white' ? 'w' : 'b'
  }${props.pieceType.toUpperCase()}`;

  return new URL(`../../assets/img/chesspieces/${fileName}.svg`, import.meta.url).href;
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
      availableMoveArray.value = moveLogic.getMoveArray();
      availableTakeArray.value = moveLogic.getTakeArray();
    }
  },
);

watch(
  () => props.squareIndex,
  (to) => {
    moveLogic.squareIndex = to;
    moveLogic.setAvailableMoves();
  },
);

watch(
  () => affectedPiecesByMoveArray.value,
  (to) => {
    console.log('y');
    if (to.includes(props.id)) {
      moveLogic.setAvailableMoves(true);
    }
  },
);

onMounted(() => {
  moveLogic.setAvailableMoves();
});

const moveLogic = createMoveLogic(props.id);
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
    width: 100%;
    padding: 10%;
    user-select: none;
    cursor: pointer;
    transition: scale 0.2s ease-in-out;

    &.deleting {
      pointer-events: none;
    }
  }

  &.hovering .v-piece {
    scale: 1.2;
  }
}
</style>
