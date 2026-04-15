import { useState, useEffect, useCallback } from "react";
import { CATEGORY_LABELS, GrammarCategory, pickRandomWords, WordEntry } from "@/data/grammarWords";

const TOTAL_WORDS = 15;
const TOTAL_TIME = 90;
const MAX_STRIKES = 3;

const CATEGORY_ORDER: GrammarCategory[] = [
  "sustantivo",
  "adjetivo",
  "adverbio",
  "pronombre",
  "determinante",
  "verbo",
  "preposición",
  "conjunción",
];

interface Props {
  locationName: string;
  icon: string;
  onComplete: () => void;
  onClose: () => void;
}

type FailReason = "time" | "strikes";

const GrammarCategoryChallenge = ({ locationName, icon, onComplete, onClose }: Props) => {
  const [words] = useState<WordEntry[]>(() => pickRandomWords(TOTAL_WORDS));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [wrongCount, setWrongCount] = useState(0);
  const [failReason, setFailReason] = useState<FailReason | null>(null);
  const [shaking, setShaking] = useState(false);
  const [flickering, setFlickering] = useState(false);

  const triggerFail = useCallback((reason: FailReason) => {
    setFlickering(true);
    setTimeout(() => {
      setFlickering(false);
      setFailReason(reason);
    }, 500);
  }, []);

  // Timer
  useEffect(() => {
    if (failReason !== null || currentIndex >= TOTAL_WORDS) return;

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
  }, [failReason, currentIndex, triggerFail]);

  const handleAnswer = (category: GrammarCategory) => {
    if (failReason !== null) return;

    const currentWord = words[currentIndex];
    if (category === currentWord.category) {
      // Correct
      const next = currentIndex + 1;
      setCurrentIndex(next);
      if (next >= TOTAL_WORDS) {
        // All done — small delay so the last word is visible
        setTimeout(() => onComplete(), 400);
      }
    } else {
      // Wrong
      const newCount = wrongCount + 1;
      setShaking(true);
      setTimeout(() => setShaking(false), 500);

      if (newCount >= MAX_STRIKES) {
        setWrongCount(newCount);
        setTimeout(() => triggerFail("strikes"), 300);
      } else {
        setWrongCount(newCount);
      }
    }
  };

  const handleRetry = () => {
    // Full reset with new random words — we can't re-shuffle words state since it's const,
    // so we reload by resetting index and counters; words stay the same batch this attempt.
    // For truly new words we remount the component via a key prop (handled in parent if needed).
    setCurrentIndex(0);
    setTimeLeft(TOTAL_TIME);
    setWrongCount(0);
    setFailReason(null);
    setShaking(false);
    setFlickering(false);
  };

  const currentWord = words[currentIndex] ?? null;
  const isLow = timeLeft <= 10;

  // Render lives
  const lives = Array.from({ length: MAX_STRIKES }, (_, i) => i < MAX_STRIKES - wrongCount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      {/* Flicker overlay */}
      {flickering && (
        <div className="absolute inset-0 z-10 bg-black animate-flicker pointer-events-none" />
      )}

      <div className="relative w-full max-w-lg sm:max-w-4xl bg-heist-bg border-2 border-heist-red shadow-2xl shadow-heist-red/20 overflow-hidden">

        {/* Failure overlay */}
        {failReason !== null && (
          <div className="absolute inset-0 z-20 bg-black/95 flex flex-col items-center justify-center gap-6 p-6">
            {/* Scanner line */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-heist-red animate-scanner" />

            <p className="text-heist-red text-xs font-bold uppercase tracking-widest">
              ⚠ Alerta de seguridad
            </p>
            <h2 className="mission-text text-4xl text-heist-red text-center">
              MISIÓN<br />FALLIDA
            </h2>
            <p className="text-gray-400 text-sm uppercase tracking-widest text-center">
              {failReason === "time" ? "⏱ Tiempo agotado" : "💀 Demasiados errores"}
            </p>
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

        {/* Header */}
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

        {/* Status bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-heist-red/20">
          {/* Timer */}
          <div className={`flex items-center gap-1.5 font-bold tabular-nums transition-colors duration-300 ${isLow ? "text-heist-red animate-pulse" : "text-gray-300"}`}>
            <span>🕐</span>
            <span className="text-lg">{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}</span>
          </div>

          {/* Lives */}
          <div className="flex gap-1 text-lg">
            {lives.map((alive, i) => (
              <span key={i} className={alive ? "opacity-100" : "opacity-25 grayscale"}>
                ❤️
              </span>
            ))}
          </div>

          {/* Progress */}
          <p className="text-gray-400 text-xs uppercase tracking-widest">
            {Math.min(currentIndex, TOTAL_WORDS)}/{TOTAL_WORDS}
          </p>
        </div>

        {/* Progress bar */}
        <div className="flex gap-0.5 px-4 py-2">
          {Array.from({ length: TOTAL_WORDS }, (_, i) => (
            <div
              key={i}
              className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                i < currentIndex ? "bg-heist-green" : "bg-gray-700"
              }`}
            />
          ))}
        </div>

        {/* Word display */}
        <div className="flex items-center justify-center px-4 py-8">
          {currentWord && (
            <p className="mission-text text-5xl text-heist-gold text-center">
              {currentWord.word}
            </p>
          )}
        </div>

        {/* Category buttons: 2 rows × 4 */}
        <div className="px-4 pb-5 flex flex-col gap-2">
          {[CATEGORY_ORDER.slice(0, 4), CATEGORY_ORDER.slice(4)].map((row, rowIdx) => (
            <div key={rowIdx} className="grid grid-cols-4 gap-2">
              {row.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleAnswer(cat)}
                  disabled={failReason !== null || currentIndex >= TOTAL_WORDS}
                  className={`
                    py-2 px-1 text-xs font-bold uppercase tracking-wide border-2 transition-all duration-150
                    ${shaking ? "animate-shake border-heist-red text-heist-red" : "border-heist-gold/60 text-heist-gold hover:bg-heist-gold hover:text-black hover:border-heist-gold"}
                    disabled:opacity-30 disabled:cursor-not-allowed
                  `}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default GrammarCategoryChallenge;
