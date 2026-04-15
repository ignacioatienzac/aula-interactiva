import { useState } from "react";
import LosPart1Challenge from "./LosPart1Challenge";
import LosPart2Challenge from "./LosPart2Challenge";

type Stage = "part1" | "transition" | "part2";

interface Props {
  locationName: string;
  icon: string;
  onComplete: () => void;
  onClose: () => void;
}

const LosUsosDeLoChallenge = ({ locationName, icon, onComplete, onClose }: Props) => {
  const [stage, setStage] = useState<Stage>("part1");

  const handlePart1Complete = () => {
    setStage("transition");
    setTimeout(() => setStage("part2"), 2200);
  };

  if (stage === "part1") {
    return (
      <LosPart1Challenge
        locationName={locationName}
        icon={icon}
        onComplete={handlePart1Complete}
        onClose={onClose}
      />
    );
  }

  if (stage === "transition") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-6 text-center px-6">
          <div className="w-16 h-0.5 bg-heist-gold mx-auto" />
          <p className="text-heist-gold text-xs font-bold uppercase tracking-widest">Parte 1 superada</p>
          <h2 className="mission-text text-4xl text-white">PARTE 2</h2>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
            Ahora decide si el «<span className="text-heist-gold font-bold">lo</span>» de cada frase es un <strong className="text-white">pronombre de OD</strong> o un <strong className="text-white">artículo neutro</strong>.
          </p>
          <p className="text-gray-600 text-xs uppercase tracking-widest animate-pulse">Preparando...</p>
          <div className="w-16 h-0.5 bg-heist-gold mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <LosPart2Challenge
      locationName={locationName}
      icon={icon}
      onComplete={onComplete}
      onClose={onClose}
    />
  );
};

export default LosUsosDeLoChallenge;
