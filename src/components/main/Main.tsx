import React, { useState } from "react";
import helpSvg from "../../assets/help.svg";
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

  return (
    <div className="appbar">
      {showModal && (
        <Modal
          type={"how-to-play"}
          score={0}
          onClose={handleCloseModal}
          reset={() => {}}
        />
      )}
      <div className="title-container">
        <span className="title">
          <div
            className="title-tile animate"
            style={{ animationDelay: "0.5s" }}
          >
            L
          </div>
          etter
        </span>
        <span className="title" style={{ marginTop: "1rem" }}>
          <div
            className="title-tile animate"
            style={{ animationDelay: "0.8s" }}
          >
            S
          </div>
          wap
        </span>
      </div>
      <div className="menu-right">
        <button className="help-button" onClick={() => handleOpenModal()}>
          <img alt="" src={helpSvg} className="help-button-img" />
        </button>
      </div>
    </div>
  );
}

export default Main;
