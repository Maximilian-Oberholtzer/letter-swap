import React from "react";
import Main from "./components/main/Main";
import { ThemeProvider } from "./components/Theme";
import { BrowserRouter as Router } from "react-router-dom";

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <Main />
      </Router>
    </ThemeProvider>
  );
};

export default App;
