interface LocationStopProps {
  index: number;
  label: string;
  icon: string;
  sublabel: string;
  isStart: boolean;
  isEnd: boolean;
  status: "completed" | "active" | "locked";
  onClick?: () => void;
}

const LocationStop = ({
  index,
  label,
  icon,
  sublabel,
  isStart,
  isEnd,
  status,
  onClick,
}: LocationStopProps) => {
  const isClickable = status === "active";

  const circleSize = isStart || isEnd ? "w-16 h-16 text-3xl" : "w-12 h-12 text-xl";

  const circleStyle = {
    completed: "bg-heist-green/20 border-heist-green text-heist-green",
    active: "bg-heist-gold/20 border-heist-gold text-heist-gold animate-pulse cursor-pointer hover:bg-heist-gold/30",
    locked: "bg-gray-800 border-gray-700 text-gray-600 opacity-50",
  }[status];

  const labelStyle = {
    completed: "text-heist-green",
    active: "text-heist-gold",
    locked: "text-gray-600",
  }[status];

  return (
    <div
      className={`flex flex-col items-center gap-1 group ${isClickable ? "cursor-pointer" : ""}`}
      onClick={isClickable ? onClick : undefined}
      title={label}
    >
      <div className={`relative rounded-full border-2 flex items-center justify-center transition-all duration-300 ${circleSize} ${circleStyle}`}>
        {status === "locked" ? (
          <span>🔒</span>
        ) : (
          <span>{icon}</span>
        )}

        {/* Index badge for non-start/end */}
        {!isStart && !isEnd && (
          <span
            className={`absolute -top-2 -right-2 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center border
              ${status === "completed" ? "bg-heist-green text-black border-heist-green" : ""}
              ${status === "active" ? "bg-heist-gold text-black border-heist-gold" : ""}
              ${status === "locked" ? "bg-gray-700 text-gray-500 border-gray-600" : ""}
            `}
          >
            {status === "completed" ? "✓" : index}
          </span>
        )}

        {/* Active pulse ring */}
        {status === "active" && (
          <span className="absolute inset-0 rounded-full border-2 border-heist-gold animate-ping opacity-40" />
        )}
      </div>

      {/* Label */}
      <div className="text-center max-w-[80px]">
        <p className={`text-[10px] font-bold uppercase tracking-wide leading-tight ${labelStyle}`}>
          {label}
        </p>
        {status === "active" && (
          <p className="text-[9px] text-heist-red uppercase tracking-widest font-bold mt-0.5">
            OBJETIVO
          </p>
        )}
      </div>
    </div>
  );
};

export default LocationStop;
