import { useState } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

type Stone = "black" | "white" | null;
type Board = Stone[][];

const Go = () => {
  const boardSize = 9;
  const [board, setBoard] = useState<Board>(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState<"black" | "white">("black");
  const [capturedStones, setCapturedStones] = useState({ black: 0, white: 0 });
  const [message, setMessage] = useState("Ход черных");

  function createEmptyBoard(): Board {
    return Array(boardSize)
      .fill(null)
      .map(() => Array(boardSize).fill(null));
  }

  const handleIntersectionClick = (row: number, col: number) => {
    if (board[row][col] !== null) {
      setMessage("Здесь уже есть камень!");
      return;
    }

    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = currentPlayer;

    const captured = captureStones(newBoard, row, col, currentPlayer === "black" ? "white" : "black");
    
    if (captured > 0) {
      setCapturedStones(prev => ({
        ...prev,
        [currentPlayer === "black" ? "white" : "black"]: prev[currentPlayer === "black" ? "white" : "black"] + captured
      }));
      setMessage(`Захвачено камней: ${captured}`);
    } else {
      setMessage(`Ход ${currentPlayer === "black" ? "белых" : "черных"}`);
    }

    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === "black" ? "white" : "black");
  };

  const captureStones = (board: Board, lastRow: number, lastCol: number, opponent: "black" | "white"): number => {
    let totalCaptured = 0;
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    for (const [dr, dc] of directions) {
      const nr = lastRow + dr;
      const nc = lastCol + dc;
      if (nr >= 0 && nr < boardSize && nc >= 0 && nc < boardSize && board[nr][nc] === opponent) {
        const group = getGroup(board, nr, nc);
        if (!hasLiberties(board, group)) {
          group.forEach(([r, c]) => {
            board[r][c] = null;
            totalCaptured++;
          });
        }
      }
    }

    return totalCaptured;
  };

  const getGroup = (board: Board, row: number, col: number): [number, number][] => {
    const color = board[row][col];
    if (color === null) return [];

    const group: [number, number][] = [];
    const visited = new Set<string>();
    const stack: [number, number][] = [[row, col]];

    while (stack.length > 0) {
      const [r, c] = stack.pop()!;
      const key = `${r},${c}`;
      if (visited.has(key)) continue;
      visited.add(key);
      group.push([r, c]);

      const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      for (const [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < boardSize && nc >= 0 && nc < boardSize && board[nr][nc] === color) {
          stack.push([nr, nc]);
        }
      }
    }

    return group;
  };

  const hasLiberties = (board: Board, group: [number, number][]): boolean => {
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (const [r, c] of group) {
      for (const [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < boardSize && nc >= 0 && nc < boardSize && board[nr][nc] === null) {
          return true;
        }
      }
    }
    return false;
  };

  const handleReset = () => {
    setBoard(createEmptyBoard());
    setCurrentPlayer("black");
    setCapturedStones({ black: 0, white: 0 });
    setMessage("Ход черных");
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold">{message}</h3>
        <div className="flex gap-4 justify-center items-center">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gray-900 border-2 border-gray-600"></div>
            <span className="font-bold">Черные: {capturedStones.white}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-white border-2 border-gray-400"></div>
            <span className="font-bold">Белые: {capturedStones.black}</span>
          </div>
        </div>
        <Button onClick={handleReset} variant="outline" className="gap-2">
          <Icon name="RotateCcw" size={18} />
          Новая игра
        </Button>
      </div>

      <div
        className="inline-grid gap-0 border-4 border-primary rounded-lg overflow-hidden shadow-2xl bg-amber-700 p-4"
        style={{ gridTemplateColumns: `repeat(${boardSize}, 1fr)` }}
      >
        {board.map((row, rowIndex) =>
          row.map((stone, colIndex) => {
            const isEdge = {
              top: rowIndex === 0,
              bottom: rowIndex === boardSize - 1,
              left: colIndex === 0,
              right: colIndex === boardSize - 1,
            };

            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleIntersectionClick(rowIndex, colIndex)}
                className="relative w-12 h-12 hover:bg-amber-600/30 transition-colors"
                style={{
                  borderTop: isEdge.top ? "none" : "1px solid #000",
                  borderBottom: isEdge.bottom ? "none" : "1px solid #000",
                  borderLeft: isEdge.left ? "none" : "1px solid #000",
                  borderRight: isEdge.right ? "none" : "1px solid #000",
                }}
              >
                {stone && (
                  <div
                    className={`absolute inset-0 m-auto w-10 h-10 rounded-full shadow-lg ${
                      stone === "black"
                        ? "bg-gray-900 border-2 border-gray-600"
                        : "bg-white border-2 border-gray-400"
                    }`}
                  ></div>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Go;
