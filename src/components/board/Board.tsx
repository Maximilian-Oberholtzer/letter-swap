import React, {
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
  useRef,
  useCallback,
} from "react";
import Modal from "../modal/Modal";
import { useTheme } from "../Theme";
import {
  fillEmptyBoard,
  getRandomLetter,
  checkForWords,
  applyAnimation,
  fillNewNextLetters,
} from "./BoardFunctions";
import { UserState } from "../main/Main";
import "./board.css";

const SWAPCOUNT = 15;
const DAY = new Date().getDay();

interface BoardProps {
  showStats: boolean;
  handleCloseStatsModal: () => void;
  userState: UserState;
  setUserState: Dispatch<SetStateAction<UserState>>;
}

function Board(props: BoardProps) {
  const { userState, setUserState } = props;

  const { theme } = useTheme();
  const isDark = theme === "dark";

  //update global user state functions
  const setBoard = useCallback(
    (newBoard: string[][]) => {
      setUserState((prevState) => ({ ...prevState, board: newBoard }));
    },
    [setUserState]
  );
  const setNextLetters = useCallback(
    (nextLetters: string) => {
      setUserState((prevState) => ({ ...prevState, nextLetters: nextLetters }));
    },
    [setUserState]
  );
  const setSwapCount = useCallback(
    (swapCount: number) => {
      setUserState((prevState) => ({ ...prevState, swapCount: swapCount }));
    },
    [setUserState]
  );
  const setFoundWords = useCallback(
    (foundWords: string[]) => {
      setUserState((prevState) => ({ ...prevState, foundWords: foundWords }));
    },
    [setUserState]
  );
  const setRecentFoundWords = useCallback(
    (recentFoundWords: string[]) => {
      setUserState((prevState) => ({
        ...prevState,
        recentFoundWords: recentFoundWords,
      }));
    },
    [setUserState]
  );
  const setPoints = useCallback(
    (points: number) => {
      setUserState((prevState) => ({ ...prevState, points: points }));
    },
    [setUserState]
  );
  const setHasPlayed = useCallback(
    (hasPlayed: boolean) => {
      setUserState((prevState) => ({ ...prevState, hasPlayed: hasPlayed }));
    },
    [setUserState]
  );
  const setLastPlayedDate = useCallback(
    (lastPlayedDate: number) => {
      setUserState((prevState) => ({
        ...prevState,
        lastPlayedDate: lastPlayedDate,
      }));
    },
    [setUserState]
  );
  const setWeeklyScores = useCallback(
    (weeklyScores: (number | null)[]) => {
      setUserState((prevState) => ({
        ...prevState,
        weeklyScores: weeklyScores,
      }));
    },
    [setUserState]
  );
  const setWeeklyPoints = useCallback(
    (weeklyPoints: (number | null)[]) => {
      setUserState((prevState) => ({
        ...prevState,
        weeklyPoints: weeklyPoints,
      }));
    },
    [setUserState]
  );

  //Animated current points effect
  const [animatedPoints, setAnimatedPoints] = useState(0);
  //For pausing the game to allow animations
  const [animateFlip, setAnimateFlip] = useState(false);
  const [animateFound, setAnimateFound] = useState(false);
  const [start, setStart] = useState(false);
  //wait for 1 second before showing modal on load
  const [showComponent, setShowComponent] = useState<any>(false);
  const [showStatsModal, setShowStatsModal] = useState(false);

  //for calculating hieght for found words container
  const [foundWordsExpand, setFoundWordsExpand] = useState(false);
  const [foundWordsExpandHeight, setWordsExpandHeight] = useState(0);
  const boardHeight = useRef<HTMLDivElement>(null);

  //If user loads into a game with 0 swaps left
  const startGameSwapCount = userState.swapCount;
  useEffect(() => {
    if (startGameSwapCount <= 0) {
      handleOpenModal();
    }
    if (!userState.hasPlayed) {
      setTimeout(() => {
        setShowComponent(true);
      }, 1000);
    }
  }, [startGameSwapCount, userState.hasPlayed]);

  const ResetGame = useCallback(() => {
    setLastPlayedDate(DAY);
    setBoard(fillEmptyBoard());
    setSwapCount(SWAPCOUNT);
    setStart(false);
    setPoints(0);
    setFoundWords([]);
    setNextLetters(fillNewNextLetters());
  }, [
    setLastPlayedDate,
    setBoard,
    setSwapCount,
    setStart,
    setPoints,
    setFoundWords,
    setNextLetters,
  ]);

  //GAME OVER - Check
  useEffect(() => {
    if (userState.lastPlayedDate !== DAY) {
      if (userState.swapCount <= 0) {
        ResetGame();
      }
      const weeklyScoreArr = [...userState.weeklyScores];
      const weeklyPointsArr = [...userState.weeklyPoints];
      weeklyScoreArr[DAY] = null;
      weeklyPointsArr[DAY] = null;
      setWeeklyScores(weeklyScoreArr);
      setWeeklyPoints(weeklyPointsArr);
    }
    if (userState.swapCount === 0) {
      handleOpenModal();
      const weeklyScoreArr = [...userState.weeklyScores];
      const weeklyPointsArr = [...userState.weeklyPoints];
      //only overwrite score if it beats current daily score
      if (userState.foundWords.length >= (weeklyScoreArr[DAY] ?? 0)) {
        weeklyScoreArr[DAY] = userState.foundWords.length;
        setWeeklyScores(weeklyScoreArr);
      }
      if (userState.points >= (weeklyPointsArr[DAY] ?? 0)) {
        weeklyPointsArr[DAY] = userState.points;
        setWeeklyPoints(weeklyPointsArr);
      }

      setLastPlayedDate(DAY);
      setSwapCount(-1);
      setStart(false);
    }
  }, [
    userState.swapCount,
    userState.lastPlayedDate,
    userState.foundWords.length,
    userState.weeklyScores,
    userState.points,
    userState.weeklyPoints,
    ResetGame,
    setLastPlayedDate,
    setSwapCount,
    setWeeklyPoints,
    setWeeklyScores,
  ]);

  //calculate height of board container (for found words drawer dynamic height)
  useEffect(() => {
    if (boardHeight.current) {
      const containerHeight = boardHeight.current.clientHeight;
      setWordsExpandHeight(containerHeight);
    }
  }, [foundWordsExpand]);

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
    let prevLetter = userState.board[rowIndex][colIndex];
    const newBoard = [...userState.board];

    const tile = document.getElementById(`${rowIndex}-${colIndex}`);
    applyAnimation(tile, setAnimateFlip);

    // Replace letter with new selection
    newBoard[rowIndex][colIndex] = letter;
    setBoard(newBoard);

    // Check if Word has been created & delete it if it was
    const foundWord = checkForWords(
      newBoard,
      userState.foundWords,
      setFoundWords,
      setRecentFoundWords,
      setAnimatedPoints,
      setAnimateFound,
      userState.points,
      setPoints,
      isDark,
      setBoard
    );

    const swapCounter = document.querySelector(".swaps-container");
    if (prevLetter !== " " && !foundWord) {
      setSwapCount(userState.swapCount - 1);
      swapCounter?.classList.add("animate");
      setTimeout(() => {
        swapCounter?.classList.remove("animate");
      }, 300);
    }

    // Update next letter
    let currentLetter = getRandomLetter();
    //no duplicates inside next letters boxes
    while (userState.nextLetters.includes(currentLetter)) {
      currentLetter = getRandomLetter();
    }
    setNextLetters(userState.nextLetters.substring(1) + currentLetter);
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
          score={userState.foundWords.length}
          points={userState.points}
          weeklyScores={userState.weeklyScores}
          weeklyPoints={userState.weeklyPoints}
          swapCount={userState.swapCount}
          onClose={handleCloseModal}
          reset={ResetGame}
        />
      )}
      {props.showStats && (
        <Modal
          type={"statistics"}
          score={userState.weeklyScores[DAY] ?? -1}
          points={userState.weeklyPoints[DAY] ?? -1}
          weeklyScores={userState.weeklyScores}
          weeklyPoints={userState.weeklyPoints}
          swapCount={userState.swapCount}
          onClose={props.handleCloseStatsModal}
          reset={ResetGame}
        />
      )}
      {!userState.hasPlayed && showComponent && (
        <Modal
          type={"how-to-play"}
          score={userState.foundWords.length}
          points={userState.points}
          weeklyScores={[]}
          weeklyPoints={[]}
          swapCount={userState.swapCount}
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
              <div>{userState.swapCount >= 0 ? userState.swapCount : 0}</div>
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
              {userState.nextLetters[0]}
            </div>
            <div
              className="tile small-tile"
              style={mergeStyles(colorStyle, borderStyle, backgroundStyle)}
            >
              {userState.nextLetters[1]}
            </div>
            <div
              className="tile small-tile"
              style={mergeStyles(colorStyle, borderStyle, backgroundStyle)}
            >
              {userState.nextLetters[2]}
            </div>
          </div>
        </div>

        <div className="board">
          {userState.board.map((row, rowIndex) => (
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
                    userState.swapCount <= 0
                      ? handleOpenModal()
                      : !animateFlip &&
                        !animateFound &&
                        handleBoard(
                          rowIndex,
                          colIndex,
                          userState.nextLetters[0]
                        )
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
                Words: <b>{userState.foundWords.length}</b>
              </div>
              <div className="middle-divider">|</div>
              <div className="found-word-left-column">
                Points: <b>{userState.points}</b>
              </div>
            </div>
            <div className="found-words-list">
              {foundWordsExpand &&
                userState.foundWords.sort().map((word, i) => (
                  <div className="found-word-text" key={i}>
                    {userState.recentFoundWords.includes(word) ? (
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
