export type ArticleAnswer = "el" | "la" | "ambas";

export interface NounEntry {
  /** Display form (singular) */
  singular: string;
  /** Correct article answer for Part 1 */
  article: ArticleAnswer;
  /** All accepted plural forms (lowercase) */
  plurals: string[];
  /** Block number (1-4) for distribution logic */
  block: 1 | 2 | 3 | 4;
}

// ─── Pool ─────────────────────────────────────────────────────────────────────

export const ALL_NOUNS: NounEntry[] = [
  // ── Bloque 1: Género engañoso ──────────────────────────────────────────────
  { singular: "agua",       article: "el",    plurals: ["aguas"],                block: 1 },
  { singular: "moto",       article: "la",    plurals: ["motos"],                block: 1 },
  { singular: "mano",       article: "la",    plurals: ["manos"],                block: 1 },
  { singular: "amistad",    article: "la",    plurals: ["amistades"],            block: 1 },
  { singular: "televisión", article: "la",    plurals: ["televisiones"],         block: 1 },
  { singular: "serie",      article: "la",    plurals: ["series"],               block: 1 },
  { singular: "mapa",       article: "el",    plurals: ["mapas"],                block: 1 },
  { singular: "día",        article: "el",    plurals: ["días"],                 block: 1 },
  { singular: "problema",   article: "el",    plurals: ["problemas"],            block: 1 },
  { singular: "idioma",     article: "el",    plurals: ["idiomas"],              block: 1 },
  { singular: "planeta",    article: "el",    plurals: ["planetas"],             block: 1 },
  { singular: "foto",       article: "la",    plurals: ["fotos"],                block: 1 },
  { singular: "sofá",       article: "el",    plurals: ["sofás"],                block: 1 },
  { singular: "radio",      article: "la",    plurals: ["radios"],               block: 1 },

  // ── Bloque 2: Personas y profesiones ──────────────────────────────────────
  { singular: "tigresa",     article: "la",    plurals: ["tigresas"],                block: 2 },
  { singular: "actriz",      article: "la",    plurals: ["actrices"],                block: 2 },
  { singular: "estudiante",  article: "ambas", plurals: ["estudiantes"],             block: 2 },
  { singular: "jabalí",      article: "ambas", plurals: ["jabalíes", "jabalís"],     block: 2 },
  { singular: "trabajador",  article: "ambas", plurals: ["trabajadores"],            block: 2 },
  { singular: "dentista",    article: "ambas", plurals: ["dentistas"],               block: 2 },
  { singular: "joven",       article: "ambas", plurals: ["jóvenes"],                 block: 2 },
  { singular: "actor",       article: "el",    plurals: ["actores"],                 block: 2 },
  { singular: "emperatriz",  article: "la",    plurals: ["emperatrices"],            block: 2 },
  { singular: "guía",        article: "ambas", plurals: ["guías"],                   block: 2 },

  // ── Bloque 3: Plurales con "truco" ─────────────────────────────────────────
  { singular: "rubí",      article: "el",    plurals: ["rubíes", "rubís"],      block: 3 },
  { singular: "ley",       article: "la",    plurals: ["leyes"],                block: 3 },
  { singular: "rey",       article: "el",    plurals: ["reyes"],                block: 3 },
  { singular: "buey",      article: "el",    plurals: ["bueyes"],               block: 3 },
  { singular: "menú",      article: "el",    plurals: ["menús"],                block: 3 },
  { singular: "tabú",      article: "el",    plurals: ["tabúes", "tabús"],      block: 3 },
  { singular: "paraguas",  article: "el",    plurals: ["paraguas"],             block: 3 },
  { singular: "análisis",  article: "el",    plurals: ["análisis"],             block: 3 },
  { singular: "lápiz",     article: "el",    plurals: ["lápices"],              block: 3 },
  { singular: "pez",       article: "el",    plurals: ["peces"],                block: 3 },

  // ── Bloque 4: Ejemplos claros ──────────────────────────────────────────────
  { singular: "libro",     article: "el",    plurals: ["libros"],               block: 4 },
  { singular: "silla",     article: "la",    plurals: ["sillas"],               block: 4 },
  { singular: "coche",     article: "el",    plurals: ["coches"],               block: 4 },
  { singular: "flor",      article: "la",    plurals: ["flores"],               block: 4 },
  { singular: "perro",     article: "el",    plurals: ["perros"],               block: 4 },
  { singular: "manzana",   article: "la",    plurals: ["manzanas"],             block: 4 },
];

const BLOCKS = [1, 2, 3, 4] as const;
const TOTAL = 15;
const MIN_PER_BLOCK = 2;

/**
 * Pick 15 nouns ensuring at least 2 from each block (4 blocks × 2 = 8 guaranteed).
 * Remaining 7 slots are filled randomly from the leftover pool.
 * Result is shuffled.
 * If a previous selection is provided, tries to avoid repeating the same words.
 */
export function pickNouns(previous?: NounEntry[]): NounEntry[] {
  const prevSingulars = new Set(previous?.map((n) => n.singular) ?? []);

  // Step 1: 2 guaranteed from each block
  const guaranteed: NounEntry[] = [];
  for (const b of BLOCKS) {
    const blockWords = ALL_NOUNS.filter((n) => n.block === b);
    // prefer words not in previous selection
    const fresh = blockWords.filter((n) => !prevSingulars.has(n.singular));
    const pool = fresh.length >= MIN_PER_BLOCK ? fresh : blockWords;
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    guaranteed.push(...shuffled.slice(0, MIN_PER_BLOCK));
  }

  // Step 2: fill remaining 7 slots
  const chosenSet = new Set(guaranteed.map((n) => n.singular));
  const leftover = ALL_NOUNS.filter((n) => !chosenSet.has(n.singular))
    .sort(() => Math.random() - 0.5)
    .slice(0, TOTAL - guaranteed.length);

  return [...guaranteed, ...leftover].sort(() => Math.random() - 0.5);
}

export const ARTICLE_OPTIONS: { value: ArticleAnswer; label: string }[] = [
  { value: "el",    label: "El" },
  { value: "la",    label: "La" },
  { value: "ambas", label: "Ambas" },
];
