import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/Home";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { setViewMode } from "./rtk/slices/ui-slice";

import StatusBar from "./components/StatusBar";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then((registration) => {
      console.log("Service Worker registered with scope:", registration.scope);
    })
    .catch((error) => {
      console.error("Service Worker registration failed:", error);
    });
}

function App() {
  const { t, i18n } = useTranslation();

  document.title = t("bunyan");

  useEffect(() => {
    // Update the direction based on the current language
    document.documentElement.dir = i18n.dir();
  }, [i18n.language]);

  const dispatch = useDispatch();

  useEffect(() => {
    const handleResize = () => {
      const newViewMode = window.innerWidth <= 767 ? "cards" : "table";
      dispatch(setViewMode(newViewMode));
    };

    // Initial check
    handleResize();

    // Listen for window resize events
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  return (
    <>
      {/* <h1>{t("greeting", { name: "John" })}</h1> */}
      <Home />
    </>
  );
}

export default App;
