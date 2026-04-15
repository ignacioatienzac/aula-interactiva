import { useState, useEffect, useRef, useCallback } from "react";
import {
  MorphologyWord,
  MorphemeType,
  MORPHEME_TYPE_LABELS,
  MORPHEME_TYPES,
  pickTwoWords,
  normalizeMorpheme,
} from "@/data/morphologyWords";

const MAX_STRIKES = 3;
const COUNT_OPTIONS = [2, 3, 4, 5];

// ─── Types ────────────────────────────────────────────────────────────────────

type WordPhase = "count" | "morphemes" | "done";

interface MorphemeInput {
  text: string;
  type: MorphemeType | "";
}

interface WordState {
  phase: WordPhase;
  selectedCount: number | null;
  inputs: MorphemeInput[];
  shaking: boolean;
}

const initWordState = (): WordState => ({
  phase: "count",
  selectedCount: null,
  inputs: [],
  shaking: false,
});

// ─── WordPanel ────────────────────────────────────────────────────────────────

interface WordPanelProps {
  word: MorphologyWord;
  state: WordState;
  onCountSelect: (n: number) => void;
  onCheckCount: () => void;
  onInputChange: (idx: number, field: "text" | "type", value: string) => void;
  onCheckMorphemes: () => void;
  disabled: boolean;
}

