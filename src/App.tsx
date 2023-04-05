import React, { useEffect } from "react";
import Main from "./components/main/Main";
import { ThemeProvider } from "./components/Theme";
import { trackPageView } from "./analytics";
import { useLocation } from "react-router-dom";

const App: React.FC = () => {
  const location = useLocation();
  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return (
    <ThemeProvider>
      <Main />
    </ThemeProvider>
  );
};

export default App;
