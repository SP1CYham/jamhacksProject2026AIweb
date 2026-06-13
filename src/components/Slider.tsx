import "./Question.css";
import { SliderQuestion } from "./Question";

interface SliderProps {
  question: SliderQuestion;
  onChange: (value: number) => void;
}

export function Slider({ question, onChange }: SliderProps) {
  const { label, min, max, step, addString, value, customEnd, answered } =
    question;

  return (
    <div className={`question ${answered ? "question--answered" : ""}`}>
      <div className="question__label">
        <span>{label}</span>
        {!answered && (
          <span className="question__required" aria-label="required">
            *
          </span>
        )}
      </div>

      <div className="question__slider-row">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          // Fall back to the midpoint so the thumb has a sane starting
          // position, but `answered` stays false until the user moves it.
          value={value ?? Math.round((min + max) / 2)}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value ?? undefined}
        />

        <span className="question__slider-value">
          {value === null
            ? "—"
            : value === max && customEnd
              ? customEnd
              : value}
          {addString}
        </span>
      </div>

      {!answered && (
        <span className="question__hint">Move the slider to answer</span>
      )}
    </div>
  );
}
