import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
const AuthContextUser = createContext();
import { toast } from "react-toastify";
export const useAuth = () => {
  const context = useContext(AuthContextUser);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProviderUser = ({ children }) => {
  const [user, setuser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Config axios pour envoyer les cookies (httpOnly)
  axios.defaults.withCredentials = true;

  // Vérifie la session sur le backend
  const verifyToken = async () => {
    try {
      const res = await axios.get("http://localhost:5000/user/verify/token", {
        withCredentials: true,
      });
      if (res.data.valid || res.data.user) setuser(res.data.user);
      else setuser(null);
    } catch (error) {
      console.error("Erreur de vérification du token", error);
      setuser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);

  // Connexion → backend place le cookie httpOnly
  const login = async (mailuser, passworduser) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/user/login",
        { mailuser, passworduser },
        { withCredentials: true }
      );
      if (res.status === 200) {
        setuser(res.data);
        // toast.success("Connexion réussie !");
        return res.data;
      } else {
        throw new Error(res.data.message || "Erreur de connexion");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Erreur de connexion";
      throw error;
    }
  };

  return (
    <AuthContextUser.Provider
      value={{
        user,
        login,
        verifyToken,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContextUser.Provider>
  );
};
