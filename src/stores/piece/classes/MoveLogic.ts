import { useBoardStore } from "@/stores/board";
import { usePieceStore } from "..";
import { storeToRefs } from "pinia";
import { useSquareStore } from "@/stores/square";

export default class MoveLogic {
  pieceId: number;
  playerColour: "white" | "black";
  pieceType;
  squareIndex;

  // stores

  pieceStore;
  pieceStoreRefs;

  boardStore;
  boardStoreRefs;

  squareStore;
  squareStoreRefs;

  constructor({
    pieceId,
    playerColour,
    pieceType,
    squareIndex,
  }: {
    pieceId: number;
    playerColour: vPlayerColour;
    pieceType: vPieceType;
    squareIndex: number;
  }) {
    this.pieceId = pieceId;
    this.playerColour = playerColour;
    this.pieceType = pieceType;
    this.squareIndex = squareIndex;

    this.pieceStore = usePieceStore();
    this.pieceStoreRefs = storeToRefs(this.pieceStore);

    this.boardStore = useBoardStore();
    this.boardStoreRefs = storeToRefs(this.boardStore);

    this.squareStore = useSquareStore();
    this.squareStoreRefs = storeToRefs(this.squareStore);
  }

  // shorthands

  isPieceType = (typeToCheck: vPieceType) =>
    this.pieceStore.isPieceType(this.pieceType, typeToCheck);

  isWhite = () => this.playerColour === "white";

  getPieceFromCollection = () =>
    this.pieceStoreRefs.pieceCollection.value[this.pieceId];

  getMoveArray = () => this.getPieceFromCollection().moves ?? [];
  getTakeArray = () => this.getPieceFromCollection().takes ?? [];

  setMoveArray = (newValue: number[]) =>
    (this.pieceStoreRefs.pieceCollection.value[this.pieceId].moves = newValue);
  setTakeArray = (newValue: number[]) =>
    (this.pieceStoreRefs.pieceCollection.value[this.pieceId].takes = newValue);

  // instructions

  instructions: { [key: string]: InstructionsObject } = {
    cardinal: {
      up: {
        availableSteps: ({ file: _file, rank }: RankFileObject) => 8 - rank,
        upDownCounter: () => 1,
        leftRightCounter: () => 0,
        line: "file",
      },
      down: {
        availableSteps: ({ file: _file, rank }: RankFileObject) => rank - 1,
        upDownCounter: () => -1,
        leftRightCounter: () => 0,
        line: "file",
      },
      right: {
        availableSteps: ({ file, rank: _rank }: RankFileObject) => 8 - file,
        upDownCounter: () => 0,
        leftRightCounter: () => 1,
        line: "rank",
      },
      left: {
        availableSteps: ({ file, rank: _rank }: RankFileObject) => file - 1,
        upDownCounter: () => 0,
        leftRightCounter: () => -1,
        line: "rank",
      },
    },

    diagonal: {
      topleft: {
        availableSteps: ({ file, rank }: RankFileObject) =>
          Math.min(8 - rank, file - 1),
        upDownCounter: () => 1,
        leftRightCounter: () => -1,
        line: "a8-h1",
      },
      topright: {
        availableSteps: ({ file, rank }: RankFileObject) =>
          Math.min(8 - file, 8 - rank),
        upDownCounter: () => 1,
        leftRightCounter: () => 1,
        line: "a1-h8",
      },
      bottomright: {
        availableSteps: ({ file, rank }: RankFileObject) =>
          Math.min(rank - 1, 8 - file),
        upDownCounter: () => -1,
        leftRightCounter: () => 1,
        line: "a8-h1",
      },
      bottomleft: {
        availableSteps: ({ file: file, rank }: RankFileObject) =>
          Math.min(file - 1, rank - 1),
        upDownCounter: () => -1,
        leftRightCounter: () => -1,
        line: "a1-h8",
      },
    },

    pawn: {
      moveupdown: {
        availableSteps: ({ rank, file: _file }) =>
          rank === 2 || rank === 7 ? 2 : 1,
        upDownCounter: () => (this.isWhite() ? 1 : -1),
        leftRightCounter: () => 0,
        line: "file",
      },
      takeleft: {
        availableSteps: (_fileRankObject) => 1,
        upDownCounter: () => (this.isWhite() ? 1 : -1),
        leftRightCounter: () => -1,
        line: this.isWhite() ? "a8-h1" : "a1-h8",
      },
      takeright: {
        availableSteps: (_fileRankObject) => 1,
        upDownCounter: () => (this.isWhite() ? 1 : -1),
        leftRightCounter: () => 1,
        line: this.isWhite() ? "a1-h8" : "a8-h1",
      },
    },

    knight: {
      upright: {
        availableSteps: (_fileRankObject) => 1,
        upDownCounter: () => 2,
        leftRightCounter: () => 1,
        line: "upright",
      },
      rightup: {
        availableSteps: (_fileRankObject) => 1,
        upDownCounter: () => 1,
        leftRightCounter: () => 2,
        line: "rightup",
      },
      rightdown: {
        availableSteps: (_fileRankObject) => 1,
        upDownCounter: () => -1,
        leftRightCounter: () => 2,
        line: "rightdown",
      },
      downright: {
        availableSteps: (_fileRankObject) => 1,
        upDownCounter: () => -2,
        leftRightCounter: () => 1,
        line: "downright",
      },
      downleft: {
        availableSteps: (_fileRankObject) => 1,
        upDownCounter: () => -2,
        leftRightCounter: () => -1,
        line: "downleft",
      },
      leftdown: {
        availableSteps: (_fileRankObject) => 1,
        upDownCounter: () => -1,
        leftRightCounter: () => -2,
        line: "leftdown",
      },
      leftup: {
        availableSteps: (_fileRankObject) => 1,
        upDownCounter: () => 1,
        leftRightCounter: () => -2,
        line: "leftup",
      },
      upleft: {
        availableSteps: (_fileRankObject) => 1,
        upDownCounter: () => 2,
        leftRightCounter: () => -1,
        line: "upleft",
      },
    },
  };

