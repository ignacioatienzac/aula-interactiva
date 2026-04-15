import { useState } from "react";
import { Challenge } from "@/data/challenges";
import { useGameContext } from "@/context/GameContext";
import GrammarCategoryChallenge from "@/components/challenges/GrammarCategoryChallenge";
import MorphologyChallenge from "@/components/challenges/MorphologyChallenge";
import DeterminantsChallenge from "@/components/challenges/DeterminantsChallenge";
import NounsChallenge from "@/components/challenges/NounsChallenge";
import AdjectivesChallenge from "@/components/challenges/AdjectivesChallenge";
import VerbsChallenge from "@/components/challenges/VerbsChallenge";
import SerEstarHaberChallenge from "@/components/challenges/SerEstarHaberChallenge";
import LosUsosDeLoChallenge from "@/components/challenges/LosUsosDeLoChallenge";

interface ChallengeModalProps {
  challenge: Challenge;
  onClose: () => void;
}

// ─── Grammar-categories routing ─────────────────────────────────────────────
const GrammarRouter = ({ challenge, onClose }: ChallengeModalProps) => {
  const { completeChallenge, closeModal } = useGameContext();

  const handleComplete = () => {
    completeChallenge(challenge.stopIndex - 1);
  };

  return (
    <GrammarCategoryChallenge
      locationName={challenge.locationName}
      icon={challenge.icon}
      onComplete={handleComplete}
      onClose={() => { closeModal(); onClose(); }}
    />
  );
};

