import React, { use, useState } from "react";
import Button from "../components/Button";
import { dessins, Quizz } from "../components/quizz";
import zik from "../assets/appuiebtn.mp3";
import zik1 from "../assets/zikcorrect.mp3";
import zik2 from "../assets/zikerror.mp3";
import star from "../assets/star.png";
function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}
//function pour retourner une image
function affichageimage(array) {
  const rand = Math.floor(Math.random() * array.length);
  return array[rand];
}
const Main = () => {
  const [Question] = useState(shuffleArray(Quizz));
  const image = affichageimage(dessins);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [stepper1, setStepper1] = useState(true);
  const [stepper2, setStepper2] = useState(false);
  const [stepper3, setStepper3] = useState(false);
  //reponse
  const [userResponse, setUserResponse] = useState("");
  //selection de la reponse
  const [selectedOption, setSelectedOption] = useState(null);
  //question correct
  const [correctOption, setCorrectOption] = useState(false);
  const playSound = (src) => {
    const audio = new Audio(src);
    audio.play();
    setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
    }, 2000);
  };
  const handlechoice = (option) => {
    if (selectedOption) {
      return; //empeche de choisir plusieurs fois
    }
    setSelectedOption(option);
    playSound(zik);
    if (option === Question[currentQuestionIndex].answer) {
      playSound(zik1);
      setUserResponse("Bonne reponse");
      setCorrectOption(false);
      setTimeout(() => {
        setUserResponse("");
        setSelectedOption(null);
        setCorrectOption(false);
        setFinalScore(finalScore + 1);
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }, 2000);
    } else {
      playSound(zik2);
      setUserResponse("Mauvaise reponse");
      setCorrectOption(true);
      setTimeout(() => {
        setUserResponse("");
        setSelectedOption(null);
        setCorrectOption(false);
        //setCurrentQuestionIndex(0);
        //setFinalScore(0);
        setStepper3(true);
        setStepper2(false);
        setStepper1(false);
      }, 2000);
    }
    if (currentQuestionIndex >= Question.length) {
      return (
        <h2>
          vous avez termine le quiz,score: {finalScore}/{Question.length}
        </h2>
      );
    }
  };
  const handlenext1 = () => {
    playSound(zik);
    setTimeout(() => {
      setStepper1(false);
      setStepper2(true);
      setStepper3(false);
    }, 1000);
  };
  const handlenext2 = () => {
    playSound(zik);
    setTimeout(() => {
      setStepper1(false);
      setStepper2(true);
      setStepper3(false);
    }, 1000);
  };

  return (
    <div className="headerQuiz">
      <div className="headerstep">
        {stepper1 && (
          <div className="quiz-start">
            <h1>Quiz de Culture Française</h1>
            <p style={{ textAlign: "center", margin: "20px 0" }}>
              35 questions réparties en 7 thèmes
            </p>
            <div className="topics-list">
              <p>📚 Histoire. </p>
              <p>⚖️ Valeurs républicaines. </p>
              <p>🏛️ Institutions. </p>
              <p>🗳️ Politique. </p>
              <p>🗺️ Géographie. </p>
              <p>🎨 Culture. </p>
              <p>🏰 Patrimoine. </p>
            </div>
            <div className="topic-button">
              <Button className="choice" onClick={handlenext1}>
                Commencer le Quiz
              </Button>
            </div>
          </div>
        )}
        {stepper2 && (
          <div className="">
            <div className="iconemessage">
              <div className="imageuser">
                <img src={image.photo} alt="" />
              </div>
              <p>
                allez tu peux le faire ,joueur 1 tu ess à la moitié du parcours
              </p>
            </div>
            <div className="" style={{ padding: "40px 0" }}>
              <p>
                {finalScore}/{Question.length}
              </p>
              <p>{userResponse}</p>
              <p className="question">
                {Question[currentQuestionIndex].question}
              </p>
              <div className="response" style={{ padding: "40px 0" }}>
                {Question[currentQuestionIndex].choices.map((p) => {
                  const isSelected = selectedOption === p;
                  const isCorrect = p === Question[currentQuestionIndex].answer;

                  let classNamebtn = "Quizbtn choice";
                  if (isSelected) {
                    classNamebtn += isCorrect ? " accept" : " decline";
                  } else if (correctOption && isCorrect) {
                    classNamebtn += " accept";
                  }
                  return (
                    <Button
                      className={classNamebtn}
                      key={p.id}
                      onClick={() => {
                        handlechoice(p);
                      }}
                    >
                      {p}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        {stepper3 && (
          <div className="classement">
            <p style={{ fontSize: "30px", fontWeight: "bold" }}>
              Classement général du quizz
            </p>
            <div className="star">
              <img src={star} alt="" />
              <img src={star} alt="" />
              <img src={star} alt="" />
            </div>

            <div className="nameclassement" style={{ padding: "0px 0" }}>
              <p>1er dimitri</p>
              <p>2eme jacques</p>
              <p>3eme jean</p>
              <p>4eme marie</p>
              <p>5eme paul</p>
              <p>6eme pierre</p>
              <p>7eme jacques</p>
            </div>
            <div className="topic-button">
              <Button className="choice" onClick={handlenext2}>
                Recommencer le Quiz
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Main;
