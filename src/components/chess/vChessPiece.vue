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
  const fileName = `${isWhite ? "w" : "b"}${props.pieceType.toUpperCase()}`;

  return new URL(
    `../../assets/img/chesspieces/${fileName}.svg`,
    import.meta.url
  ).href;
});

const getPosition = computed(() => {
  const x = (getFileBySquareIndex(props.squareIndex) - 1) * 100;
  const y = (8 - getRankBySquareIndex(props.squareIndex)) * 100;
  return `${x}% ${y}%`;
});

// piece information

const thisOwner = computed(() => {
  return getOwner(props.pieceType);
});

const chessPiece: Ref<HTMLElement | null> = ref(null);

const isWhite = getOwner(props.pieceType) === "white";

const isPawn = props.pieceType.toLowerCase() === "p";

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
  if (props.pieceType.toLowerCase() === "p") {
    calculateMovesAndTakes([pawnInstructionsObject]);
  }
  if (props.pieceType.toLowerCase() === "r") {
    calculateMovesAndTakes([cardinalInstructionsObject]);
  }
  if (props.pieceType.toLowerCase() === "k") {
    calculateMovesAndTakes(
      [cardinalInstructionsObject, diagonalInstructionsObject],
      1
    );
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
    availableSteps: ({ file: _file, rank }: RankFileObject) => 8 - rank,
    upDownCounter: 1,
    leftRightCounter: 0,
    target: "file",
  },
  down: {
    availableSteps: ({ file: _file, rank }: RankFileObject) => rank - 1,
    upDownCounter: -1,
    leftRightCounter: 0,
    target: "file",
  },
  right: {
    availableSteps: ({ file, rank: _rank }: RankFileObject) => 8 - file,
    upDownCounter: 0,
    leftRightCounter: 1,
    target: "rank",
  },
  left: {
    availableSteps: ({ file, rank: _rank }: RankFileObject) => file - 1,
    upDownCounter: 0,
    leftRightCounter: -1,
    target: "rank",
  },
};

const diagonalInstructionsObject: InstructionsObject = {
  topleft: {
    availableSteps: ({ file, rank }: RankFileObject) =>
      Math.min(8 - rank, file - 1),
    upDownCounter: 1,
    leftRightCounter: -1,
    target: "a8-h1",
  },
  topright: {
    availableSteps: ({ file, rank }: RankFileObject) =>
      Math.min(8 - file, 8 - rank),
    upDownCounter: 1,
    leftRightCounter: 1,
    target: "a1-h8",
  },
  bottomright: {
    availableSteps: ({ file, rank }: RankFileObject) =>
      Math.min(rank - 1, 8 - file),
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

const pawnInstructionsObject: InstructionsObject = {
  moveupdown: {
    availableSteps: ({ rank, file: _file }) =>
      rank === 2 || rank === 7 ? 2 : 1,
    upDownCounter: isWhite ? 1 : -1,
    leftRightCounter: 0,
    target: "file",
  },
  takeleft: {
    availableSteps: (_fileRankObject) => 1,
    upDownCounter: isWhite ? 1 : -1,
    leftRightCounter: -1,
    target: isWhite ? "a1-h8" : "a8-h1",
  },
  takeright: {
    availableSteps: (_fileRankObject) => 1,
    upDownCounter: isWhite ? 1 : -1,
    leftRightCounter: 1,
    target: isWhite ? "a1-h8" : "a8-h1",
  },
};

const knightInstructionsObject: InstructionsObject = {
  upright: {
    availableSteps: (_fileRankObject) => 1,
    upDownCounter: 2,
    leftRightCounter: 1,
    target: "upright",
  },
  rightup: {
    availableSteps: (_fileRankObject) => 1,
    upDownCounter: 1,
    leftRightCounter: 2,
    target: "rightup",
  },
  rightdown: {
    availableSteps: (_fileRankObject) => 1,
    upDownCounter: -1,
    leftRightCounter: -2,
    target: "rightdown",
  },
  downright: {
    availableSteps: (_fileRankObject) => 1,
    upDownCounter: -2,
    leftRightCounter: 1,
    target: "downright",
  },
  downleft: {
    availableSteps: (_fileRankObject) => 1,
    upDownCounter: -2,
    leftRightCounter: -1,
    target: "downleft",
  },
  leftdown: {
    availableSteps: (_fileRankObject) => 1,
    upDownCounter: -1,
    leftRightCounter: -2,
    target: "leftdown",
  },
  leftup: {
    availableSteps: (_fileRankObject) => 1,
    upDownCounter: 1,
    leftRightCounter: -2,
    target: "leftup",
  },
  upleft: {
    availableSteps: (_fileRankObject) => 1,
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
        if (
          steps &&
          counter === steps &&
          instructionsObjectArray.includes(instructionsObject)
        ) {
          return true;
        }

        upDownCounter += instructionsObject[direction].upDownCounter;
        leftRightCounter += instructionsObject[direction].leftRightCounter;

        const newRankFile = {
          rank: oldRankFile.rank + upDownCounter,
          file: oldRankFile.file + leftRightCounter,
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
            if (!preventCheckOnly && (!isPawn || target !== "file")) {
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

        if (
          !preventCheckOnly &&
          (!isPawn || !["a1-h8", "a8-h1"].includes(target))
        ) {
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
