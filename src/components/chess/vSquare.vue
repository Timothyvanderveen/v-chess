<template>
  <div
    ref="squareElement"
    class="v-square"
    :class="{
      [`v-square__colour--${props.colour}`]: true,
      hovering: isHovering,
      moveable: thisIsMoveTarget,
      takeable: thisIsTakeTarget,
    }"
    :style="{ translate: getPosition() }"
    :data-square-index="props.squareIndex"
  />
</template>

<script setup lang="ts">
import { useBoardStore } from "@/stores/board";
import { useSquareStore } from "@/stores/square";
import { storeToRefs } from "pinia";
import { ref, type PropType, type Ref, computed, onMounted } from "vue";

// stores
const { hoveringSquare, availableMoveArray, availableTakeArray } = storeToRefs(
  useBoardStore()
);

const { getFileBySquareIndex, getRankBySquareIndex } = useSquareStore();

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

const getPosition = () => {
  const x = (getFileBySquareIndex(props.squareIndex) - 1) * 100;
  const y = (8 - getRankBySquareIndex(props.squareIndex)) * 100;
  return `${x}% ${y}%`;
};

// square information

const isHovering = computed(() => {
  if (props.squareIndex === hoveringSquare.value) {
    return true;
  }
  return false;
});

const thisIsMoveTarget = computed(() => {
  return availableMoveArray.value.includes(props.squareIndex);
});
const thisIsTakeTarget = computed(() => {
  return availableTakeArray.value.includes(props.squareIndex);
});

// events

onMounted(() => {
  squareElement.value?.addEventListener("mouseover", () => {
    if (thisIsMoveTarget.value) {
      hoveringSquare.value = props.squareIndex;
    }
  });
  squareElement.value?.addEventListener(
    "mouseleave",
    () => (hoveringSquare.value = 0)
  );
});
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

  &.moveable {
    cursor: pointer;
    &::after {
      background-color: #262626;
      inset: 30%;
      opacity: 0.2;
    }
  }
  &.takeable {
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
