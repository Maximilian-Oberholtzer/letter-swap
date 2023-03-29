import React, { useEffect, useState, useRef } from "react";
import { words } from "../../words";
import Modal from "../modal/Modal";
import "./board.css";

const BOARDSIZE = 5;
const SWAPCOUNT = 20;

const getRandomLetter = (): string => {
  type Letter = string;
  const alphabet: Letter[] = "abcdefghijklmnopqrstuvwxyz".split("");
  const weights: number[] = [
    8.167, 1.492, 2.782, 4.253, 12.702, 2.228, 2.015, 6.094, 6.966, 0.153,
    0.772, 4.025, 2.406, 6.749, 7.507, 1.929, 0.095, 5.987, 10.702, 9.056,
    2.758, 0.978, 2.36, 0.15, 1.974, 0.074,
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
    const board = localStorage.getItem("board");
    if (board !== null) {
      return JSON.parse(board);
    } else {
      const newBoard = Array(BOARDSIZE)
        .fill(null)
        .map(() =>
          Array(BOARDSIZE)
            .fill(null)
            .map(() => " ")
        );
      return newBoard;
    }
  });
  const [nextLetter, setNextLetter] = useState(() => {
    const nextLetters = localStorage.getItem("nextLetters");
    if (nextLetters !== null) {
      return JSON.parse(nextLetters);
    } else {
      let letters = "";
      for (let i = 0; i < 3; i++) {
        let currentLetter = getRandomLetter();
        //no duplicates inside next letters boxes
        while (letters.includes(currentLetter)) {
          currentLetter = getRandomLetter();
        }
        letters += currentLetter;
      }
      return letters;
    }
  });
  const [swapCount, setSwapCount] = useState(() => {
    const swapCount = localStorage.getItem("swapCount");
    if (swapCount !== null) {
      return JSON.parse(swapCount);
    } else {
      return SWAPCOUNT;
    }
  });
  const [foundWords, setFoundWords] = useState<string[]>(() => {
    const foundWords = localStorage.getItem("foundWords");
    if (foundWords !== null) {
      return JSON.parse(foundWords);
    } else {
      return [];
    }
  });
  const [animateFlip, setAnimateFlip] = useState(false);
  const [animateFound, setAnimateFound] = useState(false);
  const [start, setStart] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [foundWordsExpand, setFoundWordsExpand] = useState(false);
  const [foundWordsExpandHeight, setWordsExpandHeight] = useState(0);
  const boardHeight = useRef<HTMLDivElement>(null);

  //check for game over
  useEffect(() => {
    localStorage.setItem("swapCount", JSON.stringify(swapCount));
    if (swapCount === 0) {
      handleOpenModal();
      setStart(false);
    }
  }, [swapCount]);

  //Save session to local storage
  useEffect(() => {
    localStorage.setItem("nextLetters", JSON.stringify(nextLetter));
    localStorage.setItem("board", JSON.stringify(board));
    localStorage.setItem("foundWords", JSON.stringify(foundWords));
  }, [nextLetter, board, foundWords]);

  //calculate height of board container (for found words drawer dynamic height)
  useEffect(() => {
    if (boardHeight.current) {
      const containerHeight = boardHeight.current.clientHeight;
      setWordsExpandHeight(containerHeight);
    }
  }, [foundWordsExpand]);

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
    setFoundWords([]);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
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
    let currentLetter = getRandomLetter();
    //no duplicates inside next letters boxes
    while (nextLetter.includes(currentLetter)) {
      currentLetter = getRandomLetter();
    }
    setNextLetter(nextLetter.substring(1) + currentLetter);
  };

  const toggleFoundWordsBox = () => {
    setFoundWordsExpand(!foundWordsExpand);
  };

  return (
    <div className="board-section">
      {showModal && (
        <Modal
          content={`Score: ${foundWords.length} word(s)`}
          onClose={handleCloseModal}
          reset={ResetGame}
        />
      )}
      <div ref={boardHeight} className="board-container">
        <div className="hud-container">
          <div className="hud-text">
            <div className="swaps-container">
              <b>Swaps: </b>
              <div>{swapCount}</div>
            </div>
          </div>
          <div className="next-letters-container">
            <b className="next-letters-title">Next:</b>
            <div className="tile medium-tile">{nextLetter[0]}</div>
            <div className="tile small-tile">{nextLetter[1]}</div>
            <div className="tile small-tile">{nextLetter[2]}</div>
          </div>
        </div>

        <div className="board">
          {board.map((row, rowIndex) => (
            <div key={rowIndex}>
              {row.map((letter, colIndex) => (
                <div
                  className="tile"
                  style={{
                    border:
                      letter === " " ? "2px solid darkgrey" : "2px solid grey",
                  }}
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
          <div
            className="found-words-box"
            style={{
              height: foundWordsExpand ? `${foundWordsExpandHeight}px` : "",
              overflow: foundWordsExpand ? "auto" : "hidden",
              transition: "height 0.5s ease-out, width 0.5s",
            }}
            onClick={() => {
              toggleFoundWordsBox();
            }}
          >
            <div className="found-word-title">
              Found Words ({foundWords.length})
            </div>
            <div className="found-words-list">
              {foundWordsExpand &&
                foundWords.sort().map((word, i) => (
                  <div className="found-word-text" key={i}>
                    {word}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Board;
