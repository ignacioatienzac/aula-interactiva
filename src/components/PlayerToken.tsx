interface PlayerTokenProps {
  playerIndex: number;
  name: string;
  size?: "sm" | "md";
}

const colorClasses = [
  "bg-player-1",
  "bg-player-2",
  "bg-player-3",
  "bg-player-4",
];

const emojis = ["🎒", "📚", "✏️", "📐"];

const PlayerToken = ({ playerIndex, name, size = "md" }: PlayerTokenProps) => {
  const sizeClass = size === "sm" ? "w-7 h-7 text-sm" : "w-10 h-10 text-lg";

  return (
    <div
      className={`${sizeClass} ${colorClasses[playerIndex]} rounded-full flex items-center justify-center 
        shadow-md border-2 border-foreground/20 transition-all duration-300`}
      title={name}
    >
      {emojis[playerIndex]}
    </div>
  );
};

export default PlayerToken;
