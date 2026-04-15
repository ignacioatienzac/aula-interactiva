export type MorphemeType = "prefijo" | "lexema" | "interfijo" | "sufijo";

export interface Morpheme {
  /** Normalized text — no dashes, lowercase */
  text: string;
  type: MorphemeType;
}

export interface WordDecomposition {
  morphemes: Morpheme[];
}

export interface MorphologyWord {
  word: string;
  validDecompositions: WordDecomposition[];
}

export const MORPHEME_TYPE_LABELS: Record<MorphemeType, string> = {
  prefijo:   "Prefijo",
  lexema:    "Lexema",
  interfijo: "Interfijo",
  sufijo:    "Sufijo",
};

export const MORPHEME_TYPES: MorphemeType[] = [
  "prefijo",
  "lexema",
  "interfijo",
  "sufijo",
];

/** Helper to create a morpheme entry */
const m = (text: string, type: MorphemeType): Morpheme => ({ text, type });

export const ALL_MORPHOLOGY_WORDS: MorphologyWord[] = [
  {
    word: "Submarino",
    validDecompositions: [
      { morphemes: [m("sub", "prefijo"), m("mar", "lexema"), m("ino", "sufijo")] },
    ],
  },
  {
    word: "Panadería",
    validDecompositions: [
      { morphemes: [m("pan", "lexema"), m("ad", "interfijo"), m("ería", "sufijo")] },
    ],
  },
  {
    word: "Desordenado",
    validDecompositions: [
      { morphemes: [m("des", "prefijo"), m("orden", "lexema"), m("ad", "sufijo"), m("o", "sufijo")] },
      { morphemes: [m("des", "prefijo"), m("orden", "lexema"), m("ado", "sufijo")] },
    ],
  },
  {
    word: "Perritos",
    validDecompositions: [
      { morphemes: [m("perr", "lexema"), m("it", "sufijo"), m("o", "sufijo"), m("s", "sufijo")] },
      { morphemes: [m("perr", "lexema"), m("it", "sufijo"), m("os", "sufijo")] },
      { morphemes: [m("perr", "lexema"), m("itos", "sufijo")] },
    ],
  },
  {
    word: "Inmortal",
    validDecompositions: [
      { morphemes: [m("in", "prefijo"), m("mort", "lexema"), m("al", "sufijo")] },
    ],
  },
  {
    word: "Librería",
    validDecompositions: [
      { morphemes: [m("libr", "lexema"), m("ería", "sufijo")] },
    ],
  },
  {
    word: "Precalentar",
    validDecompositions: [
      { morphemes: [m("pre", "prefijo"), m("calent", "lexema"), m("ar", "sufijo")] },
    ],
  },
  {
    word: "Zapatilla",
    validDecompositions: [
      { morphemes: [m("zapat", "lexema"), m("illa", "sufijo")] },
    ],
  },
  {
    word: "Intercultural",
    validDecompositions: [
      { morphemes: [m("inter", "prefijo"), m("cultur", "lexema"), m("al", "sufijo")] },
    ],
  },
  {
    word: "Modernizar",
    validDecompositions: [
      { morphemes: [m("modern", "lexema"), m("iz", "sufijo"), m("ar", "sufijo")] },
    ],
  },
];

/** Pick 2 distinct random words from the pool */
export function pickTwoWords(): [MorphologyWord, MorphologyWord] {
  const shuffled = [...ALL_MORPHOLOGY_WORDS].sort(() => Math.random() - 0.5);
  return [shuffled[0], shuffled[1]];
}

/**
 * Normalise a morpheme string entered by the student:
 * strips leading/trailing dashes and whitespace, lowercases.
 * e.g. "-Sub-" → "sub", "  ería " → "ería"
 */
export function normalizeMorpheme(text: string): string {
  return text.replace(/^[-\s]+|[-\s]+$/g, "").toLowerCase();
}
