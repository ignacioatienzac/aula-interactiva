import { useState, useRef, useEffect, Fragment } from "react";
import {
  AdjPosition,
  ADJ_EXERCISE,
  TOTAL_ADJ_BLANKS,
} from "@/data/adjectivesText";

const MAX_STRIKES = 3;

type BlankStatus = "idle" | "correct" | "wrong";

interface Props {
  locationName: string;
  icon: string;
  onComplete: () => void;
  onClose: () => void;
}

// ─── Inner component (remounted on retry) ──────────────────────────────────────

const AdjectivesChallengeInner = ({
  locationName,
  icon,
  onComplete,
  onClose,
}: Props) => {
  const blankCount = TOTAL_ADJ_BLANKS;

  const [answers, setAnswers] = useState<(AdjPosition | null)[]>(
    () => Array(blankCount).fill(null)
  );
  const [statuses, setStatuses] = useState<BlankStatus[]>(
    () => Array(blankCount).fill("idle" as BlankStatus)
  );
  const [lives, setLives] = useState(MAX_STRIKES);
  const [succeeded, setSucceeded] = useState(false);
  const [failReason, setFailReason] = useState<"strikes" | null>(null);
  const [shaking, setShaking] = useState(false);
  const [flickering, setFlickering] = useState(false);

  const solucionarioRef = useRef<HTMLDivElement>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Scroll to solucionario after success
  useEffect(() => {
    if (succeeded) {
      const t = setTimeout(() => {
        solucionarioRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        const successT = setTimeout(() => onCompleteRef.current(), 800);
        return () => clearTimeout(successT);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [succeeded]);

  const handleChange = (id: number, value: AdjPosition) => {
    if (statuses[id] === "correct" || succeeded || failReason !== null) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[id] = value;
      return next;
    });
    // Clear "wrong" visual on change
    if (statuses[id] === "wrong") {
      setStatuses((prev) => {
        const next = [...prev];
        next[id] = "idle";
        return next;
      });
    }
  };

  const allSelected = answers.every((a, i) => a !== null || statuses[i] === "correct");

  const handleCheck = () => {
    const blanks = ADJ_EXERCISE.blanks;
    const newStatuses: BlankStatus[] = blanks.map((blank, i) => {
      if (statuses[i] === "correct") return "correct";
      return answers[i] === blank.correct ? "correct" : "wrong";
    });
    setStatuses(newStatuses);

    const anyWrong = newStatuses.some((s) => s === "wrong");

    if (!anyWrong) {
      setSucceeded(true);
      return;
    }

    // Lose 1 life for any failed attempt
    setShaking(true);
    setTimeout(() => setShaking(false), 500);

    setLives((l) => {
      const next = l - 1;
      if (next <= 0) {
        setFlickering(true);
        setTimeout(() => {
          setFlickering(false);
          setFailReason("strikes");
        }, 500);
      }
      return next;
    });
  };

  const lifeDisplay = Array.from({ length: MAX_STRIKES }, (_, i) => i < lives);

  // ── Text rendering ──────────────────────────────────────────────────────────

  const renderSegmentText = (text: string, key: string) => {
    const parts = text.split("\n");
    return parts.map((part, i) => (
      <Fragment key={`${key}-${i}`}>
        {part}
        {i < parts.length - 1 && <br />}
      </Fragment>
    ));
  };

  const selectClass = (id: number) => {
    const st = statuses[id];
    const base =
      "inline-block mx-0.5 bg-heist-bg border text-sm font-bold rounded-none py-0.5 px-1 focus:outline-none transition-colors duration-200 cursor-pointer";
    if (st === "correct") {
      return `${base} border-heist-green text-heist-green cursor-default pointer-events-none`;
    }
    if (st === "wrong") {
      return `${base} border-heist-red text-heist-red`;
    }
    const filled = answers[id] !== null;
    return `${base} ${
      filled
        ? "border-heist-gold text-heist-gold"
        : "border-gray-600 text-gray-400 hover:border-heist-gold/60"
    }`;
  };

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
        {/* ── Failure overlay ── */}
        {failReason !== null && (
          <div className="absolute inset-0 z-20 bg-black/95 flex flex-col items-center justify-center gap-5 p-6">
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
            <p className="text-gray-500 text-xs uppercase tracking-wider">
              ¿Volver a intentarlo?
            </p>
            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="px-8 py-3 border-2 border-heist-red text-heist-red font-bold uppercase tracking-widest text-sm
                  hover:bg-heist-red hover:text-black transition-all duration-200"
              >
                SÍ
              </button>
              <button
                onClick={onClose}
                className="px-8 py-3 border-2 border-gray-600 text-gray-400 font-bold uppercase tracking-widest text-sm
                  hover:border-gray-400 hover:text-white transition-all duration-200"
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

        {/* ── Lives bar ── */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-heist-red/20 shrink-0">
          <div className="flex gap-1 text-base">
            {lifeDisplay.map((alive, i) => (
              <span key={i} className={alive ? "opacity-100" : "opacity-25 grayscale"}>
                ❤️
              </span>
            ))}
          </div>
          <p className="text-gray-600 text-xs uppercase tracking-widest">Adjetivos</p>
        </div>

        {/* ── Instructions ── */}
        <div className="px-4 pt-3 pb-1 shrink-0">
          <p className="text-[11px] text-gray-500 uppercase tracking-wider">
            Elige en cada hueco si el adjetivo va antes del sustantivo, después, o si ambas posiciones son correctas.
          </p>
        </div>

        {/* ── Scrollable content ── */}
        <div className="overflow-y-auto px-4 pb-4 flex-1 min-h-0">
          {/* Text with inline selects */}
          <p className="text-white/90 text-sm leading-loose sm:text-base">
            {ADJ_EXERCISE.segments.map((seg, i) => {
              const blankId = ADJ_EXERCISE.blankAfterSegment[i];
              return (
                <Fragment key={i}>
                  {renderSegmentText(seg, `seg-${i}`)}
                  {blankId !== null && (
                    <select
                      value={answers[blankId] ?? ""}
                      onChange={(e) =>
                        handleChange(blankId, e.target.value as AdjPosition)
                      }
                      disabled={statuses[blankId] === "correct" || succeeded || failReason !== null}
                      className={selectClass(blankId)}
                    >
                      <option value="" disabled>
                        — elige —
                      </option>
                      <option value="antes">
                        {ADJ_EXERCISE.blanks[blankId].beforeForm}
                      </option>
                      <option value="después">
                        {ADJ_EXERCISE.blanks[blankId].afterForm}
                      </option>
                      <option value="ambas">Ambas son correctas</option>
                    </select>
                  )}
                </Fragment>
              );
            })}
          </p>

          {/* ── Solucionario (only on success) ── */}
          {succeeded && (
            <div ref={solucionarioRef} className="mt-6 border border-heist-green/30 p-4">
              <p className="text-heist-green text-xs font-bold uppercase tracking-widest mb-4 text-center">
                ✓ ¡Correcto! — Solucionario
              </p>
              <ol className="flex flex-col gap-3">
                {ADJ_EXERCISE.blanks.map((blank) => {
                  const correctLabel =
                    blank.correct === "ambas"
                      ? `${blank.beforeForm} / ${blank.afterForm}`
                      : blank.correct === "antes"
                      ? blank.beforeForm
                      : blank.afterForm;
                  const badge =
                    blank.correct === "ambas"
                      ? "AMBAS"
                      : blank.correct === "antes"
                      ? "ANTES"
                      : "DESPUÉS";
                  return (
                    <li key={blank.id} className="flex gap-3 text-sm">
                      <span className="text-heist-gold font-bold shrink-0 w-5 text-right">
                        {blank.id + 1}.
                      </span>
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-white font-bold italic">{correctLabel}</span>
                          <span className="text-[10px] border border-heist-green/50 text-heist-green px-1.5 py-0.5 uppercase tracking-widest font-bold">
                            {badge}
                          </span>
                        </div>
                        <span className="text-gray-400 text-xs leading-snug">
                          {blank.explanation}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          )}
        </div>

        {/* ── Check button (hidden after success) ── */}
        {!succeeded && (
          <div className="px-4 pb-4 border-t border-heist-red/20 pt-3 shrink-0">
            <button
              onClick={handleCheck}
              disabled={!allSelected || failReason !== null}
              className={`w-full py-2.5 font-bold uppercase tracking-widest text-sm border-2 transition-all duration-200
                ${allSelected
                  ? "border-heist-red bg-heist-red/10 text-heist-red hover:bg-heist-red hover:text-black cursor-pointer"
                  : "border-gray-700 text-gray-600 cursor-not-allowed"}
              `}
            >
              ▶ Comprobar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Public wrapper — remounts inner on retry ─────────────────────────────────

const AdjectivesChallenge = (props: Props) => {
  const [retryKey, setRetryKey] = useState(0);

  return (
    <AdjectivesChallengeInner
      key={retryKey}
      {...props}
      onClose={() => {
        setRetryKey((k) => k + 1);
        props.onClose();
      }}
    />
  );
};

export default AdjectivesChallenge;
