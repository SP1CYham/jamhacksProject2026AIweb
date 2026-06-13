import './Question.css';
import { DropdownQuestion } from './Question';

interface DropdownProps {
  question: DropdownQuestion;
  onChange: (value: string) => void;
}

export function Dropdown({ question, onChange }: DropdownProps) {
  const { label, options, placeholder, value, answered } = question;

  return (
    <div className={`question ${answered ? 'question--answered' : ''}`}>
      <div className="question__label">
        <span>{label}</span>
        {!answered && <span className="question__required" aria-label="required">*</span>}
      </div>

      <select
        className="question__select"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
