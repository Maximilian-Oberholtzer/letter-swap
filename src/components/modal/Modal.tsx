import React from "react";
import "./modal.css";

interface ModalProps {
  type: string;
  score: number;
  onClose: () => void;
  reset: () => void;
  weeklyScores: (number | null)[];
}

const handleShare = async (score: number) => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: "LetterSwap",
        text: `I found ${score} word(s) today in LetterSwap.`,
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
  <>
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
        Your words can be found in the <b>"Found Words"</b> box.
      </li>
      <li className="how-to-play-instructions">
        The game is over when you run out of swaps.
      </li>
    </ul>
  </>
);

let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const currentDay = new Date().getDay();

const statistics = (score: number, weeklyScores: (number | null)[]) => (
  <>
    <h1 className="modal-title">Statistics</h1>
    <p className="modal-subtitle">
      {score !== 1 ? (
        <>Your score today: {score} words.</>
      ) : (
        <>Your score today: {score} word.</>
      )}
    </p>
    <div className="weekly-score-container">
      {days.map((day, i) => {
        return (
          <p key={i} className="weekly-score-text">
            {i === currentDay ? (
              <b>
                {day}: {weeklyScores[i] !== null ? weeklyScores[i] : "---"}
              </b>
            ) : (
              <>
                {day}: {weeklyScores[i] !== null ? weeklyScores[i] : "---"}
              </>
            )}
          </p>
        );
      })}
    </div>
    <div className="modal-bottom-container">
      <button
        onClick={() => {
          handleShare(score);
        }}
        className="share-button"
      >
        <div className="share-button-container">
          <b>Share</b>{" "}
          <svg
            width="2rem"
            height="2rem"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.61109 12.4L10.8183 18.5355C11.0462 19.6939 12.6026 19.9244 13.1565 18.8818L19.0211 7.84263C19.248 7.41555 19.2006 6.94354 18.9737 6.58417M9.61109 12.4L5.22642 8.15534C4.41653 7.37131 4.97155 6 6.09877 6H17.9135C18.3758 6 18.7568 6.24061 18.9737 6.58417M9.61109 12.4L18.9737 6.58417M19.0555 6.53333L18.9737 6.58417"
              stroke="#000000"
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
  onClose,
  reset,
  weeklyScores,
}) => {
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    closeModal();
  };

  const closeModal = () => {
    const modal = document.querySelector(".modal-content");
    modal?.classList.add("closed");
    setTimeout(() => {
      onClose();
      if (type === "game-over") {
        reset();
      }
    }, 300);
    // //temporary - reset when user completes game
  };

  return (
    <div className="modal-container">
      <div className="modal-overlay" onClick={handleOverlayClick}></div>
      <div className="modal-content">
        <button
          className="close-button"
          onClick={() => {
            closeModal();
          }}
        >
          <svg
            width="1.25rem"
            height="1.25rem"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="Menu / Close_MD">
              <path
                id="Vector"
                d="M18 18L12 12M12 12L6 6M12 12L18 6M12 12L6 18"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </svg>
          {/* <img alt="" src={closeSvg} className="close-button-img" /> */}
        </button>
        {type === "game-over" && statistics(score, weeklyScores)}
        {type === "how-to-play" && howToPlay}
      </div>
    </div>
  );
};

export default Modal;
