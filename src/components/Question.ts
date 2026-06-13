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
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this, {
      value,
    });
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

  constructor(
    id: string,
    label: string,
    options: { min: number; max: number; step?: number; value?: number | null },
  ) {
    super(id, label, options.value ?? null);
    this.min = options.min;
    this.max = options.max;
    this.step = options.step ?? 1;
  }

  get answered(): boolean {
    // null means the user hasn't touched the slider yet.
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
    placeholder = "Select an option...",
    value: string | null = null,
  ) {
    super(id, label, value);
    this.options = options;
    this.placeholder = placeholder;
  }

  get answered(): boolean {
    return this.value !== null && this.value !== "";
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
    return this.value.length > 0;
  }
}
