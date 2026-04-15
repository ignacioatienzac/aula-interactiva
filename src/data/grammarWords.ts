export type GrammarCategory =
  | "sustantivo"
  | "adjetivo"
  | "adverbio"
  | "pronombre"
  | "determinante"
  | "verbo"
  | "preposición"
  | "conjunción";

export interface WordEntry {
  word: string;
  category: GrammarCategory;
}

export const CATEGORY_LABELS: Record<GrammarCategory, string> = {
  sustantivo: "Sustantivo",
  adjetivo: "Adjetivo",
  adverbio: "Adverbio",
  pronombre: "Pronombre",
  determinante: "Determinante",
  verbo: "Verbo",
  preposición: "Preposición",
  conjunción: "Conjunción",
};

export const ALL_WORDS: WordEntry[] = [
  // Sustantivos
  { word: "Estómago",  category: "sustantivo" },
  { word: "Libertad",  category: "sustantivo" },
  { word: "Sala",      category: "sustantivo" },
  { word: "Montaña",   category: "sustantivo" },
  { word: "Ventana",   category: "sustantivo" },
  // Adjetivos
  { word: "Medioambiental", category: "adjetivo" },
  { word: "Buen",           category: "adjetivo" },
  { word: "Bueno",          category: "adjetivo" },
  { word: "Difícil",        category: "adjetivo" },
  { word: "Rápido",         category: "adjetivo" },
  // Adverbios
  { word: "Bien",     category: "adverbio" },
  { word: "Ayer",     category: "adverbio" },
  { word: "Nunca",    category: "adverbio" },
  { word: "Cerca",    category: "adverbio" },
  { word: "Bastante", category: "adverbio" },
  // Pronombres
  { word: "Se",       category: "pronombre" },
  { word: "Ustedes",  category: "pronombre" },
  { word: "Algo",     category: "pronombre" },
  { word: "Nadie",    category: "pronombre" },
  { word: "Eso",      category: "pronombre" },
  // Determinantes
  { word: "Mi",       category: "determinante" },
  { word: "Esa",      category: "determinante" },
  { word: "Algunos",  category: "determinante" },
  { word: "Cada",     category: "determinante" },
  { word: "Tres",     category: "determinante" },
  // Verbos
  { word: "Sé",       category: "verbo" },
  { word: "Fue",      category: "verbo" },
  { word: "Comemos",  category: "verbo" },
  { word: "Saldrán",  category: "verbo" },
  { word: "Dormir",   category: "verbo" },
  // Preposiciones
  { word: "En",     category: "preposición" },
  { word: "Desde",  category: "preposición" },
  { word: "Para",   category: "preposición" },
  { word: "Sin",    category: "preposición" },
  { word: "Sobre",  category: "preposición" },
  // Conjunciones
  { word: "Y",       category: "conjunción" },
  { word: "O",       category: "conjunción" },
  { word: "Pero",    category: "conjunción" },
  { word: "Aunque",  category: "conjunción" },
  { word: "Porque",  category: "conjunción" },
];

/**
 * Returns n words guaranteeing at least one from every category.
 * The 8 categories are always represented; remaining slots are filled
 * with random picks from the leftover pool. Result is shuffled.
 */
export function pickRandomWords(n: number): WordEntry[] {
  const categories = Object.keys(CATEGORY_LABELS) as GrammarCategory[];

  // Step 1: pick one random word from each category (8 guaranteed)
  const byCategory: Record<GrammarCategory, WordEntry[]> = {} as never;
  for (const cat of categories) {
    byCategory[cat] = ALL_WORDS.filter((w) => w.category === cat);
  }

  const guaranteed: WordEntry[] = categories.map((cat) => {
    const pool = byCategory[cat];
    return pool[Math.floor(Math.random() * pool.length)];
  });

  // Step 2: fill remaining slots from ALL_WORDS (excluding already chosen)
  const chosen = new Set(guaranteed);
  const leftover = ALL_WORDS.filter((w) => !chosen.has(w))
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.max(0, n - categories.length));

  // Step 3: merge and shuffle
  return [...guaranteed, ...leftover].sort(() => Math.random() - 0.5);
}
