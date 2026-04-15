export type DetermClass =
  | "artículo"
  | "posesivo"
  | "demostrativo"
  | "numeral"
  | "indefinido"
  | "numeral ordinal";

export interface BlankEntry {
  /** Zero-based position in the segments array (the blank sits before segments[id]) */
  id: number;
  /** Hint shown to the student in parentheses */
  hint: string;
  /** All accepted answers (lowercase, no leading/trailing spaces) */
  accepted: string[];
}

export interface TextSegment {
  text: string;
}

/**
 * The conversation is split into text segments.
 * Between segments[i] and segments[i+1] there may be a blank identified by its id.
 * blankAfter[i] = id of the blank that comes after segments[i], or null if none.
 */
export interface DeterminantsExercise {
  segments: string[];
  /** For each gap between segment[i] and segment[i+1]: blank id (or null = no gap there) */
  blankAfterSegment: (number | null)[];
  blanks: BlankEntry[];
}

export const DETERMINANTS_EXERCISE: DeterminantsExercise = {
  segments: [
    /* 0 */ "Javi: Oye, Lucía, ¿viste ayer a ",
    /* 1 */ " chica nueva en ",
    /* 2 */ " fiesta de Lucas? Lucía: ¿A Sonia? Sí, estaba con ",
    /* 3 */ " ",
    /* 4 */ " primos suyos, Román y Alberto, pero no habló con ",
    /* 5 */ ".\nJavi: Pues a mí me dio ",
    /* 6 */ " buena impresión al principio, pero luego cambió. Me dijo que ",
    /* 7 */ " coche es \u201cdemasiado viejo\u201d para viajar con Laura, mi novia. Al principio me extra\u00f1\u00f3, \u00a1pero entonces me enter\u00e9 de que son mejores amigas!\nLuc\u00eda: \u00a1No me lo puedo creer! A m\u00ed me solt\u00f3 ",
    /* 8 */ " comentario parecido. Me dijo que ",
    /* 9 */ " ropa no era de marca.\nJavi: Es una presumida. ¿Viste ",
    /* 10 */ " chaqueta que llevaba? ¡Parecía de ",
    /* 11 */ " abuela!\nLucía: ¡Totalmente! Y lo peor fue al final... ¿Te puedes creer que la chica ",
    /* 12 */ " me dijo que yo no era suficientemente buena para ",
    /* 13 */ " amiga? Pero, ¿quién se cree que es ella?\nJavi: ¡Qué fuerte! Pues dicen que tiene ",
    /* 14 */ " enemigos en ",
    /* 15 */ " oficina porque siempre quiere ser ",
    /* 16 */ " ",
    /* 17 */ " en todo.\nLucía: Pues conmigo que no cuente para ",
    /* 18 */ " plan más.",
  ],
  // blankAfterSegment[i] = blank id that comes AFTER segments[i]; null = no blank
  blankAfterSegment: [
    0,    // after seg 0 → blank 0
    1,    // after seg 1 → blank 1
    2,    // after seg 2 → blank 2
    3,    // after seg 3 → blank 3
    4,    // after seg 4 → blank 4
    5,    // after seg 5 → blank 5
    6,    // after seg 6 → blank 6
    7,    // after seg 7 → blank 7
    8,    // after seg 8 → blank 8
    9,    // after seg 9 → blank 9
    10,   // after seg 10 → blank 10
    11,   // after seg 11 → blank 11
    12,   // after seg 12 → blank 12
    13,   // after seg 13 → blank 13
    14,   // after seg 14 → blank 14
    15,   // after seg 15 → blank 15
    16,   // after seg 16 → blank 16
    17,   // after seg 17 → blank 17
    null, // after seg 18 → no blank (last segment)
  ],
  blanks: [
    { id: 0,  hint: "artículo",                       accepted: ["la"] },
    { id: 1,  hint: "artículo",                       accepted: ["la"] },
    { id: 2,  hint: "posesivo",                       accepted: ["sus"] },
    { id: 3,  hint: "numeral",                        accepted: ["dos"] },
    { id: 4,  hint: "pronombre/indefinido",           accepted: ["nadie"] },
    { id: 5,  hint: "artículo",                       accepted: ["una"] },
    { id: 6,  hint: "posesivo",                       accepted: ["mi"] },
    { id: 7,  hint: "artículo",                       accepted: ["un"] },
    { id: 8,  hint: "posesivo",                       accepted: ["mi"] },
    { id: 9,  hint: "demostrativo",                   accepted: ["aquella", "esa"] },
    { id: 10, hint: "posesivo",                       accepted: ["su", "mi"] },
    { id: 11, hint: "demostrativo con valor despectivo", accepted: ["esa", "aquella"] },
    { id: 12, hint: "posesivo",                       accepted: ["su"] },
    { id: 13, hint: "indefinido",                     accepted: ["muchos", "muchísimos", "bastantes"] },
    { id: 14, hint: "artículo",                       accepted: ["la"] },
    { id: 15, hint: "artículo",                       accepted: ["la"] },
    { id: 16, hint: "numeral ordinal",                accepted: ["primera"] },
    { id: 17, hint: "indefinido",                     accepted: ["ningún"] },
  ],
};

export const TOTAL_BLANKS = DETERMINANTS_EXERCISE.blanks.length;
