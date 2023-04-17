import React, { useEffect, useRef } from "react";
import { useTheme } from "../Theme";
import "./modal.css";

const handleShare = async (score: number, points: number, rank: string) => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: "LetterSwap",
        text: `I got ${rank} today in LetterSwap!\n(${score} ${
          score === 1 ? "word" : "words"
        } for ${points} points)`,
        url: window.location.href,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  } else {
    console.warn("Web Share API not supported on this device.");
  }
};

let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const currentDay = new Date().getDay();

const statistics = (
  score: number,
  points: number,
  weeklyScores: (number | null)[],
  weeklyPoints: (number | null)[],
  swapCount: number,
  rank: string,
  isDark: boolean,
  reset: () => void,
  closeModal: () => void
) => (
  <>
    <h1 className="modal-title">Statistics</h1>
    <p className="modal-subtitle" />
    {score >= 0 ? (
      score === 1 ? (
        <>
          <div className="modal-rank">Today's Rank: {rank}</div>
          <div className="modal-sub-text">
            You found {score} word for a total of {points} points.
          </div>
        </>
      ) : (
        <>
          <div className="modal-rank">Today's Rank: {rank}</div>
          <div className="modal-sub-text">
            You found {score} words for a total of {points} points.
          </div>
        </>
      )
    ) : (
      <div
        className="modal-sub-text"
        style={{ lineHeight: "1.5", marginBottom: "0.75rem" }}
      >
        Complete a game to record your score.
      </div>
    )}
    <div className="weekly-score-container">
      {days.map((day, i) => {
        return (
          <p key={i} className="weekly-score-text">
            {i === currentDay ? (
              <b>
                {day}:{" "}
                {weeklyScores[i] !== null
                  ? weeklyScores[i] === 1
                    ? `${weeklyScores[i]} word | ${
                        weeklyPoints[i] ?? "?"
                      } points`
                    : `${weeklyScores[i]} words | ${
                        weeklyPoints[i] ?? "?"
                      } points`
                  : "---"}
              </b>
            ) : (
              <>
                {day}:{" "}
                {weeklyScores[i] !== null
                  ? weeklyScores[i] === 1
                    ? `${weeklyScores[i] ?? "?"} word | ${
                        weeklyPoints[i] ?? "?"
                      } points`
                    : `${weeklyScores[i] ?? "?"} words | ${
                        weeklyPoints[i] ?? "?"
                      } points`
                  : "---"}
              </>
            )}
          </p>
        );
      })}
    </div>

    {weeklyScores[currentDay] !== null ? (
      <div className="modal-bottom-container">
        <button
          style={{
            border: isDark
              ? "2px solid var(--dark-text)"
              : "2px solid var(--light-text)",
          }}
          onClick={() => {
            handleShare(score, points, rank);
          }}
          className={`share-button ${
            isDark ? "button-focus-dark" : "button-focus-light"
          }`}
        >
          <div className="share-button-container">
            <b>Share</b>{" "}
            <svg
              width="25px"
              height="25px"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.61109 12.4L10.8183 18.5355C11.0462 19.6939 12.6026 19.9244 13.1565 18.8818L19.0211 7.84263C19.248 7.41555 19.2006 6.94354 18.9737 6.58417M9.61109 12.4L5.22642 8.15534C4.41653 7.37131 4.97155 6 6.09877 6H17.9135C18.3758 6 18.7568 6.24061 18.9737 6.58417M9.61109 12.4L18.9737 6.58417M19.0555 6.53333L18.9737 6.58417"
                style={{
                  stroke: isDark ? "var(--dark-text)" : "var(--light-text)",
                }}
                strokeWidth="1.5"
              />
            </svg>
          </div>
        </button>
        {swapCount <= 0 ? (
          <div className="play-again-container">
            <button
              style={{
                border: isDark
                  ? "2px solid var(--dark-text)"
                  : "2px solid var(--light-text)",
              }}
              onClick={() => {
                closeModal();
                setTimeout(() => {
                  reset();
                }, 300);
              }}
              className={`play-again-button ${
                isDark ? "button-focus-dark" : "button-focus-light"
              }`}
            >
              <b>Play Again</b>
            </button>
          </div>
        ) : (
          <div className="play-again-container">
            <button
              style={{
                border: isDark
                  ? "2px solid var(--dark-text)"
                  : "2px solid var(--light-text)",
              }}
              onClick={() => {
                closeModal();
                setTimeout(() => {
                  reset();
                }, 300);
              }}
              className={`play-again-button ${
                isDark ? "button-focus-dark" : "button-focus-light"
              }`}
            >
              <b>Reset Game</b>
            </button>
          </div>
        )}
      </div>
    ) : (
      <div className="modal-bottom-container">
        <div className="play-again-container">
          <button
            style={{
              border: isDark
                ? "2px solid var(--dark-text)"
                : "2px solid var(--light-text)",
            }}
            onClick={() => {
              closeModal();
              setTimeout(() => {
                reset();
              }, 300);
            }}
            className={`play-again-button ${
              isDark ? "button-focus-dark" : "button-focus-light"
            }`}
          >
            <b>Reset Game</b>
          </button>
        </div>
      </div>
    )}
  </>
);

