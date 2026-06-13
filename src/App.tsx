import { useState } from "react";

import {
  SliderQuestion,
  DropdownQuestion,
  SelectableListQuestion,
  PercentageSplitQuestion,
  PercentageScrollbarQuestion,
  Question,
} from "./components/Question";

//tsx
import { Slider } from "./components/Slider";
import { PercentageSplit } from "./components/PercentageSplit";
import { PercentageScrollbar } from "./components/PercentageScrollbar";
import { Dropdown } from "./components/Dropdown";
import { SelectableList } from "./components/SelectableList";
import { useQuestion, allAnswered } from "./components/useQuestion";

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

  const country = useQuestion(
    new DropdownQuestion("country", "Where do you live?", [
      { label: "Canada", value: "ca" },
      { label: "United States", value: "us" },
      { label: "United Kingdom", value: "uk" },
    ]),
  );

  const interests = useQuestion(
    new SelectableListQuestion(
      "interests",
      "What are you interested in?",
      [
        { label: "Sports", value: "sports" },
        { label: "Music", value: "music" },
        { label: "Reading", value: "reading" },
        { label: "Gaming", value: "gaming" },
      ],
      true, // multiple = true -> can select one or more
    ),
  );

  const favoriteColor = useQuestion(
    new SelectableListQuestion(
      "favoriteColor",
      "Pick your favorite color",
      [
        { label: "Red", value: "red" },
        { label: "Blue", value: "blue" },
        { label: "Green", value: "green" },
      ],
      false, // multiple = false -> single select
    ),
  );

  const [submitted, setSubmitted] = useState(false);

  const questions = [
    prompts.question,
    models.question,
    usage.question,
    interests.question,
    favoriteColor.question,
  ];
  const canContinue = allAnswered(questions);

  return (
    <div
      style={{
        maxWidth: 480,
        margin: "2rem auto",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
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
      <Dropdown question={country.question} onChange={country.setValue} />
      <SelectableList
        question={interests.question}
        onChange={interests.setValue}
      />
      <SelectableList
        question={favoriteColor.question}
        onChange={favoriteColor.setValue}
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
        <pre>
          {JSON.stringify(
            questions.map((q) => ({ id: q.id, value: q.value })),
            null,
            2,
          )}
        </pre>
      )}
    </div>
  );
}
