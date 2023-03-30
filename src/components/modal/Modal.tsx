import React from "react";
import "./modal.css";

interface ModalProps {
  type: string;
  score: number;
  onClose: () => void;
  reset: () => void;
}

const howToPlay = (
  <>
    <h1 className="how-to-play-title">How To Play</h1>
    <p className="how-to-play-subtitle">
      Create as many 5-letter words as possible
    </p>
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

const gameOver = (score: number) => <p>You found {score} word(s)</p>;

const Modal: React.FC<ModalProps> = ({ type, score, onClose, reset }) => {
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    closeModal();
  };

  const closeModal = () => {
    const modal = document.querySelector(".modal-content");
    modal?.classList.add("closed");
    setTimeout(() => {
      onClose();
    }, 300);
    //temporary - reset when user completes game
    if (type === "game-over") {
      reset();
    }
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
            width="1.5rem"
            height="1.5rem"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="Menu / Close_MD">
              <path
                id="Vector"
                d="M18 18L12 12M12 12L6 6M12 12L18 6M12 12L6 18"
                stroke="#000000"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
          </svg>
          {/* <img alt="" src={closeSvg} className="close-button-img" /> */}
        </button>
        {type === "game-over" && gameOver(score)}
        {type === "how-to-play" && howToPlay}
      </div>
    </div>
  );
};

export default Modal;
