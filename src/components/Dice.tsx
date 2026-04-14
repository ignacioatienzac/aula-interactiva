import { useState } from "react";

interface DiceProps {
  onRoll: (value: number) => void;
  disabled: boolean;
}

const dotPositions: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [[25, 25], [75, 75]],
  3: [[25, 25], [50, 50], [75, 75]],
  4: [[25, 25], [75, 25], [25, 75], [75, 75]],
  5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
  6: [[25, 25], [75, 25], [25, 50], [75, 50], [25, 75], [75, 75]],
};

const Dice = ({ onRoll, disabled }: DiceProps) => {
  const [value, setValue] = useState(1);
  const [rolling, setRolling] = useState(false);

  const roll = () => {
    if (disabled || rolling) return;
    setRolling(true);

    let count = 0;
    const interval = setInterval(() => {
      setValue(Math.floor(Math.random() * 6) + 1);
      count++;
      if (count > 10) {
        clearInterval(interval);
        const result = Math.floor(Math.random() * 6) + 1;
        setValue(result);
        setRolling(false);
        onRoll(result);
      }
    }, 80);
  };

  const dots = dotPositions[value] || [];

  return (
    <button
      onClick={roll}
      disabled={disabled || rolling}
      className={`relative w-20 h-20 rounded-lg bg-foreground shadow-lg cursor-pointer transition-transform
        ${rolling ? "animate-bounce" : "hover:scale-110"}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {dots.map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="9" fill="hsl(var(--background))" />
        ))}
      </svg>
    </button>
  );
};

export default Dice;