  onlyUpdateAvailableMoves = false;

  setAvailableMoves = (onlyUpdate = false) => {
    this.onlyUpdateAvailableMoves = onlyUpdate;
    const instructionKeys: Array<keyof typeof this.instructions> = [];
    let steps: number | null = null;

    switch (this.pieceType.toLowerCase()) {
      case "p":
        instructionKeys.push("pawn");
        break;
      case "r":
        instructionKeys.push("cardinal");
        break;
      case "k":
        instructionKeys.push("diagonal");
        instructionKeys.push("cardinal");
        steps = 1;
        break;
      case "q":
        instructionKeys.push("diagonal");
        instructionKeys.push("cardinal");
        break;
      case "b":
        instructionKeys.push("diagonal");
        break;
      case "n":
        instructionKeys.push("knight");
        break;
    }

    this.calculateMovesAndTakes(instructionKeys, steps);

    if (this.getMoveArray().length === 0 && this.getTakeArray().length === 0) {
      if (this.pieceStoreRefs.activePieceId.value === this.pieceId) {
        this.pieceStore.startCantMoveAnimation(this.squareIndex);
      }
      this.pieceStoreRefs.activePieceId.value = 0;
    }
  };

  getWithPreventCheckKeys = (
    instructionKeyArray: Array<keyof typeof this.instructions>
  ) => {
    const allInstructionKeys = [...instructionKeyArray];

    ["diagonal", "cardinal"].forEach((e) => {
      if (!allInstructionKeys.includes(e)) {
        allInstructionKeys.push(e);
      }
    });

    return allInstructionKeys;
  };

  // move calculation

  moveTakeCollection: MoveTakeObject[] = [];
  encounteredPieceLines = {
    king: null as string | null,
    attacker: null as string | null,
  };

  resetForNewCalculation = () => {
    this.setMoveArray([]);
    this.setTakeArray([]);
    this.moveTakeCollection = [];
    this.encounteredPieceLines = { king: null, attacker: null };
    this.pieceStoreRefs.pieceCollection.value[this.pieceId].encounteredPieces =
      { own: [], opponent: [] };
  };

  calculateMovesAndTakes = (
    instructionKeyArray: Array<keyof typeof this.instructions>,
    steps: number | null
  ) => {
    const oldRankFile = this.squareStore.getRankFileObject(this.squareIndex);

    this.resetForNewCalculation();

    this.getWithPreventCheckKeys(instructionKeyArray).forEach(
      (instructionKey) => {
        const preventCheckOnly = !instructionKeyArray.includes(instructionKey);
        const currentInstruction = this.instructions[instructionKey];

        Object.keys(currentInstruction).forEach((direction) => {
          const line = currentInstruction[direction]?.line;

          const availableSteps =
            currentInstruction[direction].availableSteps(oldRankFile);

          let upDownCounter = 0;
          let leftRightCounter = 0;

          for (let counter = 0; counter < availableSteps; counter++) {
            const instructionStepReached =
              steps &&
              counter === steps &&
              instructionKeyArray.includes(instructionKey);

            if (instructionStepReached) {
              return true;
            }

            upDownCounter += currentInstruction[direction].upDownCounter();
            leftRightCounter +=
              currentInstruction[direction].leftRightCounter();

            const newRankFile = {
              rank: oldRankFile.rank + upDownCounter,
              file: oldRankFile.file + leftRightCounter,
            };

            if (this.boardStore.rankFileExceedsBoardBounds(newRankFile)) {
              return;
            }

            const newSquareIndex = this.squareStore.getSquareIndexByCoordinates(
              {
                file: newRankFile.file as vSquareFileNumber,
                rank: newRankFile.rank as vSquareRankNumber,
              }
            );

            const handledFoundPiece = this.handleFoundPiece(
              newSquareIndex,
              line,
              instructionKey,
              preventCheckOnly
            );

            if (handledFoundPiece) {
              return true;
            } else {
              this.handleMove(newSquareIndex, line, preventCheckOnly);
            }
          }
        });
      }
    );

    this.validateMoveAndTakes();
  };

