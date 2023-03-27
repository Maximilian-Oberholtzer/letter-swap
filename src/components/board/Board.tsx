import React, { useEffect, useState } from "react";
import { words } from "../../words";
import "./board.css";

const BOARDSIZE = 5;
const SWAPCOUNT = 25;
const TIMELIMIT = 900; //15 min

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
    const newBoard = Array(BOARDSIZE)
      .fill(null)
      .map(() =>
        Array(BOARDSIZE)
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
  const [swapCount, setSwapCount] = useState(SWAPCOUNT);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [animateFlip, setAnimateFlip] = useState(false);
  const [animateFound, setAnimateFound] = useState(false);
  const [timer, setTimer] = useState(TIMELIMIT);
  const [start, setStart] = useState(false);

  //constants for timer dislpay
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  //check for game over
  useEffect(() => {
    if (swapCount === 0 || timer === 0) {
      ResetGame();
    }
  }, [swapCount, timer]);

  //update timer
  useEffect(() => {
    if (start) {
      const interval = setInterval(() => {
        setTimer((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [start]);

  const ResetGame = () => {
    const newBoard = Array(BOARDSIZE)
      .fill(null)
      .map(() =>
        Array(BOARDSIZE)
          .fill(null)
          .map(() => " ")
      );
    setBoard(newBoard);
    setSwapCount(SWAPCOUNT);
    setStart(false);
    setTimer(TIMELIMIT);
    setFoundWords([]);
  };

  type Direction = "row" | "column" | "diagonalRight" | "diagonalLeft";

  const checkForWords = (board: string[][]): boolean => {
    let foundWord = false;
    let foundSequences = [];

    //check columns
    for (let i = 0; i < BOARDSIZE; i++) {
      let sequence = "";
      for (let j = 0; j < BOARDSIZE; j++) {
        sequence += board[i][j];
        if (j === BOARDSIZE - 1) {
          let reverseSequence = sequence.split("").reverse().join("");
          if (words.includes(sequence.toLowerCase())) {
            if (!foundWords.includes(sequence)) {
              foundWord = true;
              foundSequences.push(sequence);
              replaceRow(board, "column", i);
            }
          } else if (words.includes(reverseSequence.toLowerCase())) {
            if (!foundWords.includes(reverseSequence)) {
              foundWord = true;
              foundSequences.push(reverseSequence);
              replaceRow(board, "column", i);
            }
          }
        }
      }
    }

    //check rows
    for (let i = 0; i < BOARDSIZE; i++) {
      let sequence = "";
      for (let j = 0; j < BOARDSIZE; j++) {
        sequence += board[j][i];
        if (j === BOARDSIZE - 1) {
          let reverseSequence = sequence.split("").reverse().join("");
          if (words.includes(sequence.toLowerCase())) {
            if (!foundWords.includes(sequence)) {
              foundWord = true;
              foundSequences.push(sequence);
              replaceRow(board, "row", i);
            }
          } else if (words.includes(reverseSequence.toLowerCase())) {
            if (!foundWords.includes(reverseSequence)) {
              foundWord = true;
              foundSequences.push(reverseSequence);
              replaceRow(board, "row", i);
            }
          }
        }
      }
    }

    //check diagonal right (bottom left to top right)
    let i = 0;
    let j = BOARDSIZE - 1;
    let sequence = "";
    while (i < BOARDSIZE && j >= 0) {
      sequence += board[j][i];
      i++;
      j--;
    }
    let reverseSequence = sequence.split("").reverse().join("");
    if (words.includes(sequence.toLowerCase())) {
      if (!foundWords.includes(sequence)) {
        foundWord = true;
        foundSequences.push(sequence);
        replaceRow(board, "diagonalRight", i);
      }
    } else if (words.includes(reverseSequence.toLowerCase())) {
      if (!foundWords.includes(reverseSequence)) {
        foundWord = true;
        foundSequences.push(reverseSequence);
        replaceRow(board, "diagonalRight", i);
      }
    }

    //check diagonal left (top left to bottom right)
    i = 0;
    sequence = "";
    while (i < BOARDSIZE) {
      sequence += board[i][i];
      i++;
    }
    reverseSequence = sequence.split("").reverse().join("");
    if (words.includes(sequence.toLowerCase())) {
      if (!foundWords.includes(sequence)) {
        foundWord = true;
        foundSequences.push(sequence);
        replaceRow(board, "diagonalLeft", i);
      }
    } else if (words.includes(reverseSequence.toLowerCase())) {
      if (!foundWords.includes(reverseSequence)) {
        foundWord = true;
        foundSequences.push(reverseSequence);
        replaceRow(board, "diagonalLeft", i);
      }
    }

    if (foundWord) {
      setFoundWords([...foundWords, ...foundSequences]);
    }

    return foundWord;
  };

  // If a word is found apply animation then wipe it from the board
  const replaceRow = (board: string[][], direction: Direction, row: number) => {
    let j = BOARDSIZE - 1; //for diagonal right
    for (let i = 0; i < BOARDSIZE; i++) {
      let tile;
      switch (direction) {
        case "column":
          tile = document.getElementById(`${row}-${i}`);
          applyFoundAnimation(board, tile, row, i);
          break;
        case "row":
          tile = document.getElementById(`${i}-${row}`);
          applyFoundAnimation(board, tile, i, row);
          break;
        case "diagonalRight":
          tile = document.getElementById(`${j}-${i}`);
          applyFoundAnimation(board, tile, j, i);
          j--;
          break;
        case "diagonalLeft":
          tile = document.getElementById(`${i}-${i}`);
          applyFoundAnimation(board, tile, i, i);
          break;
      }
    }
  };

  const applyFoundAnimation = (
    board: string[][],
    tile: HTMLElement | null,
    row: number,
    col: number
  ) => {
    setAnimateFound(true);
    tile?.classList.add("found-word");
    setTimeout(() => {
      tile?.classList.remove("found-word");
      tile?.classList.add("animate");
      board[row][col] = " ";

      setTimeout(() => {
        setBoard(board);
      }, 100);

      setTimeout(() => {
        tile?.classList.remove("animate");
        setAnimateFound(false);
      }, 300);
    }, 800);
  };

  const applyAnimation = (tile: HTMLElement | null) => {
    tile?.classList.add("animate");
    setAnimateFlip(true);

    setTimeout(() => {
      tile?.classList.remove("animate");
      setAnimateFlip(false);
    }, 300);
  };

  const handleBoard = (rowIndex: number, colIndex: number, letter: string) => {
    if (!start) {
      setStart(true);
    }
    let prevLetter = board[rowIndex][colIndex];
    const newBoard = [...board];

    const tile = document.getElementById(`${rowIndex}-${colIndex}`);
    applyAnimation(tile);

    // Replace letter with new selection
    newBoard[rowIndex][colIndex] = letter;

    // Check if Word has been created & delete it if it was
    const foundWord = checkForWords(newBoard);

    if (prevLetter !== " " && !foundWord) {
      setSwapCount(swapCount - 1);
    }

    // Update next letter
    setNextLetter(nextLetter.substring(1) + getRandomLetter());
  };

  return (
    <section className="board-section">
      <div className="board-container">
        <div className="hud-container">
          <div className="hud-text">
            <div className="swaps-container">
              <b>Swaps: </b>
              {swapCount}
            </div>
          </div>
          <div className="hud-text">
            <div className="time-container">
              <b>Time: </b>
              {`${minutes.toString().padStart(2, "0")}:${seconds
                .toString()
                .padStart(2, "0")}`}
            </div>
          </div>
        </div>
        <div className="next-letters-container">
          <b>Next:</b>
          <div className="tile small-tile">{nextLetter[0]}</div>
          <div className="tile small-tile">{nextLetter[1]}</div>
          <div className="tile small-tile">{nextLetter[2]}</div>
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
                    !animateFlip &&
                    !animateFound &&
                    handleBoard(rowIndex, colIndex, nextLetter[0])
                  }
                >
                  {letter}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="found-words-container">
          Found Words ({foundWords.length})
          {foundWords.map((word, i) => (
            <div key={i}>{word}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Board;
