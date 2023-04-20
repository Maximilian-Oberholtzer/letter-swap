import React, { Dispatch, SetStateAction } from "react";
import { useTheme } from "../Theme";
import { bannedWords } from "../../bannedWords";
import "./modal.css";

const handleInputChange = (
  event: React.ChangeEvent<HTMLInputElement>,
  setUserName: Dispatch<SetStateAction<string>>
) => {
  setUserName(event.target.value);
};

const UserName = (
  isDark: boolean,
  userName: string,
  setUserName: Dispatch<SetStateAction<string>>,
  closeModal: () => void
) => (
  <div>
    <h1 className="modal-title">Username</h1>
    <div className="modal-subtitle">Welcome to LetterSwap</div>
    <div className="username-form-container">
      <div className="username-label">Your name:</div>
      <div className="username-form">
        <input
          maxLength={10}
          style={{
            border: isDark
              ? "1px solid var(--dark-text)"
              : "1px solid var(--light-text)",
          }}
          className="username-input"
          type="text"
          placeholder="User"
          onChange={(event) => handleInputChange(event, setUserName)}
        ></input>
        <button
          className="username-save-button"
          onClick={() => {
            userName.length > 0 && closeModal();
          }}
        >
          <svg
            className="username-save-svg"
            viewBox="0 -0.5 21 21"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g
              style={{
                fill: isDark ? "var(--dark-text)" : "var(--light-text)",
              }}
              transform="translate(-419.000000, -640.000000)"
            >
              <g transform="translate(56.000000, 160.000000)">
                <path d="M370.21875,484 C370.21875,483.448 370.68915,483 371.26875,483 C371.84835,483 372.31875,483.448 372.31875,484 C372.31875,484.552 371.84835,485 371.26875,485 C370.68915,485 370.21875,484.552 370.21875,484 L370.21875,484 Z M381.9,497 C381.9,497.552 381.4296,498 380.85,498 L379.8,498 L379.8,494 C379.8,492.895 378.86025,492 377.7,492 L369.3,492 C368.13975,492 367.2,492.895 367.2,494 L367.2,498 L366.15,498 C365.5704,498 365.1,497.552 365.1,497 L365.1,487.044 C365.1,486.911 365.15565,486.784 365.2533,486.691 L367.2,484.837 L367.2,486 C367.2,487.105 368.13975,488 369.3,488 L377.7,488 C378.86025,488 379.8,487.105 379.8,486 L379.8,482 L380.85,482 C381.4296,482 381.9,482.448 381.9,483 L381.9,497 Z M377.7,498 L369.3,498 L369.3,495 C369.3,494.448 369.7704,494 370.35,494 L376.65,494 C377.2296,494 377.7,494.448 377.7,495 L377.7,498 Z M369.3,482.837 L370.17885,482 L377.7,482 L377.7,485 C377.7,485.552 377.2296,486 376.65,486 L370.35,486 C369.7704,486 369.3,485.552 369.3,485 L369.3,482.837 Z M381.9,480 L369.7347,480 C369.45645,480 369.18975,480.105 368.99235,480.293 L363.30765,485.707 C363.11025,485.895 363,486.149 363,486.414 L363,498 C363,499.105 363.93975,500 365.1,500 L381.9,500 C383.06025,500 384,499.105 384,498 L384,482 C384,480.895 383.06025,480 381.9,480 L381.9,480 Z"></path>
              </g>
            </g>
          </svg>
        </button>
      </div>
    </div>
    <p>* This can be changed in settings</p>
  </div>
);

interface ModalProps {
  onClose: () => void;
  userName: string;
  setUserName: Dispatch<SetStateAction<string>>;
}

const UserNameModal: React.FC<ModalProps> = ({
  onClose,
  userName,
  setUserName,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const closeModal = () => {
    const modal = document.querySelector(".modal-content");
    modal?.classList.add("closed");
    setTimeout(() => {
      onClose();
      if (bannedWords.includes(userName.toLowerCase())) {
        setUserName("User");
      }
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
        {UserName(isDark, userName, setUserName, closeModal)}
      </div>
    </div>
  );
};

export default UserNameModal;
