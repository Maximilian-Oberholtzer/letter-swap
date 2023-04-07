import React, { useEffect, useState, useRef } from "react";
import { words } from "../../words";
import Modal from "../modal/Modal";
import { useTheme } from "../Theme";
import "./board.css";

const BOARDSIZE = 5;
const SWAPCOUNT = 15;

const day = new Date().getDay();

const pointMap: { [key: string]: number } = {
  A: 1,
  B: 2,
  C: 2,
  D: 1,
  E: 1,
  F: 2,
  G: 2,
  H: 1,
  I: 1,
  J: 3,
  K: 3,
  L: 1,
  M: 2,
  N: 1,
  O: 1,
  P: 2,
  Q: 3,
  R: 1,
  S: 1,
  T: 1,
  U: 2,
  V: 3,
  W: 2,
  X: 3,
  Y: 2,
  Z: 3,
};

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

interface BoardProps {
  showStats: boolean;
  handleCloseStatsModal: () => void;
}

function Board(props: BoardProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

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
  //Current daily points based on pointmap
  const [points, setPoints] = useState<number>(() => {
    const points = localStorage.getItem("points");
    if (points !== null) {
      return JSON.parse(points);
    } else {
      return 0;
    }
  });
  //Animated current points effect
  const [animatedPoints, setAnimatedPoints] = useState(0);
  //For highlighting words in word list
  const [recentFoundWords, setRecentFoundWords] = useState<string[]>(() => {
    const recentFoundWords = localStorage.getItem("recentFoundWords");
    if (recentFoundWords !== null) {
      return JSON.parse(recentFoundWords);
    } else {
      return [];
    }
  });
  //For pausing the game to allow animations
  const [animateFlip, setAnimateFlip] = useState(false);
  const [animateFound, setAnimateFound] = useState(false);
  const [start, setStart] = useState(false);
  //check if user is new
  const [hasPlayed, setHasPlayed] = useState(() => {
    const hasPlayed = localStorage.getItem("hasPlayed");
    if (hasPlayed !== null) {
      return JSON.parse(hasPlayed);
    } else {
      return false;
    }
  });
  //wait for 1 second before showing modal on load
  const [showComponent, setShowComponent] = useState<any>(false);
  const [showStatsModal, setShowStatsModal] = useState(false);

  //data for statistics modal
  const [lastPlayedDate, setLastPlayedDate] = useState(() => {
    const lastPlayedDate = localStorage.getItem("lastPlayedDate");
    if (lastPlayedDate !== null) {
      return JSON.parse(lastPlayedDate);
    } else {
      return day;
    }
  });
  //Holds amount of words found for each day of the week
  const [weeklyScores, setWeeklyScores] = useState<(number | null)[]>(() => {
    const weeklyScores = localStorage.getItem("weeklyScores");
    if (weeklyScores !== null) {
      return JSON.parse(weeklyScores);
    } else {
      return Array.from({ length: 7 }, () => null);
    }
  });
  //Holds amount of words found for each day of the week
  const [weeklyPoints, setWeeklyPoints] = useState<(number | null)[]>(() => {
    const weeklyPoints = localStorage.getItem("weeklyPoints");
    if (weeklyPoints !== null) {
      return JSON.parse(weeklyPoints);
    } else {
      return Array.from({ length: 7 }, () => null);
    }
  });

  //for calculating hieght for found words container
  const [foundWordsExpand, setFoundWordsExpand] = useState(false);
  const [foundWordsExpandHeight, setWordsExpandHeight] = useState(0);
  const boardHeight = useRef<HTMLDivElement>(null);

  //If user loads into a game with 0 swaps left
  const startGameSwapCount = swapCount;
  useEffect(() => {
    if (startGameSwapCount <= 0) {
      handleOpenModal();
    }
    setTimeout(() => {
      setShowComponent(true);
    }, 1000);
  }, [startGameSwapCount]);

  //check for game over and resets game if new day has elapsed
  useEffect(() => {
    if (lastPlayedDate !== day) {
      // ResetGame();
      const weeklyScoreArr = [...weeklyScores];
      const weeklyPointsArr = [...weeklyPoints];
      weeklyScoreArr[day] = null;
      weeklyPointsArr[day] = null;
      setWeeklyScores(weeklyScoreArr);
      setWeeklyPoints(weeklyPointsArr);
    }
    localStorage.setItem("swapCount", JSON.stringify(swapCount));
    if (swapCount === 0) {
      handleOpenModal();
      const weeklyScoreArr = [...weeklyScores];
      const weeklyPointsArr = [...weeklyPoints];
      //only overwrite score if it beats current daily score
      if (foundWords.length >= (weeklyScoreArr[day] ?? 0)) {
        weeklyScoreArr[day] = foundWords.length;
        setWeeklyScores(weeklyScoreArr);
      }
      if (points >= (weeklyPointsArr[day] ?? 0)) {
        weeklyPointsArr[day] = points;
        setWeeklyPoints(weeklyPointsArr);
      }

      setLastPlayedDate(day);
      setSwapCount(-1);
      setStart(false);
    }
  }, [
    swapCount,
    lastPlayedDate,
    foundWords.length,
    weeklyScores,
    points,
    weeklyPoints,
  ]);

  //Save session to local storage
  useEffect(() => {
    localStorage.setItem("nextLetters", JSON.stringify(nextLetter));
    localStorage.setItem("board", JSON.stringify(board));
    localStorage.setItem("foundWords", JSON.stringify(foundWords));
    localStorage.setItem("points", JSON.stringify(points));
    localStorage.setItem("recentFoundWords", JSON.stringify(recentFoundWords));
    localStorage.setItem("hasPlayed", JSON.stringify(hasPlayed));
    localStorage.setItem("lastPlayedDate", JSON.stringify(lastPlayedDate));
    localStorage.setItem("weeklyScores", JSON.stringify(weeklyScores));
    localStorage.setItem("weeklyPoints", JSON.stringify(weeklyPoints));
  }, [
    nextLetter,
    board,
    foundWords,
    points,
    recentFoundWords,
    hasPlayed,
    lastPlayedDate,
    weeklyScores,
    weeklyPoints,
  ]);

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

    setLastPlayedDate(day);
    setBoard(newBoard);
    setSwapCount(SWAPCOUNT);
    setStart(false);
    setPoints(0);
    setFoundWords([]);
  };

  const handleOpenModal = () => {
    setShowStatsModal(true);
  };
  const handleCloseModal = () => {
    setHasPlayed(true);
    setShowStatsModal(false);
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
      setRecentFoundWords(foundSequences);
      //calculate score based on found words
      let currentPoints = 0;
      //bonus points for additional words
      if (foundSequences.length > 1) {
        currentPoints += 5 * (foundSequences.length - 1);
      }
      for (let i = 0; i < foundSequences.length; i++) {
        const currentWord = foundSequences[i];
        for (let j = 0; j < currentWord.length; j++) {
          const currentLetter = currentWord[j];
          currentPoints += pointMap[currentLetter];
        }
      }
      setAnimatedPoints(currentPoints);
      setPoints(points + currentPoints);
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
    isDark
      ? tile?.classList.add("found-word-dark")
      : tile?.classList.add("found-word-light");
    //Animate title for a fun effect when a word is found
    const titleTile = document.querySelector(".title-tile");
    const titleTile2 = document.querySelector(".title-tile-2");
    const animatedPoints = document.querySelector(".animated-points");
    titleTile?.classList.add("animate");
    titleTile2?.classList.add("animate-delay-medium");
    animatedPoints?.classList.add("show-animated-points");
    setTimeout(() => {
      tile?.classList.remove("found-word-light");
      tile?.classList.remove("found-word-dark");
      titleTile?.classList.remove("animate");
      titleTile2?.classList.remove("animate-delay-medium");
      tile?.classList.add("animate");
      board[row][col] = " ";

      setTimeout(() => {
        setBoard(board);
      }, 100);

      setTimeout(() => {
        tile?.classList.remove("animate");
        animatedPoints?.classList.remove("show-animated-points");
        setAnimateFound(false);
      }, 400);
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

    const swapCounter = document.querySelector(".swaps-container");
    if (prevLetter !== " " && !foundWord) {
      setSwapCount(swapCount - 1);
      swapCounter?.classList.add("animate");
      setTimeout(() => {
        swapCounter?.classList.remove("animate");
      }, 300);
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

  //for using multiple styles at once
  const mergeStyles = (
    ...styles: React.CSSProperties[]
  ): React.CSSProperties => {
    return styles.reduce(
      (mergedStyles, style) => ({ ...mergedStyles, ...style }),
      {}
    );
  };
  const backgroundStyle = {
    backgroundColor: isDark
      ? "var(--dark-background)"
      : "var(--light-background)",
  };
  const colorStyle = {
    color: isDark ? "var(--dark-text)" : "var(--light-text)",
  };
  const borderStyle = {
    border: isDark
      ? "2px solid var(--dark-border-full)"
      : "2px solid var(--light-border-full)",
  };
  const emptyBorderStyle = {
    border: isDark
      ? "2px solid var(--dark-border-empty)"
      : "2px solid var(--light-border-empty)",
  };
  return (
    <div className="board-section">
      {showStatsModal && (
        <Modal
          type={"statistics"}
          score={foundWords.length}
          points={points}
          weeklyScores={weeklyScores}
          weeklyPoints={weeklyPoints}
          swapCount={swapCount}
          onClose={handleCloseModal}
          reset={ResetGame}
        />
      )}
      {props.showStats && (
        <Modal
          type={"statistics"}
          score={weeklyScores[day] ?? -1}
          points={weeklyPoints[day] ?? -1}
          weeklyScores={weeklyScores}
          weeklyPoints={weeklyPoints}
          swapCount={swapCount}
          onClose={props.handleCloseStatsModal}
          reset={ResetGame}
        />
      )}
      {!hasPlayed && showComponent && (
        <Modal
          type={"how-to-play"}
          score={foundWords.length}
          points={points}
          weeklyScores={[]}
          weeklyPoints={[]}
          swapCount={swapCount}
          onClose={handleCloseModal}
          reset={() => {}}
        />
      )}
      <div ref={boardHeight} className="board-container">
        <div className="hud-container">
          <div className="hud-text">
            <div
              className="swaps-container"
              style={mergeStyles(colorStyle, borderStyle)}
            >
              <b>Swaps: </b>
              <div>{swapCount >= 0 ? swapCount : 0}</div>
            </div>
          </div>
          <div
            className="next-letters-container"
            style={{
              color: isDark ? "var(--dark-text)" : "var(--light-text)",
            }}
          >
            <b className="next-letters-title">Next:</b>
            <div
              className="tile medium-tile"
              style={mergeStyles(colorStyle, borderStyle, backgroundStyle)}
            >
              {nextLetter[0]}
            </div>
            <div
              className="tile small-tile"
              style={mergeStyles(colorStyle, borderStyle, backgroundStyle)}
            >
              {nextLetter[1]}
            </div>
            <div
              className="tile small-tile"
              style={mergeStyles(colorStyle, borderStyle, backgroundStyle)}
            >
              {nextLetter[2]}
            </div>
          </div>
        </div>

        <div className="board">
          {board.map((row, rowIndex) => (
            <div key={rowIndex}>
              {row.map((letter, colIndex) => (
                <div
                  className="tile"
                  style={mergeStyles(
                    colorStyle,
                    letter === " " ? emptyBorderStyle : borderStyle,
                    backgroundStyle
                  )}
                  id={`${rowIndex}-${colIndex}`}
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() =>
                    swapCount <= 0
                      ? handleOpenModal()
                      : !animateFlip &&
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
          <div className="animated-points" style={colorStyle}>
            +{animatedPoints}
          </div>
          <div
            className="found-words-box"
            style={mergeStyles(colorStyle, borderStyle, backgroundStyle, {
              height: foundWordsExpand ? `${foundWordsExpandHeight}px` : "",
              overflow: foundWordsExpand ? "auto" : "hidden",
              transition:
                "height 0.5s ease-out, width 0.5s, 300ms background-color, 300ms color, 300ms border",
            })}
            onClick={() => {
              toggleFoundWordsBox();
            }}
          >
            <div className="found-word-title">
              <div className="found-word-right-column">
                Words: <b>{foundWords.length}</b>
              </div>
              <div className="middle-divider">|</div>
              <div className="found-word-left-column">
                Points: <b>{points}</b>
              </div>
            </div>
            <div className="found-words-list">
              {foundWordsExpand &&
                foundWords.sort().map((word, i) => (
                  <div className="found-word-text" key={i}>
                    {recentFoundWords.includes(word) ? (
                      <b
                        className={
                          isDark ? "found-word-dark" : "found-word-light"
                        }
                      >
                        {word}
                      </b>
                    ) : (
                      <>{word}</>
                    )}
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
