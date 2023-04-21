import React from "react";
import { useTheme } from "../Theme";
import "./modal.css";

const howToPlay = (
  <div>
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
    <ul
      className="how-to-play-point-description-list"
      style={{ paddingInlineStart: "20px" }}
    >
      <li>1 point - A, D, E, H, I, L, N, O, R, S, T </li>
      <li>2 points - B, C, F, G, M, P, U, W, Y </li>
      <li>3 points - J, K, Q, V, X, Z </li>
      <li>
        3 <b>bonus</b> points for finding a word in a diagonal direction
      </li>
      <li>
        5 <b>bonus</b> points for each additional word found in one turn
      </li>
    </ul>
    <p className="modal-subtitle-small">Ranks</p>
    <ul
      className="how-to-play-point-description-list"
      style={{ paddingInlineStart: "20px" }}
    >
      <li>Beginner: 0 points</li>
      <li>Rookie: 30 points</li>
      <li>Veteran: 70 points</li>
      <li>Expert: 120 points</li>
      <li>Epic: 180 points</li>
      <li>Legend: 240 points</li>
      <li>Unreal: 300 points</li>
      <li>Master: 400 points</li>
      <li>Grandmaster: 500+ points</li>
    </ul>
  </div>
);

interface ModalProps {
  onClose: () => void;
}

const HowToPlayModal: React.FC<ModalProps> = ({ onClose }) => {
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
    }, 300);
  };

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
          tabIndex={0}
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
        {howToPlay}
      </div>
    </div>
  );
};

export default HowToPlayModal;
