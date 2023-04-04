import React from "react";
import { useTheme } from "../Theme";
import "./modal.css";

interface ModalProps {
  type: string;
  score: number;
  points: number;
  onClose: () => void;
  reset: () => void;
  weeklyScores: (number | null)[];
  weeklyPoints: (number | null)[];
}

const handleShare = async (score: number, points: number, rank: string) => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: "LetterSwap",
        text: `I got ${rank} today!\n(${score} ${
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

const howToPlay = (
  <div style={{}}>
    <h1 className="modal-title">How To Play</h1>
    <p className="modal-subtitle">Create as many 5-letter words as possible</p>
    <ul style={{ paddingInlineStart: "20px" }}>
      <li className="how-to-play-instructions">
        Tap on a tile to replace it with the next letter.
      </li>
      <li className="how-to-play-instructions">
        Spelling a <b>unique</b> 5-letter word in <b>any direction</b> clears
        the row.
      </li>
      <li className="how-to-play-instructions">
        Replacing a tile that <b>does not</b> complete a word uses a <b>swap</b>
        .
      </li>
      <li className="how-to-play-instructions">
        Tap the points/words box to view your words.
      </li>
      <li className="how-to-play-instructions">
        The game is over when you run out of swaps.
      </li>
    </ul>
    <p className="modal-subtitle-small">Points</p>
    <ul style={{ paddingInlineStart: "20px" }}>
      <li>1 point - A, D, E, H, I, L, N, O, R, S, T </li>
      <li>2 points - B, C, F, G, M, P, U, W, Y </li>
      <li>3 points - J, K, Q, V, X, Z </li>
    </ul>
    <p className="modal-subtitle-small">Ranks</p>
    <ul style={{ paddingInlineStart: "20px" }}>
      <li>Rookie: 30 points</li>
      <li>Veteran: 75 points</li>
      <li>Expert: 175 points</li>
      <li>Epic: 200 points</li>
      <li>Legend: 350 points</li>
      <li>Beyond: 500+ points</li>
    </ul>
  </div>
);

let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const currentDay = new Date().getDay();

const statistics = (
  score: number,
  points: number,
  weeklyScores: (number | null)[],
  weeklyPoints: (number | null)[],
  rank: string,
  isDark: boolean
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
      <div>Complete a game to record your score.</div>
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
        className="share-button"
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
    </div>
  </>
);

const Modal: React.FC<ModalProps> = ({
  type,
  score,
  points,
  onClose,
  reset,
  weeklyScores,
  weeklyPoints,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    closeModal();
  };

  const closeModal = () => {
    const modal = document.querySelector(".modal-content");
    modal?.classList.add("closed");
    setTimeout(() => {
      onClose();
      if (type === "statistics") {
        reset();
      }
    }, 300);
    // //temporary - reset when user completes game
  };

  //define ranks and pass into statistics
  let rank = "";
  if (points <= 30) {
    rank = "Rookie ⭐";
  } else if (points <= 75) {
    rank = "Veteran ⭐⭐";
  } else if (points <= 175) {
    rank = "Expert ⭐⭐⭐";
  } else if (points <= 200) {
    rank = "Epic ⭐⭐⭐⭐";
  } else if (points <= 350) {
    rank = "Legend ⭐⭐⭐⭐⭐";
  } else if (points >= 500) {
    rank = "Beyond 🌟🌟🌟🌟🌟";
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
          className="close-button"
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
            <g id="Menu / Close_MD">
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
        {type === "statistics" &&
          statistics(score, points, weeklyScores, weeklyPoints, rank, isDark)}
        {type === "how-to-play" && howToPlay}
      </div>
    </div>
  );
};

export default Modal;
