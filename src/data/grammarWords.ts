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

/** Returns n words chosen at random from ALL_WORDS (no repeats). */
export function pickRandomWords(n: number): WordEntry[] {
  const shuffled = [...ALL_WORDS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(n, shuffled.length));
}
