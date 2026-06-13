import './Question.css';
import { SelectableListQuestion } from './Question';

interface SelectableListProps {
  question: SelectableListQuestion;
  onChange: (value: string[]) => void;
}

export function SelectableList({ question, onChange }: SelectableListProps) {
  const { label, options, multiple, value, answered } = question;

  const toggle = (optionValue: string) => {
    const isSelected = value.includes(optionValue);

    if (multiple) {
      onChange(
        isSelected
          ? value.filter((v) => v !== optionValue)
          : [...value, optionValue],
      );
    } else {
      // Single-select: clicking the already-selected option deselects it,
      // anything else replaces the current selection.
      onChange(isSelected ? [] : [optionValue]);
    }
  };

  return (
    <div className={`question ${answered ? 'question--answered' : ''}`}>
      <div className="question__label">
        <span>{label}</span>
        {!answered && <span className="question__required" aria-label="required">*</span>}
      </div>

      <div
        className="question__list"
        role={multiple ? 'group' : 'radiogroup'}
        aria-label={label}
      >
        {options.map((opt) => {
          const isSelected = value.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              role={multiple ? undefined : 'radio'}
              aria-checked={multiple ? undefined : isSelected}
              aria-pressed={multiple ? isSelected : undefined}
              className={`question__option ${isSelected ? 'question__option--selected' : ''}`}
              onClick={() => toggle(opt.value)}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {!answered && (
        <span className="question__hint">
          Select {multiple ? 'one or more options' : 'an option'} to answer
        </span>
      )}
    </div>
  );
}
