import React, { useEffect, useState } from "react";
import { words } from "../../words";
import "./board.css";

const getRandomLetter = (): string => {
  type Letter = string;
  const alphabet: Letter[] = "abcdefghijklmnopqrstuvwxyz".split("");
  const weights: number[] = [
    8.167, 1.492, 2.782, 4.253, 12.702, 2.228, 2.015, 6.094, 6.966, 0.153,
    0.772, 4.025, 2.406, 6.749, 7.507, 1.929, 0.095, 5.987, 6.327, 9.056, 2.758,
    0.978, 2.36, 0.15, 1.974, 0.074,
  ];

  function weightedRandomIndex(weights: number[]): number {
    const totalWeight: number = weights.reduce(
      (acc: number, val: number) => acc + val,
      0
    );
    let random: number = Math.random() * totalWeight;
    for (let i = 0; i < weights.length; i++) {
      random -= weights[i];
      if (random < 0) {
        return i;
      }
    }
    return weights.length - 1;
  }

  const randomIndex: number = weightedRandomIndex(weights);
  const randomLetter: Letter = alphabet[randomIndex];

  return randomLetter.toUpperCase();
};

function Board2() {
  const [board, setBoard] = useState<string[][]>(() => {
    const newBoard = Array(5)
      .fill(null)
      .map(() =>
        Array(5)
          .fill(null)
          .map(() => " ")
      );

    return newBoard;
  });
  const [nextLetter, setNextLetter] = useState(() => {
    let letters = "";

    for (let i = 0; i < 3; i++) {
      letters += getRandomLetter();
    }

    return letters;
  });
  const [swapCount, setSwapCount] = useState(25);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [canSelect, setCanSelect] = useState(true);

  //check for game over
  useEffect(() => {
    if (swapCount === 0) {
      const newBoard = Array(5)
        .fill(null)
        .map(() =>
          Array(5)
            .fill(null)
            .map(() => " ")
        );
      setBoard(newBoard);
      setSwapCount(25);
      setFoundWords([]);
    }
  }, [swapCount]);

  type Direction = "horizontal" | "vertical" | "diagonalRight" | "diagonalLeft";

  const findAndReplaceWord = (board: string[][]) => {
    let foundWord = false;

    const directions: Direction[] = [
      "horizontal",
      "vertical",
      "diagonalRight",
      "diagonalLeft",
    ];

    const getSequence = (
      x: number,
      y: number,
      direction: Direction
    ): string => {
      let sequence = "";
      for (let i = 0; i < 5; i++) {
        switch (direction) {
          case "horizontal":
            sequence += board[x][y + i];
            break;
          case "vertical":
            sequence += board[x + i][y];
            break;
          case "diagonalRight":
            sequence += board[x + i][y + i];
            break;
          case "diagonalLeft":
            sequence += board[x + i][y - i];
            break;
        }
      }
      return sequence;
    };

    const clearSequence = (
      x: number,
      y: number,
      direction: Direction
    ): void => {
      let tile;
      console.log(tile);
      for (let i = 0; i < 5; i++) {
        switch (direction) {
          case "horizontal":
            tile = document.getElementById(`${x}-${y + i}`);
            applyAnimation(tile);
            board[x][y + i] = "";
            break;
          case "vertical":
            tile = document.getElementById(`${x + i}-${y}`);
            applyAnimation(tile);
            board[x + i][y] = "";
            break;
          case "diagonalRight":
            tile = document.getElementById(`${x + i}-${y + i}`);
            applyAnimation(tile);
            board[x + i][y + i] = "";
            break;
          case "diagonalLeft":
            tile = document.getElementById(`${x + i}-${y - i}`);
            applyAnimation(tile);
            board[x + i][y - i] = "";
            break;
        }
      }
    };

    for (let x = 0; x <= board.length - 5; x++) {
      for (let y = 0; y < board[x].length; y++) {
        directions.forEach((direction) => {
          if (
            (direction === "horizontal" && y <= board[x].length - 5) ||
            (direction === "vertical" && x <= board.length - 5) ||
            (direction === "diagonalRight" &&
              x <= board.length - 5 &&
              y <= board[x].length - 5) ||
            (direction === "diagonalLeft" && x <= board.length - 5 && y >= 4)
          ) {
            const sequence = getSequence(x, y, direction);
            const reverseSequence = sequence.split("").reverse().join("");
            if (words.includes(sequence.toLowerCase())) {
              if (!foundWords.includes(sequence)) {
                foundWord = true;
                setFoundWords([...foundWords, sequence]);
                clearSequence(x, y, direction);
              }
            } else if (words.includes(reverseSequence.toLowerCase())) {
              if (!foundWords.includes(reverseSequence)) {
                foundWord = true;
                setFoundWords([...foundWords, reverseSequence]);
                clearSequence(x, y, direction);
              }
            }
          }
        });
      }
    }

    return foundWord;
  };

  const applyAnimation = (tile: HTMLElement | null) => {
    tile?.classList.add("animate");
    setCanSelect(false);

    setTimeout(() => {
      tile?.classList.remove("animate");
      setCanSelect(true);
    }, 300);
  };

  const handleBoard = (rowIndex: number, colIndex: number, letter: string) => {
    let prevLetter = board[rowIndex][colIndex];
    const newBoard = [...board];

    const tile = document.getElementById(`${rowIndex}-${colIndex}`);
    applyAnimation(tile);

    // Replace letter with new selection
    newBoard[rowIndex][colIndex] = letter;

    // Check if Word has been created & delete it if it was
    const foundWord = findAndReplaceWord(newBoard);

    if (prevLetter !== " " && !foundWord) {
      setSwapCount(swapCount - 1);
    }

    // Update next letter
    setNextLetter(nextLetter.substring(1) + getRandomLetter());
  };

  return (
    <section className="board-container">
      <div className="hud-container">
        <div className="tile">{nextLetter[0]}</div>
        <div className="tile small">{nextLetter[1]}</div>
        <div className="tile small">{nextLetter[2]}</div>
        <div className="hud-text">Swaps Remaining: {swapCount}</div>
      </div>

      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex}>
            {row.map((letter, colIndex) => (
              <div
                className="tile"
                id={`${rowIndex}-${colIndex}`}
                key={`${rowIndex}-${colIndex}`}
                onClick={() =>
                  canSelect && handleBoard(rowIndex, colIndex, nextLetter[0])
                }
              >
                {letter}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div>
        Found Words:{" "}
        {foundWords.map((word, i) => (
          <div key={i}>{word}</div>
        ))}
      </div>
    </section>
  );
}

export default Board2;
