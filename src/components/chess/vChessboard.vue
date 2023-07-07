<template>
  <div class="v-chessboard">
    <vSquare
      v-for="index in squareArray"
      :id="index"
      :key="index"
      :colour="getColour(index)"
      :file="getFile(index)"
      :rank="getRank(index)"
    />
  </div>
</template>

<script setup lang="ts">
import vSquare from './vSquare.vue'

const squareArray = Array.from(Array(64).keys()).map((e) => ++e)
const rankArray = Array.from(Array(8).keys()).map((e) => ++e)
const fileArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

const getColour = (index: number): vSquareColour => {
  if (Math.ceil(index / 8) % 2 === 0) {
    if (index % 2 === 0) {
      return 'black'
    } else {
      return 'white'
    }
  }
  if (Math.floor((index - 1) / 8) % 2 === 0) {
    if (index % 2 === 0) {
      return 'white'
    } else {
      return 'black'
    }
  }
  throw Error('invalid colour')
}

const getFile = (index: number): vSquareFile => {
  const file: string | null = fileArray[(index - 1) % 8] ?? null
  if (file === null) throw Error('invalid file')
  return file as vSquareFile
}

const getRank = (index: number): vSquareRank => {
  const rank: number | null = rankArray[Math.ceil(index / 8) - 1]
  if (rank === null) throw Error('invalid rank')
  return rank as vSquareRank
}
</script>

<style lang="scss">
.v-chessboard {
  width: 100%;
  aspect-ratio: 1/1;
  position: relative;
}
</style>
