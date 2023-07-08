<template>
  <div
    ref="squareElement"
    class="v-square"
    :class="{
      [`v-square__colour--${props.colour}`]: true,
      hovering: isHovering,
      available: isAvailable,
    }"
    :style="{ translate: getPosition }"
    :data-square-index="props.squareIndex"
  />
</template>

<script setup lang="ts">
// imports
import { useBoardStore } from "@/stores/board";
import { useSquareStore } from "@/stores/square";
import { storeToRefs } from "pinia";
import { ref, type PropType, type Ref, computed, onMounted } from "vue";

// stores
const boardStore = useBoardStore();
const { activeSquare, hoveringSquare, availableSquares } = storeToRefs(
  useBoardStore()
);

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
// const isActive = computed(() => {
//   const hoveringAvailableSquare = availableSquares.value.includes(
//     getCoordinates(hoveringSquare.value)
//   );
//   if (props.squareIndex === activeSquare.value && !hoveringAvailableSquare) {
//     return true;
//   }
//   return false;
// });
const isAvailable = computed(() =>
  availableSquares.value.includes(getCoordinates(props.squareIndex))
);

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

// stores
const { getCoordinates } = useSquareStore();

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
    background: #262626;
    /* width: 100%; */
    opacity: 0;
    inset: 50%;
    border-radius: 50%;
    transition: inset 0.2s ease-in-out, opacity 0.2s ease-in-out;
  }

  &.available {
    cursor: pointer;
    &::after {
      inset: 30%;
      opacity: 0.2;
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
