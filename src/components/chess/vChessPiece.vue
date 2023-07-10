<template>
  <div
    class="v-piece__wrapper"
    :style="{ translate: getPosition }"
    :data-square-index="props.squareIndex"
    :class="{ active: props.squareIndex === activeSquare }"
  >
    <img
      v-if="pieceType"
      ref="chessPiece"
      :src="pieceImage"
      class="v-piece"
      draggable="false"
    />
  </div>
</template>

<script setup lang="ts">
import { useBoardStore } from "@/stores/board";
import { usePieceStore } from "@/stores/piece";
import { useSquareStore } from "@/stores/square";
import { storeToRefs } from "pinia";
import { type PropType, computed, onMounted, ref, type Ref, watch } from "vue";

// props

const props = defineProps({
  pieceType: {
    type: String as PropType<vPieceType>,
    required: true,
  },
  squareIndex: {
    type: Number,
    required: true,
  },
});

// store

const { getOwner } = usePieceStore();

const boardStore = useBoardStore();
const { hoveringSquare, activeSquare, availableMoveArray, availableTakeArray } =
  storeToRefs(boardStore);

const {
  getRankBySquareIndex,
  getFileBySquareIndex,
  getRankFileObject,
  hasOpponentPiece,
  hasPiece,
  getSquareIndexByCoordinates,
} = useSquareStore();

// element

const pieceImage = computed(() => {
  const fileName = `${
    isWhite.value ? "w" : "b"
  }${props.pieceType.toUpperCase()}`;

  return new URL(
    `../../assets/img/chesspieces/${fileName}.svg`,
    import.meta.url
  ).href;
});

const getPosition = computed(() => {
  const x = (getRankBySquareIndex(props.squareIndex) - 1) * 100;
  const y = (8 - getFileBySquareIndex(props.squareIndex)) * 100;
  return `${x}% ${y}%`;
});

// piece information

const thisOwner = computed(() => {
  return getOwner(props.pieceType);
});

const chessPiece: Ref<HTMLElement | null> = ref(null);

const isWhite = computed(() => getOwner(props.pieceType) === "white");

// events

onMounted(() => {
  chessPiece.value?.addEventListener("mouseover", () => {
    if (!activeSquare.value) {
      hoveringSquare.value = props.squareIndex;
    }
  });
  chessPiece.value?.addEventListener("mouseleave", () => {
    hoveringSquare.value = 0;
  });
});

// moves

watch(
  () => activeSquare.value,
  (to) => {
    if (to === props.squareIndex) {
      const hasSquares = setAvailableSquares();

      if (!hasSquares) {
        activeSquare.value = 0;
        chessPiece.value?.animate(
          [
            { transform: "rotate(0) scale(1)" },
            { transform: "rotate(15deg) scale(1.1)" },
            { transform: "rotate(-15deg) scale(1.1)" },
            { transform: "rotate(15deg) scale(1.1)" },
            { transform: "rotate(0) scale(1)" },
          ],
          {
            duration: 500,
          }
        );
      }
    }
  }
);

const setAvailableSquares = () => {
  availableMoveArray.value = [];
  availableTakeArray.value = [];
  if (props.pieceType.toLowerCase() === "p") {
    setAvailablePawnMoves();
    setAvailablePawnTakes();
  }
  if (props.pieceType.toLowerCase() === "r") {
    setCardinalMovesAndTakes();
  }
  if (props.pieceType.toLowerCase() === "k") {
    setCardinalMovesAndTakes(1);
  }
  if (props.pieceType.toLowerCase() === "q") {
    setCardinalMovesAndTakes();
  }

  return (
    availableMoveArray.value.length > 0 || availableTakeArray.value.length > 0
  );
};

const setAvailablePawnMoves = () => {
  const { file, rank } = getRankFileObject(props.squareIndex);

  const squareIndex = getSquareIndexByCoordinates({
    file: (file + (isWhite.value ? 1 : -1)) as vSquareFileNumber,
    rank: rank,
  });

  if (hasPiece(squareIndex)) {
    return;
  }

  availableMoveArray.value.push(squareIndex);

  if (
    (file === 2 && thisOwner.value === "white") ||
    (file === 7 && thisOwner.value === "black")
  ) {
    const squareIndex = getSquareIndexByCoordinates({
      file: (file + (isWhite.value ? 2 : -2)) as vSquareFileNumber,
      rank: rank,
    });

    availableMoveArray.value.push(squareIndex);
  }
};

const setAvailablePawnTakes = () => {
  const { file, rank } = getRankFileObject(props.squareIndex);
  const rankModifiers = [];

  if (rank > 1) {
    rankModifiers.push(rank - 1);
  }
  if (rank < 8) {
    rankModifiers.push(rank + 1);
  }

  rankModifiers.forEach((rankModifier) => {
    const squareIndex = getSquareIndexByCoordinates({
      file: (file + (isWhite.value ? 1 : -1)) as vSquareFileNumber,
      rank: rankModifier as vSquareFileNumber,
    });

    if (hasOpponentPiece(squareIndex, thisOwner.value)) {
      availableTakeArray.value.push(squareIndex);
    }
  });
};

const setCardinalMovesAndTakes = (steps: number | null = null) => {
  const { file, rank } = getRankFileObject(props.squareIndex);

  (["up", "down", "right", "left"] as CardinalDirections[]).forEach(
    (direction) => {
      let availableSteps;
      let encounteredPiece = false;

      if (direction === "up" || direction === "down") {
        availableSteps = steps ?? (direction === "up" ? 8 - file : file - 1);
      } else {
        availableSteps = steps ?? (direction === "right" ? 8 - rank : rank - 1);
      }

      Array.from(Array(availableSteps).keys()).forEach((counter) => {
        if (encounteredPiece) {
          return;
        }

        const updatedCounter =
          direction === "up" || direction === "right"
            ? counter + 1
            : -counter - 1;

        let newFile;
        let newRank;

        if (direction === "up" || direction === "down") {
          newFile = file + updatedCounter;
          newRank = rank;
        } else {
          newFile = file;
          newRank = rank + updatedCounter;
        }

        const squareIndex = getSquareIndexByCoordinates({
          file: newFile as vSquareFileNumber,
          rank: newRank as vSquareRankNumber,
        });

        if (hasPiece(squareIndex)) {
          encounteredPiece = true;
          if (hasOpponentPiece(squareIndex, getOwner(props.pieceType))) {
            availableTakeArray.value.push(squareIndex);
          }
          return;
        }

        availableMoveArray.value.push(squareIndex);
      });
    }
  );
};
</script>

<style lang="scss" scoped>
.v-piece__wrapper {
  width: 12.5%;
  aspect-ratio: 1/1;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: translate 0.2s ease-in-out;

  &.active .v-piece {
    scale: 1.2;
  }

  .v-piece {
    width: 80%;
    user-select: none;
    cursor: pointer;
    transition: scale 0.2s ease-in-out;

    &:hover {
      scale: 1.2;
    }
  }
}
</style>
