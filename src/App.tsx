import { useState, useEffect } from "react";


import {
  SliderQuestion,
  DropdownQuestion,
  SelectableListQuestion,
  PercentageScrollbarQuestion,
} from "./components/Question";

//tsx
import { Slider } from "./components/Slider";
import { PercentageScrollbar } from "./components/PercentageScrollbar";
import { Dropdown } from "./components/Dropdown";
import { SelectableList } from "./components/SelectableList";
import { useQuestion, allAnswered } from "./components/useQuestion";

import { Q1, Q3 } from "./CarbonCalc";

export default function App() {
  const prompts = useQuestion(
    new SliderQuestion(
      "prompts",
      "On average, how many prompts do you make a day?",
      {
        min: 0,
        max: 30,
        step: 1,
        customEnd: "30+",
      },
    ),
  );

  const models = useQuestion(
    new PercentageScrollbarQuestion(
      "AI models",
      "What tier of AI model do you typically use?",
      "% of the time",
      [
        {
          label: "Small (basic/built in)",
          color: "#f1e579",
          icon: "yelloe.png",
          subtitle: "etc. Llama 3.1/Meta, Qwen 2.5 7B/Alibaba",
        },
        {
          label: "Mid (free and simple)",
          color: "#ee9c37",
          icon: "orangelight.png",
          subtitle: "etc. Claude Haiku 4.5, Gemini 2.0 Flash",
        },
        {
          label: "Large Frontier (most common, some paid)",
          color: "#d46948",
          icon: "orang.png",
          subtitle: "etc. GPT-4o/ChatGPT, Gemini 1.5, DeepSeek V3",
        },
        {
          label: "Chain-Of-Thought (deep reasoning)",
          color: "#a13838",
          icon: "red.png",
          subtitle: "etc. OpenAI o3, Claude Opus 4.x, Gemini 2.5 Pro",
        },
      ],
      [25, 25, 25, 25],
    ),
  );
  const usage = useQuestion(
    new PercentageScrollbarQuestion(
      "AI usage",
      "What do you commonly use AI for?",
      "%",
      [
        { label: "Coding/Problem Solving", color: "#4c6ef5", icon: "🏠" },
        { label: "Writing", color: "#f59f00", icon: "🍔" },
        { label: "Research", color: "#e64980", icon: "🚗" },
        { label: "Everyday Questions/Tasks", color: "#addeef", icon: "🚗" },
        { label: "Other", color: "#37b24d", icon: "💰" },
      ],
      [20, 20, 20, 20, 20],
    ),
  );

  const convoLength = useQuestion(
    new SliderQuestion(
      "conversation length",
      "When using AI, how long are your conversations?",
      {
        min: 2,
        max: 50,
        step: 1,
        addString: " messages",
        customEnd: "50+",
      },
    ),
  );

  const generation = useQuestion(
    new PercentageScrollbarQuestion(
      "AI generation",
      "What do you typically use AI to generate?",
      "%",
      [
        { label: "Text", color: "#4c6ef5", icon: "🏠" },
        { label: "Images", color: "#f59f00", icon: "🍔" },
      ],
      [50, 50],
    ),
  );

  const [submitted, setSubmitted] = useState(false);

  const questions = [
    prompts.question,
    models.question,
    usage.question,
    convoLength.question,
    generation.question,
  ];
  const canContinue = allAnswered(questions);

  const q1 = prompts.question.value;
  const q3 = usage.question.value;

  function userType() {
    var index = 0;
    if (q1 !== null) {
      if (q1 >= 17) index = 2;
      else if (q1 >= 8) index = 1;
    }
    return index;

    //0 is light
    //1 is medium
    //2 is heavy
  }

  function loadSecondWeb() {
    setSubmitted(true);
    window.scrollTo({
      top: 0,
      behavior: "auto", // Enables smooth scrolling
    });
  }

  return (
    <>
      <div className="parallax-bg" />
      <img src="/clock.png" alt="mascot" className="mascot-img" />
       <div className="landing">
      <h1 className="landing__title">TAIME</h1>
      <h2 className="landing__title landing__title--sub">How Much Time do You Save with AI?</h2>
      
    </div>
      <div
        style={{
          maxWidth: 480,
          margin: "2rem auto",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        {!submitted && (
          <>
            <Slider question={prompts.question} onChange={prompts.setValue} />
            <PercentageScrollbar
              question={models.question}
              onChange={models.setValue}
            />
            <PercentageScrollbar
              question={usage.question}
              onChange={usage.setValue}
            />
            <Slider
              question={convoLength.question}
              onChange={convoLength.setValue}
            />
            <PercentageScrollbar
              question={generation.question}
              onChange={generation.setValue}
            />
            <button
              type="button"
              className="continue-btn"
              disabled={!canContinue}
              onClick={() => loadSecondWeb()}
              style={{
                padding: "0.6rem 1.2rem",
                borderRadius: "0.5rem",
                border: "none",
                background: canContinue ? "#4c6ef5" : "#c9c9d6",
                color: "#fff",
                cursor: canContinue ? "pointer" : "not-allowed",
              }}
            >
              Continue
            </button>
          </>
        )}

        {submitted && (
          <>
            <div className="answer-card" style={{ marginBottom: "100px" }}>
              <h3 style={{ marginBottom: "-5px", fontSize: "50px" }}>
                you saved:
              </h3>
              <h1 style={{ marginBottom: "-5px", fontSize: "80px" }}>
                {q1 !== null && q3 !== null
                  ? Math.round(Q1(q1) * Q3(q3) * 30 * 100) / 100
                  : "uh oh"}{" "}
                hours
              </h1>
              <h4>last month!</h4>
            </div>

            <div style={{ textAlign: "center" }}>
              <h1
                style={{
                  transition: "opacity 0.4s ease",
                }}
              >
                but what did it cost?
              </h1>
              find out below <br></br>
              <div
                style={{
                  fontSize: "10px",
                  color: "gray",
                  marginBottom: "150px",
                }}
              >
                vvvvvvvvvvv
              </div>
              <div style={{ textAlign: "left" }}>
                Based on your answers...
                <br></br>
                {userType() == 0 && <div></div>}
                {userType() == 1 && <div></div>}
                {userType() == 2 && (
                  <div>
                    you use a lot more than everyone else <br></br>fatso
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