  handleFoundPiece = (
    newSquareIndex: number,
    currentLine: string,
    currentInstructionKey: keyof typeof this.instructions,
    preventCheckOnly: boolean
  ) => {
    const foundPiece = this.pieceStore.getPieceOnSquare(newSquareIndex);

    if (foundPiece) {
      const foundPieceIsKing = foundPiece.type.toLowerCase() === "k";
      const isNotPawnOrTakingOnFileLine =
        !this.isPieceType("p") || currentLine !== "file";

      const hasOpponentPiece = this.squareStore.hasOpponentPiece(
        newSquareIndex,
        this.playerColour
      );

      if (hasOpponentPiece) {
        this.encounterPiece("opponent", newSquareIndex, preventCheckOnly);

        if (!preventCheckOnly && isNotPawnOrTakingOnFileLine) {
          this.moveTakeCollection.push({
            line: currentLine,
            squareIndex: newSquareIndex,
            action: "take",
          });
        }

        this.checkForChecks(
          currentInstructionKey,
          foundPiece.type,
          currentLine
        );

        return true;
      }

      if (foundPieceIsKing) {
        this.encounteredPieceLines.king = currentLine;
      }

      this.encounterPiece("own", newSquareIndex, preventCheckOnly);

      return true;
    } else if (
      this.isPieceType("p") &&
      currentInstructionKey === "pawn" &&
      (currentLine === "a1-h8" || currentLine === "a8-h1")
    ) {
      this.moveTakeCollection.push({
        line: currentLine,
        squareIndex: newSquareIndex,
        action: "take",
      });

      return true;
    }

    return false;
  };

  encounterPiece = (
    type: "own" | "opponent",
    squareIndex: number,
    preventCheckOnly: boolean
  ) => {
    if (!preventCheckOnly) {
      this.pieceStoreRefs.pieceCollection.value[this.pieceId].encounteredPieces[
        type
      ].push(squareIndex);
    }
  };

  checkForChecks = (
    currentInstructionKey: keyof typeof this.instructions,
    foundPieceType: vPieceType,
    currentLine: string
  ) => {
    const lineToPieceMapping = {
      cardinal: ["r", "q"],
      diagonal: ["b", "q"],
    };

    if (
      Object.keys(lineToPieceMapping).includes(currentInstructionKey.toString())
    ) {
      const pieceTypes =
        lineToPieceMapping[currentInstructionKey as "cardinal" | "diagonal"];
      if (pieceTypes && pieceTypes.includes(foundPieceType.toLowerCase())) {
        this.encounteredPieceLines.attacker = currentLine;
      }
    }
  };

  handleMove = (
    newSquareIndex: number,
    currentLine: string,
    preventCheckOnly: boolean
  ) => {
    if (
      !preventCheckOnly &&
      (!this.isPieceType("p") || !["a1-h8", "a8-h1"].includes(currentLine))
    ) {
      this.moveTakeCollection.push({
        line: currentLine,
        squareIndex: newSquareIndex,
        action: "move",
      });
    }
  };

  crossingDangerousSquare = (squareIndex: number) => {
    return this.pieceStore
      .getPieceCollectionEntries()
      .filter(([_key, value]) => value.owner !== this.playerColour)
      .some(([_key, value]) => {
        const crossingMoveableSquare =
          value.moves.includes(squareIndex) &&
          !this.pieceStore.isPieceType(value.type, "p");
        const crossingTakeableSquare = value.takes.includes(squareIndex);
        const takingOpponentSquare =
          value.encounteredPieces.own.includes(squareIndex);

        return (
          crossingMoveableSquare ||
          crossingTakeableSquare ||
          takingOpponentSquare
        );
      });
  };

  validateMoveAndTakes = () => {
    const hasNotEncounteredKing = !this.encounteredPieceLines.king;
    const attackerLineIsNotKingLine =
      this.encounteredPieceLines.attacker !== this.encounteredPieceLines.king;

    this.moveTakeCollection.forEach((moveTakeObject) => {
      const attackerOnLineIsTakeable =
        this.encounteredPieceLines.attacker === moveTakeObject.line;

      if (
        this.isPieceType("k") &&
        this.crossingDangerousSquare(moveTakeObject.squareIndex)
      ) {
        return;
      }

      if (
        hasNotEncounteredKing ||
        attackerLineIsNotKingLine ||
        attackerOnLineIsTakeable
      ) {
        if (moveTakeObject.action === "move") {
          this.setMoveArray([
            ...this.getMoveArray(),
            moveTakeObject.squareIndex,
          ]);
        }
        if (moveTakeObject.action === "take") {
          this.setTakeArray([
            ...this.getTakeArray(),
            moveTakeObject.squareIndex,
          ]);
        }
      }
    });
  };
}
