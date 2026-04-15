import { useState, useEffect, useRef, useCallback } from "react";
import {
  SerEstarHaberQuestion,
  TOTAL_TIME,
  QUESTION_COUNT,
  pickSEHQuestions,
  questionText,
} from "@/data/serEstarHaberData";

const MAX_STRIKES = 3;

type QuestionStatus = "idle" | "correct" | "wrong";
type FailReason = "time" | "strikes";

interface FailEntry {
  question: SerEstarHaberQuestion;
  given: string;
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

const pad = (n: number) => String(n).padStart(2, "0");
const formatTime = (s: number) => `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;

// ─── Inner component ──────────────────────────────────────────────────────────

const SerEstarHaberInner = ({
  locationName,
  icon,
  onComplete,
  onClose,
  excludeIds,
  onRetry,
}: InnerProps) => {
  const [questions] = useState<SerEstarHaberQuestion[]>(() =>
    pickSEHQuestions(excludeIds)
  );
  const [answers, setAnswers] = useState<string[]>(() =>
    Array(QUESTION_COUNT).fill("")
  );
  const [statuses, setStatuses] = useState<QuestionStatus[]>(() =>
    Array(QUESTION_COUNT).fill("idle" as QuestionStatus)
  );

  const [lives, setLives] = useState(MAX_STRIKES);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [failReason, setFailReason] = useState<FailReason | null>(null);
  const [failInfo, setFailInfo] = useState<FailEntry[]>([]);
  const [succeeded, setSucceeded] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [flickering, setFlickering] = useState(false);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const triggerFail = useCallback((reason: FailReason) => {
    setFlickering(true);
    setTimeout(() => {
      setFlickering(false);
      setFailReason(reason);
    }, 500);
  }, []);

  // ── Timer ────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (failReason !== null || succeeded) return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(id);
          triggerFail("time");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [failReason, succeeded, triggerFail]);

  // ── Success auto-advance ─────────────────────────────────────────────────────

  useEffect(() => {
    if (succeeded) {
      const t = setTimeout(() => onCompleteRef.current(), 1500);
      return () => clearTimeout(t);
    }
  }, [succeeded]);

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const handleChange = (idx: number, value: string) => {
    if (statuses[idx] === "correct" || succeeded || failReason !== null) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[idx] = value;
      return next;
    });
    if (statuses[idx] === "wrong") {
      setStatuses((prev) => {
        const next = [...prev];
        next[idx] = "idle";
        return next;
      });
    }
  };

  const allSelected = questions.every(
    (_, i) => statuses[i] === "correct" || answers[i] !== ""
  );

  const handleCheck = () => {
    const newStatuses: QuestionStatus[] = questions.map((q, i) => {
      if (statuses[i] === "correct") return "correct";
      return answers[i] === q.correct ? "correct" : "wrong";
    });
    setStatuses(newStatuses);

    const anyWrong = newStatuses.some((s) => s === "wrong");

    if (!anyWrong) {
      setSucceeded(true);
      return;
    }

    setShaking(true);
    setTimeout(() => setShaking(false), 500);

    setLives((l) => {
      const next = l - 1;
      if (next <= 0) {
        const info: FailEntry[] = questions
          .map((q, i) => ({ question: q, given: answers[i], status: newStatuses[i] }))
          .filter((x) => x.status === "wrong")
          .map((x) => ({ question: x.question, given: x.given }));
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

  const handleRetry = () => onRetry(questions.map((q) => q.id));

  // ── Styles ────────────────────────────────────────────────────────────────────

  const lifeDisplay = Array.from({ length: MAX_STRIKES }, (_, i) => i < lives);
  const timeRatio = timeLeft / TOTAL_TIME;
  const timerColor =
    timeRatio > 0.5
      ? "text-heist-gold"
      : timeRatio > 0.25
      ? "text-orange-400"
      : "text-heist-red";

  const selectCls = (idx: number) => {
    const st = statuses[idx];
    const filled = answers[idx] !== "";
    const base =
      "bg-heist-bg border font-bold text-[12px] py-0.5 px-1 focus:outline-none transition-colors duration-200 rounded-none cursor-pointer";
    if (st === "correct") return `${base} border-heist-green text-heist-green pointer-events-none`;
    if (st === "wrong") return `${base} border-heist-red text-heist-red`;
    return `${base} ${filled ? "border-heist-gold text-heist-gold" : "border-gray-700 text-gray-500 hover:border-heist-gold/60"}`;
  };

  // ── Render inline sentence with blank(s) ─────────────────────────────────────

  const renderQuestion = (q: SerEstarHaberQuestion, idx: number) => {
    // Two-blank question: segments.length === 3
    if (q.segments.length === 3) {
      const parts = (q.correct as string).split(" / ");
      // We model this as one compound select: the options ARE the compound strings
      return (
        <span className="text-white/90 text-sm leading-loose">
          {q.segments[0]}
          <select
            value={answers[idx]}
            onChange={(e) => handleChange(idx, e.target.value)}
            disabled={statuses[idx] === "correct" || succeeded || failReason !== null}
            className={selectCls(idx)}
          >
            <option value="" disabled>— elige —</option>
            {q.options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          {/* show second blank filled in based on selection */}
          {answers[idx]
            ? <span className={statuses[idx] === "correct" ? "text-heist-green font-bold" : statuses[idx] === "wrong" ? "text-heist-red font-bold" : "text-heist-gold font-bold"}>
                {/* second part already shown via the compound option above */}
              </span>
            : null}
          {q.segments[1]}
          <span className="text-gray-500 italic text-xs">
            {/* second blank is implied by the compound answer */}
            {answers[idx] ? (answers[idx].split(" / ")[1] ?? "") : "___"}
          </span>
          {q.segments[2]}
        </span>
      );
    }
    // Single-blank question
    return (
      <span className="text-white/90 text-sm leading-loose">
        {q.segments[0]}
        <select
          value={answers[idx]}
          onChange={(e) => handleChange(idx, e.target.value)}
          disabled={statuses[idx] === "correct" || succeeded || failReason !== null}
          className={selectCls(idx)}
        >
          <option value="" disabled>— elige —</option>
          {q.options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        {q.segments[1]}
      </span>
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      {flickering && (
        <div className="absolute inset-0 z-10 bg-black animate-flicker pointer-events-none" />
      )}

      <div
        className={`relative w-full max-w-lg sm:max-w-3xl bg-heist-bg border-2 border-heist-red shadow-2xl shadow-heist-red/20 flex flex-col max-h-[90vh] ${
          shaking ? "animate-shake" : ""
        }`}
      >
        {/* ── Success overlay ── */}
        {succeeded && (
          <div className="absolute inset-0 z-20 bg-black/95 flex flex-col items-center justify-center gap-4">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-heist-green" />
            <p className="text-heist-green text-xs font-bold uppercase tracking-widest">✓ Operación completada</p>
            <h2 className="mission-text text-4xl text-heist-green text-center">MISIÓN<br />COMPLETADA</h2>
            <p className="text-gray-500 text-xs uppercase tracking-widest animate-pulse">Avanzando...</p>
          </div>
        )}

        {/* ── Failure overlay ── */}
        {failReason !== null && (
          <div className="absolute inset-0 z-20 bg-black/95 flex flex-col items-center justify-center gap-4 p-6 overflow-y-auto">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-heist-red animate-scanner" />
            <p className="text-heist-red text-xs font-bold uppercase tracking-widest">⚠ Alerta de seguridad</p>
            <h2 className="mission-text text-4xl text-heist-red text-center">MISIÓN<br />FALLIDA</h2>
            {failReason === "time" ? (
              <p className="text-gray-400 text-sm uppercase tracking-widest text-center">⏱ ¡Se ha acabado el tiempo!</p>
            ) : (
              <>
                <p className="text-gray-400 text-sm uppercase tracking-widest text-center">💀 Demasiados errores</p>
                {failInfo.length > 0 && (
                  <div className="w-full max-w-xl border border-gray-700 p-3 max-h-56 overflow-y-auto">
                    <p className="text-heist-gold text-xs font-bold uppercase tracking-widest mb-3 text-center">Tus errores</p>
                    <div className="flex flex-col gap-3">
                      {failInfo.map((entry, i) => (
                        <div key={i} className="text-xs border-b border-gray-800 pb-2">
                          <p className="text-white/70 italic mb-1">{questionText(entry.question)}</p>
                          <div className="flex items-center gap-2 pl-2">
                            <span className="text-heist-red line-through">{entry.given || "—"}</span>
                            <span className="text-gray-500">→</span>
                            <span className="text-heist-green font-bold">{entry.question.correct}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
            <p className="text-gray-500 text-xs uppercase tracking-wider">¿Volver a intentarlo?</p>
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
            <span className="text-heist-red text-xs font-bold uppercase tracking-widest">{locationName}</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl leading-none transition-colors">✕</button>
        </div>

        {/* ── Timer + lives ── */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-heist-red/20 shrink-0">
          <div className="flex gap-1 text-base">
            {lifeDisplay.map((alive, i) => (
              <span key={i} className={alive ? "opacity-100" : "opacity-25 grayscale"}>❤️</span>
            ))}
          </div>
          <span className={`font-mono font-bold text-lg ${timerColor}`}>{formatTime(timeLeft)}</span>
          <p className="text-gray-600 text-xs uppercase tracking-widest">Ser / Estar / Haber</p>
        </div>

        {/* ── Instructions ── */}
        <div className="px-4 pt-3 pb-1 shrink-0">
          <p className="text-[11px] text-gray-500 uppercase tracking-wider">
            Elige la forma correcta de <em>ser</em>, <em>estar</em> o <em>haber</em> en cada frase. Completa todas y pulsa Comprobar.
          </p>
        </div>

        {/* ── Questions list ── */}
        <div className="overflow-y-auto flex-1 min-h-0 px-4 pb-4">
          <ol className="flex flex-col gap-3 mt-2">
            {questions.map((q, idx) => (
              <li key={q.id} className="flex gap-2 items-baseline border-b border-gray-800/60 pb-2">
                <span className="text-heist-gold font-bold text-xs shrink-0 w-5 text-right">{idx + 1}.</span>
                <div className="leading-loose">{renderQuestion(q, idx)}</div>
              </li>
            ))}
          </ol>
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

// ─── Public wrapper ───────────────────────────────────────────────────────────

const SerEstarHaberChallenge = (props: Props) => {
  const [retryKey, setRetryKey] = useState(0);
  const excludeRef = useRef<number[]>([]);

  return (
    <SerEstarHaberInner
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

export default SerEstarHaberChallenge;
