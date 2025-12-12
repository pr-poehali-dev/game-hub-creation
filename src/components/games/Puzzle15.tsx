import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const Puzzle15 = () => {
  const [tiles, setTiles] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [solved, setSolved] = useState(false);

  const initPuzzle = () => {
    const numbers = Array.from({ length: 15 }, (_, i) => i + 1);
    numbers.push(0);
    
    const shuffled = [...numbers];
    for (let i = 0; i < 200; i++) {
      const emptyIndex = shuffled.indexOf(0);
      const validMoves = getValidMoves(emptyIndex);
      const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
      [shuffled[emptyIndex], shuffled[randomMove]] = [shuffled[randomMove], shuffled[emptyIndex]];
    }
    
    setTiles(shuffled);
    setMoves(0);
    setTime(0);
    setIsRunning(false);
    setSolved(false);
  };

  useEffect(() => {
    initPuzzle();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && !solved) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, solved]);

  const getValidMoves = (emptyIndex: number): number[] => {
    const moves: number[] = [];
    const row = Math.floor(emptyIndex / 4);
    const col = emptyIndex % 4;

    if (row > 0) moves.push(emptyIndex - 4);
    if (row < 3) moves.push(emptyIndex + 4);
    if (col > 0) moves.push(emptyIndex - 1);
    if (col < 3) moves.push(emptyIndex + 1);

    return moves;
  };

  const checkSolved = (currentTiles: number[]): boolean => {
    for (let i = 0; i < 15; i++) {
      if (currentTiles[i] !== i + 1) return false;
    }
    return currentTiles[15] === 0;
  };

  const handleTileClick = (index: number) => {
    if (solved) return;

    const emptyIndex = tiles.indexOf(0);
    const validMoves = getValidMoves(emptyIndex);

    if (validMoves.includes(index)) {
      if (!isRunning) setIsRunning(true);

      const newTiles = [...tiles];
      [newTiles[emptyIndex], newTiles[index]] = [newTiles[index], newTiles[emptyIndex]];
      setTiles(newTiles);
      setMoves((prev) => prev + 1);

      if (checkSolved(newTiles)) {
        setSolved(true);
        setIsRunning(false);
      }
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{moves}</div>
          <div className="text-xs text-muted-foreground">Ходов</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">{formatTime(time)}</div>
          <div className="text-xs text-muted-foreground">Время</div>
        </Card>
      </div>

      <div className="bg-secondary/50 p-3 rounded-lg max-w-sm mx-auto">
        <div className="grid grid-cols-4 gap-3">
          {tiles.map((tile, index) => (
            <button
              key={index}
              onClick={() => handleTileClick(index)}
              disabled={tile === 0}
              className={`aspect-square rounded-lg flex items-center justify-center text-2xl font-bold transition-all ${
                tile === 0
                  ? "bg-transparent cursor-default"
                  : "bg-primary/20 hover:bg-primary/30 active:scale-95 cursor-pointer"
              }`}
            >
              {tile !== 0 && tile}
            </button>
          ))}
        </div>
      </div>

      {solved && (
        <Card className="p-6 text-center bg-primary/10 border-primary/30">
          <div className="text-2xl font-bold mb-2">🎉 Решено!</div>
          <div className="text-sm text-muted-foreground mb-4">
            Ходов: {moves} | Время: {formatTime(time)}
          </div>
          <Button onClick={initPuzzle} className="gap-2">
            <Icon name="RotateCcw" size={18} />
            Новая игра
          </Button>
        </Card>
      )}

      {!solved && (
        <Button onClick={initPuzzle} variant="outline" className="w-full gap-2">
          <Icon name="Shuffle" size={18} />
          Перемешать
        </Button>
      )}

      <div className="text-center text-sm text-muted-foreground">
        Собери числа от 1 до 15 по порядку
      </div>
    </div>
  );
};

export default Puzzle15;
