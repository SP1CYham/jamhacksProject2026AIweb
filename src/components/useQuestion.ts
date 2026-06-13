import { useCallback, useState } from 'react';
import { Question } from './Question';

/**
 * Manages state for a single Question model.
 *
 * Usage:
 *   const slider = useQuestion(new SliderQuestion('age', 'How old are you?', { min: 0, max: 100 }));
 *   <Slider question={slider.question} onChange={slider.setValue} />
 *   slider.answered // boolean
 */
export function useQuestion<T, Q extends Question<T>>(initial: Q) {
  const [question, setQuestion] = useState<Q>(initial);

  const setValue = useCallback((value: T) => {
    setQuestion((q) => q.withValue(value) as Q);
  }, []);

  return { question, setValue, answered: question.answered, setQuestion };
}

/**
 * Convenience helper for a parent screen: given a list of question models,
 * returns true only if every single one has been answered.
 */
export function allAnswered(questions: Question<unknown>[]): boolean {
  return questions.every((q) => q.answered);
}
