import { useState, useRef } from "react";
import {
  Part2Sentence,
  LoType,
  PART2_COUNT,
  pickPart2,
} from "@/data/losUsosDeLoData";

const MAX_STRIKES = 3;

/** Split text on the first standalone «lo»/«Lo» and wrap it in bold gold. */
function renderBoldLo(text: string): React.ReactNode {
  const match = text.match(/\blo\b/i);
  if (!match || match.index === undefined) return text;
  const before = text.slice(0, match.index);
  const lo = match[0];
  const after = text.slice(match.index + lo.length);
  return (
    <>
      {before}
      <strong className="font-extrabold text-heist-gold">{lo}</strong>
      {after}
    </>
  );
}

interface Props {
  locationName: string;
  icon: string;
  onComplete: () => void;
  onClose: () => void;
}

type Phase = "answering" | "feedback-correct" | "feedback-wrong";

interface FailEntry {
  sentence: Part2Sentence;
  given: LoType;
}

// ─── Part2Challenge ───────────────────────────────────────────────────────────

const Part2Challenge = ({ locationName, icon, onComplete, onClose }: Props) => {
  const [questions] = useState<Part2Sentence[]>(() => pickPart2());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lives, setLives] = useState(MAX_STRIKES);
  const [phase, setPhase] = useState<Phase>("answering");
  const [failReason, setFailReason] = useState<"strikes" | null>(null);
  const [failInfo, setFailInfo] = useState<FailEntry[]>([]);
  const failInfoRef = useRef<FailEntry[]>([]);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const triggerFail = () => {
    setFailInfo([...failInfoRef.current]);
    setFailReason("strikes");
  };

  const handleAnswer = (option: LoType) => {
    if (phase !== "answering" || failReason !== null) return;
    const q = questions[currentIndex];
    const correct = option === q.correct;

    if (correct) {
      setPhase("feedback-correct");
      setTimeout(() => {
        const next = currentIndex + 1;
        if (next >= PART2_COUNT) {
          setTimeout(() => onCompleteRef.current(), 400);
        }
        setCurrentIndex(next);
        setPhase("answering");
      }, 600);
    } else {
      setPhase("feedback-wrong");
      failInfoRef.current = [...failInfoRef.current, { sentence: q, given: option }];
      setLives((l) => {
        const next = l - 1;
        if (next <= 0) setTimeout(triggerFail, 400);
        return next;
      });
      setTimeout(() => {
        setPhase("answering");
      }, 700);
    }
  };

  const lifeDisplay = Array.from({ length: MAX_STRIKES }, (_, i) => i < lives);
  const currentQ = questions[currentIndex] ?? null;

  const btnCls = (option: LoType, label: string) => {
    const base = "flex-1 py-3 px-4 text-sm font-bold uppercase tracking-wide border-2 transition-all duration-150 disabled:cursor-not-allowed";
    if (phase === "feedback-correct" && option === currentQ?.correct)
      return `${base} border-heist-green bg-heist-green/20 text-heist-green`;
    if (phase === "feedback-wrong" && option !== currentQ?.correct && label === option)
      return `${base} border-heist-red bg-heist-red/20 text-heist-red animate-shake`;
    return `${base} border-heist-gold/60 text-heist-gold hover:bg-heist-gold hover:text-black hover:border-heist-gold`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      {/* Failure overlay */}
      {failReason !== null && (
        <div className="absolute inset-0 z-20 bg-heist-bg flex flex-col items-center justify-start gap-4 p-8 overflow-y-auto">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-heist-red" />
          <div className="flex flex-col items-center gap-4 w-full max-w-lg mx-auto mt-4">
            <p className="text-heist-red text-xs font-bold uppercase tracking-widest">⚠ Alerta de seguridad</p>
            <h2 className="mission-text text-4xl text-heist-red text-center">MISIÓN<br />FALLIDA</h2>
            <p className="text-gray-400 text-sm uppercase tracking-widest text-center">💀 Demasiados errores</p>
            {failInfo.length > 0 && (
              <div className="w-full border border-gray-700 p-4 overflow-y-auto" style={{ maxHeight: "50vh" }}>
                <p className="text-heist-gold text-xs font-bold uppercase tracking-widest mb-3 text-center">Tus errores</p>
                <div className="flex flex-col gap-4">
                  {failInfo.map((entry, i) => (
                    <div key={i} className="border-b border-gray-800 pb-3">
                      <p className="text-white/70 italic mb-2 text-sm leading-snug">{renderBoldLo(entry.sentence.text)}</p>
                      <div className="flex items-center gap-3 pl-1 text-sm">
                        <span className="text-heist-red line-through">
                          {entry.given === "pronombre" ? "Pronombre de OD" : "Artículo neutro"}
                        </span>
                        <span className="text-gray-500">→</span>
                        <span className="text-heist-green font-bold">
                          {entry.sentence.correct === "pronombre" ? "Pronombre de OD" : "Artículo neutro"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <p className="text-gray-500 text-xs uppercase tracking-wider mt-2">La misión ha terminado.</p>
            <button onClick={onClose} className="px-8 py-3 border-2 border-gray-600 text-gray-400 font-bold uppercase tracking-widest text-sm hover:border-gray-400 hover:text-white transition-all duration-200">
              CERRAR
            </button>
          </div>
        </div>
      )}

      <div className="relative w-full max-w-lg sm:max-w-2xl bg-heist-bg border-2 border-heist-red shadow-2xl shadow-heist-red/20 overflow-hidden">

        {/* Success overlay */}
        {currentIndex >= PART2_COUNT && !failReason && (
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
            <span className="text-gray-600 text-xs uppercase tracking-wider">— Parte 2</span>
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
          <p className="text-gray-400 text-xs uppercase tracking-widest">
            {Math.min(currentIndex, PART2_COUNT)}/{PART2_COUNT}
          </p>
        </div>

        {/* Progress bar */}
        <div className="flex gap-0.5 px-4 py-2">
          {Array.from({ length: PART2_COUNT }, (_, i) => (
            <div key={i} className={`flex-1 h-1 rounded-full transition-all duration-300 ${i < currentIndex ? "bg-heist-green" : "bg-gray-700"}`} />
          ))}
        </div>

        {/* Instruction */}
        <p className="text-gray-500 text-[11px] uppercase tracking-widest text-center px-4 pt-3">
          ¿El «lo» subrayado es pronombre de OD o artículo neutro?
        </p>

        {/* Sentence */}
        <div className="flex items-center justify-center px-6 py-6 min-h-[120px]">
          {currentQ && (
            <p className="text-white text-lg sm:text-xl text-center leading-relaxed font-medium">
              {renderBoldLo(currentQ.text)}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="px-4 pb-6 flex flex-col gap-2 sm:flex-row sm:gap-3">
          {(["pronombre", "articulo"] as LoType[]).map((opt) => (
            <button
              key={opt}
              onClick={() => handleAnswer(opt)}
              disabled={phase !== "answering" || failReason !== null}
              className={btnCls(opt, opt)}
            >
              {opt === "pronombre" ? "Pronombre de OD" : "Artículo neutro"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Part2Challenge;
