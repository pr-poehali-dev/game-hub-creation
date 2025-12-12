import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

type Board = number[][];

const Game2048 = () => {
  const [board, setBoard] = useState<Board>([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const initBoard = useCallback(() => {
    const newBoard: Board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    addRandomTile(newBoard);
    addRandomTile(newBoard);
    return newBoard;
  }, []);

  useEffect(() => {
    setBoard(initBoard());
    const saved = localStorage.getItem("2048-best");
    if (saved) setBestScore(parseInt(saved));
  }, [initBoard]);

  const addRandomTile = (currentBoard: Board) => {
    const emptyCells: [number, number][] = [];
    currentBoard.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell === 0) emptyCells.push([i, j]);
      });
    });
    if (emptyCells.length > 0) {
      const [i, j] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      currentBoard[i][j] = Math.random() < 0.9 ? 2 : 4;
    }
  };

  const move = useCallback(
    (direction: "up" | "down" | "left" | "right") => {
      if (gameOver) return;

      const newBoard = board.map((row) => [...row]);
      let moved = false;
      let points = 0;

      const moveAndMerge = (line: number[]): [number[], number] => {
        const newLine = line.filter((val) => val !== 0);
        let linePoints = 0;

        for (let i = 0; i < newLine.length - 1; i++) {
          if (newLine[i] === newLine[i + 1]) {
            newLine[i] *= 2;
            linePoints += newLine[i];
            newLine.splice(i + 1, 1);
          }
        }

        while (newLine.length < 4) {
          newLine.push(0);
        }

        return [newLine, linePoints];
      };

      if (direction === "left") {
        for (let i = 0; i < 4; i++) {
          const [newRow, rowPoints] = moveAndMerge(newBoard[i]);
          if (JSON.stringify(newRow) !== JSON.stringify(newBoard[i])) moved = true;
          newBoard[i] = newRow;
          points += rowPoints;
        }
      } else if (direction === "right") {
        for (let i = 0; i < 4; i++) {
          const [newRow, rowPoints] = moveAndMerge(newBoard[i].reverse());
          if (JSON.stringify(newRow.reverse()) !== JSON.stringify(newBoard[i]))
            moved = true;
          newBoard[i] = newRow.reverse();
          points += rowPoints;
        }
      } else if (direction === "up") {
        for (let j = 0; j < 4; j++) {
          const column = [newBoard[0][j], newBoard[1][j], newBoard[2][j], newBoard[3][j]];
          const [newColumn, colPoints] = moveAndMerge(column);
          if (JSON.stringify(newColumn) !== JSON.stringify(column)) moved = true;
          for (let i = 0; i < 4; i++) {
            newBoard[i][j] = newColumn[i];
          }
          points += colPoints;
        }
      } else if (direction === "down") {
        for (let j = 0; j < 4; j++) {
          const column = [newBoard[0][j], newBoard[1][j], newBoard[2][j], newBoard[3][j]];
          const [newColumn, colPoints] = moveAndMerge(column.reverse());
          if (JSON.stringify(newColumn.reverse()) !== JSON.stringify(column))
            moved = true;
          const reversedColumn = newColumn.reverse();
          for (let i = 0; i < 4; i++) {
            newBoard[i][j] = reversedColumn[i];
          }
          points += colPoints;
        }
      }

      if (moved) {
        addRandomTile(newBoard);
        setBoard(newBoard);
        const newScore = score + points;
        setScore(newScore);
        if (newScore > bestScore) {
          setBestScore(newScore);
          localStorage.setItem("2048-best", newScore.toString());
        }

        if (checkGameOver(newBoard)) {
          setGameOver(true);
        }
      }
    },
    [board, score, bestScore, gameOver]
  );

  const checkGameOver = (currentBoard: Board): boolean => {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (currentBoard[i][j] === 0) return false;
        if (j < 3 && currentBoard[i][j] === currentBoard[i][j + 1]) return false;
        if (i < 3 && currentBoard[i][j] === currentBoard[i + 1][j]) return false;
      }
    }
    return true;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === "ArrowLeft") move("left");
      if (e.key === "ArrowRight") move("right");
      if (e.key === "ArrowUp") move("up");
      if (e.key === "ArrowDown") move("down");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [move]);

  const resetGame = () => {
    setBoard(initBoard());
    setScore(0);
    setGameOver(false);
  };

  const getTileColor = (value: number) => {
    const colors: { [key: number]: string } = {
      0: "bg-secondary/30",
      2: "bg-yellow-500/20 text-yellow-400",
      4: "bg-yellow-500/30 text-yellow-300",
      8: "bg-orange-500/30 text-orange-400",
      16: "bg-orange-500/40 text-orange-300",
      32: "bg-red-500/30 text-red-400",
      64: "bg-red-500/40 text-red-300",
      128: "bg-purple-500/30 text-purple-400",
      256: "bg-purple-500/40 text-purple-300",
      512: "bg-blue-500/30 text-blue-400",
      1024: "bg-blue-500/40 text-blue-300",
      2048: "bg-primary/40 text-primary",
    };
    return colors[value] || "bg-primary/50 text-primary";
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{score}</div>
          <div className="text-xs text-muted-foreground">Счёт</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">{bestScore}</div>
          <div className="text-xs text-muted-foreground">Рекорд</div>
        </Card>
      </div>

      <div className="bg-secondary/50 p-3 rounded-lg max-w-sm mx-auto">
        <div className="grid grid-cols-4 gap-3">
          {board.map((row, i) =>
            row.map((cell, j) => (
              <div
                key={`${i}-${j}`}
                className={`aspect-square rounded-lg flex items-center justify-center text-2xl font-bold transition-all ${getTileColor(
                  cell
                )}`}
              >
                {cell !== 0 && cell}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto">
        <div></div>
        <Button
          variant="secondary"
          size="lg"
          onClick={() => move("up")}
          className="aspect-square"
        >
          <Icon name="ArrowUp" size={24} />
        </Button>
        <div></div>
        <Button
          variant="secondary"
          size="lg"
          onClick={() => move("left")}
          className="aspect-square"
        >
          <Icon name="ArrowLeft" size={24} />
        </Button>
        <Button
          variant="secondary"
          size="lg"
          onClick={() => move("down")}
          className="aspect-square"
        >
          <Icon name="ArrowDown" size={24} />
        </Button>
        <Button
          variant="secondary"
          size="lg"
          onClick={() => move("right")}
          className="aspect-square"
        >
          <Icon name="ArrowRight" size={24} />
        </Button>
      </div>

      {gameOver && (
        <Card className="p-6 text-center bg-destructive/10 border-destructive/30">
          <div className="text-2xl font-bold mb-4">😔 Игра окончена</div>
          <div className="text-lg mb-4">Ваш счёт: {score}</div>
          <Button onClick={resetGame} className="gap-2">
            <Icon name="RotateCcw" size={18} />
            Новая игра
          </Button>
        </Card>
      )}

      <div className="text-center text-sm text-muted-foreground">
        Используйте стрелки или кнопки для управления
      </div>
    </div>
  );
};

export default Game2048;
