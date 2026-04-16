export interface Exercise {
  id: number;
  level: 1 | 2 | 3;
  levelLabel: string;
  /** Source sentences shown to the student */
  sources: string[];
  /** Hint shown below the sentences */
  hint: string;
  /** All accepted answers (stored with natural capitalization/punctuation; compared after normalization) */
  accepted: string[];
}

/** Normalize a student answer for comparison:
 *  - strip accents (focus is grammar, not orthography)
 *  - lowercase
 *  - trim + collapse spaces
 *  - remove trailing punctuation
 */
export function normalizeAnswer(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[.,;:!?¡¿]+$/, "");
}

export const EXERCISES: Exercise[] = [
  // ── Nivel 1: Coordinadas y Condicionales 1 ────────────────────────────────
  {
    id: 1, level: 1,
    levelLabel: "Coordinadas y Condicionales 1",
    sources: ["No tengo hambre.", "Voy a comer un poco de fruta."],
    hint: "Usa el conector: «pero»",
    accepted: [
      "No tengo hambre, pero voy a comer un poco de fruta.",
      "No tengo hambre pero voy a comer un poco de fruta.",
    ],
  },
  {
    id: 2, level: 1,
    levelLabel: "Coordinadas y Condicionales 1",
    sources: ["Mañana hace buen tiempo.", "Iremos de excursión a Lamma Island."],
    hint: "Usa el conector: «si» (condicional real)",
    accepted: [
      "Si mañana hace buen tiempo, iremos de excursión a Lamma Island.",
      "Iremos de excursión a Lamma Island si mañana hace buen tiempo.",
    ],
  },
  {
    id: 3, level: 1,
    levelLabel: "Coordinadas y Condicionales 1",
    sources: ["No salimos a pasear por el parque.", "Estaba lloviendo muchísimo."],
    hint: "Usa el conector: «porque»",
    accepted: [
      "No salimos a pasear por el parque porque estaba lloviendo muchísimo.",
      "Porque estaba lloviendo muchísimo, no salimos a pasear por el parque.",
    ],
  },
  {
    id: 4, level: 1,
    levelLabel: "Coordinadas y Condicionales 1",
    sources: ["No es un perro.", "Es un lobo."],
    hint: "Usa el conector: «sino»",
    accepted: [
      "No es un perro sino un lobo.",
    ],
  },
  {
    id: 5, level: 1,
    levelLabel: "Coordinadas y Condicionales 1",
    sources: ["No tenía mucha hambre.", "Se comió la pizza entera de Román."],
    hint: "Usa el conector: «aunque»",
    accepted: [
      "Aunque no tenía mucha hambre, se comió la pizza entera de Román.",
      "Se comió la pizza entera de Román aunque no tenía mucha hambre.",
    ],
  },
  {
    id: 6, level: 1,
    levelLabel: "Coordinadas y Condicionales 1",
    sources: ["No quiero comer pizza.", "No quiero comer hamburguesa."],
    hint: "Usa el conector: «ni»",
    accepted: [
      "Ni quiero comer pizza ni quiero comer hamburguesa.",
      "No quiero comer ni pizza ni hamburguesa.",
      "No quiero ni comer pizza ni comer hamburguesa.",
    ],
  },

  // ── Nivel 2: Subordinadas de Relativo y Condicionales 2 ──────────────────
  {
    id: 7, level: 2,
    levelLabel: "Subordinadas de Relativo y Condicionales 2",
    sources: ["El libro es muy interesante.", "Estoy leyendo el libro para clase."],
    hint: "Usa el pronombre relativo: «que»",
    accepted: [
      "El libro que estoy leyendo para clase es muy interesante.",
    ],
  },
  {
    id: 8, level: 2,
    levelLabel: "Subordinadas de Relativo y Condicionales 2",
    sources: ["No tengo muchas vacaciones.", "No puedo viajar a España para ver a mi familia."],
    hint: "Usa «si» con imperfecto de subjuntivo + condicional simple",
    accepted: [
      "Si tuviera más vacaciones, viajaría a España para ver a mi familia.",
      "Viajaría a España para ver a mi familia si tuviera más vacaciones.",
    ],
  },
  {
    id: 9, level: 2,
    levelLabel: "Subordinadas de Relativo y Condicionales 2",
    sources: ["La chica es mi hermana.", "La chica está sentada en la primera fila."],
    hint: "Usa el pronombre relativo: «quien»",
    accepted: [
      "La chica, quien está sentada en la primera fila, es mi hermana.",
      "La chica quien está sentada en la primera fila es mi hermana.",
    ],
  },
  {
    id: 10, level: 2,
    levelLabel: "Subordinadas de Relativo y Condicionales 2",
    sources: ["El coche es muy rápido.", "Compraste el coche el mes pasado."],
    hint: "Usa el pronombre relativo: «que»",
    accepted: [
      "El coche que compraste el mes pasado es muy rápido.",
    ],
  },
  {
    id: 11, level: 2,
    levelLabel: "Subordinadas de Relativo y Condicionales 2",
    sources: ["No sé la respuesta a la pregunta.", "Te la diría ahora mismo."],
    hint: "Usa «si» con imperfecto de subjuntivo + condicional simple",
    accepted: [
      "Si supiera la respuesta a la pregunta, te la diría ahora mismo.",
      "Te la diría ahora mismo si supiera la respuesta a la pregunta.",
    ],
  },

  // ── Nivel 3: Relativos con Preposición y Condicionales 3 ─────────────────
  {
    id: 12, level: 3,
    levelLabel: "Relativos con Preposición y Condicionales 3",
    sources: ["Ese es el chico.", "Te hablé de él ayer en la cafetería."],
    hint: "Usa el relativo con preposición: «del que»",
    accepted: [
      "Ese es el chico del que te hablé ayer en la cafetería.",
    ],
  },
  {
    id: 13, level: 3,
    levelLabel: "Relativos con Preposición y Condicionales 3",
    sources: ["No me dijiste la verdad.", "Me enfadé mucho."],
    hint: "Usa «si» con pluscuamperfecto de subjuntivo + condicional compuesto",
    accepted: [
      "Si me hubieras dicho la verdad, no me habría enfadado tanto contigo.",
      "No me habría enfadado tanto contigo si me hubieras dicho la verdad.",
    ],
  },
  {
    id: 14, level: 3,
    levelLabel: "Relativos con Preposición y Condicionales 3",
    sources: ["La ciudad es preciosa.", "Vivo en esa ciudad desde hace tres años."],
    hint: "Usa el relativo con preposición: «en la que»",
    accepted: [
      "La ciudad en la que vivo desde hace tres años es preciosa.",
    ],
  },
  {
    id: 15, level: 3,
    levelLabel: "Relativos con Preposición y Condicionales 3",
    sources: [
      "Queríamos ir a la yincana con los estudiantes el domingo.",
      "No hizo sol.",
      "No fuimos.",
    ],
    hint: "Usa «si» con pluscuamperfecto de subjuntivo + condicional compuesto",
    accepted: [
      "Si hubiera hecho sol el domingo, habríamos ido a la yincana con los estudiantes.",
      "Habríamos ido a la yincana con los estudiantes si hubiera hecho sol el domingo.",
    ],
  },
  {
    id: 16, level: 3,
    levelLabel: "Relativos con Preposición y Condicionales 3",
    sources: ["El problema es muy difícil.", "Estamos trabajando en ese problema ahora."],
    hint: "Usa el relativo con preposición: «en el que»",
    accepted: [
      "El problema en el que estamos trabajando ahora es muy difícil.",
    ],
  },
];

/** Pick one exercise per level (always 1→2→3), avoiding already-used IDs. */
export function pickExercises(excludeIds: number[] = []): Exercise[] {
  return ([1, 2, 3] as const).map((lvl) => {
    const pool = EXERCISES.filter((e) => e.level === lvl);
    const available = pool.filter((e) => !excludeIds.includes(e.id));
    const src = available.length > 0 ? available : pool;
    return src[Math.floor(Math.random() * src.length)];
  });
}
