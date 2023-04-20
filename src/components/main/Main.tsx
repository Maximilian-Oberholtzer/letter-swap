import React, { useCallback, useEffect, useState } from "react";
import { useTheme } from "../Theme";
import Board from "../board/Board";
import {
  fillEmptyBoard,
  fillNewNextLetters,
  generateGameId,
} from "../board/BoardFunctions";
import { trackPageView } from "../../analytics";
import { useLocation } from "react-router-dom";
import "./main.css";
import {
  LeaderboardEntry,
  addLeaderboardEntry,
} from "../leaderboard/leaderboardFunctions";
import { fetchLeaderboardData } from "../leaderboard/leaderboardFunctions";
import Appbar from "../appbar/Appbar";

const DAY = new Date().getDay();
const SWAPCOUNT = 15;

export interface UserState {
  board: string[][];
  nextLetters: string;
  swapCount: number;
  foundWords: string[];
  recentFoundWords: string[];
  points: number;
  hasPlayed: boolean;
  lastPlayedDate: number;
  weeklyScores: (number | null)[];
  weeklyPoints: (number | null)[];
  userName: string;
  gameId: number;
}

function Main() {
  //google analytics
  const location = useLocation();
  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  //global user state
  const [userState, setUserState] = useState<UserState>(() => {
    const storedState = localStorage.getItem("userData");
    return storedState
      ? JSON.parse(storedState)
      : {
          board: fillEmptyBoard(),
          nextLetters: fillNewNextLetters(),
          swapCount: SWAPCOUNT,
          foundWords: [],
          recentFoundWords: [],
          points: 0,
          hasPlayed: false,
          lastPlayedDate: DAY,
          weeklyScores: Array.from({ length: 7 }, () => null),
          weeklyPoints: Array.from({ length: 7 }, () => null),
          userName: "User",
          gameId: generateGameId(),
        };
  });

  //save user's game
  useEffect(() => {
    localStorage.setItem("userData", JSON.stringify(userState));
  }, [userState]);

  const [showBonusLetterModal, setShowBonusLetterModal] = useState(false);

  //Initialize leaderboard data and send to leaderboard modal
  const [addedToLeaderboard, setAddedToLeaderboard] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<
    LeaderboardEntry[] | null
  >(null);
  useEffect(() => {
    async function fetchData() {
      const data = await fetchLeaderboardData();
      setLeaderboardData(data);
      setAddedToLeaderboard(false);
      console.log("Fetched Data", data);
    }
    fetchData();
  }, [userState.gameId, addedToLeaderboard]);

  //Add to leaderboard
  useEffect(() => {
    //Potential entry into the database
    let entry = {
      id: userState.gameId,
      name: userState.userName,
      score: userState.weeklyScores[DAY] ?? 0,
      points: userState.weeklyPoints[DAY] ?? 0,
    };

    //Check if entry should be added
    let idExists = false;
    if (leaderboardData) {
      for (let row of leaderboardData) {
        if (row.id === userState.gameId) {
          idExists = true;
        }
      }
      //Add first entry in the DB
      if (leaderboardData.length === 0) {
        if (entry.points > 0) {
          setAddedToLeaderboard(true);
          addLeaderboardEntry(entry);
          console.log("Added first entry", entry);
        }
      }
      //Add entry because leaderboard is < 25 rows
      else if (leaderboardData.length < 25 && !idExists && entry.points > 0) {
        setAddedToLeaderboard(true);
        addLeaderboardEntry(entry);
        console.log("Added entry (under 25 entries)", entry);
      }
      //Add entry because it is within the top 25 entries
      else if (
        leaderboardData[leaderboardData.length - 1].points < entry.points &&
        !idExists
      ) {
        setAddedToLeaderboard(true);
        addLeaderboardEntry(entry);
        console.log("Added entry (in the top 25 - bumped one off)", entry);
      } else {
        console.log("Id exists or score does not qualify");
      }
    }
  }, [
    userState.userName,
    userState.gameId,
    leaderboardData,
    userState.weeklyPoints,
    userState.weeklyScores,
    addedToLeaderboard,
  ]);

  const handleBonusLetterModal = useCallback(() => {
    setShowBonusLetterModal(!showBonusLetterModal);
  }, [setShowBonusLetterModal, showBonusLetterModal]);

  const resetGame = useCallback(() => {
    setUserState((prevState) => ({ ...prevState, board: fillEmptyBoard() }));
    setUserState((prevState) => ({ ...prevState, lastPlayedDate: DAY }));
    setUserState((prevState) => ({ ...prevState, swapCount: SWAPCOUNT }));
    setUserState((prevState) => ({ ...prevState, points: 0 }));
    setUserState((prevState) => ({ ...prevState, foundWords: [] }));
    setUserState((prevState) => ({ ...prevState, recentFoundWords: [] }));
    setUserState((prevState) => ({
      ...prevState,
      nextLetters: fillNewNextLetters(),
    }));
    setTimeout(() => {
      handleBonusLetterModal();
    }, 250);
  }, [setUserState, handleBonusLetterModal]);

  const { theme } = useTheme();
  const isDark = theme === "dark";

  //Remove animations from title so they can re-animate later
  useEffect(() => {
    const titleTile = document.querySelector(".title-tile");
    const titleTile2 = document.querySelector(".title-tile-2");

    setTimeout(() => {
      titleTile?.classList.remove("animate-delay-medium");
      titleTile2?.classList.remove("animate-delay-long");
    }, 1100);
  }, []);

  return (
    <div
      className="app-container"
      style={{
        backgroundColor: isDark
          ? "var(--dark-background)"
          : "var(--light-background)",
      }}
    >
      <Appbar
        userState={userState}
        resetGame={resetGame}
        leaderboardData={leaderboardData}
      />
      <Board
        userState={userState}
        setUserState={setUserState}
        resetGame={resetGame}
        handleBonusLetterModal={handleBonusLetterModal}
        showBonusLetterModal={showBonusLetterModal}
      />
    </div>
  );
}

export default Main;