interface ModalProps {
  score: number;
  points: number;
  onClose: () => void;
  reset: () => void;
  weeklyScores: (number | null)[];
  weeklyPoints: (number | null)[];
  swapCount: number;
}

const StatisticsModal: React.FC<ModalProps> = ({
  score,
  points,
  onClose,
  reset,
  weeklyScores,
  weeklyPoints,
  swapCount,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Accessibility focus for modal close button
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, []);

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    closeModal();
  };

  const closeModal = () => {
    const modal = document.querySelector(".modal-content");
    modal?.classList.add("closed");
    setTimeout(() => {
      onClose();
    }, 300);
  };

  let rank = "";
  if (points < 35) {
    rank = "Beginner 🔰";
  } else if (points >= 30 && points < 70) {
    rank = "Rookie ⭐";
  } else if (points >= 70 && points < 120) {
    rank = "Veteran ⭐⭐";
  } else if (points >= 120 && points < 180) {
    rank = "Expert ⭐⭐⭐";
  } else if (points >= 180 && points < 240) {
    rank = "Epic ⭐⭐⭐⭐";
  } else if (points >= 240 && points < 300) {
    rank = "Legend ⭐⭐⭐⭐⭐";
  } else if (points >= 300 && points < 400) {
    rank = "Unreal 🌟🌟🌟🌟🌟";
  } else if (points >= 400 && points < 500) {
    rank = "Master ✨✨✨✨✨";
  } else if (points >= 500) {
    rank = "Grandmaster 💫💫💫💫💫";
  }

  return (
    <div className="modal-container">
      <div
        className="modal-overlay"
        style={{
          backgroundColor: isDark
            ? "rgb(0, 0, 0, 0.6)"
            : "rgb(255, 255, 255, 0.6)",
        }}
        onClick={handleOverlayClick}
      ></div>
      <div
        className="modal-content"
        style={{
          backgroundColor: isDark
            ? "var(--dark-background)"
            : "var(--light-background)",
          color: isDark ? "var(--dark-text)" : "var(--light-text)",
        }}
      >
        <button
          className={`close-button ${
            isDark ? "outline-dark" : "outline-light"
          }`}
          ref={closeButtonRef}
          id="close-button"
          type="button"
          aria-label="Close"
          onClick={() => {
            closeModal();
          }}
        >
          <svg
            width="20px"
            height="20px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g>
              <path
                style={{
                  stroke: isDark ? "var(--dark-text)" : "var(--light-text)",
                }}
                id="Vector"
                d="M18 18L12 12M12 12L6 6M12 12L18 6M12 12L6 18"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </svg>
        </button>
        {statistics(
          score,
          points,
          weeklyScores,
          weeklyPoints,
          swapCount,
          rank,
          isDark,
          reset,
          closeModal
        )}
      </div>
    </div>
  );
};

export default StatisticsModal;
