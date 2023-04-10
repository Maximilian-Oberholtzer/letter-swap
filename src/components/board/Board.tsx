import React, { useEffect, useState, useRef } from "react";
import Modal from "../modal/Modal";
import { useTheme } from "../Theme";
import {
  fillEmptyBoard,
  getRandomLetter,
  checkForWords,
  applyAnimation,
  fillNewNextLetters,
} from "./BoardFunctions";
import "./board.css";

const BOARDSIZE = 5;
const SWAPCOUNT = 15;

const day = new Date().getDay();

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
      return fillEmptyBoard();
    }
  });
  const [nextLetter, setNextLetter] = useState(() => {
    const nextLetters = localStorage.getItem("nextLetters");
    if (nextLetters !== null) {
      return JSON.parse(nextLetters);
    } else {
      fillNewNextLetters();
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
      if (swapCount <= 0) {
        ResetGame();
      }
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

    //3 new letters for next
    let letters = "";
    for (let i = 0; i < 3; i++) {
      let currentLetter = getRandomLetter();
      //no duplicates inside next letters boxes
      while (letters.includes(currentLetter)) {
        currentLetter = getRandomLetter();
      }
      letters += currentLetter;
    }
    setNextLetter(letters);
  };

  const handleOpenModal = () => {
    setShowStatsModal(true);
  };
  const handleCloseModal = () => {
    setHasPlayed(true);
    setShowStatsModal(false);
  };

  const handleBoard = (rowIndex: number, colIndex: number, letter: string) => {
    if (!start) {
      setStart(true);
    }
    let prevLetter = board[rowIndex][colIndex];
    const newBoard = [...board];

    const tile = document.getElementById(`${rowIndex}-${colIndex}`);
    applyAnimation(tile, setAnimateFlip);

    // Replace letter with new selection
    newBoard[rowIndex][colIndex] = letter;

    // Check if Word has been created & delete it if it was
    const foundWord = checkForWords(
      newBoard,
      foundWords,
      setFoundWords,
      setRecentFoundWords,
      setAnimatedPoints,
      setAnimateFound,
      points,
      setPoints,
      isDark,
      setBoard
    );

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
