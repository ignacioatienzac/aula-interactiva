import { AVATARS } from "@/context/GameContext";

interface AvatarSelectorProps {
  selected: number;
  onSelect: (index: number) => void;
}

const AvatarSelector = ({ selected, onSelect }: AvatarSelectorProps) => {
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-xs uppercase tracking-widest text-heist-red font-bold">
        Elige tu disfraz
      </p>
      <div className="flex gap-3 flex-wrap justify-center">
        {AVATARS.map((avatar, index) => (
          <button
            key={index}
            onClick={() => onSelect(index)}
            title={avatar.label}
            className={`
              relative w-14 h-14 rounded-full flex items-center justify-center text-2xl
              border-2 transition-all duration-200
              ${avatar.color}
              ${
                selected === index
                  ? "border-heist-gold scale-110 shadow-lg shadow-heist-gold/40 animate-pulse"
                  : "border-transparent opacity-60 hover:opacity-90 hover:scale-105"
              }
            `}
          >
            {avatar.emoji}
            {selected === index && (
              <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-heist-gold font-bold uppercase tracking-wider whitespace-nowrap">
                {avatar.label}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AvatarSelector;
