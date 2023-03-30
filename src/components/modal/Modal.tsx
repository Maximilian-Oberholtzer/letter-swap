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

    <p className="how-to-play-subtitle">Examples</p>
  </>
);

const gameOver = (score: number) => <p>You found {score} word(s)</p>;

const Modal: React.FC<ModalProps> = ({ type, score, onClose, reset }) => {
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      const modal = document.querySelector(".modal-content");
      modal?.classList.add("closed");
      setTimeout(() => {
        onClose();
      }, 300);
    }
    reset();
  };
  return (
    <div className="modal-container">
      <div className="modal-overlay" onClick={handleOverlayClick}></div>
      <div className="modal-content">
        {type === "game-over" && gameOver(score)}
        {type === "how-to-play" && howToPlay}
      </div>
    </div>
  );
};

export default Modal;
