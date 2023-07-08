<template>
  <div class="v-chessboard">
    <vSquare
      v-for="squareId in squareArray"
      :id="squareId"
      :key="squareId"
      :colour="getColour(squareId)"
      :file="getFileBySquareIndex(squareId)"
      :rank="getRankBySquareIndex(squareId)"
    />
  </div>
</template>

<script setup lang="ts">
import vSquare from "./vSquare.vue";
import { useSquareStore } from "@/stores/square";
import { useBoardStore } from "@/stores/board";
import { onMounted } from "vue";

const { getColour, getRankBySquareIndex, getFileBySquareIndex } =
  useSquareStore();
const { squareArray, populateBoardState } = useBoardStore();

onMounted(() => {
  populateBoardState();
});
</script>

<style lang="scss">
.v-chessboard {
  width: 100%;
  aspect-ratio: 1/1;
  position: relative;
}
</style>
