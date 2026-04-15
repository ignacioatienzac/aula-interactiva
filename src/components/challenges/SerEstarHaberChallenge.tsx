import { useState, useEffect, useRef, useCallback } from "react";
import {
  SerEstarHaberQuestion,
  TOTAL_TIME,
  QUESTION_COUNT,
  pickSEHQuestions,
} from "@/data/serEstarHaberData";

const MAX_STRIKES = 3;

type FailReason = "time" | "strikes";
type Phase = "answering" | "feedback-correct" | "feedback-wrong";

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

const pad = (n: number) => String(n).padStart(2, "0");
const formatTime = (s: number) => `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;

function renderWithBlanks(
  segments: string[],
  filledWith: string | null,
  phase: Phase
) {
  const slotCls = `inline-block mx-1 px-2 py-0.5 font-extrabold border-b-2 min-w-[3rem] text-center leading-tight transition-colors duration-200 ${
    filledWith && phase === "feedback-correct"
      ? "text-heist-green border-heist-green"
      : filledWith && phase === "feedback-wrong"
      ? "text-heist-red border-heist-red"
      : "text-heist-gold border-heist-gold/60"
  }`;

  if (segments.length === 2) {
    return (
      <>
        {segments[0]}
        <span className={slotCls}>{filledWith ?? "___"}</span>
        {segments[1]}
      </>
    );
  }
  const parts = filledWith ? filledWith.split(" / ") : ["___", "___"];
  return (
    <>
      {segments[0]}
      <span className={slotCls}>{parts[0]}</span>
      {segments[1]}
      <span className={slotCls}>{parts[1] ?? "___"}</span>
      {segments[2]}
    </>
  );
}

const SerEstarHaberInner = ({
  locationName,
  icon,
  onComplete,
  onClose,
  excludeIds,
  onRetry,
}: InnerProps) => {
  const [questions] = useState<SerEstarHaberQuestion[]>(() => pickSEHQuestions(excludeIds));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lives, setLives] = useState(MAX_STRIKES);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [phase, setPhase] = useState<Phase>("answering");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [failReason, setFailReason] = useState<FailReason | null>(null);
  const [failInfo, setFailInfo] = useState<FailEntry[]>([]);
  const [flickering, setFlickering] = useState(false);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const failInfoRef = useRef<FailEntry[]>([]);

  const triggerFail = useCallback((reason: FailReason) => {
    setFlickering(true);
    setTimeout(() => {
      setFlickering(false);
      setFailInfo([...failInfoRef.current]);
      setFailReason(reason);
    }, 500);
  }, []);

  useEffect(() => {
    if (failReason !== null || phase !== "answering") return;
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
  }, [failReason, phase, triggerFail]);

  const handleAnswer = (option: string) => {
    if (phase !== "answering" || failReason !== null) return;
    setSelectedOption(option);
    const q = questions[currentIndex];
    const correct = option === q.correct;

    if (correct) {
      setPhase("feedback-correct");
      setTimeout(() => {
        const next = currentIndex + 1;
        if (next >= QUESTION_COUNT) {
          setTimeout(() => onCompleteRef.current(), 400);
        }
        setCurrentIndex(next);
        setSelectedOption(null);
        setPhase("answering");
      }, 600);
    } else {
      setPhase("feedback-wrong");
      failInfoRef.current = [...failInfoRef.current, { question: q, given: option }];
      setLives((l) => {
        const next = l - 1;
        if (next <= 0) {
          setTimeout(() => triggerFail("strikes"), 400);
        }
        return next;
      });
      setTimeout(() => {
        setSelectedOption(null);
        setPhase("answering");
      }, 700);
    }
  };

  const handleRetry = () => onRetry(questions.map((q) => q.id));

  const lifeDisplay = Array.from({ length: MAX_STRIKES }, (_, i) => i < lives);
  const timeRatio = timeLeft / TOTAL_TIME;
  const timerColor = timeRatio > 0.5 ? "text-gray-300" : timeRatio > 0.25 ? "text-orange-400" : "text-heist-red";
  const currentQ = questions[currentIndex] ?? null;

  const optionBtnCls = (opt: string) => {
    const base = "flex-1 py-3 px-4 text-sm font-bold uppercase tracking-wide border-2 transition-all duration-150 disabled:cursor-not-allowed";
    if (phase === "feedback-correct" && opt === selectedOption)
      return `${base} border-heist-green bg-heist-green/20 text-heist-green`;
    if (phase === "feedback-wrong" && opt === selectedOption)
      return `${base} border-heist-red bg-heist-red/20 text-heist-red animate-shake`;
    return `${base} border-heist-gold/60 text-heist-gold hover:bg-heist-gold hover:text-black hover:border-heist-gold`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      {flickering && (
        <div className="absolute inset-0 z-10 bg-black animate-flicker pointer-events-none" />
      )}

      <div className="relative w-full max-w-lg sm:max-w-2xl bg-heist-bg border-2 border-heist-red shadow-2xl shadow-heist-red/20 overflow-hidden">

        {/* Success overlay */}
        {currentIndex >= QUESTION_COUNT && !failReason && (
          <div className="absolute inset-0 z-20 bg-black/95 flex flex-col items-center justify-center gap-4">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-heist-green" />
            <p className="text-heist-green text-xs font-bold uppercase tracking-widest">✓ Operación completada</p>
            <h2 className="mission-text text-4xl text-heist-green text-center">MISIÓN<br />COMPLETADA</h2>
            <p className="text-gray-500 text-xs uppercase tracking-widest animate-pulse">Avanzando...</p>
          </div>
        )}

        {/* Failure overlay */}
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
                  <div className="w-full max-w-md border border-gray-700 p-3 max-h-52 overflow-y-auto">
                    <p className="text-heist-gold text-xs font-bold uppercase tracking-widest mb-3 text-center">Tus errores</p>
                    <div className="flex flex-col gap-3">
                      {failInfo.map((entry, i) => (
                        <div key={i} className="text-xs border-b border-gray-800 pb-2">
                          <p className="text-white/70 italic mb-1 text-[11px] leading-snug">
                            {entry.question.segments.join("___")}
                          </p>
                          <div className="flex items-center gap-2 pl-1">
                            <span className="text-heist-red line-through">{entry.given}</span>
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
            <p className="text-gray-500 text-xs uppercase tracking-wider mt-1">¿Volver a intentarlo?</p>
            <div className="flex gap-4">
              <button onClick={handleRetry} className="px-8 py-3 border-2 border-heist-red text-heist-red font-bold uppercase tracking-widest text-sm hover:bg-heist-red hover:text-black transition-all duration-200">SÍ</button>
              <button onClick={onClose} className="px-8 py-3 border-2 border-gray-600 text-gray-400 font-bold uppercase tracking-widest text-sm hover:border-gray-400 hover:text-white transition-all duration-200">NO</button>
            </div>
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

        {/* Status bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-heist-red/20">
          <div className="flex gap-1 text-lg">
            {lifeDisplay.map((alive, i) => (
              <span key={i} className={alive ? "opacity-100" : "opacity-25 grayscale"}>❤️</span>
            ))}
          </div>
          <span className={`font-mono font-bold text-xl ${timerColor} ${timeLeft <= 15 ? "animate-pulse" : ""}`}>
            {formatTime(timeLeft)}
          </span>
          <p className="text-gray-400 text-xs uppercase tracking-widest">
            {Math.min(currentIndex, QUESTION_COUNT)}/{QUESTION_COUNT}
          </p>
        </div>

        {/* Progress bar */}
        <div className="flex gap-0.5 px-4 py-2">
          {Array.from({ length: QUESTION_COUNT }, (_, i) => (
            <div key={i} className={`flex-1 h-1 rounded-full transition-all duration-300 ${i < currentIndex ? "bg-heist-green" : "bg-gray-700"}`} />
          ))}
        </div>

        {/* Sentence */}
        <div className="flex items-center justify-center px-6 py-8 min-h-[140px]">
          {currentQ && (
            <p className="text-white text-xl sm:text-2xl text-center leading-loose font-medium">
              {renderWithBlanks(currentQ.segments, selectedOption, phase)}
            </p>
          )}
        </div>

        {/* Option buttons */}
        <div className="px-4 pb-6 flex flex-col gap-2 sm:flex-row sm:gap-3">
          {currentQ?.options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleAnswer(opt)}
              disabled={phase !== "answering" || failReason !== null}
              className={optionBtnCls(opt)}
            >
              {opt}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};

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
