<template>
  <div class="chessboard--wrapper">
    <VChessboard />
  </div>
</template>

<script setup lang="ts">
import VChessboard from '~/components/chess/vChessboard.vue';
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
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@100;300&display=swap');
</style>
