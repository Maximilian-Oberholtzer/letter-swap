import React, { useEffect, useState } from "react";
import Modal from "../modal/Modal";
import "./main.css";

function Main() {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  //Remove animations from title so they can re-animate later
  useEffect(() => {
    const titleTile = document.querySelector(".title-tile");
    const titleTile2 = document.querySelector(".title-tile-2");

    setTimeout(() => {
      titleTile?.classList.remove("animate-delay-medium");
      titleTile2?.classList.remove("animate-delay-long");
    }, 1100);
  }, []);

  return (
    <div className="appbar">
      {showModal && (
        <Modal
          type={"how-to-play"}
          score={0}
          weeklyScores={[]}
          onClose={handleCloseModal}
          reset={() => {}}
        />
      )}
      <div className="title-container">
        <span className="title">
          <div className="title-tile animate-delay-medium">L</div>
          etter
        </span>
        <span className="title" style={{ marginTop: "1rem" }}>
          <div className="title-tile-2 animate-delay-long">S</div>
          wap
        </span>
      </div>
      <div className="menu-right">
        <button className="help-button" onClick={() => handleOpenModal()}>
          <svg
            className="help-button-svg"
            xmlns="http://www.w3.org/2000/svg"
            fill="#000000"
            viewBox="0 0 24 24"
          >
            <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Main;
