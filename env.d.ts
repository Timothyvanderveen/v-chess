/// <reference types="vite/client" />

type vSquareColour = "black" | "white";
type vPlayerColour = "black" | "white";
type vSquareFileLetter = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h";
type vSquareFileNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type vSquareRankNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
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
type vBoardState = Array<vSquareState>;

interface vSquareState {
  file: vSquareFileNumber;
  rank: vSquareRankNumber;
  piece: vPieceType | null;
  squareIndex: number;
}

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
