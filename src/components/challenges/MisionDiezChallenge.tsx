import { useState, useRef } from "react";
import { Exercise, normalizeAnswer, pickExercises } from "@/data/misionDiezData";

const MAX_LIVES = 5;
const TOTAL_LEVELS = 3;

type Phase = "answering" | "feedback-correct" | "feedback-wrong";

interface Props {
  locationName: string;
  icon: string;
  onComplete: () => void;
  onClose: () => void;
}

interface InnerProps extends Props {
  excludeIds: number[];
  onRetry: (usedIds: number[]) => void;
}

// ─── Inner component ──────────────────────────────────────────────────────────

const MisionDiezInner = ({
  locationName,
  icon,
  onComplete,
  onClose,
  excludeIds,
  onRetry,
}: InnerProps) => {
  const [exercises] = useState<Exercise[]>(() => pickExercises(excludeIds));
  const [currentLevel, setCurrentLevel] = useState(0); // 0 = Nivel 1, etc.
  const [lives, setLives] = useState(MAX_LIVES);
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<Phase>("answering");
  const [failReason, setFailReason] = useState<"lives" | null>(null);
  const [allDone, setAllDone] = useState(false);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const ex = exercises[currentLevel];

  const handleSubmit = () => {
    if (phase !== "answering" || failReason !== null || allDone) return;
    if (!input.trim()) return;

    const isCorrect = ex.accepted.some(
      (a) => normalizeAnswer(a) === normalizeAnswer(input)
    );

    if (isCorrect) {
      setPhase("feedback-correct");
      setTimeout(() => {
        const next = currentLevel + 1;
        if (next >= TOTAL_LEVELS) {
          setAllDone(true);
          setTimeout(() => onCompleteRef.current(), 1200);
        } else {
          setCurrentLevel(next);
          setInput("");
          setPhase("answering");
        }
      }, 900);
    } else {
      setPhase("feedback-wrong");
      setLives((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          setTimeout(() => setFailReason("lives"), 700);
        } else {
          setTimeout(() => setPhase("answering"), 800);
        }
        return next;
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleRetry = () => onRetry(exercises.map((e) => e.id));

  const lifeDisplay = Array.from({ length: MAX_LIVES }, (_, i) => i < lives);

  const inputCls = `w-full bg-transparent border-b-2 py-2 px-1 text-sm outline-none resize-none placeholder:text-gray-700 transition-all duration-200 ${
    phase === "feedback-correct"
      ? "border-heist-green text-heist-green"
      : phase === "feedback-wrong"
      ? "border-heist-red text-heist-red"
      : "border-heist-gold/60 focus:border-heist-gold text-white"
  }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">

      {/* Failure overlay */}
      {failReason !== null && (
        <div className="absolute inset-0 z-20 bg-heist-bg flex flex-col items-center justify-start gap-4 p-8 overflow-y-auto">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-heist-red" />
          <div className="flex flex-col items-center gap-5 w-full max-w-lg mx-auto mt-4">
            <p className="text-heist-red text-xs font-bold uppercase tracking-widest">⚠ Alerta de seguridad</p>
            <h2 className="mission-text text-4xl text-heist-red text-center">MISIÓN<br />FALLIDA</h2>
            <p className="text-gray-400 text-sm uppercase tracking-widest text-center">💀 Sin vidas</p>
            <div className="w-full border border-gray-700 p-4">
              <p className="text-heist-gold text-xs font-bold uppercase tracking-widest mb-3 text-center">
                Respuesta correcta — Nivel {currentLevel + 1}
              </p>
              <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-2">Frases:</p>
              {ex.sources.map((src, i) => (
                <p key={i} className="text-white/60 text-sm italic mb-1">{src}</p>
              ))}
              <div className="mt-3 flex flex-col gap-2">
                {ex.accepted.map((ans, i) => (
                  <p key={i} className="text-sm">
                    {i > 0 && <span className="text-gray-500 text-xs">o bien: </span>}
                    <span className="text-heist-green font-medium">{ans}</span>
                  </p>
                ))}
              </div>
            </div>
            <p className="text-gray-500 text-xs uppercase tracking-wider mt-1">¿Volver a intentarlo?</p>
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
        </div>
      )}

      <div className="relative w-full max-w-2xl bg-heist-bg border-2 border-heist-red shadow-2xl shadow-heist-red/20 overflow-hidden">

        {/* Success overlay */}
        {allDone && (
          <div className="absolute inset-0 z-20 bg-black/95 flex flex-col items-center justify-center gap-4">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-heist-green" />
            <p className="text-heist-green text-xs font-bold uppercase tracking-widest">✓ Operación completada</p>
            <h2 className="mission-text text-4xl text-heist-green text-center">MISIÓN<br />COMPLETADA</h2>
            <p className="text-gray-500 text-xs uppercase tracking-widest animate-pulse">Avanzando...</p>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between bg-heist-red/10 border-b border-heist-red px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{icon}</span>
            <span className="text-heist-red text-xs font-bold uppercase tracking-widest">{locationName}</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl leading-none transition-colors">✕</button>
        </div>

        {/* Lives + level counter */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-heist-red/20">
          <div className="flex gap-1 text-base">
            {lifeDisplay.map((alive, i) => (
              <span key={i} className={alive ? "opacity-100" : "opacity-25 grayscale"}>❤️</span>
            ))}
          </div>
          <p className="text-gray-400 text-xs uppercase tracking-widest">
            Nivel {currentLevel + 1}/{TOTAL_LEVELS}
          </p>
        </div>

        {/* Progress bar — 3 segments */}
        <div className="flex gap-0.5 px-4 py-2">
          {Array.from({ length: TOTAL_LEVELS }, (_, i) => (
            <div
              key={i}
              className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${
                i < currentLevel
                  ? "bg-heist-green"
                  : i === currentLevel
                  ? "bg-heist-gold"
                  : "bg-gray-700"
              }`}
            />
          ))}
        </div>

        {/* Level label */}
        <div className="px-6 pt-4 pb-1">
          <p className="text-heist-red text-[10px] font-bold uppercase tracking-widest">{ex.levelLabel}</p>
        </div>

        {/* Source sentences */}
        <div className="px-6 pt-2 pb-3">
          <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-2">Combina estas frases:</p>
          <div className="flex flex-col gap-1.5 border-l-2 border-heist-gold/40 pl-3">
            {ex.sources.map((src, i) => (
              <p key={i} className="text-white text-sm leading-relaxed">{src}</p>
            ))}
          </div>
        </div>

        {/* Hint */}
        <div className="px-6 pb-4">
          <p className="text-heist-gold text-xs italic">🔑 {ex.hint}</p>
        </div>

        {/* Text input */}
        <div className="px-6 pb-2">
          <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-2">
            Tu respuesta: <span className="normal-case not-italic text-gray-600">(Enter para enviar)</span>
          </p>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={phase !== "answering" || failReason !== null}
            rows={2}
            placeholder="Escribe tu oración aquí..."
            className={inputCls}
          />
          {phase === "feedback-wrong" && (
            <p className="text-heist-red text-xs mt-1 animate-fade-in">❌ Respuesta incorrecta. Inténtalo de nuevo.</p>
          )}
          {phase === "feedback-correct" && (
            <p className="text-heist-green text-xs mt-1 animate-fade-in">✓ ¡Correcto!</p>
          )}
        </div>

        {/* Submit button */}
        <div className="px-6 pb-6 pt-3">
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || phase !== "answering" || failReason !== null}
            className={`w-full py-3 font-bold uppercase tracking-widest text-sm border-2 transition-all duration-200 ${
              input.trim() && phase === "answering" && failReason === null
                ? "border-heist-gold bg-heist-gold/10 text-heist-gold hover:bg-heist-gold hover:text-black cursor-pointer"
                : "border-gray-700 text-gray-600 cursor-not-allowed"
            }`}
          >
            ▶ ENVIAR
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Public wrapper ───────────────────────────────────────────────────────────

const MisionDiezChallenge = (props: Props) => {
  const [retryKey, setRetryKey] = useState(0);
  const excludeRef = useRef<number[]>([]);

  return (
    <MisionDiezInner
      key={retryKey}
      {...props}
      excludeIds={excludeRef.current}
      onRetry={(usedIds) => {
        excludeRef.current = [...excludeRef.current, ...usedIds];
        setRetryKey((k) => k + 1);
      }}
    />
  );
};

export default MisionDiezChallenge;
