import "./Question.css";
import { PercentageSplitQuestion } from "./Question";

interface PercentageSplitProps {
  question: PercentageSplitQuestion;
  onChange: (value: number[]) => void;
}

export function PercentageSplit({ question, onChange }: PercentageSplitProps) {
  const {
    label,
    options,
    value,
    total,
    remainder,
    hasError,
    answered,
    addString,
  } = question;
  const lastOption = options[options.length - 1];

  const handleChange = (index: number, newValue: number) => {
    const next = [...value];
    next[index] = newValue;
    onChange(next);
  };

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

      {options.slice(0, -1).map((opt, i) => {
        const min = opt.min ?? 0;
        const configuredMax = opt.max ?? 100;
        const step = opt.step ?? 1;

        // How much "room" is left for this slider given what the others
        // currently add up to. This keeps the total from ever exceeding
        // 100% via the slider itself.
        const sumOfOthers = total - value[i];
        const availableForThis = 100 - sumOfOthers;
        const effectiveMax = Math.max(
          min,
          Math.min(configuredMax, availableForThis),
        );

        return (
          <div key={i} className="question__slider-row">
            <span className="question__slider-option-label">{opt.label}</span>
            <input
              type="range"
              min={min}
              max={effectiveMax}
              step={step}
              value={value[i]}
              onChange={(e) => handleChange(i, Number(e.target.value))}
              aria-valuemin={min}
              aria-valuemax={effectiveMax}
              aria-valuenow={value[i]}
            />
            <span className="question__slider-value">
              {value[i]}
              {addString}
            </span>
          </div>
        );
      })}

      <div className="question__slider-row question__slider-row--readonly">
        <span className="question__slider-option-label">
          {lastOption.label}
        </span>
        <span className="question__slider-value">
          {Math.max(remainder, 0)}%
        </span>
      </div>

      <div className="question__total">
        Total: {total}% + {Math.max(remainder, 0)}% ={" "}
        {total + Math.max(remainder, 0)}%
      </div>

      {hasError && (
        <span className="question__error">
          Allocations add up to {total}%, which is {total - 100}% over 100.
          Reduce one or more sliders.
        </span>
      )}
    </div>
  );
}
