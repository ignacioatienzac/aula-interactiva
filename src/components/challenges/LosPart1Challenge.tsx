import { useState, useRef, useEffect } from "react";
import { Part1Sentence, pickPart1 } from "@/data/losUsosDeLoData";

const MAX_STRIKES = 3;

interface Props {
  locationName: string;
  icon: string;
  onComplete: () => void;
  onClose: () => void;
}

interface SlotState {
  /** token currently dropped in this slot, or null */
  filled: string | null;
  /** flash state for feedback */
  flash: "correct" | "wrong" | null;
}

// ─── Drag-token chip ──────────────────────────────────────────────────────────

const TokenChip = ({
  token,
  used,
  onDragStart,
  onTouchStart,
}: {
  token: string;
  used: boolean;
  onDragStart: (t: string, e: React.DragEvent) => void;
  onTouchStart: (t: string, e: React.TouchEvent) => void;
}) => (
  <div
    draggable={!used}
    onDragStart={(e) => !used && onDragStart(token, e)}
    onTouchStart={(e) => !used && onTouchStart(token, e)}
    className={`px-4 py-2 border-2 text-sm font-bold uppercase tracking-wide select-none transition-all duration-150 ${
      used
        ? "border-gray-700 text-gray-700 cursor-default opacity-40"
        : "border-heist-gold text-heist-gold cursor-grab active:cursor-grabbing hover:bg-heist-gold hover:text-black"
    }`}
  >
    {token}
  </div>
);

// ─── Part1Challenge ───────────────────────────────────────────────────────────

