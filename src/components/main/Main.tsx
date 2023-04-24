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
import Appbar from "../appbar/Appbar";
import {
  fetchDailyLeaderboardData,
  fetchLeaderboardData,
  writeToLeaderboard,
} from "../leaderboard/leaderboardFunctions";
import { LeaderboardEntry } from "../leaderboard/leaderboardFunctions";

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
  //Daily bonus letter
  const [bonusLetter, setBonusLetter] = useState("");

  //Initialize leaderboard data and send to leaderboard modal
  const [addedToLeaderboard, setAddedToLeaderboard] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<
    LeaderboardEntry[] | null
  >(null);
  const [leaderboardDailyData, setLeaderboardDailyData] = useState<
    LeaderboardEntry[] | null
  >(null);
  useEffect(() => {
    fetchLeaderboardData(setLeaderboardData);
    fetchDailyLeaderboardData(setLeaderboardDailyData);
  }, [userState.gameId, addedToLeaderboard]);

  // Add to leaderboard
  useEffect(() => {
    //Potential entry into the database
    let entry = {
      id: userState.gameId,
      name: userState.userName,
      score: userState.weeklyScores[DAY] ?? 0,
      points: userState.weeklyPoints[DAY] ?? 0,
      foundWords: userState.foundWords,
      recentFoundWords: userState.recentFoundWords,
    };

    //Check if entry should be added
    let idExists = false;
    if (leaderboardData) {
      for (let row of leaderboardData) {
        if (row.id === userState.gameId) {
          idExists = true;
        }
      }

      if (!idExists && !addedToLeaderboard) {
        writeToLeaderboard(entry);
        setTimeout(() => {
          setAddedToLeaderboard(true);
        }, 1000);
        console.log("Entry added to db");
      } else {
        console.log("Entry not added - duplicate id");
      }
    }
  }, [
    userState.userName,
    userState.gameId,
    leaderboardData,
    userState.weeklyPoints,
    userState.weeklyScores,
    addedToLeaderboard,
    userState.foundWords,
    userState.recentFoundWords,
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
    handleBonusLetterModal();
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
        leaderboardDailyData={leaderboardDailyData}
        setUserState={setUserState}
      />
      <Board
        userState={userState}
        setUserState={setUserState}
        resetGame={resetGame}
        handleBonusLetterModal={handleBonusLetterModal}
        showBonusLetterModal={showBonusLetterModal}
        bonusLetter={bonusLetter}
        setBonusLetter={setBonusLetter}
        setAddedToLeaderboard={setAddedToLeaderboard}
      />
    </div>
  );
}

export default Main;
