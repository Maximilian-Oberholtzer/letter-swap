import React, { useState, useEffect } from "react";
import { useTheme } from "../Theme";
import StatisticsModal from "../modal/StatisticsModal";
import HowToPlayModal from "../modal/HowToPlayModal";
import SettingsModal from "../modal/SettingsModal";
import { UserState } from "../main/Main";
import "./appbar.css";
import LeaderboardModal from "../modal/LeaderboardModal";
import { LeaderboardEntry } from "../leaderboard/leaderboardFunctions";

const DAY = new Date().getDay();

interface AppbarProps {
  userState: UserState;
  resetGame: () => void;
  leaderboardData: LeaderboardEntry[] | null;
}

function Appbar(props: AppbarProps) {
  const { userState, resetGame, leaderboardData } = props;

  const [showInstructions, setShowInstructions] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Allow focus for buttons only if modal is not active
  const [focusable, setFocusable] = useState(true);
  useEffect(() => {
    if (showInstructions || showSettings || showStats || showLeaderboard) {
      setFocusable(false);
    } else {
      setFocusable(true);
    }
  }, [showInstructions, showSettings, showStats, showLeaderboard]);

  const handleInstructionsModal = () => {
    setShowInstructions(!showInstructions);
  };
  const handleStatsModal = () => {
    setShowStats(!showStats);
  };
  const handleSettingsModal = () => {
    setShowSettings(!showSettings);
  };
  const handleLeaderboardModal = () => {
    setShowLeaderboard(!showLeaderboard);
  };

  return (
    <div
      className="appbar"
      style={{
        backgroundColor: isDark
          ? "var(--dark-background)"
          : "var(--light-background)",
      }}
    >
      {showInstructions && <HowToPlayModal onClose={handleInstructionsModal} />}
      {showStats && (
        <StatisticsModal
          score={userState.weeklyScores[DAY] ?? -1}
          points={userState.weeklyPoints[DAY] ?? -1}
          weeklyScores={userState.weeklyScores}
          weeklyPoints={userState.weeklyPoints}
          swapCount={userState.swapCount}
          onClose={handleStatsModal}
          reset={resetGame}
        />
      )}
      {showSettings && (
        <SettingsModal onClose={handleSettingsModal} reset={resetGame} />
      )}
      {showLeaderboard && (
        <LeaderboardModal
          onClose={handleLeaderboardModal}
          leaderboardData={leaderboardData}
        />
      )}
      <div className="menu-left">
        <button
          className={`settings-button ${
            isDark ? "outline-dark" : "outline-light"
          }`}
          tabIndex={focusable ? 0 : -1}
          id="settings-button"
          type="button"
          aria-label="Settings"
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
            marginTop: "0.65rem",
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
        <button
          className={`stats-button ${
            isDark ? "outline-dark" : "outline-light"
          }`}
          tabIndex={focusable ? 0 : -1}
          id="stats-button"
          type="button"
          aria-label="Stats"
          onClick={() => handleStatsModal()}
        >
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
          className={`trophy-button ${
            isDark ? "outline-dark" : "outline-light"
          }`}
          onClick={() => handleLeaderboardModal()}
        >
          <svg
            style={{
              fill: isDark ? "var(--dark-text)" : "var(--light-text)",
              transition: "300ms fill",
            }}
            className="trophy-button-svg"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M22,3H19V2a1,1,0,0,0-1-1H6A1,1,0,0,0,5,2V3H2A1,1,0,0,0,1,4V6a4.994,4.994,0,0,0,4.276,4.927A7.009,7.009,0,0,0,11,15.92V18H7a1,1,0,0,0-.949.684l-1,3A1,1,0,0,0,6,23H18a1,1,0,0,0,.948-1.316l-1-3A1,1,0,0,0,17,18H13V15.92a7.009,7.009,0,0,0,5.724-4.993A4.994,4.994,0,0,0,23,6V4A1,1,0,0,0,22,3ZM5,8.829A3.006,3.006,0,0,1,3,6V5H5ZM16.279,20l.333,1H7.387l.334-1ZM17,9A5,5,0,0,1,7,9V3H17Zm4-3a3.006,3.006,0,0,1-2,2.829V5h2ZM10.667,8.667,9,7.292,11,7l1-2,1,2,2,.292L13.333,8.667,13.854,11,12,9.667,10.146,11Z" />
          </svg>
        </button>
        <button
          className={`help-button ${isDark ? "outline-dark" : "outline-light"}`}
          tabIndex={focusable ? 0 : -1}
          id="help-button"
          type="button"
          aria-label="Help"
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
      </div>
    </div>
  );
}

export default Appbar;
