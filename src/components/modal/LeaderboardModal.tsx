import React, { Dispatch, SetStateAction, useState } from "react";
import { useTheme } from "../Theme";
import { LeaderboardEntry } from "../leaderboard/leaderboardFunctions";
import "./modal.css";

const leaderBoard = (
  leaderboardData: LeaderboardEntry[] | null,
  setLeaderboardType: Dispatch<SetStateAction<string>>,
  leaderboardType: string
) => (
  <div>
    <h1 className="modal-title">Hall of Fame</h1>
    <p className="modal-subtitle">
      Top 20 scores {`${leaderboardType === "daily" ? "today" : "of all time"}`}
    </p>
    <div className="leaderboard-type-container">
      <button
        className="daily-leaderboard-button"
        onClick={() => {
          setLeaderboardType("daily");
        }}
      >
        Daily
      </button>
      <button
        className="alltime-leaderboard-button"
        onClick={() => {
          setLeaderboardType("alltime");
        }}
      >
        All time
      </button>
    </div>
    {leaderboardData ? (
      <div className="leaderboard-list">
        {leaderboardData.length === 0 && (
          <div>No results posted to leaderboard.</div>
        )}
        {leaderboardData?.map((entry, index) => (
          <div className="leaderboard-entry" key={entry.id}>
            {index === 0 && (
              <span className="leaderboard-entry-medal">{`🥇 ${entry.name} - ${entry.score} words for ${entry.points} points.`}</span>
            )}
            {index === 1 && (
              <span className="leaderboard-entry-medal">{`🥈 ${entry.name} - ${entry.score} words for ${entry.points} points.`}</span>
            )}
            {index === 2 && (
              <span className="leaderboard-entry-medal">{`🥉 ${entry.name} - ${entry.score} words for ${entry.points} points.`}</span>
            )}
            {index > 2 && (
              <span style={{ marginLeft: "0.3rem" }}>
                {
                  <span style={{ marginRight: "0.3rem" }}>{`${
                    index + 1
                  }.`}</span>
                }
                {` ${entry.name} - ${entry.score} ${
                  entry.score > 1 ? " words" : " word"
                } for 
              ${entry.points} points.`}
              </span>
            )}
          </div>
        ))}
        {leaderboardData.length < 20 &&
          Array(20 - leaderboardData.length)
            .fill(null)
            .map((_, index) => (
              <div className="leaderboard-entry" key={index}>
                <span style={{ marginLeft: "0.3rem" }}>
                  {index + 1 + leaderboardData.length}
                </span>
                . <span style={{ marginLeft: "0.3rem" }}>-----</span>
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
  leaderboardDailyData: LeaderboardEntry[] | null;
}

const LeaderboardModal: React.FC<ModalProps> = ({
  onClose,
  leaderboardData,
  leaderboardDailyData,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [leaderboardType, setLeaderboardType] = useState("daily");

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
        {leaderBoard(
          leaderboardType === "daily" ? leaderboardDailyData : leaderboardData,
          setLeaderboardType,
          leaderboardType
        )}
      </div>
    </div>
  );
};

export default LeaderboardModal;
