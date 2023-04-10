import React from "react";
import { useTheme } from "../Theme";
import "./modal.css";

const day = new Date().getDate();
const month = new Date().getMonth();

const BonusLetter = (bonusLetter: string, isDark: boolean) => (
  <div>
    <h1 className="modal-title">
      Bonus Letter ({month + 1}/{day})
    </h1>
    <p className="modal-subtitle">Bonus Letters are worth 2x points</p>
    <div className="bonus-letter-container">
      <div className="bonus-letter-text">Today's bonus letter: </div>
      <div
        className="tile small-tile"
        style={{
          border: isDark ? "0.15rem dashed #cfcfcf" : "0.15rem dashed #505050",
        }}
      >
        {bonusLetter}
      </div>
    </div>
  </div>
);

interface ModalProps {
  onClose: () => void;
  bonusLetter: string;
}

const BonusLetterModal: React.FC<ModalProps> = ({ onClose, bonusLetter }) => {
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
        {BonusLetter(bonusLetter, isDark)}
      </div>
    </div>
  );
};

export default BonusLetterModal;
