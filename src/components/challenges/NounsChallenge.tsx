import { useState, useCallback, useRef, useEffect } from "react";
import {
  NounEntry,
  ArticleAnswer,
  ARTICLE_OPTIONS,
  pickNouns,
} from "@/data/nounsData";

const MAX_STRIKES = 3;

interface Props {
  locationName: string;
  icon: string;
  onComplete: () => void;
  onClose: () => void;
}

type Phase = "article" | "plural" | "done";
type CheckStatus = "idle" | "wrong";

// ─── Inner component (remounted on retry for fresh nouns) ─────────────────────

interface InnerProps extends Props {
  previous: NounEntry[] | undefined;
  onRetry: (current: NounEntry[]) => void;
}

interface ArticleRowStatus {
  checked: boolean;
  correct: boolean;
}

interface PluralRowStatus {
  checked: boolean;
  correct: boolean;
}

const NounsChallengeInner = ({
  locationName,
  icon,
  onComplete,
  onClose,
  previous,
  onRetry,
}: InnerProps) => {
  const [nouns] = useState<NounEntry[]>(() => pickNouns(previous));

  // Phase state
  const [phase, setPhase] = useState<Phase>("article");

  // Part 1: article selections
  const [articleAnswers, setArticleAnswers] = useState<(ArticleAnswer | null)[]>(
    () => Array(15).fill(null)
  );
  const [articleStatuses, setArticleStatuses] = useState<ArticleRowStatus[]>(
    () => Array(15).fill({ checked: false, correct: false })
  );
  const [articleCheckStatus, setArticleCheckStatus] = useState<CheckStatus>("idle");

  // Part 2: plural inputs
  const [pluralValues, setPluralValues] = useState<string[]>(() => Array(15).fill(""));
  const [pluralStatuses, setPluralStatuses] = useState<PluralRowStatus[]>(
    () => Array(15).fill({ checked: false, correct: false })
  );
  const [pluralCheckStatus, setPluralCheckStatus] = useState<CheckStatus>("idle");

  // Lives & fail
  const [lives, setLives] = useState(MAX_STRIKES);
  const [failReason, setFailReason] = useState<"strikes" | null>(null);
  const [failInfo, setFailInfo] = useState<{ noun: NounEntry; wrongArticle?: ArticleAnswer | null; wrongPlural?: string }[]>([]);
  const [flickering, setFlickering] = useState(false);
  const [shaking, setShaking] = useState(false);

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const triggerFail = useCallback(
    (info: { noun: NounEntry; wrongArticle?: ArticleAnswer | null; wrongPlural?: string }[]) => {
      setFlickering(true);
      setFailInfo(info);
      setTimeout(() => {
        setFlickering(false);
        setFailReason("strikes");
      }, 500);
    },
    []
  );

  const loseLife = useCallback(
    (info: { noun: NounEntry; wrongArticle?: ArticleAnswer | null; wrongPlural?: string }[]) => {
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      setLives((l) => {
        const next = l - 1;
        if (next <= 0) {
          setTimeout(() => triggerFail(info), 400);
        }
        return next;
      });
    },
    [triggerFail]
  );

  // Trigger onComplete when phase reaches "done"
  useEffect(() => {
    if (phase === "done" && failReason === null) {
      const t = setTimeout(() => onCompleteRef.current(), 700);
      return () => clearTimeout(t);
    }
  }, [phase, failReason]);

  // ── Part 1 handlers ──────────────────────────────────────────────────────

  const handleArticleSelect = (idx: number, val: ArticleAnswer) => {
    if (phase !== "article") return;
    setArticleAnswers((prev) => {
      const next = [...prev];
      next[idx] = val;
      return next;
    });
  };

  const handleCheckArticles = () => {
    const newStatuses: ArticleRowStatus[] = nouns.map((noun, i) => ({
      checked: true,
      correct: articleAnswers[i] === noun.article,
    }));
    setArticleStatuses(newStatuses);

    const errors = nouns
      .map((noun, i) => ({ noun, idx: i, correct: newStatuses[i].correct }))
      .filter((r) => !r.correct);

    if (errors.length === 0) {
      setPhase("plural");
    } else {
      setArticleCheckStatus("wrong");
      const info = errors.map((e) => ({ noun: e.noun, wrongArticle: articleAnswers[e.idx] }));
      loseLife(info);
    }
  };

  // ── Part 2 handlers ──────────────────────────────────────────────────────

  const handlePluralChange = (idx: number, val: string) => {
    setPluralValues((prev) => {
      const next = [...prev];
      next[idx] = val;
      return next;
    });
    if (pluralStatuses[idx].checked) {
      setPluralStatuses((prev) => {
        const next = [...prev];
        next[idx] = { checked: false, correct: false };
        return next;
      });
    }
  };

  const handleCheckPlurals = () => {
    const newStatuses: PluralRowStatus[] = nouns.map((noun, i) => {
      const normalized = pluralValues[i].trim().toLowerCase().replace(/^-|-$/g, "");
      return {
        checked: true,
        correct: noun.plurals.includes(normalized),
      };
    });
    setPluralStatuses(newStatuses);

    const errors = nouns
      .map((noun, i) => ({ noun, idx: i, correct: newStatuses[i].correct }))
      .filter((r) => !r.correct);

    if (errors.length === 0) {
      setPhase("done");
    } else {
      setPluralCheckStatus("wrong");
      const info = errors.map((e) => ({ noun: e.noun, wrongPlural: pluralValues[e.idx] }));
      loseLife(info);
    }
  };

  const handleRetry = () => {
    onRetry(nouns);
  };

  const allArticlesSelected = articleAnswers.every((a) => a !== null);
  const allPluralsFilledForDone = pluralValues.every((v) => v.trim() !== "");

  const lifeDisplay = Array.from({ length: MAX_STRIKES }, (_, i) => i < lives);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      {flickering && (
        <div className="absolute inset-0 z-10 bg-black animate-flicker pointer-events-none" />
      )}

      <div
        className={`relative w-full max-w-lg sm:max-w-4xl bg-heist-bg border-2 border-heist-red shadow-2xl shadow-heist-red/20 overflow-hidden ${
          shaking ? "animate-shake" : ""
        }`}
      >
        {/* ── Failure overlay ── */}
        {failReason !== null && (
          <div className="absolute inset-0 z-20 bg-black/95 flex flex-col items-center justify-center gap-5 p-6 overflow-y-auto">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-heist-red animate-scanner" />
            <p className="text-heist-red text-xs font-bold uppercase tracking-widest">
              ⚠ Alerta de seguridad
            </p>
            <h2 className="mission-text text-4xl text-heist-red text-center">
              MISIÓN<br />FALLIDA
            </h2>
            <p className="text-gray-400 text-sm uppercase tracking-widest text-center">
              💀 Demasiados errores
            </p>

            {/* Error summary */}
            {failInfo.length > 0 && (
              <div className="w-full max-w-2xl border border-gray-700 p-4">
                <p className="text-heist-gold text-xs font-bold uppercase tracking-widest mb-3 text-center">
                  Tus errores
                </p>
                <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                  {failInfo.map((item, i) => (
                    <div key={i} className="flex flex-wrap items-center gap-2 text-xs border-b border-gray-800 pb-1">
                      <span className="text-white font-bold w-24 shrink-0">{item.noun.singular}</span>
                      {item.wrongArticle !== undefined && (
                        <>
                          <span className="text-heist-red line-through">
                            {item.wrongArticle ?? "—"}
                          </span>
                          <span className="text-gray-500">→</span>
                          <span className="text-heist-green font-bold">{item.noun.article}</span>
                        </>
                      )}
                      {item.wrongPlural !== undefined && (
                        <>
                          <span className="text-heist-red line-through">
                            {item.wrongPlural || "—"}
                          </span>
                          <span className="text-gray-500">→</span>
                          <span className="text-heist-green font-bold">
                            {item.noun.plurals.join(" / ")}
                          </span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-gray-500 text-xs uppercase tracking-wider">
              ¿Volver a intentarlo?
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleRetry}
                className="px-8 py-3 border-2 border-heist-red text-heist-red font-bold uppercase tracking-widest text-sm
                  hover:bg-heist-red hover:text-black transition-all duration-200"
              >
                SÍ
              </button>
              <button
                onClick={onClose}
                className="px-8 py-3 border-2 border-gray-600 text-gray-400 font-bold uppercase tracking-widest text-sm
                  hover:border-gray-400 hover:text-white transition-all duration-200"
              >
                NO
              </button>
            </div>
          </div>
        )}

        {/* ── Header ── */}
        <div className="flex items-center justify-between bg-heist-red/10 border-b border-heist-red px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{icon}</span>
            <span className="text-heist-red text-xs font-bold uppercase tracking-widest">
              {locationName}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl leading-none transition-colors"
          >
            ✕
          </button>
        </div>

        {/* ── Lives bar ── */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-heist-red/20">
          <div className="flex gap-1 text-base">
            {lifeDisplay.map((alive, i) => (
              <span key={i} className={alive ? "opacity-100" : "opacity-25 grayscale"}>❤️</span>
            ))}
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 border ${
            phase === "article"
              ? "border-heist-gold text-heist-gold"
              : "border-heist-green text-heist-green"
          }`}>
            {phase === "article" ? "Parte 1: Género" : "Parte 2: Plural"}
          </span>
          <p className="text-gray-600 text-xs uppercase tracking-widest">
            Sustantivos
          </p>
        </div>

        {/* ── Instructions ── */}
        <div className="px-4 pt-3 pb-1">
          <p className="text-[11px] text-gray-500 uppercase tracking-wider">
            {phase === "article"
              ? "Selecciona el artículo que corresponde a cada sustantivo: El, La o Ambas."
              : "Escribe el plural de cada sustantivo."}
          </p>
        </div>

        {/* ── Table ── */}
        <div className="px-4 pb-4 max-h-[52vh] overflow-y-auto">
          {phase === "article" && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-heist-red/20">
                  <th className="text-left py-1.5 text-[10px] text-gray-500 uppercase tracking-widest font-bold w-1/2">
                    Sustantivo
                  </th>
                  {ARTICLE_OPTIONS.map((opt) => (
                    <th key={opt.value} className="text-center py-1.5 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                      {opt.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {nouns.map((noun, i) => {
                  const st = articleStatuses[i];
                  const rowColor = st.checked
                    ? st.correct
                      ? "text-heist-green"
                      : "text-heist-red"
                    : "text-white";
                  return (
                    <tr key={i} className={`border-b border-gray-800 ${rowColor}`}>
                      <td className="py-1.5 font-bold capitalize">{noun.singular}</td>
                      {ARTICLE_OPTIONS.map((opt) => (
                        <td key={opt.value} className="text-center py-1.5">
                          <button
                            onClick={() => handleArticleSelect(i, opt.value)}
                            disabled={failReason !== null || phase !== "article"}
                            className={`w-7 h-7 rounded-full border-2 transition-all duration-150 text-xs font-bold
                              ${articleAnswers[i] === opt.value
                                ? st.checked
                                  ? st.correct
                                    ? "border-heist-green bg-heist-green/20 text-heist-green"
                                    : "border-heist-red bg-heist-red/20 text-heist-red"
                                  : "border-heist-gold bg-heist-gold/20 text-heist-gold"
                                : "border-gray-700 text-gray-600 hover:border-heist-gold/60 hover:text-heist-gold/60"
                              }
                              disabled:cursor-not-allowed`}
                          >
                            {articleAnswers[i] === opt.value ? "●" : "○"}
                          </button>
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {phase === "plural" && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-heist-red/20">
                  <th className="text-left py-1.5 text-[10px] text-gray-500 uppercase tracking-widest font-bold w-1/2">
                    Sustantivo (singular)
                  </th>
                  <th className="text-left py-1.5 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                    Plural
                  </th>
                </tr>
              </thead>
              <tbody>
                {nouns.map((noun, i) => {
                  const st = pluralStatuses[i];
                  return (
                    <tr key={i} className="border-b border-gray-800">
                      <td className="py-1.5 text-gray-300 capitalize">{noun.singular}</td>
                      <td className="py-1.5">
                        <input
                          type="text"
                          value={pluralValues[i]}
                          onChange={(e) => handlePluralChange(i, e.target.value)}
                          disabled={failReason !== null}
                          placeholder="plural..."
                          className={`w-full bg-transparent border-b text-sm font-bold focus:outline-none transition-colors duration-200
                            placeholder-gray-700 tracking-wide
                            ${st.checked && st.correct ? "border-heist-green text-heist-green" : ""}
                            ${st.checked && !st.correct ? "border-heist-red text-heist-red" : ""}
                            ${!st.checked ? "border-heist-gold/40 text-white focus:border-heist-gold" : ""}
                          `}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* ── Check button ── */}
        <div className="px-4 pb-4 border-t border-heist-red/20 pt-3">
          {phase === "article" && (
            <button
              onClick={handleCheckArticles}
              disabled={!allArticlesSelected || failReason !== null}
              className={`w-full py-2.5 font-bold uppercase tracking-widest text-sm border-2 transition-all duration-200
                ${allArticlesSelected
                  ? "border-heist-red bg-heist-red/10 text-heist-red hover:bg-heist-red hover:text-black cursor-pointer"
                  : "border-gray-700 text-gray-600 cursor-not-allowed"}
              `}
            >
              ▶ Comprobar géneros
            </button>
          )}
          {phase === "plural" && (
            <button
              onClick={handleCheckPlurals}
              disabled={!allPluralsFilledForDone || failReason !== null}
              className={`w-full py-2.5 font-bold uppercase tracking-widest text-sm border-2 transition-all duration-200
                ${allPluralsFilledForDone
                  ? "border-heist-red bg-heist-red/10 text-heist-red hover:bg-heist-red hover:text-black cursor-pointer"
                  : "border-gray-700 text-gray-600 cursor-not-allowed"}
              `}
            >
              ▶ Comprobar plurales
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Public wrapper — remounts on retry with new nouns ────────────────────────

const NounsChallenge = (props: Props) => {
  const [retryKey, setRetryKey] = useState(0);
  const previousRef = useRef<NounEntry[] | undefined>(undefined);

  return (
    <NounsChallengeInner
      key={retryKey}
      {...props}
      previous={previousRef.current}
      onRetry={(current) => {
        previousRef.current = current;
        setRetryKey((k) => k + 1);
      }}
    />
  );
};

export default NounsChallenge;
