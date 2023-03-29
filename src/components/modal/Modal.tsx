import React from "react";
import "./modal.css";

interface ModalProps {
  content: string;
  onClose: () => void;
  reset: () => void;
}

const Modal: React.FC<ModalProps> = ({ content, onClose, reset }) => {
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
      reset();
    }
  };
  return (
    <div className="modal-container">
      <div className="modal-overlay" onClick={handleOverlayClick}></div>
      <div className="modal-content">
        <p>{content}</p>
      </div>
    </div>
  );
};

export default Modal;
