import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { updateStats } from "@/lib/achievements";

type Player = "X" | "O" | null;

interface TicTacToeProps {
  onAchievement?: (achievements: any[]) => void;
}

const TicTacToe = ({ onAchievement }: TicTacToeProps) => {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState<Player | "draw" | null>(null);
  const [score, setScore] = useState({ player: 0, ai: 0, draws: 0 });

  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const checkWinner = (currentBoard: Player[]): Player | "draw" | null => {
    for (const combo of winningCombinations) {
      const [a, b, c] = combo;
      if (
        currentBoard[a] &&
        currentBoard[a] === currentBoard[b] &&
        currentBoard[a] === currentBoard[c]
      ) {
        return currentBoard[a];
      }
    }
    if (currentBoard.every((cell) => cell !== null)) {
      return "draw";
    }
    return null;
  };

  const makeAIMove = (currentBoard: Player[]) => {
    const emptyCells = currentBoard
      .map((cell, index) => (cell === null ? index : null))
      .filter((index) => index !== null) as number[];

    for (const combo of winningCombinations) {
      const [a, b, c] = combo;
      if (
        currentBoard[a] === "O" &&
        currentBoard[b] === "O" &&
        currentBoard[c] === null
      ) {
        return c;
      }
      if (
        currentBoard[a] === "O" &&
        currentBoard[c] === "O" &&
        currentBoard[b] === null
      ) {
        return b;
      }
      if (
        currentBoard[b] === "O" &&
        currentBoard[c] === "O" &&
        currentBoard[a] === null
      ) {
        return a;
      }
    }

    for (const combo of winningCombinations) {
      const [a, b, c] = combo;
      if (
        currentBoard[a] === "X" &&
        currentBoard[b] === "X" &&
        currentBoard[c] === null
      ) {
        return c;
      }
      if (
        currentBoard[a] === "X" &&
        currentBoard[c] === "X" &&
        currentBoard[b] === null
      ) {
        return b;
      }
      if (
        currentBoard[b] === "X" &&
        currentBoard[c] === "X" &&
        currentBoard[a] === null
      ) {
        return a;
      }
    }

    if (currentBoard[4] === null) return 4;

    const corners = [0, 2, 6, 8].filter((i) => currentBoard[i] === null);
    if (corners.length > 0) {
      return corners[Math.floor(Math.random() * corners.length)];
    }

    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  };

  useEffect(() => {
    if (!isPlayerTurn && !winner) {
      const timer = setTimeout(() => {
        const aiMove = makeAIMove(board);
        if (aiMove !== undefined) {
          const newBoard = [...board];
          newBoard[aiMove] = "O";
          setBoard(newBoard);
          const gameResult = checkWinner(newBoard);
          if (gameResult) {
            setWinner(gameResult);
            if (gameResult === "O") {
              setScore((prev) => ({ ...prev, ai: prev.ai + 1 }));
              const result = updateStats({ 
                tictactoePlayed: 1, 
                totalGamesPlayed: 1 
              });
              if (result.newAchievements.length > 0 && onAchievement) {
                onAchievement(result.newAchievements);
              }
            } else if (gameResult === "draw") {
              setScore((prev) => ({ ...prev, draws: prev.draws + 1 }));
              const result = updateStats({ 
                tictactoePlayed: 1, 
                totalGamesPlayed: 1 
              });
              if (result.newAchievements.length > 0 && onAchievement) {
                onAchievement(result.newAchievements);
              }
            }
          }
          setIsPlayerTurn(true);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, winner, board, onAchievement]);

  const handleCellClick = (index: number) => {
    if (board[index] || winner || !isPlayerTurn) return;

    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);

    const gameResult = checkWinner(newBoard);
    if (gameResult) {
      setWinner(gameResult);
      if (gameResult === "X") {
        setScore((prev) => ({ ...prev, player: prev.player + 1 }));
        const result = updateStats({ 
          tictactoeWins: 1, 
          tictactoePlayed: 1, 
          totalGamesPlayed: 1, 
          totalWins: 1 
        });
        if (result.newAchievements.length > 0 && onAchievement) {
          onAchievement(result.newAchievements);
        }
      } else if (gameResult === "draw") {
        setScore((prev) => ({ ...prev, draws: prev.draws + 1 }));
        const result = updateStats({ 
          tictactoePlayed: 1, 
          totalGamesPlayed: 1 
        });
        if (result.newAchievements.length > 0 && onAchievement) {
          onAchievement(result.newAchievements);
        }
      }
    } else {
      setIsPlayerTurn(false);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setIsPlayerTurn(true);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-2 mb-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{score.player}</div>
          <div className="text-xs text-muted-foreground">Вы</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-muted-foreground">{score.draws}</div>
          <div className="text-xs text-muted-foreground">Ничья</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-destructive">{score.ai}</div>
          <div className="text-xs text-muted-foreground">ИИ</div>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
        {board.map((cell, index) => (
          <button
            key={index}
            onClick={() => handleCellClick(index)}
            disabled={!!cell || !!winner || !isPlayerTurn}
            className="aspect-square bg-secondary hover:bg-secondary/80 rounded-lg flex items-center justify-center text-5xl font-bold transition-all disabled:cursor-not-allowed disabled:hover:bg-secondary"
          >
            {cell === "X" && <span className="text-primary">X</span>}
            {cell === "O" && <span className="text-destructive">O</span>}
          </button>
        ))}
      </div>

      {winner && (
        <Card className="p-6 text-center bg-primary/10 border-primary/30">
          <div className="text-2xl font-bold mb-4">
            {winner === "X" && "🎉 Вы победили!"}
            {winner === "O" && "😔 ИИ победил"}
            {winner === "draw" && "🤝 Ничья"}
          </div>
          <Button onClick={resetGame} className="gap-2">
            <Icon name="RotateCcw" size={18} />
            Новая игра
          </Button>
        </Card>
      )}

      {!winner && !isPlayerTurn && (
        <div className="text-center text-muted-foreground animate-pulse">
          ИИ думает...
        </div>
      )}
    </div>
  );
};

export default TicTacToe;