import React, {
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
  useRef,
  useCallback,
  KeyboardEvent,
} from "react";
import Confetti from "react-confetti";
import { useTheme } from "../Theme";
import {
  getRandomLetter,
  checkForWords,
  applyAnimation,
  generateGameId,
} from "./BoardFunctions";
import { UserState } from "../main/Main";
import "./board.css";
import { bonusLetters } from "../../bonusLetters";
import HowToPlayModal from "../modal/HowToPlayModal";
import StatisticsModal from "../modal/StatisticsModal";
import BonusLetterModal from "../modal/BonusLetterModal";
import UserNameModal from "../modal/UserNameModal";

const DAY = new Date().getDay();

interface BoardProps {
  userState: UserState;
  setUserState: Dispatch<SetStateAction<UserState>>;
  resetGame: () => void;
  handleBonusLetterModal: () => void;
  showBonusLetterModal: boolean;
  setAddedToLeaderboard: Dispatch<SetStateAction<boolean>>;
}

function Board(props: BoardProps) {
  const {
    userState,
    setUserState,
    resetGame,
    handleBonusLetterModal,
    showBonusLetterModal,
    setAddedToLeaderboard,
  } = props;

  const { theme } = useTheme();
  const isDark = theme === "dark";

  //update global user state functions
  const useSetUserState = (key: string) => {
    return useCallback(
      (value: any) => {
        setUserState((prevState) => ({ ...prevState, [key]: value }));
      },
      [key]
    );
  };
  const setBoard = useSetUserState("board");
  const setNextLetters = useSetUserState("nextLetters");
  const setSwapCount = useSetUserState("swapCount");
  const setFoundWords = useSetUserState("foundWords");
  const setRecentFoundWords = useSetUserState("recentFoundWords");
  const setPoints = useSetUserState("points");
  const setHasPlayed = useSetUserState("hasPlayed");
  const setLastPlayedDate = useSetUserState("lastPlayedDate");
  const setWeeklyScores = useSetUserState("weeklyScores");
  const setWeeklyPoints = useSetUserState("weeklyPoints");
  const setUserName = useSetUserState("userName");
  const setGameId = useSetUserState("gameId");

  //set nextLetters as an array for easier jsx mapping
  let nextLetters = userState.nextLetters.split("");

  //Easter egg effects
  const [effect, setEffect] = useState<string>("");
  //Daily bonus letter
  const [bonusLetter, setBonusLetter] = useState("");
  //Animated current points effect
  const [animatedPoints, setAnimatedPoints] = useState(0);
  //For pausing the game to allow animations
  const [animateFlip, setAnimateFlip] = useState(false);
  const [animateFound, setAnimateFound] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showUserNameModal, setShowUserNameModal] = useState(false);

  //Allow animation to run when game is over
  const [canOpenStats, setCanOpenStats] = useState(true);

  //for calculating hieght for found words container
  const [foundWordsExpand, setFoundWordsExpand] = useState(false);
  const [foundWordsExpandHeight, setWordsExpandHeight] = useState(0);
  const boardHeight = useRef<HTMLDivElement>(null);

  //Remove easter egg effects after 6 seconds
  useEffect(() => {
    setTimeout(() => {
      setEffect("");
    }, 6000);
  }, [effect]);

  //Completed game animation when user loads back in to app
  const endGameAnimation = (delay: number) => {
    const row = 5;
    const col = 5;
    setCanOpenStats(false);
    setTimeout(() => {
      for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
          setTimeout(() => {
            const tile = document.getElementById(`${i}-${j}`);
            tile?.classList.add("animate");
            setTimeout(() => {
              tile?.classList.remove("animate");
              setAnimateFlip(false);
            }, 250);
          }, i * 150);
        }
      }
    }, delay);
    setTimeout(() => {
      setCanOpenStats(true);
    }, 1000);
  };

  //If user loads into a game with 0 swaps left
  const startGameSwapCount = userState.swapCount;
  useEffect(() => {
    //wait for 1.5 seconds before showing modal on load
    if (userState.lastPlayedDate === DAY) {
      if (startGameSwapCount < 0) {
        endGameAnimation(300);
        openStatsModal(1300);
      }
    }

    //Flow of modals for user's first time playing
    if (!userState.hasPlayed) {
      setTimeout(() => {
        setShowUserNameModal(true);
      }, 750);
    }
  }, [startGameSwapCount, userState.hasPlayed, userState.lastPlayedDate]);

  //GAME OVER - Check
  useEffect(() => {
    if (userState.lastPlayedDate !== DAY) {
      setLastPlayedDate(DAY);
      resetGame();
      const weeklyScoreArr = [...userState.weeklyScores];
      const weeklyPointsArr = [...userState.weeklyPoints];
      weeklyScoreArr[DAY] = null;
      weeklyPointsArr[DAY] = null;
      setWeeklyScores(weeklyScoreArr);
      setWeeklyPoints(weeklyPointsArr);
    }
    if (userState.swapCount === 0) {
      endGameAnimation(250);
      openStatsModal(1250);
      const weeklyScoreArr = [...userState.weeklyScores];
      const weeklyPointsArr = [...userState.weeklyPoints];
      //only overwrite score if it beats current daily score and give new gameId to be savable to leaderboard
      if (userState.foundWords.length > (weeklyScoreArr[DAY] ?? -1)) {
        weeklyScoreArr[DAY] = userState.foundWords.length;
        setWeeklyScores(weeklyScoreArr);
      }
      if (userState.points > (weeklyPointsArr[DAY] ?? -1)) {
        weeklyPointsArr[DAY] = userState.points;
        setWeeklyPoints(weeklyPointsArr);
        setAddedToLeaderboard(false);
        setGameId(generateGameId());
      }
      setSwapCount(-1);
    }
  }, [
    userState.swapCount,
    userState.lastPlayedDate,
    userState.foundWords.length,
    userState.weeklyScores,
    userState.points,
    userState.weeklyPoints,
    setLastPlayedDate,
    setSwapCount,
    setWeeklyPoints,
    setWeeklyScores,
    setGameId,
    setAddedToLeaderboard,
    resetGame,
    handleBonusLetterModal,
  ]);

  //set daily bonus letter based on current day
  useEffect(() => {
    const startDate = new Date("2023-04-09");
    const currentDate = new Date();
    // Set start date to midnight of the local time zone
    startDate.setHours(0, 0, 0, 0);
    const differenceInTime = currentDate.getTime() - startDate.getTime();
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
    setBonusLetter(bonusLetters[differenceInDays]);
  }, []);

  //calculate height of board container (for found words drawer dynamic height)
  useEffect(() => {
    if (boardHeight.current) {
      const containerHeight = boardHeight.current.clientHeight;
      setWordsExpandHeight(containerHeight);
    }
  }, [foundWordsExpand]);

  //Modal handling
  const openStatsModal = (delay: number) => {
    setTimeout(() => {
      setShowStatsModal(true);
    }, delay);
  };
  const closeStatsModal = () => {
    setShowStatsModal(false);
  };
  const handleCloseUserNameModal = () => {
    setHasPlayed(true);
    setShowUserNameModal(false);
    setShowInstructions(true);
  };
  const handleCloseInstructionsModal = () => {
    setShowInstructions(false);
    handleBonusLetterModal();
  };

  const handleBoard = (rowIndex: number, colIndex: number, letter: string) => {
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
      setBoard,
      bonusLetter,
      setEffect
    );

    //Animate swap counter if used swap
    const swapCounter = document.querySelector(".swaps-container");
    if (prevLetter !== " " && !foundWord) {
      setSwapCount(userState.swapCount - 1);
      swapCounter?.classList.add("animate");
      setTimeout(() => {
        swapCounter?.classList.remove("animate");
      }, 250);
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

  //Handle Accessibility events
  const handleKeyPress = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.code === "Space" || event.code === "Enter") {
      toggleFoundWordsBox();
    }
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
      ? "0.15rem solid var(--dark-border-full)"
      : "0.15rem solid var(--light-border-full)",
  };
  const bonusBorderStyle = {
    border: isDark
      ? "0.15rem dotted var(--dark-border-full)"
      : "0.15rem dotted var(--light-border-full)",
  };
  const emptyBorderStyle = {
    border: isDark
      ? "0.15rem solid var(--dark-border-empty)"
      : "0.15rem solid var(--light-border-empty)",
  };

  return (
    <div className="board-section">
      {effect === "confetti" && (
        <Confetti
          style={{ zIndex: "2000" }}
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={400}
          tweenDuration={12000}
          recycle={false}
          onConfettiComplete={() => {
            setEffect("");
          }}
        />
      )}
      {showStatsModal && (
        <StatisticsModal
          score={userState.foundWords.length}
          points={userState.points}
          weeklyScores={userState.weeklyScores}
          weeklyPoints={userState.weeklyPoints}
          swapCount={userState.swapCount}
          onClose={closeStatsModal}
          reset={resetGame}
        />
      )}
      {showUserNameModal && (
        <UserNameModal
          onClose={handleCloseUserNameModal}
          userName={userState.userName}
          setUserName={setUserName}
        />
      )}
      {showInstructions && (
        <HowToPlayModal onClose={handleCloseInstructionsModal} />
      )}
      {showBonusLetterModal && (
        <BonusLetterModal
          onClose={handleBonusLetterModal}
          bonusLetter={bonusLetter}
        />
      )}
      <div ref={boardHeight} className="board-container">
        <div className="hud-container">
          <div className="hud-text">
            <div
              className="swaps-container"
              style={mergeStyles(colorStyle, borderStyle)}
              aria-label="Swap Count"
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
            aria-label="Next Letters"
          >
            <b className="next-letters-title">Next:</b>
            {nextLetters.map((letter, index) => (
              <div
                key={index}
                className={index === 0 ? "tile medium-tile" : "tile small-tile"}
                style={mergeStyles(
                  colorStyle,
                  backgroundStyle,
                  nextLetters[index] === bonusLetter
                    ? bonusBorderStyle
                    : borderStyle
                )}
              >
                {letter}
              </div>
            ))}
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
                    letter !== " "
                      ? letter === bonusLetter
                        ? bonusBorderStyle
                        : borderStyle
                      : emptyBorderStyle,
                    backgroundStyle
                  )}
                  id={`${rowIndex}-${colIndex}`}
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() =>
                    userState.swapCount <= 0
                      ? canOpenStats && openStatsModal(0)
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
        <div className="found-words-container" aria-label="Found Words">
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
            tabIndex={0}
            onKeyDown={handleKeyPress}
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
