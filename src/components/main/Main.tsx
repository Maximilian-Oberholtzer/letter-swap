import React, { useEffect, useState } from "react";
import { useTheme } from "../Theme";
import Modal from "../modal/Modal";
import Board from "../board/Board";
import { fillEmptyBoard, fillNewNextLetters } from "../board/BoardFunctions";
import { trackPageView } from "../../analytics";
import { useLocation } from "react-router-dom";
import "./main.css";

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
}

function Main() {
  //google analytics
  const location = useLocation();
  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  //global user state
  const [userState, setUserState] = useState<UserState>(() => {
    const storedState = localStorage.getItem("userState");
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
        };
  });

  useEffect(() => {
    localStorage.setItem("userState", JSON.stringify(userState));
  }, [userState]);

  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [showInstructions, setShowInstructions] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleInstructionsModal = () => {
    setShowInstructions(!showInstructions);
  };
  const handleStatsModal = () => {
    setShowStats(!showStats);
  };
  const handleSettingsModal = () => {
    setShowSettings(!showSettings);
  };

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
      <div
        className="appbar"
        style={{
          backgroundColor: isDark
            ? "var(--dark-background)"
            : "var(--light-background)",
        }}
      >
        {showInstructions && (
          <Modal
            type={"how-to-play"}
            score={0}
            points={0}
            weeklyScores={[]}
            weeklyPoints={[]}
            swapCount={0}
            onClose={handleInstructionsModal}
            reset={() => {}}
          />
        )}
        {showSettings && (
          <Modal
            type={"settings"}
            score={0}
            points={0}
            weeklyScores={[]}
            weeklyPoints={[]}
            swapCount={0}
            onClose={handleSettingsModal}
            reset={() => {}}
          />
        )}
        <div
          className="title-container"
          style={{
            backgroundColor: isDark
              ? "var(--dark-background)"
              : "var(--light-background)",
          }}
        >
          <span
            className="title"
            style={{
              color: isDark ? "var(--dark-text)" : "var(--light-text)",
            }}
          >
            <div
              className="title-tile animate-delay-medium"
              style={{
                backgroundColor: isDark
                  ? "var(--dark-background)"
                  : "var(--light-background)",
                color: isDark ? "var(--dark-text)" : "var(--light-text)",
                border: isDark
                  ? "2px solid var(--dark-text)"
                  : "2px solid var(--light-text)",
              }}
            >
              L
            </div>
            etter
          </span>
          <span
            className="title"
            style={{
              color: isDark ? "var(--dark-text)" : "var(--light-text)",
              marginTop: "1rem",
            }}
          >
            <div
              className="title-tile-2 animate-delay-long"
              style={{
                backgroundColor: isDark
                  ? "var(--dark-background)"
                  : "var(--light-background)",
                color: isDark ? "var(--dark-text)" : "var(--light-text)",
                border: isDark
                  ? "2px solid var(--dark-text)"
                  : "2px solid var(--light-text)",
              }}
            >
              S
            </div>
            wap
          </span>
        </div>
        <div className="menu-right">
          <button className="stats-button" onClick={() => handleStatsModal()}>
            <svg
              style={{
                fill: isDark ? "var(--dark-text)" : "var(--light-text)",
                transition: "300ms fill",
              }}
              className="stats-button-svg"
              viewBox="4 4 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20.6666 14.8333V5.5H11.3333V12.5H4.33325V26.5H27.6666V14.8333H20.6666ZM13.6666 7.83333H18.3333V24.1667H13.6666V7.83333ZM6.66659 14.8333H11.3333V24.1667H6.66659V14.8333ZM25.3333 24.1667H20.6666V17.1667H25.3333V24.1667Z" />
            </svg>
          </button>
          <button
            className="help-button"
            onClick={() => handleInstructionsModal()}
          >
            <svg
              style={{
                fill: isDark ? "var(--dark-text)" : "var(--light-text)",
                transition: "300ms fill",
              }}
              className="help-button-svg"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" />
            </svg>
          </button>
          <button
            className="settings-button"
            onClick={() => handleSettingsModal()}
          >
            <svg
              style={{
                fill: isDark ? "var(--dark-text)" : "var(--light-text)",
                transition: "300ms fill",
              }}
              className="settings-button-svg"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M4,13.743l-1,.579a1,1,0,0,0-.366,1.366l1.488,2.578a1,1,0,0,0,1.366.366L6.5,18.05a1.987,1.987,0,0,1,1.986,0l.02.011a1.989,1.989,0,0,1,1,1.724V21a1,1,0,0,0,1,1h3a1,1,0,0,0,1-1V19.782a1.985,1.985,0,0,1,.995-1.721l.021-.012a1.987,1.987,0,0,1,1.986,0l1.008.582a1,1,0,0,0,1.366-.366l1.488-2.578A1,1,0,0,0,21,14.322l-1-.579a1.994,1.994,0,0,1-1-1.733v-.021a1.991,1.991,0,0,1,1-1.732l1-.579a1,1,0,0,0,.366-1.366L19.876,5.734a1,1,0,0,0-1.366-.366L17.5,5.95a1.987,1.987,0,0,1-1.986,0L15.5,5.94a1.989,1.989,0,0,1-1-1.724V3a1,1,0,0,0-1-1h-3a1,1,0,0,0-1,1V4.294A1.856,1.856,0,0,1,8.57,5.9l-.153.088a1.855,1.855,0,0,1-1.853,0L5.49,5.368a1,1,0,0,0-1.366.366L2.636,8.312A1,1,0,0,0,3,9.678l1,.579A1.994,1.994,0,0,1,5,11.99v.021A1.991,1.991,0,0,1,4,13.743ZM12,9a3,3,0,1,1-3,3A3,3,0,0,1,12,9Z" />
            </svg>
          </button>
        </div>
      </div>
      <Board
        showStats={showStats}
        handleCloseStatsModal={handleStatsModal}
        userState={userState}
        setUserState={setUserState}
      />
    </div>
  );
}

export default Main;