const WordPanel = ({
  word,
  state,
  onCountSelect,
  onCheckCount,
  onInputChange,
  onCheckMorphemes,
  disabled,
}: WordPanelProps) => {
  const { phase, selectedCount, inputs, shaking } = state;

  const canCheckCount = selectedCount !== null;
  const canCheckMorphemes =
    inputs.length > 0 &&
    inputs.every((inp) => inp.text.trim() !== "" && inp.type !== "");

  return (
    <div
      className={`flex-1 flex flex-col gap-4 p-5 transition-all duration-300 ${
        shaking ? "animate-shake" : ""
      }`}
    >
      {/* Word */}
      <div className="text-center">
        <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">
          Palabra
        </p>
        <p className="mission-text text-4xl sm:text-5xl text-heist-gold break-words">
          {word.word}
        </p>
      </div>

      {/* ── Phase: count ── */}
      {phase === "count" && (
        <div className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-widest text-gray-400 text-center">
            ¿Cuántos morfemas tiene?
          </p>

          <div className="grid grid-cols-4 gap-2">
            {COUNT_OPTIONS.map((n) => (
              <button
                key={n}
                disabled={disabled}
                onClick={() => onCountSelect(n)}
                className={`py-3 text-xl font-bold border-2 transition-all duration-150
                  ${
                    selectedCount === n
                      ? "border-heist-gold bg-heist-gold/20 text-heist-gold"
                      : "border-heist-gold/30 text-heist-gold/50 hover:border-heist-gold hover:text-heist-gold"
                  }
                  disabled:opacity-30 disabled:cursor-not-allowed`}
              >
                {n}
              </button>
            ))}
          </div>

          <button
            disabled={!canCheckCount || disabled}
            onClick={onCheckCount}
            className="w-full py-2 border-2 border-heist-red text-heist-red font-bold uppercase tracking-widest text-sm
              hover:bg-heist-red hover:text-black transition-all duration-200
              disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Comprobar
          </button>
        </div>
      )}

      {/* ── Phase: morphemes ── */}
      {phase === "morphemes" && (
        <div className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-widest text-gray-400 text-center">
            Escribe cada morfema y selecciona su tipo
          </p>

          <div className="flex flex-col gap-2">
            {inputs.map((inp, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-gray-600 text-xs w-4 shrink-0 text-right">
                  {i + 1}.
                </span>
                <input
                  type="text"
                  value={inp.text}
                  onChange={(e) => onInputChange(i, "text", e.target.value)}
                  disabled={disabled}
                  placeholder="morfema"
                  className="flex-1 min-w-0 bg-black/40 border border-heist-gold/40 text-heist-gold px-2 py-1.5 text-sm
                    focus:outline-none focus:border-heist-gold placeholder-gray-700 tracking-wider"
                />
                <select
                  value={inp.type}
                  onChange={(e) => onInputChange(i, "type", e.target.value)}
                  disabled={disabled}
                  className="shrink-0 bg-black border border-heist-gold/40 text-heist-gold px-2 py-1.5 text-xs
                    focus:outline-none focus:border-heist-gold cursor-pointer"
                >
                  <option value="" disabled>
                    Tipo
                  </option>
                  {MORPHEME_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {MORPHEME_TYPE_LABELS[t]}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <button
            disabled={!canCheckMorphemes || disabled}
            onClick={onCheckMorphemes}
            className="w-full py-2 border-2 border-heist-red text-heist-red font-bold uppercase tracking-widest text-sm
              hover:bg-heist-red hover:text-black transition-all duration-200
              disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Comprobar
          </button>
        </div>
      )}

      {/* ── Phase: done ── */}
      {phase === "done" && (
        <div className="flex flex-col items-center justify-center gap-3 py-6">
          <span className="text-5xl">✅</span>
          <p className="text-heist-green font-bold uppercase tracking-widest text-sm">
            ¡Correcto!
          </p>
        </div>
      )}
    </div>
  );
};

// ─── Main component (inner — remounted on retry via key) ─────────────────────

interface InnerProps extends Props {
  onRetry: () => void;
}

const MorphologyChallengeInner = ({
  locationName,
  icon,
  onComplete,
  onClose,
  onRetry,
}: InnerProps) => {
  const [[word0, word1]] = useState<[MorphologyWord, MorphologyWord]>(
    () => pickTwoWords()
  );
  const words = [word0, word1] as const;

  const [wordStates, setWordStates] = useState<[WordState, WordState]>([
    initWordState(),
    initWordState(),
  ]);
  const [lives, setLives] = useState(MAX_STRIKES);
  const [failReason, setFailReason] = useState<"strikes" | null>(null);
  const [flickering, setFlickering] = useState(false);

  // Stable ref so useEffect doesn't need onComplete in deps
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Trigger mission failure with flicker
  const triggerFail = useCallback(() => {
    setFlickering(true);
    setTimeout(() => {
      setFlickering(false);
      setFailReason("strikes");
    }, 500);
  }, []);

  // Shake a specific word panel
  const shakeWord = useCallback((wordIdx: 0 | 1) => {
    setWordStates((prev) => {
      const next: [WordState, WordState] = [{ ...prev[0] }, { ...prev[1] }];
      next[wordIdx] = { ...next[wordIdx], shaking: true };
      return next;
    });
    setTimeout(() => {
      setWordStates((prev) => {
        const next: [WordState, WordState] = [{ ...prev[0] }, { ...prev[1] }];
        next[wordIdx] = { ...next[wordIdx], shaking: false };
        return next;
      });
    }, 500);
  }, []);

  // Lose one life (shared across both words)
  const loseLife = useCallback(
    (wordIdx: 0 | 1) => {
      shakeWord(wordIdx);
      setLives((l) => {
        const next = l - 1;
        if (next <= 0) {
          setTimeout(() => triggerFail(), 300);
        }
        return next;
      });
    },
    [shakeWord, triggerFail]
  );

  // Watch for both words done → complete mission
  const bothDone =
    wordStates[0].phase === "done" && wordStates[1].phase === "done";

  useEffect(() => {
    if (bothDone && failReason === null) {
      const timer = setTimeout(() => onCompleteRef.current(), 700);
      return () => clearTimeout(timer);
    }
  }, [bothDone, failReason]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleCountSelect = (wordIdx: 0 | 1, count: number) => {
    if (wordStates[wordIdx].phase !== "count") return;
    setWordStates((prev) => {
      const next: [WordState, WordState] = [{ ...prev[0] }, { ...prev[1] }];
      next[wordIdx] = { ...next[wordIdx], selectedCount: count };
      return next;
    });
  };

  const handleCheckCount = (wordIdx: 0 | 1) => {
    const ws = wordStates[wordIdx];
    const word = words[wordIdx];
    if (ws.selectedCount === null || ws.phase !== "count") return;

    const validCounts = word.validDecompositions.map(
      (d) => d.morphemes.length
    );
    if (validCounts.includes(ws.selectedCount)) {
      // Correct — build empty inputs for that many morphemes
      const inputs: MorphemeInput[] = Array.from(
        { length: ws.selectedCount },
        () => ({ text: "", type: "" })
      );
      setWordStates((prev) => {
        const next: [WordState, WordState] = [{ ...prev[0] }, { ...prev[1] }];
        next[wordIdx] = { ...next[wordIdx], phase: "morphemes", inputs };
        return next;
      });
    } else {
      loseLife(wordIdx);
    }
  };

  const handleInputChange = (
    wordIdx: 0 | 1,
    morphemeIdx: number,
    field: "text" | "type",
    value: string
  ) => {
    setWordStates((prev) => {
      const next: [WordState, WordState] = [{ ...prev[0] }, { ...prev[1] }];
      const inputs = [...next[wordIdx].inputs];
      inputs[morphemeIdx] = { ...inputs[morphemeIdx], [field]: value };
      next[wordIdx] = { ...next[wordIdx], inputs };
      return next;
    });
  };

  const handleCheckMorphemes = (wordIdx: 0 | 1) => {
    const ws = wordStates[wordIdx];
    const word = words[wordIdx];
    if (ws.phase !== "morphemes") return;

    const matched = word.validDecompositions.find((decomp) => {
      if (decomp.morphemes.length !== ws.selectedCount) return false;
      return decomp.morphemes.every(
        (m, i) =>
          normalizeMorpheme(ws.inputs[i].text) === m.text &&
          ws.inputs[i].type === m.type
      );
    });

    if (matched) {
      setWordStates((prev) => {
        const next: [WordState, WordState] = [{ ...prev[0] }, { ...prev[1] }];
        next[wordIdx] = { ...next[wordIdx], phase: "done" };
        return next;
      });
    } else {
      loseLife(wordIdx);
    }
  };

  const handleRetry = () => {
    onRetry();
  };

  const lifeDisplay = Array.from(
    { length: MAX_STRIKES },
    (_, i) => i < lives
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      {/* Flicker overlay */}
      {flickering && (
        <div className="absolute inset-0 z-10 bg-black animate-flicker pointer-events-none" />
      )}

      <div className="relative w-full max-w-lg sm:max-w-4xl bg-heist-bg border-2 border-heist-red shadow-2xl shadow-heist-red/20 overflow-hidden">
        {/* ── Failure overlay ── */}
        {failReason !== null && (
          <div className="absolute inset-0 z-20 bg-black/95 flex flex-col items-center justify-center gap-4 p-6 overflow-y-auto">
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

            {/* Correct answers */}
            <div className="w-full max-w-lg flex flex-col sm:flex-row gap-4 mt-2">
              {([0, 1] as const).map((wi) => {
                const w = words[wi];
                // Show first valid decomposition as the "model" answer
                const model = w.validDecompositions[0];
                return (
                  <div key={wi} className="flex-1 border border-gray-700 p-3">
                    <p className="text-heist-gold font-bold text-sm mb-2 text-center">{w.word}</p>
                    <div className="flex flex-col gap-1">
                      {model.morphemes.map((m, i) => (
                        <div key={i} className="flex items-center justify-between gap-2 text-xs">
                          <span className="text-white font-mono tracking-widest">-{m.text}-</span>
                          <span className="text-gray-400 uppercase tracking-wider">{MORPHEME_TYPE_LABELS[m.type]}</span>
                        </div>
                      ))}
                    </div>
                    {w.validDecompositions.length > 1 && (
                      <p className="text-gray-600 text-[10px] mt-2 text-center uppercase tracking-wider">
                        +{w.validDecompositions.length - 1} opción{w.validDecompositions.length > 2 ? "es" : ""} válida{w.validDecompositions.length > 2 ? "s" : ""} más
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <p className="text-gray-500 text-xs uppercase tracking-wider mt-2">
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

        {/* ── Lives bar ── */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-heist-red/20">
          <p className="text-gray-500 text-xs uppercase tracking-widest">
            Vidas
          </p>
          <div className="flex gap-1 text-lg">
            {lifeDisplay.map((alive, i) => (
              <span
                key={i}
                className={alive ? "opacity-100" : "opacity-25 grayscale"}
              >
                ❤️
              </span>
            ))}
          </div>
          <p className="text-gray-500 text-xs uppercase tracking-widest">
            Morfología
          </p>
        </div>

        {/* ── Words: 2 columns on desktop, 2 rows on mobile ── */}
        <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-heist-red/20">
          {([0, 1] as const).map((wordIdx) => (
            <WordPanel
              key={wordIdx}
              word={words[wordIdx]}
              state={wordStates[wordIdx]}
              onCountSelect={(n) => handleCountSelect(wordIdx, n)}
              onCheckCount={() => handleCheckCount(wordIdx)}
              onInputChange={(mi, field, val) =>
                handleInputChange(wordIdx, mi, field, val)
              }
              onCheckMorphemes={() => handleCheckMorphemes(wordIdx)}
              disabled={failReason !== null || lives <= 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Public wrapper — remounts inner component on retry for fresh words ───────

interface Props {
  locationName: string;
  icon: string;
  onComplete: () => void;
  onClose: () => void;
}

const MorphologyChallenge = (props: Props) => {
  const [retryKey, setRetryKey] = useState(0);
  return (
    <MorphologyChallengeInner
      key={retryKey}
      {...props}
      onRetry={() => setRetryKey((k) => k + 1)}
    />
  );
};

export default MorphologyChallenge;
