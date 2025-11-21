import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { toast } from "react-toastify";

const Inscription = () => {
  const [showerror, setShowerror] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formdata, setformdata] = useState({
    nameuser: "",
    mailuser: "",
    passworduser: "",
  });
  const navigate = useNavigate();
  const handlechange = (e) => {
    setformdata({ ...formdata, [e.target.name]: e.target.value });
  };
  const handlesubmit = (e) => {
    e.preventDefault();
    if (!formdata.mailuser || !formdata.nameuser || !formdata.passworduser) {
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
      nameuser: formdata.nameuser,
      mailuser: formdata.mailuser,
      passworduser: formdata.passworduser,
      date: new Date().toLocaleDateString("fr-FR"),
    };
    localStorage.setItem("user", JSON.stringify(userData));

    toast.success(`Inscription reussie ${formdata.nameuser}`);
    navigate("/jeux");
    console.log({
      nameuser: formdata.nameuser,
      mailuser: formdata.mailuser,
      passworduser: formdata.passworduser,
    });
    setShowerror(false);
    setErrorMessage("");
    setformdata({
      nameuser: "",
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
            <p>Nom</p>
            <input
              type="text"
              name="nameuser"
              value={formdata.nameuser}
              placeholder="entrer votre nom"
              onChange={handlechange}
            />
          </div>
          <div className="container">
            <p>adresse email</p>
            <input
              type="email"
              name="mailuser"
              value={formdata.mailuser}
              placeholder="entrer votre adresse email "
              onChange={handlechange}
            />
          </div>
          <div className="container">
            <p>Password</p>
            <input
              type="password"
              name="passworduser"
              value={formdata.passworduser}
              placeholder="entrer votre nom "
              onChange={handlechange}
            />
          </div>
          <Button type="submit" className="accept">
            S'inscrire
          </Button>
        </form>
        <div className="linkpath">
          <p>
            Vous avez un compte ?<Link to="/">Se connecter</Link>{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Inscription;
