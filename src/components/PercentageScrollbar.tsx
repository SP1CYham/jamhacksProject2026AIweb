import { useCallback, useRef } from "react";
import "./Question.css";
import { PercentageScrollbarQuestion } from "./Question";

interface PercentageScrollbarProps {
  question: PercentageScrollbarQuestion;
  onChange: (value: number[]) => void;
}

/**
 * Converts segment values (e.g. [10, 10, 10, 70]) into cumulative boundary
 * positions for the N-1 draggable handles (e.g. [10, 20, 30]).
 */
function valuesToBoundaries(values: number[]): number[] {
  const boundaries: number[] = [];
  let acc = 0;
  for (let i = 0; i < values.length - 1; i++) {
    acc += values[i];
    boundaries.push(acc);
  }
  return boundaries;
}

/** Converts boundary positions back into segment values. */
function boundariesToValues(boundaries: number[], count: number): number[] {
  const values: number[] = [];
  let prev = 0;
  for (let i = 0; i < count - 1; i++) {
    values.push(Math.round((boundaries[i] - prev) * 100) / 100);
    prev = boundaries[i];
  }
  values.push(Math.round((100 - prev) * 100) / 100);
  return values;
}

export function PercentageScrollbar({
  question,
  onChange,
}: PercentageScrollbarProps) {
  const { label, addString, segments, value, step, answered, total } = question;
  const trackRef = useRef<HTMLDivElement>(null);
  const boundaries = valuesToBoundaries(value);

  const clientXToPercent = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return 0;
      const rect = track.getBoundingClientRect();
      const raw = ((clientX - rect.left) / rect.width) * 100;
      const stepped = Math.round(raw / step) * step;
      return Math.min(100, Math.max(0, stepped));
    },
    [step],
  );

  const startDrag = useCallback(
    (handleIndex: number) => (event: React.PointerEvent) => {
      event.preventDefault();
      const lowerBound = handleIndex === 0 ? 0 : boundaries[handleIndex - 1];
      const upperBound =
        handleIndex === boundaries.length - 1
          ? 100
          : boundaries[handleIndex + 1];

      const handleMove = (moveEvent: PointerEvent) => {
        const percent = clientXToPercent(moveEvent.clientX);
        const clamped = Math.min(upperBound, Math.max(lowerBound, percent));
        const nextBoundaries = [...boundaries];
        nextBoundaries[handleIndex] = clamped;
        onChange(boundariesToValues(nextBoundaries, value.length));
      };

      const handleUp = () => {
        window.removeEventListener("pointermove", handleMove);
        window.removeEventListener("pointerup", handleUp);
      };

      window.addEventListener("pointermove", handleMove);
      window.addEventListener("pointerup", handleUp);
    },
    [boundaries, clientXToPercent, onChange, value.length],
  );

  const nudgeHandle = useCallback(
    (handleIndex: number, direction: 1 | -1) => {
      const lowerBound = handleIndex === 0 ? 0 : boundaries[handleIndex - 1];
      const upperBound =
        handleIndex === boundaries.length - 1
          ? 100
          : boundaries[handleIndex + 1];
      const current = boundaries[handleIndex];
      const next = Math.min(
        upperBound,
        Math.max(lowerBound, current + direction * step),
      );
      const nextBoundaries = [...boundaries];
      nextBoundaries[handleIndex] = next;
      onChange(boundariesToValues(nextBoundaries, value.length));
    },
    [boundaries, onChange, step, value.length],
  );

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

      {/* Legend */}
      <div className="percentage-scrollbar__legend">
        {segments.map((segment, i) => (
          <div key={i} className="percentage-scrollbar__legend-item">
            <span className="percentage-scrollbar__legend-icon">
              {segment.icon ? (
                <img
                  src={typeof segment.icon == "string" ? segment.icon : ""}
                  alt={segment.label}
                  style={{
                    width: "1.1rem",
                    height: "1.1rem",
                    objectFit: "contain",
                    verticalAlign: "middle",
                  }}
                />
              ) : (
                segment.label[0]
              )}
            </span>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.1rem",
              }}
            >
              <span>{segment.label}</span>
              {segment.subtitle && (
                <span style={{ fontSize: "0.75rem", color: "#5b9bd6" }}>
                  {segment.subtitle}
                </span>
              )}
            </div>
            <span className="percentage-scrollbar__legend-value">
              {value[i]}
              {addString}
            </span>
          </div>
        ))}
      </div>

      {/* Track + segments + handles */}
      <div className="percentage-scrollbar__track" ref={trackRef}>
        <div className="percentage-scrollbar__segments">
          {segments.map((segment, i) => {
            const left = i === 0 ? 0 : boundaries[i - 1];
            const right = i === boundaries.length ? 100 : boundaries[i];
            return (
              <div
                key={i}
                className="percentage-scrollbar__segment"
                style={{
                  left: `${left}%`,
                  width: `${right - left}%`,
                  backgroundColor: segment.color,
                }}
              />
            );
          })}
        </div>

        {boundaries.map((position, i) => (
          <div
            key={i}
            className="percentage-scrollbar__handle"
            style={{ left: `${position}%`, zIndex: i + 1 }}
            onPointerDown={startDrag(i)}
            role="slider"
            tabIndex={0}
            aria-label={`Boundary between ${segments[i].label} and ${segments[i + 1].label}`}
            aria-valuemin={i === 0 ? 0 : boundaries[i - 1]}
            aria-valuemax={
              i === boundaries.length - 1 ? 100 : boundaries[i + 1]
            }
            aria-valuenow={position}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft" || e.key === "ArrowDown")
                nudgeHandle(i, -1);
              if (e.key === "ArrowRight" || e.key === "ArrowUp")
                nudgeHandle(i, 1);
            }}
          />
        ))}
      </div>

      {/* Icons below the track, centered under each segment */}
      <div className="percentage-scrollbar__icons">
        {segments.map((segment, i) => {
          const left = i === 0 ? 0 : boundaries[i - 1];
          const right = i === boundaries.length ? 100 : boundaries[i];
          const center = (left + right) / 2;
          return (
            <span
              key={i}
              className="percentage-scrollbar__icon"
              style={{ left: `${center}%` }}
            >
              {segment.icon ? (
                <img
                  src={typeof segment.icon == "string" ? segment.icon : ""}
                  alt={segment.label}
                  style={{
                    width: "1.4rem",
                    height: "1.4rem",
                    objectFit: "contain",
                  }}
                />
              ) : (
                segment.label[0]
              )}
            </span>
          );
        })}
      </div>

      {!answered && (
        <span className="question__hint">
          Total must equal 100% (currently {total}%)
        </span>
      )}
    </div>
  );
}
