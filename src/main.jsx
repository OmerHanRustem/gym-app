import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import NewTraining from "./pages/NewTraining.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./rtk/store";
import i18n from "./translations/i18n";
import StatusBar from "./components/StatusBar.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Routes>
          <Route
            path="/gym-app/"
            element={
              <>
                <App />
                <StatusBar />
              </>
            }
          />
          <Route
            path="/gym-app/new"
            element={
              <>
                <NewTraining />
                <StatusBar />
              </>
            }
          />
        </Routes>
      </Router>
    </Provider>
  </React.StrictMode>
);
