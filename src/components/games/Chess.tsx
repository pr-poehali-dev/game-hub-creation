import { useState } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

type PieceType = "king" | "queen" | "rook" | "bishop" | "knight" | "pawn";
type PieceColor = "white" | "black";
type Piece = { type: PieceType; color: PieceColor } | null;
type Board = Piece[][];

const pieceSymbols: Record<PieceColor, Record<PieceType, string>> = {
  white: { king: "♔", queen: "♕", rook: "♖", bishop: "♗", knight: "♘", pawn: "♙" },
  black: { king: "♚", queen: "♛", rook: "♜", bishop: "♝", knight: "♞", pawn: "♟" },
};

const Chess = () => {
  const [board, setBoard] = useState<Board>(createInitialBoard());
  const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<PieceColor>("white");
  const [message, setMessage] = useState("Ход белых");

  function createInitialBoard(): Board {
    const board: Board = Array(8)
      .fill(null)
      .map(() => Array(8).fill(null));

    const backRow: PieceType[] = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"];
    backRow.forEach((type, i) => {
      board[0][i] = { type, color: "black" };
      board[7][i] = { type, color: "white" };
    });
    for (let i = 0; i < 8; i++) {
      board[1][i] = { type: "pawn", color: "black" };
      board[6][i] = { type: "pawn", color: "white" };
    }
    return board;
  }

  const handleSquareClick = (row: number, col: number) => {
    if (!selectedSquare) {
      const piece = board[row][col];
      if (piece && piece.color === currentPlayer) {
        setSelectedSquare([row, col]);
        setMessage(`Выбрана фигура: ${pieceSymbols[piece.color][piece.type]}`);
      }
    } else {
      const [selectedRow, selectedCol] = selectedSquare;
      const piece = board[selectedRow][selectedCol];
      
      if (piece && isValidMove(selectedRow, selectedCol, row, col, piece)) {
        const newBoard = board.map(r => [...r]);
        newBoard[row][col] = piece;
        newBoard[selectedRow][selectedCol] = null;
        setBoard(newBoard);
        
        const nextPlayer = currentPlayer === "white" ? "black" : "white";
        setCurrentPlayer(nextPlayer);
        setMessage(`Ход ${nextPlayer === "white" ? "белых" : "черных"}`);
      }
      setSelectedSquare(null);
    }
  };

  const isValidMove = (fromRow: number, fromCol: number, toRow: number, toCol: number, piece: Piece): boolean => {
    if (!piece) return false;
    const targetPiece = board[toRow][toCol];
    if (targetPiece && targetPiece.color === piece.color) return false;

    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);

    switch (piece.type) {
      case "pawn":
        const direction = piece.color === "white" ? -1 : 1;
        const startRow = piece.color === "white" ? 6 : 1;
        if (toCol === fromCol && !targetPiece) {
          if (toRow === fromRow + direction) return true;
          if (fromRow === startRow && toRow === fromRow + 2 * direction && !board[fromRow + direction][fromCol]) return true;
        }
        if (colDiff === 1 && toRow === fromRow + direction && targetPiece) return true;
        return false;
      case "rook":
        return (fromRow === toRow || fromCol === toCol) && isPathClear(fromRow, fromCol, toRow, toCol);
      case "knight":
        return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
      case "bishop":
        return rowDiff === colDiff && isPathClear(fromRow, fromCol, toRow, toCol);
      case "queen":
        return (fromRow === toRow || fromCol === toCol || rowDiff === colDiff) && isPathClear(fromRow, fromCol, toRow, toCol);
      case "king":
        return rowDiff <= 1 && colDiff <= 1;
      default:
        return false;
    }
  };

  const isPathClear = (fromRow: number, fromCol: number, toRow: number, toCol: number): boolean => {
    const rowStep = toRow > fromRow ? 1 : toRow < fromRow ? -1 : 0;
    const colStep = toCol > fromCol ? 1 : toCol < fromCol ? -1 : 0;
    let currentRow = fromRow + rowStep;
    let currentCol = fromCol + colStep;
    while (currentRow !== toRow || currentCol !== toCol) {
      if (board[currentRow][currentCol]) return false;
      currentRow += rowStep;
      currentCol += colStep;
    }
    return true;
  };

  const handleReset = () => {
    setBoard(createInitialBoard());
    setSelectedSquare(null);
    setCurrentPlayer("white");
    setMessage("Ход белых");
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold">{message}</h3>
        <Button onClick={handleReset} variant="outline" className="gap-2">
          <Icon name="RotateCcw" size={18} />
          Новая партия
        </Button>
      </div>

      <div className="inline-grid grid-cols-8 gap-0 border-4 border-primary rounded-lg overflow-hidden shadow-2xl">
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const isLight = (rowIndex + colIndex) % 2 === 0;
            const isSelected = selectedSquare && selectedSquare[0] === rowIndex && selectedSquare[1] === colIndex;
            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleSquareClick(rowIndex, colIndex)}
                className={`w-16 h-16 flex items-center justify-center text-5xl transition-all ${
                  isLight ? "bg-amber-100" : "bg-amber-800"
                } ${isSelected ? "ring-4 ring-primary" : ""} hover:opacity-80`}
              >
                {piece && pieceSymbols[piece.color][piece.type]}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Chess;
