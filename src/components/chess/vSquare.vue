<template>
  <div
    ref="squareElement"
    class="v-square"
    :class="getColourClass()"
    :style="{ translate: getPosition(props.file, props.rank) }"
  >
    {{ file }} - {{ rank }}
    {{ getPieceState(id) }}
  </div>
</template>

<script setup lang="ts">
import { useSquareStore } from "@/stores/square";
import { ref, type PropType, type Ref } from "vue";

const squareElement = ref(null) as Ref<HTMLElement | null>;
const { getPosition, getPieceState } = useSquareStore();

const props = defineProps({
  id: {
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
  background-color: wheat;
}
.v-square__colour--black {
  background-color: brown;
}
</style>
