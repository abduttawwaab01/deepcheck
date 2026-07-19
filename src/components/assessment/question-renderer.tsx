import type { AssessmentQuestion } from "@/data/assessments/types";
import { ChartRenderer } from "@/components/charts/svg-charts";
import { GeometryRenderer } from "@/components/charts/geometry-renderer";

export function StandardRenderer({ question, selected, onSelect }: {
  question: AssessmentQuestion;
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-base leading-relaxed text-neutral-900 dark:text-white">{question.questionText}</p>
      <div className="space-y-2">
        {question.options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-all min-h-[48px] ${
              selected === opt.id
                ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300"
                : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-300"
            }`}
          >
            <span className="mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs font-medium">
              {opt.id.toUpperCase()}
            </span>
            {opt.text}
          </button>
        ))}
      </div>
    </div>
  );
}

export function PassageRenderer({ question, selected, onSelect }: {
  question: AssessmentQuestion;
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="max-h-60 overflow-y-auto rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm leading-relaxed text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300">
        {question.passageText}
      </div>
      <p className="text-base leading-relaxed text-neutral-900 dark:text-white">{question.questionText}</p>
      <div className="space-y-2">
        {question.options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-all min-h-[48px] ${
              selected === opt.id
                ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300"
                : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-300"
            }`}
          >
            <span className="mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs font-medium">
              {opt.id.toUpperCase()}
            </span>
            {opt.text}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ChartQuestionRenderer({ question, selected, onSelect }: {
  question: AssessmentQuestion;
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      {question.chartData && <ChartRenderer data={question.chartData} />}
      <p className="text-base leading-relaxed text-neutral-900 dark:text-white">{question.questionText}</p>
      <div className="space-y-2">
        {question.options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-all min-h-[48px] ${
              selected === opt.id
                ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300"
                : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-300"
            }`}
          >
            <span className="mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs font-medium">
              {opt.id.toUpperCase()}
            </span>
            {opt.text}
          </button>
        ))}
      </div>
    </div>
  );
}

export function GeometryQuestionRenderer({ question, selected, onSelect }: {
  question: AssessmentQuestion;
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      {question.geometryData && <GeometryRenderer data={question.geometryData} />}
      <p className="text-base leading-relaxed text-neutral-900 dark:text-white">{question.questionText}</p>
      <div className="space-y-2">
        {question.options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-all min-h-[48px] ${
              selected === opt.id
                ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300"
                : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-300"
            }`}
          >
            <span className="mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs font-medium">
              {opt.id.toUpperCase()}
            </span>
            {opt.text}
          </button>
        ))}
      </div>
    </div>
  );
}

export function InteractiveRenderer({ question, selected, onSelect }: {
  question: AssessmentQuestion;
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  if (question.interactiveData?.type === "fill_blanks") {
    return (
      <div className="space-y-3">
        <p className="text-base leading-relaxed text-neutral-900 dark:text-white">{question.questionText}</p>
        <div className="space-y-2">
          {question.options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onSelect(opt.id)}
              className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-all min-h-[48px] ${
                selected === opt.id
                  ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300"
                  : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-300"
              }`}
            >
              <span className="mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs font-medium">
                {opt.id.toUpperCase()}
              </span>
              {opt.text}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-base leading-relaxed text-neutral-900 dark:text-white">{question.questionText}</p>
      <div className="space-y-2">
        {question.options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-all min-h-[48px] ${
              selected === opt.id
                ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300"
                : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-300"
            }`}
          >
            <span className="mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs font-medium">
              {opt.id.toUpperCase()}
            </span>
            {opt.text}
          </button>
        ))}
      </div>
    </div>
  );
}
