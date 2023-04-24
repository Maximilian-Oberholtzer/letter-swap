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
    <div className="how-to-play-bottom-container">
      <div className="how-to-play-points-container">
        <div className="modal-subtitle-small">Points</div>
        <ul
          className="how-to-play-point-description-list"
          style={{ paddingInlineStart: "20px" }}
        >
          <div>1 point - A, D, E, H, I, L, N, O, R, S, T </div>
          <div>2 points - B, C, F, G, M, P, U, W, Y </div>
          <div>3 points - J, K, Q, V, X, Z </div>
          <div>
            3 <b>bonus</b> points for finding a word in a diagonal direction.
          </div>
          <div>
            5 <b>bonus</b> points for each additional word found in one turn.
          </div>
        </ul>
      </div>

      <div className="how-to-play-ranks-container">
        <div className="modal-subtitle-small">Ranks</div>
        <ul
          className="how-to-play-point-description-list"
          style={{ paddingInlineStart: "20px" }}
        >
          <div>Beginner: 0 points</div>
          <div>Rookie: 30 points</div>
          <div>Veteran: 70 points</div>
          <div>Expert: 120 points</div>
          <div>Epic: 180 points</div>
          <div>Legend: 240 points</div>
          <div>Unreal: 300 points</div>
          <div>Master: 400 points</div>
          <div>Grandmaster: 500+ points</div>
        </ul>
      </div>
    </div>
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
          maxWidth: "400px",
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