const Part1Challenge = ({ locationName, icon, onComplete, onClose }: Props) => {
  const [{ sentences, tokens }] = useState(() => pickPart1());
  const [slots, setSlots] = useState<SlotState[]>(() =>
    Array(5).fill(null).map(() => ({ filled: null, flash: null }))
  );
  const [lives, setLives] = useState(MAX_STRIKES);
  const [checked, setChecked] = useState(false);
  const [allCorrect, setAllCorrect] = useState(false);

  // Tokens used = those currently placed in any slot
  const usedTokens = new Set(slots.map((s) => s.filled).filter(Boolean) as string[]);

  // ── Drag-and-drop (pointer/mouse) ─────────────────────────────────────────

  const dragTokenRef = useRef<string | null>(null);

  const handleDragStart = (token: string, e: React.DragEvent) => {
    dragTokenRef.current = token;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", token);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (slotIndex: number, e: React.DragEvent) => {
    e.preventDefault();
    const token = e.dataTransfer.getData("text/plain") || dragTokenRef.current;
    if (!token) return;
    placeToken(slotIndex, token);
  };

  // ── Touch drag (mobile) ───────────────────────────────────────────────────

  const touchTokenRef = useRef<string | null>(null);
  const ghostRef = useRef<HTMLDivElement | null>(null);

  const handleTouchStart = (token: string, e: React.TouchEvent) => {
    touchTokenRef.current = token;
    // Create a ghost element that follows the finger
    const ghost = document.createElement("div");
    ghost.textContent = token;
    ghost.style.cssText = `
      position: fixed; z-index: 9999; pointer-events: none;
      padding: 8px 16px; font-size: 14px; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.05em;
      border: 2px solid #f5c242; color: #f5c242;
      background: #0d0d0d; opacity: 0.95;
      transform: translate(-50%, -50%);
    `;
    document.body.appendChild(ghost);
    ghostRef.current = ghost;
    moveTouchGhost(e.touches[0].clientX, e.touches[0].clientY);
  };

  const moveTouchGhost = (x: number, y: number) => {
    if (ghostRef.current) {
      ghostRef.current.style.left = `${x}px`;
      ghostRef.current.style.top = `${y}px`;
    }
  };

  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (!touchTokenRef.current) return;
      e.preventDefault();
      moveTouchGhost(e.touches[0].clientX, e.touches[0].clientY);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchTokenRef.current) return;
      const token = touchTokenRef.current;
      touchTokenRef.current = null;

      // Remove ghost
      ghostRef.current?.remove();
      ghostRef.current = null;

      // Find which slot the finger was released over
      const touch = e.changedTouches[0];
      const el = document.elementFromPoint(touch.clientX, touch.clientY);
      const slotEl = el?.closest("[data-slot-index]");
      if (slotEl) {
        const idx = parseInt((slotEl as HTMLElement).dataset.slotIndex ?? "-1");
        if (idx >= 0) placeToken(idx, token);
      }
    };

    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slots]);

  // ── Place & remove tokens ─────────────────────────────────────────────────

  const placeToken = (slotIndex: number, token: string) => {
    if (checked) return;
    setSlots((prev) => {
      const next = prev.map((s) => ({ ...s }));
      // If token already lives in another slot, clear it first
      for (let i = 0; i < next.length; i++) {
        if (next[i].filled === token) next[i].filled = null;
      }
      next[slotIndex].filled = token;
      return next;
    });
  };

  const clearSlot = (slotIndex: number) => {
    if (checked) return;
    setSlots((prev) => {
      const next = prev.map((s) => ({ ...s }));
      next[slotIndex].filled = null;
      return next;
    });
  };

  // ── Check answers ─────────────────────────────────────────────────────────

  const handleCheck = () => {
    if (checked) return;
    const allFilled = slots.every((s) => s.filled !== null);
    if (!allFilled) return;

    let wrongCount = 0;
    const newSlots = slots.map((slot, i) => {
      const correct = slot.filled === sentences[i].correct;
      if (!correct) wrongCount++;
      return { ...slot, flash: correct ? ("correct" as const) : ("wrong" as const) };
    });
    setSlots(newSlots);
    setChecked(true);

    if (wrongCount === 0) {
      setAllCorrect(true);
      setTimeout(onComplete, 1000);
    } else {
      const newLives = lives - wrongCount;
      setLives(Math.max(0, newLives));
      // After 1s, clear wrong slots and let player retry
      setTimeout(() => {
        setSlots((prev) =>
          prev.map((s) => (s.flash === "wrong" ? { filled: null, flash: null } : { ...s, flash: null }))
        );
        setChecked(false);
        if (newLives <= 0) {
          // Redirect to game over — signal parent via onClose (no retry here)
          onClose();
        }
      }, 1200);
    }
  };

  const allFilled = slots.every((s) => s.filled !== null);
  const lifeDisplay = Array.from({ length: MAX_STRIKES }, (_, i) => i < lives);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-heist-bg border-2 border-heist-red shadow-2xl shadow-heist-red/20 overflow-hidden max-h-[95vh] flex flex-col">

        {/* Success overlay */}
        {allCorrect && (
          <div className="absolute inset-0 z-20 bg-black/95 flex flex-col items-center justify-center gap-4">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-heist-green" />
            <p className="text-heist-green text-xs font-bold uppercase tracking-widest">✓ Parte 1 completada</p>
            <h2 className="mission-text text-3xl text-heist-green text-center">¡CORRECTO!</h2>
            <p className="text-gray-500 text-xs uppercase tracking-widest animate-pulse">Pasando a la parte 2...</p>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between bg-heist-red/10 border-b border-heist-red px-4 py-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-lg">{icon}</span>
            <span className="text-heist-red text-xs font-bold uppercase tracking-widest">{locationName}</span>
            <span className="text-gray-600 text-xs uppercase tracking-wider">— Parte 1</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl leading-none transition-colors">✕</button>
        </div>

        {/* Lives */}
        <div className="flex items-center gap-3 px-4 py-2 border-b border-heist-red/20 shrink-0">
          <div className="flex gap-1 text-base">
            {lifeDisplay.map((alive, i) => (
              <span key={i} className={alive ? "opacity-100" : "opacity-25 grayscale"}>❤️</span>
            ))}
          </div>
          <p className="text-gray-500 text-xs uppercase tracking-widest">Arrastra las opciones al hueco correcto</p>
        </div>

        {/* Token bank */}
        <div className="px-4 pt-4 pb-2 shrink-0">
          <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-2">Opciones disponibles</p>
          <div className="flex flex-wrap gap-2">
            {tokens.map((token, i) => (
              <TokenChip
                key={`${token}-${i}`}
                token={token}
                used={usedTokens.has(token)}
                onDragStart={handleDragStart}
                onTouchStart={handleTouchStart}
              />
            ))}
          </div>
        </div>

        {/* Sentences */}
        <div className="overflow-y-auto flex-1 px-4 py-3 flex flex-col gap-4">
          {sentences.map((s: Part1Sentence, i: number) => {
            const slot = slots[i];
            const slotCls = `inline-flex items-center justify-center min-w-[7rem] px-3 py-1 border-b-2 mx-1 text-sm font-bold transition-all duration-200 cursor-pointer select-none ${
              slot.flash === "correct"
                ? "border-heist-green text-heist-green bg-heist-green/10"
                : slot.flash === "wrong"
                ? "border-heist-red text-heist-red bg-heist-red/10 animate-shake"
                : slot.filled
                ? "border-heist-gold text-heist-gold"
                : "border-gray-600 text-gray-500"
            }`;

            return (
              <div key={s.id} className="text-white text-base leading-relaxed flex flex-wrap items-center gap-y-1">
                {s.before && <span className="mr-1">{s.before}</span>}
                <span
                  data-slot-index={i}
                  className={slotCls}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(i, e)}
                  onClick={() => slot.filled && clearSlot(i)}
                  title={slot.filled ? "Clic para quitar" : "Suelta aquí"}
                >
                  {slot.filled ?? "— — —"}
                </span>
                {s.after && <span className="ml-1">{s.after}</span>}
              </div>
            );
          })}
        </div>

        {/* Check button */}
        <div className="px-4 py-4 border-t border-heist-red/20 shrink-0">
          <button
            onClick={handleCheck}
            disabled={!allFilled || checked}
            className={`w-full py-3 font-bold uppercase tracking-widest text-sm border-2 transition-all duration-200 ${
              allFilled && !checked
                ? "border-heist-gold bg-heist-gold/10 text-heist-gold hover:bg-heist-gold hover:text-black cursor-pointer"
                : "border-gray-700 text-gray-600 cursor-not-allowed"
            }`}
          >
            ▶ COMPROBAR
          </button>
        </div>
      </div>
    </div>
  );
};

export default Part1Challenge;
