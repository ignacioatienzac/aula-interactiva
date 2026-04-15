import { useState, useRef } from "react";
import {
  VerbSentence,
  FieldKey,
  VERB_FIELDS,
  FIELD_META,
  fieldValueLabel,
  pickVerbSentences,
} from "@/data/verbsData";

const MAX_STRIKES = 3;
const ROW_COUNT = 8;

type CellStatus = "idle" | "correct" | "wrong";
type RowAnswer = Record<FieldKey, string>;
type RowStatus = Record<FieldKey, CellStatus>;

interface FailEntry {
  sentence: VerbSentence;
  errors: { field: FieldKey; given: string; correct: string }[];
}

interface Props {
  locationName: string;
  icon: string;
  onComplete: () => void;
  onClose: () => void;
}

interface InnerProps extends Props {
  excludeIds?: number[];
  onRetry: (usedIds: number[]) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseBold(text: string) {
  return text.split(/\*\*(.*?)\*\*/).map((part, i) =>
    i % 2 === 1
      ? <strong key={i} className="text-heist-gold font-extrabold">{part}</strong>
      : <span key={i}>{part}</span>
  );
}

const makeEmptyAnswers = (n: number): RowAnswer[] =>
  Array.from({ length: n }, () =>
    Object.fromEntries(VERB_FIELDS.map((f) => [f, ""])) as RowAnswer
  );

const makeEmptyStatuses = (n: number): RowStatus[] =>
  Array.from({ length: n }, () =>
    Object.fromEntries(VERB_FIELDS.map((f) => [f, "idle" as CellStatus])) as RowStatus
  );

// ─── Inner component (remounted on retry) ─────────────────────────────────────

const VerbsChallengeInner = ({
  locationName,
  icon,
  onComplete,
  onClose,
  excludeIds,
  onRetry,
}: InnerProps) => {
  const [sentences] = useState<VerbSentence[]>(() => pickVerbSentences(excludeIds));
  const [answers, setAnswers]   = useState<RowAnswer[]>(() => makeEmptyAnswers(ROW_COUNT));
  const [statuses, setStatuses] = useState<RowStatus[]>(() => makeEmptyStatuses(ROW_COUNT));

  const [lives, setLives]           = useState(MAX_STRIKES);
  const [succeeded, setSucceeded]   = useState(false);
  const [failReason, setFailReason] = useState<"strikes" | null>(null);
  const [failInfo, setFailInfo]     = useState<FailEntry[]>([]);
  const [shaking, setShaking]       = useState(false);
  const [flickering, setFlickering] = useState(false);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // ── Event handlers ──────────────────────────────────────────────────────────

  const handleChange = (rowIdx: number, field: FieldKey, value: string) => {
    if (statuses[rowIdx][field] === "correct" || succeeded || failReason !== null) return;
    setAnswers((prev) =>
      prev.map((row, i) => (i === rowIdx ? { ...row, [field]: value } : row))
    );
    if (statuses[rowIdx][field] === "wrong") {
      setStatuses((prev) =>
        prev.map((row, i) =>
          i === rowIdx ? { ...row, [field]: "idle" as CellStatus } : row
        )
      );
    }
  };

  const allSelected = sentences.every((_, rowIdx) =>
    VERB_FIELDS.every(
      (f) => statuses[rowIdx][f] === "correct" || answers[rowIdx][f] !== ""
    )
  );

  const handleCheck = () => {
    const newStatuses: RowStatus[] = statuses.map((rowStatus, rowIdx) => {
      const correct = sentences[rowIdx].answers;
      return Object.fromEntries(
        VERB_FIELDS.map((f) => {
          if (rowStatus[f] === "correct") return [f, "correct"];
          const expected = String(correct[f]);
          return [f, answers[rowIdx][f] === expected ? "correct" : "wrong"];
        })
      ) as RowStatus;
    });

    setStatuses(newStatuses);

    const anyWrong = newStatuses.some((row) =>
      VERB_FIELDS.some((f) => row[f] === "wrong")
    );

    if (!anyWrong) {
      setSucceeded(true);
      setTimeout(() => onCompleteRef.current(), 1500);
      return;
    }

    setShaking(true);
    setTimeout(() => setShaking(false), 500);

    setLives((l) => {
      const next = l - 1;
      if (next <= 0) {
        const info: FailEntry[] = sentences
          .map((sentence, rowIdx) => ({
            sentence,
            errors: VERB_FIELDS.filter((f) => newStatuses[rowIdx][f] === "wrong").map(
              (f) => ({
                field: f,
                given: answers[rowIdx][f],
                correct: String(sentence.answers[f]),
              })
            ),
          }))
          .filter((e) => e.errors.length > 0);
        setFailInfo(info);
        setFlickering(true);
        setTimeout(() => {
          setFlickering(false);
          setFailReason("strikes");
        }, 500);
      }
      return next;
    });
  };

  const handleRetry = () => onRetry(sentences.map((s) => s.id));

  // ── Styles ──────────────────────────────────────────────────────────────────

  const lifeDisplay = Array.from({ length: MAX_STRIKES }, (_, i) => i < lives);

  const selectCls = (rowIdx: number, field: FieldKey): string => {
    const status   = statuses[rowIdx][field];
    const hasValue = answers[rowIdx][field] !== "";
    const base =
      "w-full bg-heist-bg border text-[11px] font-bold py-1 pl-1 pr-0 focus:outline-none transition-colors duration-200 rounded-none";
    if (status === "correct")
      return `${base} border-heist-green text-heist-green cursor-default pointer-events-none`;
    if (status === "wrong") return `${base} border-heist-red text-heist-red cursor-pointer`;
    return `${base} cursor-pointer ${
      hasValue
        ? "border-heist-gold text-heist-gold"
        : "border-gray-700 text-gray-500 hover:border-heist-gold/60"
    }`;
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      {flickering && (
        <div className="absolute inset-0 z-10 bg-black animate-flicker pointer-events-none" />
      )}

      <div
        className={`relative w-full max-w-lg sm:max-w-4xl bg-heist-bg border-2 border-heist-red shadow-2xl shadow-heist-red/20 flex flex-col max-h-[90vh] ${
          shaking ? "animate-shake" : ""
        }`}
      >
        {/* ── Success overlay ── */}
        {succeeded && (
          <div className="absolute inset-0 z-20 bg-black/95 flex flex-col items-center justify-center gap-4">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-heist-green" />
            <p className="text-heist-green text-xs font-bold uppercase tracking-widest">
              ✓ Operación completada
            </p>
            <h2 className="mission-text text-4xl text-heist-green text-center">
              MISIÓN<br />COMPLETADA
            </h2>
            <p className="text-gray-500 text-xs uppercase tracking-widest animate-pulse">
              Avanzando...
            </p>
          </div>
        )}

        {/* ── Failure overlay ── */}
        {failReason !== null && (
          <div className="absolute inset-0 z-20 bg-black/95 flex flex-col items-center justify-center gap-4 p-6 overflow-y-auto">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-heist-red animate-scanner" />
            <p className="text-heist-red text-xs font-bold uppercase tracking-widest">
              ⚠ Alerta de seguridad
            </p>
            <h2 className="mission-text text-4xl text-heist-red text-center">
              MISIÓN<br />FALLIDA
            </h2>
            <p className="text-gray-400 text-sm uppercase tracking-widest text-center">
              💀 Demasiados errores
            </p>

            {failInfo.length > 0 && (
              <div className="w-full max-w-2xl border border-gray-700 p-3 max-h-56 overflow-y-auto">
                <p className="text-heist-gold text-xs font-bold uppercase tracking-widest mb-3 text-center">
                  Tus errores
                </p>
                <div className="flex flex-col gap-3">
                  {failInfo.map((entry, i) => (
                    <div key={i}>
                      <p className="text-white/80 text-xs font-bold mb-1 italic">
                        {entry.sentence.text.replace(/\*\*(.*?)\*\*/g, "«$1»")}
                      </p>
                      {entry.errors.map((err, j) => (
                        <div key={j} className="flex items-center gap-2 text-xs pl-2 pb-0.5">
                          <span className="text-gray-500 shrink-0">
                            {FIELD_META[err.field].header}:
                          </span>
                          <span className="text-heist-red line-through">
                            {fieldValueLabel(err.field, err.given) || "—"}
                          </span>
                          <span className="text-gray-500">→</span>
                          <span className="text-heist-green font-bold">
                            {fieldValueLabel(err.field, err.correct)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-gray-500 text-xs uppercase tracking-wider">
              ¿Volver a intentarlo?
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleRetry}
                className="px-8 py-3 border-2 border-heist-red text-heist-red font-bold uppercase tracking-widest text-sm hover:bg-heist-red hover:text-black transition-all duration-200"
              >
                SÍ
              </button>
              <button
                onClick={onClose}
                className="px-8 py-3 border-2 border-gray-600 text-gray-400 font-bold uppercase tracking-widest text-sm hover:border-gray-400 hover:text-white transition-all duration-200"
              >
                NO
              </button>
            </div>
          </div>
        )}

        {/* ── Header ── */}
        <div className="flex items-center justify-between bg-heist-red/10 border-b border-heist-red px-4 py-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-lg">{icon}</span>
            <span className="text-heist-red text-xs font-bold uppercase tracking-widest">
              {locationName}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl leading-none transition-colors"
          >
            ✕
          </button>
        </div>

        {/* ── Lives ── */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-heist-red/20 shrink-0">
          <div className="flex gap-1 text-base">
            {lifeDisplay.map((alive, i) => (
              <span key={i} className={alive ? "opacity-100" : "opacity-25 grayscale"}>
                ❤️
              </span>
            ))}
          </div>
          <p className="text-gray-600 text-xs uppercase tracking-widest">Verbos</p>
        </div>

        {/* ── Instructions ── */}
        <div className="px-4 pt-3 pb-1 shrink-0">
          <p className="text-[11px] text-gray-500 uppercase tracking-wider">
            Analiza el verbo en negrita de cada frase. Completa todas las columnas y pulsa Comprobar.
          </p>
        </div>

        {/* ── Table ── */}
        <div className="overflow-y-auto flex-1 min-h-0 px-4 pb-4">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-xs border-collapse">
              <thead>
                <tr className="border-b border-heist-red/30">
                  <th className="text-left py-2 pr-2 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                    Frase
                  </th>
                  {VERB_FIELDS.map((f) => (
                    <th
                      key={f}
                      className="text-center py-2 px-1 text-[10px] text-gray-500 uppercase tracking-widest font-bold w-24"
                    >
                      {FIELD_META[f].header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sentences.map((sentence, rowIdx) => (
                  <tr key={sentence.id} className="border-b border-gray-800">
                    <td className="py-2 pr-3 text-white/90 leading-snug align-middle">
                      {parseBold(sentence.text)}
                    </td>
                    {VERB_FIELDS.map((f) => (
                      <td key={f} className="py-2 px-1 align-middle">
                        <select
                          value={answers[rowIdx][f]}
                          onChange={(e) => handleChange(rowIdx, f, e.target.value)}
                          disabled={
                            statuses[rowIdx][f] === "correct" ||
                            succeeded ||
                            failReason !== null
                          }
                          className={selectCls(rowIdx, f)}
                        >
                          <option value="" disabled>
                            —
                          </option>
                          {FIELD_META[f].options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Comprobar ── */}
        {!succeeded && (
          <div className="px-4 pb-4 border-t border-heist-red/20 pt-3 shrink-0">
            <button
              onClick={handleCheck}
              disabled={!allSelected || failReason !== null}
              className={`w-full py-2.5 font-bold uppercase tracking-widest text-sm border-2 transition-all duration-200 ${
                allSelected
                  ? "border-heist-red bg-heist-red/10 text-heist-red hover:bg-heist-red hover:text-black cursor-pointer"
                  : "border-gray-700 text-gray-600 cursor-not-allowed"
              }`}
            >
              ▶ Comprobar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Public wrapper — remounts with fresh sentences on retry ──────────────────

const VerbsChallenge = (props: Props) => {
  const [retryKey, setRetryKey] = useState(0);
  const excludeRef = useRef<number[]>([]);

  return (
    <VerbsChallengeInner
      key={retryKey}
      {...props}
      excludeIds={excludeRef.current.length > 0 ? excludeRef.current : undefined}
      onRetry={(usedIds) => {
        excludeRef.current = usedIds;
        setRetryKey((k) => k + 1);
      }}
    />
  );
};

export default VerbsChallenge;
