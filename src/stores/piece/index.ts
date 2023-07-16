import { defineStore } from "pinia";
import { useBoardStore } from "../board";
import { computed, reactive, ref, type Ref } from "vue";
import { useTurnStore } from "../turn";

export const usePieceStore = defineStore("piece", () => {
  // stores

  // const { availableMoveArray, availableTakeArray } = storeToRefs(
  //   useBoardStore()
  // );

  const { makeTurn } = useTurnStore();

  // piece information

  const getOwner = (pieceType: vPieceType) => {
    if (pieceType.toUpperCase() === pieceType) {
      return "white";
    }
    if (pieceType.toLowerCase() === pieceType) {
      return "black";
    }
    throw new Error(`invalid piece type: ${pieceType}`);
  };

  const hasMove = (squareIndex: number) => {
    return (
      useBoardStore().availableMoveArray.includes(squareIndex) ||
      useBoardStore().availableTakeArray.includes(squareIndex)
    );
  };

  const isPieceType = (currentPieceType: vPieceType, typeToCheck: vPieceType) =>
    currentPieceType.toLowerCase() === typeToCheck.toLowerCase();

  const isKing = (pieceType: vPieceType) => pieceType.toLowerCase() === "k";

  // piece collection

  const pieceCollection: vPieceCollection = reactive({});

  const getPieceCollectionEntries = () => {
    return Object.entries(pieceCollection) as [
      key: [key: string, value: vPieceObject]
    ];
  };

  const getPieceOnSquare = (squareIndex: number) => {
    let pieceId = null;
    getPieceCollectionEntries().some(([key, value]) => {
      if (value.squareIndex === squareIndex) {
        pieceId = key;
        return true;
      }
    });
    return pieceId ? pieceCollection[pieceId] : pieceId;
  };

  let IDcounter = 0;
  const createID = (): number => {
    return ++IDcounter;
  };

  const activePieceId: Ref<number | null> = ref(null);
  const activePiece = computed(() => {
    return activePieceId.value ? pieceCollection[activePieceId.value] : null;
  });

  const unselectPiece = () => {
    useBoardStore().availableMoveArray = [];
    useBoardStore().availableTakeArray = [];
    activePieceId.value = null;
  };

  const addPiece = ({
    squareIndex,
    pieceType,
  }: {
    squareIndex: number;
    pieceType: vPieceType;
  }) => {
    const newID = createID();
    pieceCollection[newID] = {
      owner: getOwner(pieceType),
      type: pieceType,
      squareIndex,
      moves: [],
      takes: [],
      id: newID,
    };
  };

  const removePiece = (squareIndex: number) => {
    Object.entries(pieceCollection).some(([key, value]) => {
      if (value.squareIndex === squareIndex) {
        delete pieceCollection[parseInt(key) as number];
        return true;
      }
    });
  };

  const movePiece = (to: number, from: number) => {
    let toKey = -1;
    let fromKey = -1;

    Object.entries(pieceCollection).forEach(function ([key, value]) {
      if (value.squareIndex === from) {
        fromKey = parseInt(key);
      }

      if (value.squareIndex === to) {
        toKey = parseInt(key);
      }
    });

    makeTurn(pieceCollection[fromKey].owner, to, from);

    if (toKey && pieceCollection[toKey]) {
      removePiece(pieceCollection[toKey].squareIndex);
    }
    if (fromKey && pieceCollection[fromKey]) {
      pieceCollection[fromKey].squareIndex = to;
    }

    unselectPiece();
  };

  const getPieceElement = (squareIndex: number): HTMLElement | null => {
    return document.querySelector(
      `.v-piece__wrapper[data-square-index="${squareIndex}"] .v-piece`
    );
  };

  const startCantMoveAnimation = (squareIndex: number) => {
    getPieceElement(squareIndex)?.animate(
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
  };

  const checkingPieceSquareIndex = ref(0);

  const getKingInCheck = computed(() => {
    return false;
    // let kingPlayer: vPlayerColour | null = null;
    // Object.entries(pieceCollection).find(([key, value]) => {
    //   const isKing = value.type.toLowerCase() === "k";
    //   if (isKing && lastAvailableTakeArray.value.includes(value.squareIndex)) {
    //     kingPlayer = getOwner(value.type);
    //     return true;
    //   }
    // });
    // return kingPlayer;
  });

  return {
    getOwner,
    hasMove,
    pieceCollection,
    getPieceCollectionEntries,
    addPiece,
    removePiece,
    movePiece,
    startCantMoveAnimation,
    getPieceElement,
    getKingInCheck,
    checkingPieceSquareIndex,
    isKing,
    activePieceId,
    activePiece,
    unselectPiece,
    getPieceOnSquare,
    isPieceType,
  };
});