// ─── Text-input routing ──────────────────────────────────────────────────────
const TextInputModal = ({ challenge, onClose }: ChallengeModalProps & { challenge: Extract<Challenge, { type: 'text-input' }> }) => {
  const { state, submitAnswer } = useGameContext();
  const [inputValue, setInputValue] = useState("");

  const isCorrect = state.answerStatus === "correct";
  const isWrong = state.answerStatus === "wrong";

  const handleSubmit = () => {
    if (!inputValue.trim()) return;
    submitAnswer(challenge.stopIndex - 1, inputValue, challenge.correctAnswer);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-heist-bg border-2 border-heist-red shadow-2xl shadow-heist-red/20">
        {/* Header bar */}
        <div className="flex items-center justify-between bg-heist-red/10 border-b border-heist-red px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="text-heist-red text-xs font-bold uppercase tracking-widest">
              ⚠ MISIÓN CLASIFICADA
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl leading-none transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-5">
          {/* Location */}
          <div className="flex items-center gap-3">
            <span className="text-3xl">{challenge.icon}</span>
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-500">Ubicación</p>
              <p className="text-heist-gold font-bold uppercase tracking-wide">
                {challenge.locationName}
              </p>
            </div>
          </div>

          {/* Challenge text */}
          <div className="border border-heist-red/30 bg-heist-red/5 rounded p-4">
            <p className="text-xs uppercase tracking-widest text-heist-red font-bold mb-2">
              Objetivo
            </p>
            <p className="text-gray-200 text-sm leading-relaxed">
              {challenge.challengeText}
            </p>
          </div>

          {/* Answer input */}
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest text-gray-500 font-bold">
              Tu respuesta
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu respuesta..."
              disabled={isCorrect}
              className={`
                w-full bg-transparent border-b-2 text-white py-2 outline-none
                placeholder:text-gray-700 transition-all duration-200 text-sm
                ${isWrong ? "border-heist-red animate-shake" : ""}
                ${isCorrect ? "border-heist-green text-heist-green" : ""}
                ${!isWrong && !isCorrect ? "border-gray-600 focus:border-heist-gold" : ""}
              `}
            />
          </div>

          {/* Status messages */}
          {isCorrect && (
            <div className="text-center text-heist-green font-bold uppercase tracking-wider text-sm animate-fade-in">
              ✅ ¡Correcto! Avanzando...
            </div>
          )}
          {isWrong && (
            <div className="text-center text-heist-red font-bold uppercase tracking-wider text-sm">
              ❌ Incorrecto. Inténtalo de nuevo.
            </div>
          )}

          {/* Submit button */}
          {!isCorrect && (
            <button
              onClick={handleSubmit}
              disabled={!inputValue.trim()}
              className={`
                w-full py-3 font-bold uppercase tracking-widest text-sm border-2 transition-all duration-200
                ${
                  inputValue.trim()
                    ? "border-heist-gold bg-heist-gold/10 text-heist-gold hover:bg-heist-gold hover:text-black cursor-pointer"
                    : "border-gray-700 text-gray-600 cursor-not-allowed"
                }
              `}
            >
              ▶ ENVIAR RESPUESTA
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Morphology routing ──────────────────────────────────────────────────────
const MorphologyRouter = ({ challenge, onClose }: ChallengeModalProps) => {
  const { completeChallenge, closeModal } = useGameContext();

  const handleComplete = () => {
    completeChallenge(challenge.stopIndex - 1);
  };

  return (
    <MorphologyChallenge
      locationName={challenge.locationName}
      icon={challenge.icon}
      onComplete={handleComplete}
      onClose={() => { closeModal(); onClose(); }}
    />
  );
};

// ─── Determinants routing ─────────────────────────────────────────────────────
const DeterminantsRouter = ({ challenge, onClose }: ChallengeModalProps) => {
  const { completeChallenge, closeModal } = useGameContext();

  const handleComplete = () => {
    completeChallenge(challenge.stopIndex - 1);
  };

  return (
    <DeterminantsChallenge
      locationName={challenge.locationName}
      icon={challenge.icon}
      onComplete={handleComplete}
      onClose={() => { closeModal(); onClose(); }}
    />
  );
};

// ─── Nouns routing ──────────────────────────────────────────────────────────
const NounsRouter = ({ challenge, onClose }: ChallengeModalProps) => {
  const { completeChallenge, closeModal } = useGameContext();

  const handleComplete = () => {
    completeChallenge(challenge.stopIndex - 1);
  };

  return (
    <NounsChallenge
      locationName={challenge.locationName}
      icon={challenge.icon}
      onComplete={handleComplete}
      onClose={() => { closeModal(); onClose(); }}
    />
  );
};

// ─── SerEstarHaber routing ────────────────────────────────────────────────────────────────
const SerEstarHaberRouter = ({ challenge, onClose }: ChallengeModalProps) => {
  const { completeChallenge, closeModal } = useGameContext();

  const handleComplete = () => {
    completeChallenge(challenge.stopIndex - 1);
  };

  return (
    <SerEstarHaberChallenge
      locationName={challenge.locationName}
      icon={challenge.icon}
      onComplete={handleComplete}
      onClose={() => { closeModal(); onClose(); }}
    />
  );
};

// ─── Verbs routing ──────────────────────────────────────────────────────────────────────────────────────────────────────────────
const VerbsRouter = ({ challenge, onClose }: ChallengeModalProps) => {
  const { completeChallenge, closeModal } = useGameContext();

  const handleComplete = () => {
    completeChallenge(challenge.stopIndex - 1);
  };

  return (
    <VerbsChallenge
      locationName={challenge.locationName}
      icon={challenge.icon}
      onComplete={handleComplete}
      onClose={() => { closeModal(); onClose(); }}
    />
  );
};

// ─── Adjectives routing ──────────────────────────────────────────────────────
const AdjectivesRouter = ({ challenge, onClose }: ChallengeModalProps) => {
  const { completeChallenge, closeModal } = useGameContext();

  const handleComplete = () => {
    completeChallenge(challenge.stopIndex - 1);
  };

  return (
    <AdjectivesChallenge
      locationName={challenge.locationName}
      icon={challenge.icon}
      onComplete={handleComplete}
      onClose={() => { closeModal(); onClose(); }}
    />
  );
};

// ─── LosUsosDeLo routing ────────────────────────────────────────────────
const LosUsosDeLoRouter = ({ challenge, onClose }: ChallengeModalProps) => {
  const { completeChallenge, closeModal } = useGameContext();
  const handleComplete = () => { completeChallenge(challenge.stopIndex - 1); };
  return (
    <LosUsosDeLoChallenge
      locationName={challenge.locationName}
      icon={challenge.icon}
      onComplete={handleComplete}
      onClose={() => { closeModal(); onClose(); }}
    />
  );
};

// ─── Main router component ────────────────────────────────────────────────────
const ChallengeModal = ({ challenge, onClose }: ChallengeModalProps) => {
  if (challenge.type === "grammar-categories") {
    return <GrammarRouter challenge={challenge} onClose={onClose} />;
  }
  if (challenge.type === "morphology") {
    return <MorphologyRouter challenge={challenge} onClose={onClose} />;
  }
  if (challenge.type === "determinants") {
    return <DeterminantsRouter challenge={challenge} onClose={onClose} />;
  }
  if (challenge.type === "nouns") {
    return <NounsRouter challenge={challenge} onClose={onClose} />;
  }
  if (challenge.type === "adjectives") {
    return <AdjectivesRouter challenge={challenge} onClose={onClose} />;
  }
  if (challenge.type === "verbs") {
    return <VerbsRouter challenge={challenge} onClose={onClose} />;
  }
  if (challenge.type === "ser-estar-haber") {
    return <SerEstarHaberRouter challenge={challenge} onClose={onClose} />;
  }
  if (challenge.type === "los-usos-de-lo") {
    return <LosUsosDeLoRouter challenge={challenge} onClose={onClose} />;
  }
  return <TextInputModal challenge={challenge} onClose={onClose} />;
};

export default ChallengeModal;
