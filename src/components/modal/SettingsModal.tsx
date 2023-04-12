import React from "react";
import { useTheme } from "../Theme";
import "./modal.css";

const currentYear = new Date().getFullYear();
const settings = (toggleTheme: () => void, isDark: boolean) => (
  <div>
    <h1 className="modal-title">Settings</h1>
    <div className="theme-container">
      <div>Light / Dark mode:</div>
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
    </div>
    <p className="modal-subtitle-small">Ranks</p>
    <ul style={{ paddingInlineStart: "20px" }}>
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

    <div className="modal-bottom-container">
      <a
        href="https://www.buymeacoffee.com/maxoberholtzer"
        rel="noreferrer"
        target="_blank"
        style={{
          border: isDark
            ? "2px solid var(--dark-text)"
            : "2px solid var(--light-text)",
        }}
        className="donate-link"
      >
        <b>Buy me a Beer! 🍺</b>
      </a>
    </div>
    <div className="copyright-text">
      &copy; {currentYear} Maximilian Oberholtzer
    </div>
  </div>
);

interface ModalProps {
  onClose: () => void;
  reset: () => void;
}

const SettingsModal: React.FC<ModalProps> = ({ onClose, reset }) => {
  const { theme, toggleTheme } = useTheme();
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
        {settings(toggleTheme, isDark)}
      </div>
    </div>
  );
};

export default SettingsModal;
