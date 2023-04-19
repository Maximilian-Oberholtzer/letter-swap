import React from "react";
import { useTheme } from "../Theme";
import { LeaderboardEntry } from "../leaderboard/leaderboardFunctions";
import "./modal.css";

const leaderBoard = (leaderboardData: LeaderboardEntry[] | null) => (
  <div>
    <h1 className="modal-title">Hall of Fame</h1>
    <p className="modal-subtitle">Top 25 scores of all time </p>
    {leaderboardData ? (
      <div className="leaderboard-list">
        {leaderboardData.length === 0 && (
          <div>No results posted to leaderboard.</div>
        )}
        {leaderboardData?.map((entry, index) => (
          <div className="leaderboard-entry" key={entry.id}>
            {index === 0 &&
              `🥇 ${entry.name} - ${entry.score} words for ${entry.points} points.`}
            {index === 1 &&
              `🥈 ${entry.name} - ${entry.score} words for ${entry.points} points.`}
            {index === 2 &&
              `🥉 ${entry.name} - ${entry.score} words for ${entry.points} points.`}
            {index > 2 && (
              <span style={{ marginLeft: "0.3rem" }}>
                {
                  <span style={{ marginRight: "0.3rem" }}>{`${
                    index + 1
                  }.`}</span>
                }
                {` ${entry.name} - ${entry.score} words for 
              ${entry.points} points.`}
              </span>
            )}
          </div>
        ))}
      </div>
    ) : (
      <div>Error fetching leaderboard data.</div>
    )}
  </div>
);

interface ModalProps {
  onClose: () => void;
  leaderboardData: LeaderboardEntry[] | null;
}

const LeaderboardModal: React.FC<ModalProps> = ({
  onClose,
  leaderboardData,
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
        {leaderBoard(leaderboardData)}
      </div>
    </div>
  );
};

export default LeaderboardModal;
