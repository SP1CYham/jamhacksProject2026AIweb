import { useState, useEffect } from "react";
import "./components/Question.css";
import confetti from "canvas-confetti";

import {
  SliderQuestion,
  PercentageScrollbarQuestion,
} from "./components/Question";

//tsx
import { Slider } from "./components/Slider";
import { PercentageScrollbar } from "./components/PercentageScrollbar";
import { useQuestion, allAnswered } from "./components/useQuestion";

import { CO2Num, Q1, Q3, WaterNum, kWattHours } from "./CarbonCalc";

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
          color: "#84ffe0",
          icon: "c0.png",
          subtitle: "etc. Llama 3.1/Meta, Qwen 2.5 7B/Alibaba",
        },
        {
          label: "Mid (free and simple)",
          color: "#94daed",
          icon: "c1.png",
          subtitle: "etc. Claude Haiku 4.5, Gemini 2.0 Flash",
        },
        {
          label: "Large Frontier (most common, some paid)",
          color: "#5b9bd6",
          icon: "c2.png",
          subtitle: "etc. GPT-4o/ChatGPT, Gemini 1.5, DeepSeek V3",
        },
        {
          label: "Chain-Of-Thought (deep reasoning)",
          color: "#3468bc",
          icon: "c3.png",
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
        {
          label: "Coding/Problem Solving",
          color: "#84ffe0",
          icon: "c0.png",
        },
        { label: "Writing", color: "#94daed", icon: "c1.png" },
        { label: "Research", color: "#5b9bd6", icon: "c2.png" },
        {
          label: "Everyday Questions/Tasks",
          color: "#3468bc",
          icon: "c3.png",
        },
        { label: "Other", color: "#244197", icon: "c4.png" },
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
        { label: "Text", color: "#f1e579", icon: "writing.png" },
        { label: "Images", color: "#ee9c37", icon: "images.png" },
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

  const timeSaved = () =>
    q1 !== null && q3 !== null ? Math.round(Q1(q1) * Q3(q3) * 30 * 10) / 10 : 0;

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
      behavior: "smooth", // Enables smooth scrolling
    });
  }

  const videos = ["bg1.mp4", "bg2.mp4"];
  const [activeIndex, setActiveIndex] = useState(0);

  function kiloWattHrs() {
    return kWattHours(
      q1 == null ? 0 : q1,
      models.question.value,
      usage.question.value,
      convoLength.question.value == null ? 0 : convoLength.question.value,
      generation.question.value[1],
    );
  }

  function useCountUp(target: number, duration = 1500, enabled = true) {
    const [count, setCount] = useState(0);
    const [finished, setFinished] = useState(false);

    useEffect(() => {
      if (!enabled) return;
      setCount(0);
      setFinished(false);

      let start = 0;
      const steps = 60;
      const increment = target / steps;
      const interval = duration / steps;

      const timer = setInterval(() => {
        start += increment / 4 + start / 50;
        if (start >= target) {
          setCount(target);
          setFinished(true);
          clearInterval(timer);
        } else {
          setCount(Math.round(start * 10) / 10);
        }
      }, interval);

      return () => clearInterval(timer);
    }, [target, duration, enabled]);

    return { count, finished };
  }

  const { count: savedCount, finished } = useCountUp(
    timeSaved(),
    1500,
    submitted,
  );

  useEffect(() => {
    if (!finished) return;
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 1 },
    });
  }, [finished]);

  const target = document.querySelector("#trigger-point");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActiveIndex(1); // called when element enters the viewport
      }
    });
  });
  if (target) {
    observer.observe(target);
  }

  return (
    <div className="custom-player">
      {!submitted && (
        <video className="title_page" autoPlay muted loop>
          <source src="/title_page.webm" type="video/mp4" />
        </video>
      )}
      <div className="parallax-bg" />
      <div
        style={{
          maxWidth: 950,
          margin: "2rem auto",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div className="bg-video-container">
          {videos.map((src, i) => (
            <video
              key={src}
              className={`bg-video ${i === activeIndex ? "bg-video--active" : ""}`}
              autoPlay
              muted
              loop
              playsInline
            >
              <source src={src} type="video/mp4" />
            </video>
          ))}
        </div>
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
            <div
              className="answer-card"
              style={{ textAlign: "center", marginBottom: "300px" }}
            >
            <div
              className="answer-card"
              style={{ textAlign: "center", marginBottom: "300px" }}
            >
              <h3 style={{ marginBottom: "-5px", fontSize: "50px" }}>
                You Saved
              </h3>
              <h1
                style={{
                  marginBottom: "-5px",
                  fontSize: "80px",
                  fontWeight: "bold",
                }}
              >
                {savedCount} hours
              </h1>
              <h4>in the last month!</h4>
            </div>
            <div
              className="answer-card"
              style={{
                textAlign: "center",
                marginBottom: "-100px",
                fontSize: "50px",
              }}
              style={{
                textAlign: "center",
                marginBottom: "-100px",
                fontSize: "50px",
              }}
            >
              <h1
                style={{
                  transition: "opacity 0.4s ease",
                  fontSize: "40px",
                }}
              >
                But what's the REAL cost of that time saved?
              </h1>
              <div id="trigger-point"></div>
              <div style={{ fontSize: "30px" }}>
                <strong>
                  AI is reshaping how your brain works, whether you realize it
                  or not.
                </strong>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "40px",
                marginTop: "-30px",
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  className="answer-card"
                  style={{ textAlign: "left", marginBottom: "300px" }}
                >
                  <>
                    {userType() == 0 && (
                      <div
                        className="ai-usage-effect"
                        //style={{ marginTop: "400px" }}
                      >
                        You use AI occasionally, and that probably feels
                        harmless.
                        <br></br>
                        <br></br>
                        But even a single AI-assisted task produces measurably
                        reduced neural connectivity compared to doing it
                        yourself. In one study, AI users showed 55% lower
                        cognitive engagement, and 83% couldn't recall key
                        details from tasks they had just completed.
                        <br></br>
                        <br></br>
                        There's no completely neutral baseline. Every time you
                        hand a task to AI, your brain opts out a little. No one
                        is exempt from the lingering effects of taking
                        shortcuts.
                      </div>
                    )}
                    {userType() == 1 && (
                      <div className="ai-usage-effect">
                        At the rate you use AI, the research gets hard to
                        ignore.
                        <br></br>
                        <br></br>
                        Studies show a correlation of r = -0.68 between AI usage
                        and cognitive decline. Memory, attention, critical
                        thinking, decision-making, all of these vital
                        functionalities are shown to be declining in people
                        using AI at the same frequency you do. You may have
                        already noticed something feels off. AI users at your
                        level report a 17% decrease in knowledge retention. You
                        may have a harder time focusing and remembering
                        information.
                        <br></br>
                        <br></br>
                        You are at the stage where the effects of AI stop being
                        subtle.
                      </div>
                    )}
                    {userType() == 2 && (
                      <div
                        className="ai-usage-effect"
                        //style={{ marginTop: "300px" }}
                      >
                        At your usage level, you've already crossed the line
                        from convenience into dependency.
                        <br></br>
                        <br></br>
                        Research shows a strong negative correlation between AI
                        usage and cognitive decline, meaning the heavier the use
                        AI, the more significant the effects. Memory, attention,
                        critical thinking and decision-making are all things you
                        risk. On top of that, the constant back-and-forth with
                        AI dismantles your ability to think on your own, with
                        users who use similar amounts of AI as you reporting
                        significant cognitive fatigue and burnout. That
                        dependency has been linked to broader mental health
                        decline as well. Your overall wellbeing is at risk.
                        <br></br>
                        <br></br>
                        The tool you're using to save time may be costing you
                        something much harder to get back.
                      </div>
                    )}
                  </>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <img
                  src="your-image.jpg"
                  style={{ width: "100%", borderRadius: "12px" }}
                />
              </div>
            </div>

            <div className="ai-usage-effect" style={{ textAlign: "left" }}>
              <h1
                style={{
                  textAlign: "center",
                  transition: "opacity 0.4s ease",
                  marginBottom: "40px",
                }}
              >
                But what about the environmental impacts of using AI?
              </h1>
              <div>
                It may be surprising but your usage of AI uses less natural
                resources than you may think.
              </div>
              <div>
                Based on your results you used about{" "}
                {Math.round(kiloWattHrs() * 100) / 100} kWh of power to generate
                prompts over an entire year. That’s the equivalent of running a
                standard fridge for only{" "}
                {Math.round((kiloWattHrs() * 100) / 1.99) / 100} days.
              </div>
              <div>
                You also used the equivalent of{" "}
                {Math.round(CO2Num(kiloWattHrs()) * 100) / 100} kilograms of CO2
                to power your AI assistants, that is equivalent to one{" "}
                {Math.round((CO2Num(kiloWattHrs()) / 0.15) * 100) / 100} km car
                ride.
              </div>
              <div>
                But what about your water usage? Based on your results you have
                used {Math.round(WaterNum(kiloWattHrs()) * 100) / 100} Litres of
                water in the past year, which accounts for both water usage for
                energy production and water used to cool data centers. Consider
                that making a single single beef burger patty requires around
                2,400 litres of water to produce.
              </div>
              <div>
                This isn’t to say that your usage of AI will not have an impact
                on communities. One of the largest concerns with the growth of
                AI is the construction of data centers, which will actually
                siphon significant resources from local communities, placing
                significant strain on electricity and water systems.
              </div>
              <div>
                Based on your location in Ontario, the current load of data
                centers already accounts for approximately 30 per cent of
                Ontario's peak demand for energy. In the next 10 years, Ontario
                expects 16 more data centres to connect to its grid, resulting
                in an expected change of 75 percent in 2025 up from just 60
                percent in 2024.
              </div>
              <div>
                One data centre can use as much electricity as 100,000
                households, according to the International Energy Agency. This
                is why the introduction of data centres into communities like
                yours can significantly change your local community, driving up
                energy costs and diverting a significant amount of local usable
                water.
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
