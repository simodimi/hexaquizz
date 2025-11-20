import React, { use, useEffect, useState } from "react";
import Button from "../components/Button";
import { dessins, Quizz } from "../components/quizz";
import zik from "../assets/appuiebtn.mp3";
import zik1 from "../assets/zikcorrect.mp3";
import zik2 from "../assets/zikerror.mp3";
import star from "../assets/star.png";
const topics = [
  "Histoire",
  "Valeurs républicaines",
  "Institutions",
  "Politique",
  "Géographie",
  "Culture",
  "Patrimoine",
];
//function pour melanger les questions
function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}
//function pour avoir 5questions par topic
function getQuestionsByTopic(topic) {
  const serie = [];
  topics.forEach((elt) => {
    const questiontopic = Quizz.filter((p) => p.topic === elt);
    serie.push(...questiontopic.slice(0, 5)); //slice(0,5) pour avoir 5 questions
  });
  return shuffleArray(serie);
}
//function pour retourner une image
function affichageimage(array) {
  const rand = Math.floor(Math.random() * array.length);
  return array[rand];
}
const Main = () => {
  const allQuestions = getQuestionsByTopic();
  const [Question, setQuestion] = useState(shuffleArray(allQuestions));
  const [image, setimage] = useState(affichageimage(dessins));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [stepper1, setStepper1] = useState(true);
  const [stepper2, setStepper2] = useState(false);
  const [stepper3, setStepper3] = useState(false);
  //show message
  const [showMessage, setShowMessage] = useState(false);
  const [textencouragement, settextencouragement] = useState("");
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
  const score = parseFloat((100 * finalScore) / Question.length).toFixed(2);

  useEffect(() => {
    let timer;
    if (stepper2) {
      if (finalScore === 0) {
        setShowMessage(true);
        settextencouragement("Allez joueur 1 on vise le sommet de la montagne");
        timer = setTimeout(() => {
          setShowMessage(false);
        }, 3000);
      }
      if (finalScore === 5) {
        setShowMessage(true);
        settextencouragement("courage joueur 1 tu avance bien!");
        timer = setTimeout(() => {
          setShowMessage(false);
        }, 3000);
      }
      if (finalScore === 10) {
        setShowMessage(true);
        settextencouragement(
          "quelle performance joueur 1 tu avances beaucoup!"
        );
        timer = setTimeout(() => {
          setShowMessage(false);
        }, 3000);
      }
      if (finalScore === 15) {
        setShowMessage(true);
        settextencouragement("bravo joueur 1,bientôt la moitié du sommet!");
        timer = setTimeout(() => {
          setShowMessage(false);
        }, 3000);
      }
      if (finalScore === 20) {
        setShowMessage(true);
        settextencouragement("bravo joueur 1,tu es un monstre!");
        timer = setTimeout(() => {
          setShowMessage(false);
        }, 3000);
      }
      if (finalScore === 25) {
        setShowMessage(true);
        settextencouragement("oh lalala joueur 1,quelle prouesse!");
        timer = setTimeout(() => {
          setShowMessage(false);
        }, 3000);
      }
      if (finalScore === 30) {
        setShowMessage(true);
        settextencouragement(
          "rien à dire,bravo joueur 1,un petit effort pour le sommet"
        );
        timer = setTimeout(() => {
          setShowMessage(false);
        }, 3000);
      }
      if (finalScore === 35) {
        setShowMessage(true);
        settextencouragement("fin des temps ");
        timer = setTimeout(() => {
          setShowMessage(false);
        }, 3000);
      }
      return () => {
        clearTimeout(timer);
      };
    }
  }, [stepper2, finalScore]);

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
        //setFinalScore(0);
        setStepper3(true);
        setStepper2(false);
        setStepper1(false);
        setQuestion(getQuestionsByTopic());
        setimage(affichageimage(dessins));
      }, 2000);

      console.log("score en pourcentage", score);
    }
    if (currentQuestionIndex >= Question.length) {
      return (
        <div>
          <h2>
            vous avez termine le quiz joueur 1,score: {finalScore}/
            {Question.length}
          </h2>
          {setTimeout(() => {
            setStepper3(true);
            setStepper2(false);
            setStepper1(false);
            setimage(affichageimage(dessins));
          }, 2000)}
        </div>
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
      setCurrentQuestionIndex(0);
      setFinalScore(0);
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
            {showMessage && (
              <div className="iconemessage">
                <div className="imageuser">
                  <img src={image.photo} alt="" />
                </div>
                <p>{textencouragement}</p>
              </div>
            )}
            <div className="" style={{ padding: "40px 0" }}>
              <p>
                {finalScore}/{Question.length}
              </p>
              <p>{userResponse}</p>
              <p>{Question[currentQuestionIndex].topic}</p>
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
