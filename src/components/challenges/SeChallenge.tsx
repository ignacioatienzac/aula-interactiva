import { useState, useRef } from "react";
import {
  SeSentence,
  SeType,
  SE_TYPES,
  SE_TYPE_LABELS,
  pickSeSentences,
} from "@/data/losUsosDeSEData";

const MAX_STRIKES = 3;

interface Props {
  locationName: string;
  icon: string;
  onComplete: () => void;
  onClose: () => void;
}

interface InnerProps extends Props {
  excludeIds: number[];
  onRetry: (usedIds: number[]) => void;
}

interface RowState {
  selected: SeType | "";
  flash: "correct" | "wrong" | null;
}

// ─── Render text with *se* / *Se* bolded in gold ──────────────────────────────

function renderText(text: string) {
  const parts = text.split(/(\*[Ss]e\*)/);
  return (
    <>
      {parts.map((part, i) =>
        /^\*[Ss]e\*$/.test(part) ? (
          <strong key={i} className="text-heist-gold font-extrabold">
            {part.replace(/\*/g, "")}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

// ─── Inner component ──────────────────────────────────────────────────────────

const SeInner = ({
  locationName,
  icon,
  onComplete,
  onClose,
  excludeIds,
  onRetry,
}: InnerProps) => {
  const [sentences] = useState<SeSentence[]>(() => pickSeSentences(excludeIds));
  const [rows, setRows] = useState<RowState[]>(() =>
    sentences.map(() => ({ selected: "", flash: null }))
  );
  const [lives, setLives] = useState(MAX_STRIKES);
  const [checked, setChecked] = useState(false);
  const [failReason, setFailReason] = useState<"strikes" | null>(null);
  const [allCorrect, setAllCorrect] = useState(false);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const handleSelect = (rowIndex: number, value: SeType | "") => {
    if (checked || failReason) return;
    setRows((prev) => {
      const next = [...prev];
      next[rowIndex] = { ...next[rowIndex], selected: value };
      return next;
    });
  };

  const allFilled = rows.every((r) => r.selected !== "");

  const handleCheck = () => {
    if (!allFilled || checked || failReason) return;

    const newRows = rows.map((row, i) => ({
      ...row,
      flash: row.selected === sentences[i].type
        ? ("correct" as const)
        : ("wrong" as const),
    }));
    const hasErrors = newRows.some((r) => r.flash === "wrong");
    setRows(newRows);
    setChecked(true);

    if (!hasErrors) {
      setAllCorrect(true);
      setTimeout(() => onCompleteRef.current(), 1000);
    } else {
      // 1 life per attempt regardless of number of errors
      const newLives = lives - 1;
      setLives(Math.max(0, newLives));
      setTimeout(() => {
        if (newLives <= 0) {
          setFailReason("strikes");
        } else {
          // Clear only wrong rows, keep correct ones locked
          setRows((prev) =>
            prev.map((r) =>
              r.flash === "wrong" ? { selected: "", flash: null } : { ...r, flash: null }
            )
          );
          setChecked(false);
        }
      }, 1200);
    }
  };

  const handleRetry = () => onRetry(sentences.map((s) => s.id));

  const lifeDisplay = Array.from({ length: MAX_STRIKES }, (_, i) => i < lives);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">

      {/* Failure overlay — outside the card to avoid overflow-hidden clipping */}
      {failReason !== null && (
        <div className="absolute inset-0 z-20 bg-heist-bg flex flex-col items-center justify-start gap-4 p-8 overflow-y-auto">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-heist-red" />
          <div className="flex flex-col items-center gap-4 w-full max-w-lg mx-auto mt-4">
            <p className="text-heist-red text-xs font-bold uppercase tracking-widest">⚠ Alerta de seguridad</p>
            <h2 className="mission-text text-4xl text-heist-red text-center">MISIÓN<br />FALLIDA</h2>
            <p className="text-gray-400 text-sm uppercase tracking-widest text-center">💀 Demasiados errores</p>
            <div className="w-full border border-gray-700 p-4 overflow-y-auto" style={{ maxHeight: "50vh" }}>
              <p className="text-heist-gold text-xs font-bold uppercase tracking-widest mb-3 text-center">
                Respuestas correctas
              </p>
              <div className="flex flex-col gap-3">
                {sentences.map((s) => (
                  <div key={s.id} className="border-b border-gray-800 pb-2">
                    <p className="text-white/70 text-sm leading-snug mb-1">{renderText(s.text)}</p>
                    <p className="text-heist-green text-xs font-bold pl-2">
                      → {SE_TYPE_LABELS[s.type]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-gray-500 text-xs uppercase tracking-wider mt-1">¿Volver a intentarlo?</p>
            <div className="flex gap-4">
              <button
                onClick={handleRetry}
                className="px-8 py-3 border-2 border-heist-red text-heist-red font-bold uppercase tracking-widest text-sm hover:bg-heist-red hover:text-black transition-all duration-200"
              >
                SÍ
              </button>
              <button
                onClick={onClose}
                className="px-8 py-3 border-2 border-gray-600 text-gray-400 font-bold uppercase tracking-widest text-sm hover:border-gray-400 hover:text-white transition-all duration-200"
              >
                NO
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative w-full max-w-2xl bg-heist-bg border-2 border-heist-red shadow-2xl shadow-heist-red/20 overflow-hidden max-h-[95vh] flex flex-col">

        {/* Success overlay */}
        {allCorrect && (
          <div className="absolute inset-0 z-20 bg-black/95 flex flex-col items-center justify-center gap-4">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-heist-green" />
            <p className="text-heist-green text-xs font-bold uppercase tracking-widest">✓ Operación completada</p>
            <h2 className="mission-text text-4xl text-heist-green text-center">MISIÓN<br />COMPLETADA</h2>
            <p className="text-gray-500 text-xs uppercase tracking-widest animate-pulse">Avanzando...</p>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between bg-heist-red/10 border-b border-heist-red px-4 py-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-lg">{icon}</span>
            <span className="text-heist-red text-xs font-bold uppercase tracking-widest">{locationName}</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl leading-none transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Lives + instruction */}
        <div className="flex items-center gap-3 px-4 py-2 border-b border-heist-red/20 shrink-0">
          <div className="flex gap-1 text-base">
            {lifeDisplay.map((alive, i) => (
              <span key={i} className={alive ? "opacity-100" : "opacity-25 grayscale"}>❤️</span>
            ))}
          </div>
          <p className="text-gray-500 text-xs uppercase tracking-widest">
            Elige el uso de «se» en cada frase
          </p>
        </div>

        {/* Sentence rows */}
        <div className="overflow-y-auto flex-1 px-4 py-3 flex flex-col gap-3">
          {sentences.map((s, i) => {
            const row = rows[i];
            const isLocked = row.flash === "correct";
            const borderCls =
              row.flash === "correct"
                ? "border-heist-green/60 bg-heist-green/5"
                : row.flash === "wrong"
                ? "border-heist-red bg-heist-red/5 animate-shake"
                : "border-heist-red/20 hover:border-heist-red/40";

            return (
              <div
                key={s.id}
                className={`border ${borderCls} p-3 flex flex-col sm:flex-row sm:items-center gap-3 transition-colors duration-200`}
              >
                {/* Sentence */}
                <p className="text-white text-sm leading-relaxed flex-1">{renderText(s.text)}</p>

                {/* Select */}
                <select
                  value={row.selected}
                  onChange={(e) => handleSelect(i, e.target.value as SeType | "")}
                  disabled={checked || !!failReason || isLocked}
                  className={`shrink-0 sm:w-48 w-full bg-transparent border-b-2 py-1 px-1 text-sm outline-none transition-colors duration-150 ${
                    isLocked
                      ? "border-heist-green text-heist-green cursor-default"
                      : row.flash === "wrong"
                      ? "border-heist-red text-heist-red"
                      : row.selected
                      ? "border-heist-gold text-heist-gold cursor-pointer"
                      : "border-gray-600 text-gray-500 cursor-pointer"
                  } [&>option]:bg-[#0d0d0d] [&>option]:text-white`}
                >
                  <option value="">— Elegir —</option>
                  {SE_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {SE_TYPE_LABELS[t]}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>

        {/* Comprobar button */}
        <div className="px-4 py-4 border-t border-heist-red/20 shrink-0">
          <button
            onClick={handleCheck}
            disabled={!allFilled || checked || !!failReason}
            className={`w-full py-3 font-bold uppercase tracking-widest text-sm border-2 transition-all duration-200 ${
              allFilled && !checked && !failReason
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

// ─── Public wrapper — remounts with new sentences on retry ────────────────────

const SeChallenge = (props: Props) => {
  const [retryKey, setRetryKey] = useState(0);
  const excludeRef = useRef<number[]>([]);

  return (
    <SeInner
      key={retryKey}
      {...props}
      excludeIds={excludeRef.current}
      onRetry={(usedIds) => {
        excludeRef.current = [...excludeRef.current, ...usedIds];
        setRetryKey((k) => k + 1);
      }}
    />
  );
};

export default SeChallenge;
