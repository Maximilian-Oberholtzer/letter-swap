import React from "react";
import Main from "./components/main/Main";
import { ThemeProvider } from "./components/Theme";

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Main />
    </ThemeProvider>
  );
};

export default App;
