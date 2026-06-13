import { useState } from "react";

import {
  SliderQuestion,
  DropdownQuestion,
  SelectableListQuestion,
  PercentageSplitQuestion,
  Question,
} from "./components/Question";

//tsx
import { Slider } from "./components/Slider";
import { PercentageSplit } from "./components/PercentageSplit";
import { Dropdown } from "./components/Dropdown";
import { SelectableList } from "./components/SelectableList";
import { useQuestion, allAnswered } from "./components/useQuestion";

export default function App() {
  const age = useQuestion(
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

  const split = useQuestion(
    new PercentageSplitQuestion("AI usage", "What AI models do you use?", "%", [
      { label: "ChatGPT", max: 100, step: 5 },
      { label: "Gemini", max: 100, step: 5 },
      { label: "Claude", max: 100, step: 5 },
      { label: "Other" }, // not editable, just the label
    ]),
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
    age.question,
    country.question,
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
      <Slider question={age.question} onChange={age.setValue} />
      <PercentageSplit question={split.question} onChange={split.setValue} />
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
