<template>
  <div
    class="v-piece__wrapper"
    :style="{ translate: getPosition }"
    :data-square-index="props.squareIndex"
    :class="{
      active: props.id === activePieceId,
      hovering: hoveringSquare === squareIndex,
    }"
  >
    <img
      v-if="pieceType"
      ref="chessPiece"
      :src="pieceImage"
      class="v-piece"
      draggable="false"
      :data-piece-type="props.pieceType"
      :data-id="props.id"
    />
  </div>
</template>

<script setup lang="ts">
import { useBoardStore } from "@/stores/board";
import { usePieceStore } from "@/stores/piece";
import { useSquareStore } from "@/stores/square";
import { storeToRefs } from "pinia";
import { type PropType, computed, ref, type Ref, watch } from "vue";

// props

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
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

const { getOwner, startCantMoveAnimation, getPieceOnSquare } = usePieceStore();
const { activePieceId } = storeToRefs(usePieceStore());

const boardStore = useBoardStore();
const { hoveringSquare, availableMoveArray, availableTakeArray } =
  storeToRefs(boardStore);

const {
  getRankBySquareIndex,
  getFileBySquareIndex,
  getRankFileObject,
  hasOpponentPiece,
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

// moves

watch(
  () => activePieceId.value,
  (to) => {
    if (to === props.id) {
      setAvailableMoves();
    }
  }
);

// TODO move logic
const setAvailableMoves = () => {
  // if (props.pieceType.toLowerCase() === "p") {
  //   setAvailablePawnMoves();
  //   setAvailablePawnTakes();
  // }
  if (props.pieceType.toLowerCase() === "r") {
    calculateMovesAndTakes([cardinalInstructionsObject]);
  }
  if (props.pieceType.toLowerCase() === "k") {
    // movesTakesObject = getMovesAndTakes(cardinalInstructionsObject, 1);
  }
  if (props.pieceType.toLowerCase() === "q") {
    calculateMovesAndTakes([
      cardinalInstructionsObject,
      diagonalInstructionsObject,
    ]);
  }
  if (props.pieceType.toLowerCase() === "b") {
    calculateMovesAndTakes([diagonalInstructionsObject]);
  }
  if (props.pieceType.toLowerCase() === "n") {
    calculateMovesAndTakes([knightInstructionsObject]);
  }

  if (
    availableMoveArray.value.length === 0 &&
    availableTakeArray.value.length === 0
  ) {
    startCantMoveAnimation(props.squareIndex);
    activePieceId.value = 0;
  }
};

const cardinalInstructionsObject: InstructionsObject = {
  up: {
    availableSteps: ({ file, rank: _rank }: RankFileObject) => 8 - file,
    upDownCounter: 1,
    leftRightCounter: 0,
    target: "file",
  },
  down: {
    availableSteps: ({ file, rank: _rank }: RankFileObject) => file - 1,
    upDownCounter: -1,
    leftRightCounter: 0,
    target: "file",
  },
  right: {
    availableSteps: ({ file: _file, rank }: RankFileObject) => 8 - rank,
    upDownCounter: 0,
    leftRightCounter: 1,
    target: "rank",
  },
  left: {
    availableSteps: ({ file: _file, rank }: RankFileObject) => rank - 1,
    upDownCounter: 0,
    leftRightCounter: -1,
    target: "rank",
  },
};

const diagonalInstructionsObject: InstructionsObject = {
  topleft: {
    availableSteps: ({ file, rank: rank }: RankFileObject) =>
      Math.min(8 - file, rank - 1),
    upDownCounter: 1,
    leftRightCounter: -1,
    target: "a8-h1",
  },
  topright: {
    availableSteps: ({ file, rank: rank }: RankFileObject) =>
      Math.min(8 - file, 8 - rank),
    upDownCounter: 1,
    leftRightCounter: 1,
    target: "a1-h8",
  },
  bottomright: {
    availableSteps: ({ file: file, rank }: RankFileObject) =>
      Math.min(file - 1, 8 - rank),
    upDownCounter: -1,
    leftRightCounter: 1,
    target: "a8-h1",
  },
  bottomleft: {
    availableSteps: ({ file: file, rank }: RankFileObject) =>
      Math.min(file - 1, rank - 1),
    upDownCounter: -1,
    leftRightCounter: -1,
    target: "a1-h8",
  },
};

const knightInstructionsObject: InstructionsObject = {
  upright: {
    availableSteps: ({ file: _file, rank: _rank }: RankFileObject) => 1,
    upDownCounter: 2,
    leftRightCounter: 1,
    target: "upright",
  },
  rightup: {
    availableSteps: ({ file: _file, rank: _rank }: RankFileObject) => 1,
    upDownCounter: 1,
    leftRightCounter: 2,
    target: "rightup",
  },
  rightdown: {
    availableSteps: ({ file: _file, rank: _rank }: RankFileObject) => 1,
    upDownCounter: -1,
    leftRightCounter: 2,
    target: "rightdown",
  },
  downright: {
    availableSteps: ({ file: _file, rank: _rank }: RankFileObject) => 1,
    upDownCounter: -2,
    leftRightCounter: 1,
    target: "downright",
  },
  downleft: {
    availableSteps: ({ file: _file, rank: _rank }: RankFileObject) => 1,
    upDownCounter: -2,
    leftRightCounter: -1,
    target: "downleft",
  },
  leftdown: {
    availableSteps: ({ file: _file, rank: _rank }: RankFileObject) => 1,
    upDownCounter: -1,
    leftRightCounter: -2,
    target: "leftdown",
  },
  leftup: {
    availableSteps: ({ file: _file, rank: _rank }: RankFileObject) => 1,
    upDownCounter: 1,
    leftRightCounter: -2,
    target: "leftup",
  },
  upleft: {
    availableSteps: ({ file: _file, rank: _rank }: RankFileObject) => 1,
    upDownCounter: 2,
    leftRightCounter: -1,
    target: "upleft",
  },
};

const calculateMovesAndTakes = (
  instructionsObjectArray: InstructionsObject[],
  steps?: number
) => {
  const oldRankFile = getRankFileObject(props.squareIndex);
  const moveTakeCollection: MoveTakeObject[] = [];

  const allInstructionObjectArray = [...instructionsObjectArray];

  [cardinalInstructionsObject, diagonalInstructionsObject].forEach((e) => {
    if (!allInstructionObjectArray.includes(e)) {
      allInstructionObjectArray.push(e);
    }
  });

  availableMoveArray.value = [];
  availableTakeArray.value = [];

  let encounteredKingTarget: null | string = null;
  let encounteredAttackerTarget: null | string = null;

  allInstructionObjectArray.forEach((instructionsObject) => {
    const preventCheckOnly =
      !instructionsObjectArray.includes(instructionsObject);

    Object.keys(instructionsObject).forEach((direction) => {
      const target = instructionsObject[direction]?.target;

      const availableSteps = instructionsObject[direction].availableSteps({
        file: oldRankFile.file,
        rank: oldRankFile.rank,
      });

      let upDownCounter = 0;
      let leftRightCounter = 0;

      Array.from(Array(availableSteps).keys()).some((counter) => {
        if (steps && counter === steps) {
          return true;
        }

        upDownCounter += instructionsObject[direction].upDownCounter;
        leftRightCounter += instructionsObject[direction].leftRightCounter;

        const newRankFile = {
          rank: oldRankFile.rank + leftRightCounter,
          file: oldRankFile.file + upDownCounter,
        };

        if (
          Math.max(newRankFile.file, newRankFile.rank) > 8 ||
          Math.min(newRankFile.file, newRankFile.rank) < 1
        ) {
          return;
        }

        const squareIndex = getSquareIndexByCoordinates({
          file: newRankFile.file as vSquareFileNumber,
          rank: newRankFile.rank as vSquareRankNumber,
        });

        const foundPiece = getPieceOnSquare(squareIndex);

        if (foundPiece) {
          if (hasOpponentPiece(squareIndex, thisOwner.value)) {
            if (!preventCheckOnly) {
              moveTakeCollection.push({
                target,
                squareIndex,
                action: "take",
              });
            }

            if (instructionsObject === cardinalInstructionsObject) {
              if (["r", "q"].includes(foundPiece.type.toLowerCase())) {
                encounteredAttackerTarget = target;
              }
            }
            if (instructionsObject === diagonalInstructionsObject) {
              if (["b", "q"].includes(foundPiece.type.toLowerCase())) {
                encounteredAttackerTarget = target;
              }
            }
          } else if (foundPiece.type.toLowerCase() === "k") {
            encounteredKingTarget = target;
          }

          return true;
        }

        if (!preventCheckOnly) {
          moveTakeCollection.push({ target, squareIndex, action: "move" });
        }
      });
    });
  });

  moveTakeCollection.forEach((moveTakeObject) => {
    if (
      !encounteredKingTarget ||
      encounteredAttackerTarget !== encounteredKingTarget ||
      encounteredAttackerTarget === moveTakeObject.target
    ) {
      if (moveTakeObject.action === "move") {
        availableMoveArray.value.push(moveTakeObject.squareIndex);
      }
      if (moveTakeObject.action === "take") {
        availableTakeArray.value.push(moveTakeObject.squareIndex);
      }
    }
  });
};

// const setAvailablePawnMoves = () => {
//   const { file, rank } = getRankFileObject(props.squareIndex);

//   const squareIndex = getSquareIndexByCoordinates({
//     file: (file + (isWhite.value ? 1 : -1)) as vSquareFileNumber,
//     rank: rank,
//   });

//   if (hasPiece(squareIndex)) {
//     return;
//   }

//   availableMoveArray.value.push(squareIndex);

//   if (
//     (file === 2 && thisOwner.value === "white") ||
//     (file === 7 && thisOwner.value === "black")
//   ) {
//     const squareIndex = getSquareIndexByCoordinates({
//       file: (file + (isWhite.value ? 2 : -2)) as vSquareFileNumber,
//       rank: rank,
//     });

//     availableMoveArray.value.push(squareIndex);
//   }
// };

// const setAvailablePawnTakes = () => {
//   const { file, rank } = getRankFileObject(props.squareIndex);
//   const rankModifiers = [];

//   if (rank > 1) {
//     rankModifiers.push(rank - 1);
//   }
//   if (rank < 8) {
//     rankModifiers.push(rank + 1);
//   }

//   rankModifiers.forEach((rankModifier) => {
//     const squareIndex = getSquareIndexByCoordinates({
//       file: (file + (isWhite.value ? 1 : -1)) as vSquareFileNumber,
//       rank: rankModifier as vSquareFileNumber,
//     });

//     pushTake(squareIndex);
//   });
// };
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
  }

  &.hovering .v-piece {
    scale: 1.2;
  }
}
</style>
