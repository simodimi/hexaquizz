import "./App.css";
import Inscription from "./pages/Inscription";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Main from "./pages/Main";
import Misspassword from "./pages/Misspassword";
import Notification from "./components/Notification";
import ProtectedRouteUser from "./components/ProtectedRouteUser";
import { AuthProviderUser } from "./components/AuthContextUser";
function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProviderUser>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/inscription" element={<Inscription />} />
            <Route path="/update" element={<Misspassword />} />
            <Route
              path="/jeux"
              element={
                <ProtectedRouteUser>
                  <Main />
                </ProtectedRouteUser>
              }
            />
          </Routes>
          <Notification />
        </AuthProviderUser>
      </BrowserRouter>
    </>
  );
}

export default App;
