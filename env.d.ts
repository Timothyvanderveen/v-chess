/// <reference types="vite/client" />

type BlackWhite = "black" | "white";
type vSquareColour = BlackWhite;
type vPlayerColour = BlackWhite;

// board

type vBoardState = Array<vSquareState>;

// coordinates

type OneThroughEight = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type vSquareFileLetter = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h";
type vSquareFileNumber = OneThroughEight;
type vSquareRankNumber = OneThroughEight;

// square

interface vSquareState {
  file: vSquareFileNumber;
  rank: vSquareRankNumber;
  squareIndex: number;
}

// moves

interface AvailableMoveCollection {
  cardinal?: Array<AvailableMove>;
  diagonal?: Array<AvailableMove>;
  horse?: Array<AvailableMove>;
}

type AvailableMove = {
  rank: vSquareRankNumber;
  file: vSquareFileNumber;
};

type MoveType = "horse" | "diagonal" | "cardinal";

type CardinalDirections = "up" | "down" | "right" | "left";
type DiagonalDirections = "topleft" | "topright" | "bottomright" | "bottomleft";

// pieces

type vPieceType =
  | "r"
  | "R"
  | "b"
  | "B"
  | "n"
  | "N"
  | "q"
  | "Q"
  | "k"
  | "K"
  | "p"
  | "P";

type vPieceCollection = {
  [key: number]: vPieceObject;
};

interface vPieceObject {
  owner: vPlayerColour;
  type: pieceType;
  squareIndex: number;
}
