import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import GymTraining from "./components/GymTraining";

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
  return (
    <>
      <GymTraining />
    </>
  );
}

export default App;
