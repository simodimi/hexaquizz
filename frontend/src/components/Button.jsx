import React from "react";
import "../pages/quizz.css";

const Button = ({ type = "button", children, onClick, className = "" }) => {
  return (
    <div>
      <button type={type} onClick={onClick} className={`Quizbtn ${className}`}>
        {children}
      </button>
    </div>
  );
};

export default Button;
