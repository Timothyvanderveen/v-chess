<template>
  <div
    ref="squareElement"
    class="v-square"
    :class="getColourClass()"
    :style="{ translate: getTranslate() }"
  >
    {{ file }} - {{ rank }}
  </div>
</template>

<script setup lang="ts">
import { ref, type PropType, type Ref } from "vue";

const squareElement = ref(null) as Ref<HTMLElement | null>;

const rankArray = Array.from(Array(8).keys()).map((e) => ++e);
const fileArray = ["a", "b", "c", "d", "e", "f", "g", "h"];

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  file: {
    type: String as PropType<vSquareFile>,
    required: true,
  },
  rank: {
    type: Number as PropType<vSquareRank>,
    required: true,
  },
  colour: {
    type: String as PropType<vSquareColour>,
    required: true,
    validator: (prop: string) => ["black", "white"].includes(prop),
  },
});
const getTranslate = () => {
  const x = fileArray.indexOf(props.file) * 100;
  const y = (8 - props.rank) * 100;
  return `${x}% ${y}%`;
};
// const getBottom = () => {
//   if (!squareElement.value) return "0";
//   return (props.rank - 1) * squareElement.value.offsetWidth + "px";
// };

// const getLeft = () => {
//   if (!squareElement.value) return "0";
//   return fileArray.indexOf(props.file) * squareElement.value.offsetWidth + "px";
// };

const getColourClass = () => `v-square__colour--${props.colour}`;
</script>

<style lang="scss">
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
