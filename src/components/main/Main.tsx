import React, { useEffect, useState } from "react";
import { useTheme } from "../Theme";
import Modal from "../modal/Modal";
import Board from "../board/Board";
import "./main.css";

function Main() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const [showModal, setShowModal] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleOpenStatsModal = () => {
    setShowStats(true);
  };
  const handleCloseStatsModal = () => {
    setShowStats(false);
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
        {showModal && (
          <Modal
            type={"how-to-play"}
            score={0}
            points={0}
            weeklyScores={[]}
            weeklyPoints={[]}
            onClose={handleCloseModal}
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
          <button className="theme-button" onClick={toggleTheme}>
            <svg
              className="theme-button-svg"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                style={{
                  stroke: isDark ? "var(--dark-text)" : "var(--light-text)",
                  transition: "300ms stroke",
                }}
                d="M12 7a5 5 0 0 0-3.573 8.497c.343.351.626.77.722 1.251l.53 2.644A2 2 0 0 0 11.638 21h.722a2 2 0 0 0 1.96-1.608l.53-2.644c.096-.482.379-.9.722-1.25A5 5 0 0 0 12 7z"
                strokeWidth="2"
              />
              <path
                style={{
                  stroke: isDark ? "var(--dark-text)" : "var(--light-text)",
                  transition: "300ms stroke",
                }}
                d="M12 4V3M18 6l1-1M20 12h1M4 12H3M5 5l1 1M10 17h4"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            className="stats-button"
            onClick={() => handleOpenStatsModal()}
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
          <button className="help-button" onClick={() => handleOpenModal()}>
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
      <Board
        showStats={showStats}
        handleCloseStatsModal={handleCloseStatsModal}
      />
    </div>
  );
}

export default Main;
