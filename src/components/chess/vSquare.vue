<template>
  <div
    ref="squareElement"
    class="v-square"
    :class="{
      [`v-square__colour--${props.colour}`]: true,
      hovering: isHovering,
      available: isAvailable && !thisHasAnyPiece,
      [`available-with-piece`]: isAvailable && thisHasOpponentPiece,
    }"
    :style="{ translate: getPosition }"
    :data-square-index="props.squareIndex"
  >
    <div style="position: absolute">{{ squareIndex }}</div>
  </div>
</template>

<script setup lang="ts">
// imports
import { useBoardStore } from "@/stores/board";
import { useSquareStore } from "@/stores/square";
import { storeToRefs } from "pinia";
import { ref, type PropType, type Ref, computed, onMounted } from "vue";

// stores
const boardStore = useBoardStore();
const { hoveringSquare, availableMoveCollection } = storeToRefs(
  useBoardStore()
);
const { getRankFileObject, hasOpponentPiece, hasPiece } = useSquareStore();

// props
const props = defineProps({
  squareIndex: {
    type: Number,
    required: true,
  },
  colour: {
    type: String as PropType<vSquareColour>,
    required: true,
    validator: (prop: string) => ["black", "white"].includes(prop),
  },
});

// html manipulation
const squareElement = ref(null) as Ref<HTMLElement | null>;
const isHovering = computed(() => {
  if (props.squareIndex === hoveringSquare.value) {
    return true;
  }
  return false;
});

const thisHasAnyPiece = computed(() => {
  return hasPiece(props.squareIndex);
});

const thisHasOpponentPiece = computed(() => {
  return hasOpponentPiece(props.squareIndex, props.colour);
});

const isAvailable = computed(() => {
  const { file, rank } = getRankFileObject(props.squareIndex);
  return availableMoveCollection.value.some((availableMove) => {
    return (["horse", "diagonal", "cardinal"] as Array<MoveType>).some(
      (moveType) => {
        return availableMove[moveType]?.some((availableMoveType) => {
          return (
            availableMoveType.file === file && availableMoveType.rank === rank
          );
        });
      }
    );
  });
});

onMounted(() => {
  squareElement.value?.addEventListener("mouseover", ({ clientX, clientY }) => {
    if (isAvailable.value) {
      hoveringSquare.value = props.squareIndex;
    }
  });
  squareElement.value?.addEventListener(
    "mouseleave",
    () => (hoveringSquare.value = 0)
  );
});

// square logic

const getPosition = computed(() => boardStore.getPosition(props.squareIndex));
</script>

<style lang="scss" scoped>
.v-square {
  width: calc(100% / 8);
  aspect-ratio: 1/1;
  position: absolute;
  overflow: hidden;
  border: 0.2vmin rgb(38, 38, 38, 0) solid;
  transition: border 0.2s ease-in-out;

  &.hovering {
    border: 0.2vmin rgb(38, 38, 38, 1) solid;
  }

  &::after {
    content: "";
    position: absolute;
    background-color: transparent;
    /* width: 100%; */
    border: 0 solid #262626;
    opacity: 0;
    inset: 50%;
    border-radius: 50%;
    transition: all 0.2s ease-in-out;
  }

  &.available {
    cursor: pointer;
    &::after {
      background-color: #262626;
      inset: 30%;
      opacity: 0.2;
    }
  }
  &.available-with-piece {
    cursor: pointer;
    &::after {
      inset: 0;
      opacity: 0.2;
      border-width: 0.5vmin;
    }
  }
}
.v-square__colour--white {
  background-color: #ababab;
}
.v-square__colour--black {
  background-color: #898989;
}
</style>
