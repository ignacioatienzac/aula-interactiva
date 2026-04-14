import PlayerToken from "./PlayerToken";

interface BoardSquareProps {
  index: number;
  label: string;
  isStart: boolean;
  isEnd: boolean;
  isActive: boolean;
  playersHere: { index: number; name: string }[];
}

const BoardSquare = ({ index, label, isStart, isEnd, isActive, playersHere }: BoardSquareProps) => {
  return (
    <div
      className={`relative rounded-lg border-2 p-2 flex flex-col items-center justify-between min-h-[90px] transition-all duration-300
        ${isStart ? "bg-primary/30 border-primary" : ""}
        ${isEnd ? "bg-accent/30 border-accent" : ""}
        ${!isStart && !isEnd && isActive ? "bg-desk-active/30 border-desk-active shadow-lg shadow-desk-active/20" : ""}
        ${!isStart && !isEnd && !isActive ? "bg-desk/20 border-border opacity-60" : ""}
        ${isActive ? "scale-105" : ""}
      `}
    >
      <span className="text-[10px] text-muted-foreground font-mono absolute top-1 left-2">
        {index + 1}
      </span>

      <div className="mt-3 text-center">
        {isStart && <span className="text-xl">🚪</span>}
        {isEnd && <span className="text-xl">😴</span>}
        {!isStart && !isEnd && <span className="text-xs">🪑</span>}
      </div>

      <span className="text-[10px] text-chalk font-medium text-center leading-tight">
        {label}
      </span>

      {playersHere.length > 0 && (
        <div className="flex gap-1 flex-wrap justify-center mt-1">
          {playersHere.map((p) => (
            <PlayerToken key={p.index} playerIndex={p.index} name={p.name} size="sm" />
          ))}
        </div>
      )}
    </div>
  );
};

export default BoardSquare;
