import { useState } from "react";

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
      "What AI models do you use?",
      "% of the time",
      [
        { label: "ChatGPT", color: "#86cdf0", icon: "openai1.png" },
        { label: "Gemini", color: "#839ee7", icon: "google.png" },
        { label: "Claude", color: "#f494b6", icon: "claude.svg" },
        { label: "Other", color: "#bc8ce9", icon: "openai1.png" },
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

  return (
    <>
    <div className="parallax-bg" />
      <img src="/clock.png" alt="mascot" className="mascot-img" />
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
          disabled={!canContinue}
          onClick={() => setSubmitted(true)}
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

        {submitted && (
          <div style={{ alignContent: "center" }}>
            <h3 style={{ marginBottom: "-5px" }}>you saved:</h3>
            <h1 style={{ marginBottom: "-5px" }}>
              {q1 !== null && q3 !== null
                ? Math.round(Q1(q1) * Q3(q3) * 30 * 100) / 100
                : "uh oh"}{" "}
              hours
            </h1>
            <h4>last month!</h4>
          </div>
        )}
      </div>
    </>
  );
}
