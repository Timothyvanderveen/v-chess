<template>
  <div class="chessboard--wrapper">
    <v-chessboard />
  </div>
</template>

<script setup lang="ts">
// imports
import vChessboard from "@/components/chess/vChessboard.vue";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { useBoardStore } from "./stores/board";

// stores
const boardStore = useBoardStore();
const { activeSquare, hoveringSquare, availableMoveCollection } =
  storeToRefs(boardStore);

onMounted(() => {
  window.addEventListener("mousedown", ({ clientX, clientY }) => {
    const element = document.elementFromPoint(clientX, clientY);
    if (element?.classList.contains("v-piece")) {
      activeSquare.value = parseInt(
        element.parentElement?.dataset.squareIndex as string
      );
    } else {
      activeSquare.value = 0;
      hoveringSquare.value = 0;
      availableMoveCollection.value = [];
    }
  });
});
</script>

<style lang="scss" scoped>
.chessboard--wrapper {
  display: flex;
  height: 100%;
  margin: auto auto;
  align-items: center;
  justify-content: center;

  &:deep(.v-chessboard) {
    width: 600px;
  }
}
</style>

<style>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@100;300&display=swap");
</style>
