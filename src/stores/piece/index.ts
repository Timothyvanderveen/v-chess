import { defineStore } from 'pinia';
import { useBoardStore } from '../board';
import { computed, reactive, ref, type Ref } from 'vue';
import { useTurnStore } from '../turn';
import MoveLogic from './classes/MoveLogic';

export const usePieceStore = defineStore('piece', () => {
  // stores

  // const { availableMoveArray, availableTakeArray } = storeToRefs(
  //   useBoardStore()
  // );

  const { makeTurn } = useTurnStore();

  // piece information

  const getOwner = (pieceType: vPieceType) => {
    if (pieceType.toUpperCase() === pieceType) {
      return 'white';
    }
    if (pieceType.toLowerCase() === pieceType) {
      return 'black';
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

  const isKing = (pieceType: vPieceType) => pieceType.toLowerCase() === 'k';

  // piece collection

  const pieceCollection: vPieceCollection = reactive({});

  const getPieceCollectionEntries = () => {
    return Object.entries(pieceCollection) as [key: [key: string, value: vPieceObject]];
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

  const pieceIdsToDelete: Ref<number[]> = ref([]);

  const activePieceId: Ref<number | null> = ref(null);
  const activePiece = computed(() => {
    return activePieceId.value ? pieceCollection[activePieceId.value] : null;
  });

  const unselectPiece = () => {
    useBoardStore().availableMoveArray = [];
    useBoardStore().availableTakeArray = [];
    activePieceId.value = null;
  };

  const addPiece = ({ squareIndex, pieceType }: { squareIndex: number; pieceType: vPieceType }) => {
    const newID = createID();
    pieceCollection[newID] = {
      owner: getOwner(pieceType),
      type: pieceType,
      squareIndex,
      moves: [],
      takes: [],
      id: newID,
      encounteredPieces: {
        own: [],
        opponent: [],
      },
    };
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

    getPieceCollectionEntries().forEach(([_key, value]) => {
      const movesAffected = value.moves.includes(from) || value.moves.includes(to);
      const takesAffected = value.takes.includes(from) || value.takes.includes(to);
      const ownPiecesAffected =
        value.encounteredPieces.own.includes(to) || value.encounteredPieces.own.includes(from);
      const opponentPiecesAffected =
        value.encounteredPieces.opponent.includes(to) ||
        value.encounteredPieces.opponent.includes(from);

      if (movesAffected || takesAffected || ownPiecesAffected || opponentPiecesAffected) {
        createMoveLogic(value.id).setAvailableMoves();
      }
    });
  };

  const getPieceElement = (squareIndex: number): HTMLElement | null => {
    return document.querySelector(`.v-piece__wrapper[data-square-index="${squareIndex}"] .v-piece`);
  };

  const startCantMoveAnimation = (squareIndex: number) => {
    getPieceElement(squareIndex)?.animate(
      [
        { transform: 'rotate(0) scale(1)' },
        { transform: 'rotate(15deg) scale(1.1)' },
        { transform: 'rotate(-15deg) scale(1.1)' },
        { transform: 'rotate(15deg) scale(1.1)' },
        { transform: 'rotate(0) scale(1)' },
      ],
      {
        duration: 500,
      },
    );
  };

  // removing pieces

  const removePiece = (squareIndex: number) => {
    Object.entries(pieceCollection).some(([key, value]) => {
      if (value.squareIndex === squareIndex) {
        pieceIdsToDelete.value.push(parseInt(key) as number);
        startDeathAnimation(squareIndex);
        return true;
      }
    });
  };

  const startDeathAnimation = (squareIndex: number) => {
    const pieceElement = getPieceElement(squareIndex);
    if (!pieceElement) return;
    const randomSideNumber = Math.floor(Math.random() * 2);
    const xModifier = randomSideNumber === 0 ? '40%' : '-40%';
    const degModifier = randomSideNumber === 0 ? '20deg' : '-20deg';
    pieceElement.classList.add('deleting');
    pieceElement
      .animate(
        [
          { opacity: 1 },
          {
            transform: `translate(${xModifier}, -40%) rotate(${degModifier})`,
            opacity: 0,
            zIndex: 1,
          },

          { opacity: 0 },
        ],
        {
          duration: 300,
        },
      )
      .addEventListener('finish', () => {
        checkForDeletion(pieceElement);
      });
  };

  const checkForDeletion = (pieceElement: HTMLElement) => {
    if (!pieceElement.dataset.id) {
      return;
    }
    const id = parseInt(pieceElement.dataset.id);

    pieceIdsToDelete.value = pieceIdsToDelete.value.filter((pieceIdToDelete) => {
      if (pieceIdToDelete === id) {
        delete pieceCollection[id];
        return false;
      }
      return true;
    });
  };

  const affectedPiecesByMoveArray: Ref<number[]> = ref([]);

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

  const createMoveLogic = (id: keyof typeof pieceCollection) => {
    return new MoveLogic({
      pieceId: pieceCollection[id].id,
      playerColour: getOwner(pieceCollection[id].type),
      pieceType: pieceCollection[id].type,
      squareIndex: pieceCollection[id].squareIndex,
    });
  };

  return {
    getOwner,
    hasMove,
    pieceCollection,
    getPieceCollectionEntries,
    addPiece,
    removePiece,
    movePiece,
    startCantMoveAnimation,
    startDeathAnimation,
    getPieceElement,
    getKingInCheck,
    affectedPiecesByMoveArray,
    isKing,
    activePieceId,
    activePiece,
    unselectPiece,
    getPieceOnSquare,
    pieceIdsToDelete,
    isPieceType,
    checkForDeletion,
    createMoveLogic,
  };
});
