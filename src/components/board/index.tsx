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

function Board() {
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
  const [nextLetter, setNextLetter] = useState(getRandomLetter);
  const [swapCount, setSwapCount] = useState(25);
  const [foundWords, setFoundWords] = useState<string[]>([]);

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

  const checkBoard = (board: string[][], prevLetter: string) => {
    let currentWord = "";
    let foundWord = false;
    //check columns
    for (let i = 0; i < 5; i++) {
      currentWord = "";
      for (let j = 0; j < 5; j++) {
        currentWord += board[i][j];
        if (words.includes(currentWord.toLowerCase())) {
          setFoundWords([...foundWords, currentWord]);
          foundWord = true;
          for (let k = 0; k < 5; k++) {
            updateBoard(i, k, " ");
          }
        }
      }
    }
    //check columns reverse
    for (let i = 0; i < 5; i++) {
      currentWord = "";
      for (let j = 4; j >= 0; j--) {
        currentWord += board[i][j];
        if (words.includes(currentWord.toLowerCase())) {
          setFoundWords([...foundWords, currentWord]);
          foundWord = true;
          for (let k = 0; k < 5; k++) {
            updateBoard(i, k, " ");
          }
        }
      }
    }
    //check rows
    for (let i = 0; i < 5; i++) {
      currentWord = "";
      for (let j = 0; j < 5; j++) {
        currentWord += board[j][i];
        if (words.includes(currentWord.toLowerCase())) {
          setFoundWords([...foundWords, currentWord]);
          foundWord = true;
          for (let k = 0; k < 5; k++) {
            updateBoard(k, i, " ");
          }
        }
      }
    }
    //check rows reverse
    for (let i = 0; i < 5; i++) {
      currentWord = "";
      for (let j = 4; j >= 0; j--) {
        currentWord += board[j][i];
        if (words.includes(currentWord.toLowerCase())) {
          setFoundWords([...foundWords, currentWord]);
          foundWord = true;
          for (let k = 0; k < 5; k++) {
            updateBoard(k, i, " ");
          }
        }
      }
    }

    //check diagonal
    currentWord = "";
    for (let i = 0; i < 5; i++) {
      currentWord += board[i][i];
      if (words.includes(currentWord.toLowerCase())) {
        setFoundWords([...foundWords, currentWord]);
        foundWord = true;
        for (let k = 0; k < 5; k++) {
          updateBoard(k, k, " ");
        }
      }
    }

    //check diagonal cases
    currentWord = "";
    currentWord =
      board[0][0] + board[1][1] + board[2][2] + board[3][3] + board[4][4];

    if (words.includes(currentWord.toLowerCase())) {
      setFoundWords([...foundWords, currentWord]);
      foundWord = true;
      updateBoard(0, 0, " ");
      updateBoard(1, 1, " ");
      updateBoard(2, 2, " ");
      updateBoard(3, 3, " ");
      updateBoard(4, 4, " ");
    }

    currentWord = "";
    currentWord =
      board[4][4] + board[3][3] + board[2][2] + board[1][1] + board[0][0];

    if (words.includes(currentWord.toLowerCase())) {
      setFoundWords([...foundWords, currentWord]);
      foundWord = true;
      updateBoard(0, 0, " ");
      updateBoard(1, 1, " ");
      updateBoard(2, 2, " ");
      updateBoard(3, 3, " ");
      updateBoard(4, 4, " ");
    }

    currentWord = "";
    currentWord =
      board[0][4] + board[1][3] + board[2][2] + board[3][1] + board[4][0];

    if (words.includes(currentWord.toLowerCase())) {
      setFoundWords([...foundWords, currentWord]);
      foundWord = true;
      updateBoard(0, 4, " ");
      updateBoard(1, 3, " ");
      updateBoard(2, 2, " ");
      updateBoard(3, 1, " ");
      updateBoard(4, 0, " ");
    }

    currentWord = "";
    currentWord =
      board[4][0] + board[3][1] + board[2][2] + board[1][3] + board[0][4];

    if (words.includes(currentWord.toLowerCase())) {
      setFoundWords([...foundWords, currentWord]);
      foundWord = true;
      updateBoard(0, 4, " ");
      updateBoard(1, 3, " ");
      updateBoard(2, 2, " ");
      updateBoard(3, 1, " ");
      updateBoard(4, 0, " ");
    }

    if (!foundWord && prevLetter !== " ") {
      setSwapCount(swapCount - 1);
    }
  };

  const updateBoard = (rowIndex: number, colIndex: number, letter: string) => {
    const newBoard = [...board];
    newBoard[rowIndex][colIndex] = letter;

    setBoard(newBoard);
  };

  const handleBoard = (rowIndex: number, colIndex: number, letter: string) => {
    let prevLetter = board[rowIndex][colIndex];
    const newBoard = [...board];
    newBoard[rowIndex][colIndex] = letter;

    // Check if words were formed after new letter placement
    checkBoard(newBoard, prevLetter);

    // Update next letter
    setNextLetter(getRandomLetter);
  };

  return (
    <section className="board-container">
      <div className="hud-container">
        <div className="tile">{nextLetter}</div>
        <div className="hud-text">Swaps Remaining: {swapCount}</div>
      </div>

      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex}>
            {row.map((letter, colIndex) => (
              <div
                className="tile"
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleBoard(rowIndex, colIndex, nextLetter)}
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

export default Board;
