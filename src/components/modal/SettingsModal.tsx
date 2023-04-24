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

const currentYear = new Date().getFullYear();
const settings = (
  toggleTheme: () => void,
  isDark: boolean,
  userName: string,
  setUserName: Dispatch<SetStateAction<string>>,
  closeModal: () => void,
  setSoundEnabled: Dispatch<SetStateAction<boolean>>,
  soundEnabled: boolean
) => (
  <div>
    <h1 className="modal-title">Settings</h1>
    <div style={{ marginTop: "2rem", marginBottom: "0.5rem" }}>Username:</div>
    <div
      className="username-form"
      style={{
        marginBottom: "0.5rem",
      }}
    >
      <input
        maxLength={10}
        style={{
          border: isDark
            ? "1px solid var(--dark-text)"
            : "1px solid var(--light-text)",
        }}
        className="username-input"
        type="text"
        value={userName}
        onChange={(event) => handleInputChange(event, setUserName)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            closeModal();
          }
        }}
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
              transition: "300ms fill",
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
    <div className="theme-container">
      <div>Light / Dark mode:</div>
      <button
        className={`theme-button ${isDark ? "outline-dark" : "outline-light"}`}
        onClick={toggleTheme}
      >
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
    <div className="sound-container">
      <div>Toggle sound: </div>
      <button
        className={`sound-button ${isDark ? "outline-dark" : "outline-light"}`}
        onClick={() => {
          setSoundEnabled(!soundEnabled);
        }}
      >
        {soundEnabled ? (
          <svg
            className="sound-button-svg"
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g
              style={{
                fill: isDark ? "var(--dark-text)" : "var(--light-text)",
                transition: "300ms fill",
              }}
              transform="translate(42.666667, 85.333333)"
            >
              <path d="M361.299413,341.610667 L328.014293,314.98176 C402.206933,233.906133 402.206933,109.96608 328.013013,28.8906667 L361.298133,2.26304 C447.910187,98.97536 447.908907,244.898347 361.299413,341.610667 Z M276.912853,69.77216 L243.588693,96.4309333 C283.38432,138.998613 283.38304,204.87488 243.589973,247.44256 L276.914133,274.101333 C329.118507,215.880107 329.118507,127.992107 276.912853,69.77216 Z M191.749973,1.42108547e-14 L80.8957867,87.2292267 L7.10542736e-15,87.2292267 L7.10542736e-15,257.895893 L81.0208,257.895893 L191.749973,343.35424 L191.749973,1.42108547e-14 L191.749973,1.42108547e-14 Z M42.6666667,129.895893 L95.6874667,129.895893 L149.083307,87.8749867 L149.083307,256.520747 L95.5624533,215.229227 L42.6666667,215.229227 L42.6666667,129.895893 Z"></path>
            </g>
          </svg>
        ) : (
          <svg
            className="sound-button-svg"
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g
              style={{
                fill: isDark ? "var(--dark-text)" : "var(--light-text)",
                transition: "300ms fill",
              }}
              transform="translate(42.666667, 85.333333)"
            >
              <path d="M47.0849493,-1.42108547e-14 L409.751616,362.666662 L379.581717,392.836561 L191.749,205.003 L191.749973,369.105851 L81.0208,283.647505 L7.10542736e-15,283.647505 L7.10542736e-15,112.980838 L80.8957867,112.980838 L91.433,104.688 L16.9150553,30.169894 L47.0849493,-1.42108547e-14 Z M361.298133,28.0146513 C429.03793,103.653926 443.79725,209.394854 405.578543,298.152074 L372.628731,265.200172 C396.498116,194.196781 381.626371,113.22828 328.013013,54.642278 L361.298133,28.0146513 Z M121.824,135.078 L95.6874667,155.647505 L42.6666667,155.647505 L42.6666667,240.980838 L95.5624533,240.980838 L149.083307,282.272358 L149.083,162.337 L121.824,135.078 Z M276.912853,95.5237713 C305.539112,127.447886 318.468552,168.292377 315.701384,208.274722 L266.463468,159.037386 C261.494642,145.732631 253.869746,133.179747 243.588693,122.182545 L243.588693,122.182545 Z M191.749973,25.7516113 L191.749,84.325 L158.969,51.545 L191.749973,25.7516113 Z"></path>
            </g>
          </svg>
        )}
      </button>
    </div>
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
        className={`donate-link ${
          isDark ? "button-focus-dark" : "button-focus-light"
        }`}
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
  userName: string;
  setUserName: Dispatch<SetStateAction<string>>;
  setSoundEnabled: Dispatch<SetStateAction<boolean>>;
  soundEnabled: boolean;
}

const SettingsModal: React.FC<ModalProps> = ({
  onClose,
  reset,
  userName,
  setUserName,
  setSoundEnabled,
  soundEnabled,
}) => {
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
      if (
        userName.length === 0 ||
        bannedWords.includes(userName.toLowerCase())
      ) {
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
        {settings(
          toggleTheme,
          isDark,
          userName,
          setUserName,
          closeModal,
          setSoundEnabled,
          soundEnabled
        )}
      </div>
    </div>
  );
};

export default SettingsModal;
