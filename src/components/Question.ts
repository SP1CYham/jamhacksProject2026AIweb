/**
 * Base abstraction for "question" form controls.
 *
 * React function components can't literally extend a class, so instead the
 * shared behaviour (the value, the `answered` flag, and an immutable
 * `withValue` updater) lives on these model classes. Each input component
 * (Slider, Dropdown, SelectableList) receives one of these as a prop and
 * renders based on it. This keeps the "is this question answered?" logic in
 * one place, defined per subclass, so a parent screen can simply check
 * `question.answered` for every question to decide whether the user can
 * move on.
 */
export abstract class Question<T> {
  readonly id: string;
  readonly label: string;
  readonly value: T;

  protected constructor(id: string, label: string, value: T) {
    this.id = id;
    this.label = label;
    this.value = value;
  }

  /** Whether this question currently has a valid answer. */
  abstract get answered(): boolean;

  /**
   * Returns a new instance of the same subclass with `value` replaced.
   * Keeps the model immutable, which plays nicely with React state.
   */
  withValue(value: T): this {
    return Object.assign(
      Object.create(Object.getPrototypeOf(this)),
      this,
      { value },
    );
  }
}

export interface Option {
  label: string;
  value: string;
}

/** A continuous/numeric value picked via a range slider. */
export class SliderQuestion extends Question<number | null> {
  readonly min: number;
  readonly max: number;
  readonly step: number;
  readonly customEnd?: string;
  readonly addString?: string;

  constructor(
    id: string,
    label: string,
    options: { min: number; max: number; step?: number; addString?: string, value?: number | null; customEnd?: string },
  ) {
    super(id, label, options.value ?? null);
    this.min = options.min;
    this.max = options.max;
    this.step = options.step ?? 1;
    this.customEnd = options.customEnd;
    this.addString = options.addString;
  }

  get answered(): boolean {
    return this.value !== null;
  }
}

/** A single choice picked from a dropdown/select. */
export class DropdownQuestion extends Question<string | null> {
  readonly options: Option[];
  readonly placeholder: string;

  constructor(
    id: string,
    label: string,
    options: Option[],
    placeholder = 'Select an option...',
    value: string | null = null,
  ) {
    super(id, label, value);
    this.options = options;
    this.placeholder = placeholder;
  }

  get answered(): boolean {
    return this.value !== null && this.value !== '';
  }
}

import type { ReactNode } from 'react';

/** Config for one segment of a PercentageScrollbarQuestion. */
export interface PercentageSegment {
  label: string;
  color: string;
  icon: ReactNode;
}

/**
 * A single track with N-1 draggable handles splitting it into N segments
 * that always sum to 100%. Dragging a handle only trades percentage
 * between its two immediate neighbours.
 */
export class PercentageScrollbarQuestion extends Question<number[]> {
  readonly segments: PercentageSegment[];
  readonly step: number;
  readonly addString?: String;

  constructor(id: string, label: string, addString: string, segments: PercentageSegment[], value?: number[], step = 1) {
    if (segments.length < 2) {
      throw new Error('PercentageScrollbarQuestion needs at least 2 segments.');
    }

    const n = segments.length;
    const base = Math.floor(100 / n);
    const defaultValue = Array.from({ length: n }, (_, i) =>
      i === n - 1 ? 100 - base * (n - 1) : base,
    );

    super(id, label, value ?? defaultValue);
    this.segments = segments;
    this.step = step;
    this.addString = addString;
  }

  get total(): number {
    return this.value.reduce((sum, v) => sum + v, 0);
  }

  get answered(): boolean {
    return this.total === 100;
  }
}

/** A slider's static config, reused by PercentageSplitQuestion. */
export interface PercentageOption {
  label: string;
  min?: number;
  max?: number;
  step?: number;
}

/**
 * A set of sliders whose values must add up to 100%. `options` has N
 * entries; the first N-1 are editable sliders, and the last one is the
 * remainder (100 - sum of the others), displayed read-only.
 */
export class PercentageSplitQuestion extends Question<number[]> {
  readonly options: PercentageOption[];
  readonly addString?: String;

  constructor(id: string, label: string, addString: String, options: PercentageOption[], value?: number[]) {
    if (options.length < 2) {
      throw new Error('PercentageSplitQuestion needs at least 2 options (1 slider + 1 remainder).');
    }
    const editableCount = options.length - 1;
    super(id, label, value ?? new Array(editableCount).fill(0));
    this.options = options;
    this.addString = addString;
  }

  /** Sum of the editable sliders' values. */
  get total(): number {
    return this.value.reduce((sum, v) => sum + v, 0);
  }

  /** What's left over for the last, non-editable option. */
  get remainder(): number {
    return 100 - this.total;
  }

  /** True if the editable sliders alone already exceed 100%. */
  get hasError(): boolean {
    return this.total > 100;
  }

  get answered(): boolean {
    // "Answered" once every slider has moved off zero and the totals are valid.
    return !this.hasError && this.value.every((v) => v > 0);
  }
}

/** One or more choices picked from a list of options. */
export class SelectableListQuestion extends Question<string[]> {
  readonly options: Option[];
  readonly multiple: boolean;

  constructor(
    id: string,
    label: string,
    options: Option[],
    multiple = false,
    value: string[] = [],
  ) {
    super(id, label, value);
    this.options = options;
    this.multiple = multiple;
  }

  get answered(): boolean {
    return this.options.length > 0;
  }
}
