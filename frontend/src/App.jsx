import "./App.css";
import Inscription from "./pages/Inscription";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Main from "./pages/Main";
import Misspassword from "./pages/Misspassword";
import Notification from "./components/Notification";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/jeux" element={<Main />} />
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/update" element={<Misspassword />} />
        </Routes>
        <Notification />
      </BrowserRouter>
    </>
  );
}

export default App;
