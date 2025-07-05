import { useContext, useEffect } from "react";
import "./App.scss";
import { ThemeContext } from "./context/ThemeContext";
import { DARK_THEME, LIGHT_THEME } from "./constants/themeConstants";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MoonIcon from "./assets/icons/moon.svg";
import SunIcon from "./assets/icons/sun.svg";
import BaseLayout from "./layout/BaseLayout";
import { Dashboard, PageNotFound } from "./screens";
import Pdfsum from "./screens/dashboard/Pdfsum";
import PdfChatbot from "./screens/dashboard/PdfChatbot";
import Chatbot from "./screens/dashboard/Chatbot";
import Commentfilter from "./screens/dashboard/Commentfilter";
import Summarizer from "./screens/dashboard/summarizer";
import Websum from "./screens/dashboard/Websum";

function App() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  // adding dark-mode class if the dark mode is set on to the body tag
  useEffect(() => {
    if (theme === DARK_THEME) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.add("dark-mode");
    }
  }, [theme]);

  return (
    <>
      <Router>
        <Routes>
          <Route element={<BaseLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/summarizer" element={<Summarizer />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/commentfilter" element={<Commentfilter />} />
            <Route path="/pdfsum" element={<Pdfsum />} />

            <Route path="/pdfchatbot" element={<PdfChatbot />} />
            <Route path="/websummarizer" element={<Websum />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>

        
      </Router>
    </>
  );
}

export default App;
