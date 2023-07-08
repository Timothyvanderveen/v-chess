<template>
  <div
    ref="squareElement"
    class="v-square"
    :class="getColourClass()"
    :style="{ translate: getPosition }"
    :data-coordinates="getCoordinates(props.squareIndex)"
  />
</template>

<script setup lang="ts">
// imports
import { useBoardStore } from "@/stores/board";
import { useSquareStore } from "@/stores/square";
import { ref, type PropType, type Ref, computed } from "vue";

// stores
const boardStore = useBoardStore();

// props
const props = defineProps({
  squareIndex: {
    type: Number,
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
  colour: {
    type: String as PropType<vSquareColour>,
    required: true,
    validator: (prop: string) => ["black", "white"].includes(prop),
  },
});

// html refs
const squareElement = ref(null) as Ref<HTMLElement | null>;

// stores
const { getCoordinates } = useSquareStore();

// square logic

const getPosition = computed(() =>
  boardStore.getPosition(props.file, props.rank)
);

const getColourClass = () => `v-square__colour--${props.colour}`;
</script>

<style lang="scss" scoped>
.v-square {
  width: calc(100% / 8);
  aspect-ratio: 1/1;
  position: absolute;
  overflow: hidden;
}
.v-square__colour--white {
  background-color: #ababab;
}
.v-square__colour--black {
  background-color: #898989;
}
</style>
