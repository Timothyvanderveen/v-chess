/// <reference types="vite/client" />
// vSquare

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

interface vSquareState {
  squareIndex: number;
  piece: vPieceType | null;
}

interface vBoardState {
  [key: number]: vSquareState;
}
