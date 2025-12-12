import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

type Grid = (number | null)[][];

const Sudoku = () => {
  const [grid, setGrid] = useState<Grid>([]);
  const [initialGrid, setInitialGrid] = useState<Grid>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    generatePuzzle();
  }, []);

  const generatePuzzle = () => {
    const newGrid: Grid = Array(9)
      .fill(null)
      .map(() => Array(9).fill(null));

    const puzzle: Grid = [
      [5, 3, null, null, 7, null, null, null, null],
      [6, null, null, 1, 9, 5, null, null, null],
      [null, 9, 8, null, null, null, null, 6, null],
      [8, null, null, null, 6, null, null, null, 3],
      [4, null, null, 8, null, 3, null, null, 1],
      [7, null, null, null, 2, null, null, null, 6],
      [null, 6, null, null, null, null, 2, 8, null],
      [null, null, null, 4, 1, 9, null, null, 5],
      [null, null, null, null, 8, null, null, 7, 9],
    ];

    setGrid(puzzle);
    setInitialGrid(puzzle.map(row => [...row]));
    setMessage("Заполните пустые клетки числами от 1 до 9");
  };

  const handleCellClick = (row: number, col: number) => {
    if (initialGrid[row][col] === null) {
      setSelectedCell([row, col]);
    }
  };

  const handleNumberInput = (num: number) => {
    if (!selectedCell) {
      setMessage("Выберите пустую клетку");
      return;
    }

    const [row, col] = selectedCell;
    if (initialGrid[row][col] !== null) return;

    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = num;
    setGrid(newGrid);

    if (isValidPlacement(row, col, num, newGrid)) {
      setMessage("Правильно!");
      if (isPuzzleComplete(newGrid)) {
        setMessage("🎉 Поздравляем! Судоку решена!");
      }
    } else {
      setMessage("⚠️ Конфликт! Проверьте ряд, столбец или квадрат 3×3");
    }
  };

  const isValidPlacement = (row: number, col: number, num: number, grid: Grid): boolean => {
    for (let i = 0; i < 9; i++) {
      if (i !== col && grid[row][i] === num) return false;
      if (i !== row && grid[i][col] === num) return false;
    }

    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const r = startRow + i;
        const c = startCol + j;
        if (r !== row && c !== col && grid[r][c] === num) return false;
      }
    }

    return true;
  };

  const isPuzzleComplete = (grid: Grid): boolean => {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (grid[i][j] === null) return false;
      }
    }
    return true;
  };

  const handleClear = () => {
    if (selectedCell) {
      const [row, col] = selectedCell;
      if (initialGrid[row][col] === null) {
        const newGrid = grid.map(r => [...r]);
        newGrid[row][col] = null;
        setGrid(newGrid);
        setMessage("Клетка очищена");
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold">{message}</h3>
        <Button onClick={generatePuzzle} variant="outline" className="gap-2">
          <Icon name="RotateCcw" size={18} />
          Новая головоломка
        </Button>
      </div>

      <div className="inline-grid grid-cols-9 gap-0 border-4 border-primary rounded-lg overflow-hidden shadow-2xl bg-white">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isSelected = selectedCell && selectedCell[0] === rowIndex && selectedCell[1] === colIndex;
            const isInitial = initialGrid[rowIndex][colIndex] !== null;
            const thickRight = (colIndex + 1) % 3 === 0 && colIndex !== 8;
            const thickBottom = (rowIndex + 1) % 3 === 0 && rowIndex !== 8;

            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                className={`w-12 h-12 flex items-center justify-center text-xl font-bold transition-all
                  ${isInitial ? "bg-gray-200 text-gray-900" : "bg-white text-primary hover:bg-primary/10"}
                  ${isSelected ? "ring-4 ring-primary" : ""}
                  ${thickRight ? "border-r-4 border-r-gray-800" : "border-r border-r-gray-300"}
                  ${thickBottom ? "border-b-4 border-b-gray-800" : "border-b border-b-gray-300"}
                `}
              >
                {cell || ""}
              </button>
            );
          })
        )}
      </div>

      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <Button
            key={num}
            onClick={() => handleNumberInput(num)}
            variant="outline"
            className="w-12 h-12 text-lg font-bold"
          >
            {num}
          </Button>
        ))}
        <Button onClick={handleClear} variant="destructive" className="col-span-5 gap-2">
          <Icon name="X" size={18} />
          Очистить
        </Button>
      </div>
    </div>
  );
};

export default Sudoku;
