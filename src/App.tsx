import { useState } from "react";
import "./components/Question.css";


import {
  SliderQuestion,
  PercentageScrollbarQuestion,
} from "./components/Question";

//tsx
import { Slider } from "./components/Slider";
import { PercentageScrollbar } from "./components/PercentageScrollbar";
import { useQuestion, allAnswered } from "./components/useQuestion";

import { Q1, Q3, kWattHours } from "./CarbonCalc";

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
        { label: "Coding/Problem Solving", color: "#4c6ef5", icon: "yelloe.png" },
        { label: "Writing", color: "#f59f00", icon: "orangelight.png" },
        { label: "Research", color: "#e64980", icon: "orang.png" },
        { label: "Everyday Questions/Tasks", color: "#addeef", icon: "red.png" },
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

  function kiloWattHrs() {
    if (
      typeof q1 !== "number" ||
      typeof convoLength.question.value !== "number"
    )
      return null;
    else
      return kWattHours(
        q1,
        models.question.value,
        usage.question.value,
        convoLength.question.value,
        generation.question.value[1],
      );
  }

  return (
    <div className="custom-player">
      <video className="title_page" autoPlay muted loop>
        <source src="/title_page.webm" type="video/mp4" />
      </video>
      <div className="parallax-bg" />
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
            <div className="answer-card" style={{ marginBottom: "200px" }}>
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

            <div style={{ textAlign: "center", marginBottom: "200px" }}>
              <h1
                style={{
                  transition: "opacity 0.4s ease",
                }}
              >
                but what did it cost?
              </h1>
              AI is reshaping how your brain works, quietly and consistently.
              The research isn't speculative anymore.
            </div>
            <div style={{ textAlign: "left" }}>
              <>
                <line style={{ fontWeight: "bold" }}>
                  Based on your answers...
                </line>
                <br></br>
                {userType() == 0 && (
                  <div>
                    You use AI occasionally, and that probably feels harmless.
                    But even a single AI-assisted task produces measurably
                    reduced neural connectivity compared to doing it alone. In
                    one study, AI users showed 55% lower cognitive engagement,
                    and 83% couldn't recall key details from tasks they had just
                    completed.
                    <br></br>
                    <br></br>
                    There's no completely neutral baseline. Every time you hand
                    a task to AI, your brain opts out a little. No one is exempt
                    from the lingering effects of taking shortcuts.
                  </div>
                )}
                {userType() == 1 && (
                  <div>
                    At the rate you use AI, the research gets hard to ignore.
                    Studies show a correlation of r = -0.68 between AI usage and
                    cognitive decline. Memory, attention, critical thinking,
                    decision-making. Not one or two of these. All of them,
                    declining together, in people using AI at the same frequency
                    you do. You may have already noticed something feels off.
                    That's not a coincidence. AI users at your level report a
                    17% decrease in knowledge retention. Information goes in,
                    but it doesn't stick the way it once did.
                    <br></br>
                    <br></br>
                    You are at the stage where the effects of AI stop being
                    subtle.
                  </div>
                )}
                {userType() == 2 && (
                  <div>
                    At the rate you use, AI dependency isn't a risk. It's likely
                    already present. Research shows a strong negative
                    correlation between AI usage and cognitive decline, meaning
                    the heavier the use, the more significant the effects.
                    Memory, attention, critical thinking and decision-making are
                    all in measurable decline. On top of that, the constant
                    back-and-forth with AI quietly dismantles your ability to
                    think on your own, with users who use similar amounts of AI
                    as you reporting significant cognitive fatigue and burnout.
                    That dependency has been linked to broader mental health
                    decline. Not just foggy thinking. Your overall wellbeing is
                    at risk.
                    <br></br>
                    <br></br>
                    The tool you're using to save time may be costing you
                    something much harder to get back.
                  </div>
                )}
              </>
              <div>
                you used {kiloWattHrs()}
                many kilo watt hours
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
