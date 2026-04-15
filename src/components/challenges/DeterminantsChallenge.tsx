import { useState, useCallback } from "react";
import {
  DETERMINANTS_EXERCISE,
  TOTAL_BLANKS,
} from "@/data/determinantsText";

const MAX_STRIKES = 3;

interface Props {
  locationName: string;
  icon: string;
  onComplete: () => void;
  onClose: () => void;
}

type BlankStatus = "empty" | "correct" | "wrong";

const DeterminantsChallenge = ({
  locationName,
  icon,
  onComplete,
  onClose,
}: Props) => {
  const { segments, blankAfterSegment, blanks } = DETERMINANTS_EXERCISE;

  const [values, setValues] = useState<string[]>(() =>
    Array(TOTAL_BLANKS).fill("")
  );
  const [statuses, setStatuses] = useState<BlankStatus[]>(() =>
    Array(TOTAL_BLANKS).fill("empty")
  );
  const [lives, setLives] = useState(MAX_STRIKES);
  const [failReason, setFailReason] = useState<"strikes" | null>(null);
  const [flickering, setFlickering] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [checked, setChecked] = useState(false);

  const triggerFail = useCallback(() => {
    setFlickering(true);
    setTimeout(() => {
      setFlickering(false);
      setFailReason("strikes");
    }, 500);
  }, []);

  const handleChange = (id: number, val: string) => {
    setValues((prev) => {
      const next = [...prev];
      next[id] = val;
      return next;
    });
    // Reset status when the student edits
    if (statuses[id] !== "empty") {
      setStatuses((prev) => {
        const next = [...prev];
        next[id] = "empty";
        return next;
      });
    }
  };

  const handleCheck = () => {
    setChecked(true);
    const newStatuses: BlankStatus[] = blanks.map((blank, i) => {
      const normalized = values[i].trim().toLowerCase().replace(/^-|-$/g, "");
      return blank.accepted.includes(normalized) ? "correct" : "wrong";
    });
    setStatuses(newStatuses);

    const wrongCount = newStatuses.filter((s) => s === "wrong").length;

    if (wrongCount > 0) {
      // Lose one life per wrong answer, but cap at available lives
      const livesLost = Math.min(wrongCount, lives);
      const remaining = lives - livesLost;

      setShaking(true);
      setTimeout(() => setShaking(false), 500);

      setLives(remaining);
      if (remaining <= 0) {
        setTimeout(() => triggerFail(), 400);
      }
    } else {
      // All correct!
      setTimeout(() => onComplete(), 800);
    }
  };

  const handleRetry = () => {
    setValues(Array(TOTAL_BLANKS).fill(""));
    setStatuses(Array(TOTAL_BLANKS).fill("empty"));
    setLives(MAX_STRIKES);
    setFailReason(null);
    setFlickering(false);
    setShaking(false);
    setChecked(false);
  };

  const allFilled = values.every((v) => v.trim() !== "");
  const lifeDisplay = Array.from({ length: MAX_STRIKES }, (_, i) => i < lives);
  const correctCount = statuses.filter((s) => s === "correct").length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      {/* Flicker overlay */}
      {flickering && (
        <div className="absolute inset-0 z-10 bg-black animate-flicker pointer-events-none" />
      )}

      <div
        className={`relative w-full max-w-lg sm:max-w-4xl bg-heist-bg border-2 border-heist-red shadow-2xl shadow-heist-red/20 overflow-hidden ${
          shaking ? "animate-shake" : ""
        }`}
      >
        {/* ── Failure overlay ── */}
        {failReason !== null && (
          <div className="absolute inset-0 z-20 bg-black/95 flex flex-col items-center justify-center gap-5 p-6 overflow-y-auto">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-heist-red animate-scanner" />
            <p className="text-heist-red text-xs font-bold uppercase tracking-widest">
              ⚠ Alerta de seguridad
            </p>
            <h2 className="mission-text text-4xl text-heist-red text-center">
              MISIÓN
              <br />
              FALLIDA
            </h2>
            <p className="text-gray-400 text-sm uppercase tracking-widest text-center">
              💀 Demasiados errores
            </p>

            <p className="text-gray-500 text-xs uppercase tracking-wider">
              ¿Volver a intentarlo?
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleRetry}
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
        <div className="flex items-center justify-between bg-heist-red/10 border-b border-heist-red px-4 py-2">
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

        {/* ── Lives + progress bar ── */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-heist-red/20">
          <div className="flex gap-1 text-base">
            {lifeDisplay.map((alive, i) => (
              <span key={i} className={alive ? "opacity-100" : "opacity-25 grayscale"}>
                ❤️
              </span>
            ))}
          </div>
          {checked && (
            <p className="text-xs text-gray-400 uppercase tracking-widest">
              {correctCount}/{TOTAL_BLANKS} correctos
            </p>
          )}
          <p className="text-gray-600 text-xs uppercase tracking-widest">
            Determinantes
          </p>
        </div>

        {/* ── Instructions ── */}
        <div className="px-4 pt-3 pb-1">
          <p className="text-[11px] text-gray-500 uppercase tracking-wider">
            Rellena los huecos con el determinante correcto. El tipo aparece entre paréntesis.
          </p>
        </div>

        {/* ── Text with inline inputs ── */}
        <div className="px-4 pb-4 max-h-[55vh] overflow-y-auto">
          <p className="text-gray-200 text-sm leading-10 whitespace-pre-wrap">
            {segments.map((seg, i) => {
              const blankId = blankAfterSegment[i];
              return (
                <span key={i}>
                  {seg}
                  {blankId !== null && blankId !== undefined && (() => {
                    const blank = blanks[blankId];
                    const status = statuses[blankId];
                    return (
                      <span className="inline-flex items-baseline gap-0.5">
                        <input
                          type="text"
                          value={values[blankId]}
                          onChange={(e) => handleChange(blankId, e.target.value)}
                          disabled={failReason !== null}
                          placeholder="___"
                          className={`
                            inline-block w-20 bg-transparent border-b-2 text-center text-sm font-bold
                            focus:outline-none transition-colors duration-200 placeholder-gray-700
                            ${status === "correct" ? "border-heist-green text-heist-green" : ""}
                            ${status === "wrong" ? "border-heist-red text-heist-red" : ""}
                            ${status === "empty" ? "border-heist-gold/50 text-white focus:border-heist-gold" : ""}
                          `}
                        />
                        <span className="text-gray-500 text-[10px] italic">
                          ({blank.hint})
                        </span>
                      </span>
                    );
                  })()}
                </span>
              );
            })}
          </p>
        </div>

        {/* ── Check button ── */}
        <div className="px-4 pb-4 border-t border-heist-red/20 pt-3">
          <button
            onClick={handleCheck}
            disabled={!allFilled || failReason !== null}
            className={`w-full py-2.5 font-bold uppercase tracking-widest text-sm border-2 transition-all duration-200
              ${
                allFilled
                  ? "border-heist-red bg-heist-red/10 text-heist-red hover:bg-heist-red hover:text-black cursor-pointer"
                  : "border-gray-700 text-gray-600 cursor-not-allowed"
              }
            `}
          >
            ▶ Comprobar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeterminantsChallenge;
