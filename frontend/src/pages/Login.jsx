import React, { useState } from "react";
import "../pages/quizz.css";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { toast } from "react-toastify";

const Login = () => {
  const [showerror, setShowerror] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formdata, setformdata] = useState({
    mailuser: "",
    passworduser: "",
  });
  const navigate = useNavigate();
  const handlechange = (e) => {
    setformdata({ ...formdata, [e.target.name]: e.target.value });
  };
  const handlesubmit = (e) => {
    e.preventDefault();
    if (!formdata.mailuser || !formdata.passworduser) {
      setShowerror(true);
      setErrorMessage("Veuillez remplir tous les champs");
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formdata.mailuser)) {
      setShowerror(true);
      setErrorMessage("Veuillez entrer une adresse mail valide");
      toast.error("Veuillez entrer une adresse mail valide");
      return;
    }
    const userData = {
      mailuser: formdata.mailuser,
      passworduser: formdata.passworduser,
      date: new Date().toLocaleDateString("fr-FR"),
    };
    localStorage.setItem("user", JSON.stringify(userData));
    toast.success("Connexion reussie");
    navigate("/jeux");
    console.log({
      mailuser: formdata.mailuser,
      passworduser: formdata.passworduser,
    });
    setShowerror(false);
    setErrorMessage("");
    setformdata({
      mailuser: "",
      passworduser: "",
    });
  };

  return (
    <div className="headerQuiz">
      <div className="LoginUser">
        {showerror && <p style={{ textAlign: "center" }}>{errorMessage}</p>}
        <form onSubmit={handlesubmit}>
          <div className="container">
            <p>adresse email</p>
            <input
              type="email"
              name="mailuser"
              placeholder="entrer votre adresse email "
              value={formdata.mailuser}
              onChange={handlechange}
            />
          </div>
          <div className="container">
            <p>Password</p>
            <input
              type="password"
              name="passworduser"
              placeholder="entrer votre nom "
              value={formdata.passworduser}
              onChange={handlechange}
            />
          </div>
          <Button type="submit" className="accept">
            Se connecter
          </Button>
        </form>
        <div className="linkpath">
          <p>
            Vous n'avez pas de compte ?
            <Link to="/inscription">Inscription</Link>{" "}
          </p>
          <p>
            Mot de passe oublié ?<Link to="/update">misspassword</Link>{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
