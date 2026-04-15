// ─── Parte 1: Drag-and-drop ──────────────────────────────────────────────────

export interface Part1Sentence {
  id: number;
  /** Texto antes del hueco */
  before: string;
  /** Texto después del hueco (puede ser "") */
  after: string;
  /** Respuesta correcta */
  correct: "lo" | "lo de" | "lo que" | "lo de que";
}

export const PART1_POOL: Part1Sentence[] = [
  { id: 1,  before: "No entiendo",                                  after: "dice el profesor en las clases de gramática.",  correct: "lo que" },
  { id: 2,  before: "",                                             after: "ayer en la oficina fue un malentendido total.", correct: "lo de" },
  { id: 3,  before: "",                                             after: "te vas a casar en agosto me ha hecho mucha ilusión.", correct: "lo de que" },
  { id: 4,  before: "",                                             after: "mejor de vivir aquí es que nunca te aburres.",  correct: "lo" },
  { id: 5,  before: "Cuéntame otra vez",                            after: "tu viaje por Latinoamérica con tus amigos.",    correct: "lo de" },
  { id: 6,  before: "¿Has escuchado",                               after: "van a cerrar la cafetería del campus?",         correct: "lo de que" },
  { id: 7,  before: "No me importa",                                after: "piensen los demás, yo voy a seguir con mi proyecto.", correct: "lo que" },
  { id: 8,  before: "",                                             after: "ser profesor es vocacional, hay que tener mucha paciencia.", correct: "lo de" },
  { id: 9,  before: "Tienes que ver",                               after: "rápido que corre el perro de Ignacio.",         correct: "lo" },
  { id: 10, before: "Me encanta",                                   after: "has hecho con el diseño de la web.",            correct: "lo que" },
  { id: 11, before: "",                                             after: "ir a la playa el domingo me parece un planazo.", correct: "lo de" },
  { id: 12, before: "¿Es verdad",                                   after: "no hay clase el próximo lunes?",                correct: "lo de que" },
  { id: 13, before: "No soporto",                                   after: "tarde que llega siempre el autobús.",           correct: "lo" },
  { id: 14, before: "",                                             after: "increíble de esta historia es que nadie se dio cuenta del error.", correct: "lo" },
  { id: 15, before: "Aclárame",                                     after: "las nuevas reglas del examen, por favor.",      correct: "lo de" },
  { id: 16, before: "Es alucinante",                                after: "se puede aprender usando inteligencia artificial.", correct: "lo que" },
  { id: 17, before: "",                                             after: "la Tierra es plana es una teoría sin sentido.", correct: "lo de que" },
  { id: 18, before: "Olvida",                                       after: "la cena de esta noche, tengo que trabajar hasta tarde.", correct: "lo de" },
  { id: 19, before: "No me creo",                                   after: "hayas terminado ya todos los ejercicios.",      correct: "lo de que" },
  { id: 20, before: "",                                             after: "más importante en la vida es ser una buena persona.", correct: "lo" },
];

export const ALL_OPTIONS: Array<"lo" | "lo de" | "lo que" | "lo de que"> = [
  "lo", "lo de", "lo que", "lo de que",
];

/** Pick 5 random sentences, then build 7 tokens: the 5 correct answers
 *  + 2 extra tokens (different from each other, chosen randomly from
 *  the 4 possible values, possibly repeating one that's already correct).
 *  Returns sentences + shuffled token list. */
export function pickPart1(excludeIds?: number[]): {
  sentences: Part1Sentence[];
  tokens: string[];
} {
  const pool = excludeIds?.length
    ? PART1_POOL.filter((s) => !excludeIds.includes(s.id))
    : PART1_POOL;

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const sentences = shuffled.slice(0, 5);

  const correctSet = sentences.map((s) => s.correct);

  // Pick 2 extras randomly from ALL_OPTIONS (any value is fine, including repeats of correct ones)
  const extras: string[] = [];
  while (extras.length < 2) {
    const pick = ALL_OPTIONS[Math.floor(Math.random() * ALL_OPTIONS.length)];
    extras.push(pick);
  }

  const tokens = [...correctSet, ...extras].sort(() => Math.random() - 0.5);
  return { sentences, tokens };
}

// ─── Parte 2: Pronombre OD vs Artículo neutro ────────────────────────────────

export type LoType = "pronombre" | "articulo";

export interface Part2Sentence {
  id: number;
  text: string;
  correct: LoType;
}

export const PART2_POOL: Part2Sentence[] = [
  { id: 1,  text: "¿El libro de ejercicios? Lo dejé encima de la mesa.",                          correct: "pronombre" },
  { id: 2,  text: "No te puedes imaginar lo cansado que estoy hoy.",                               correct: "articulo" },
  { id: 3,  text: "Lo bueno de este juego es que puedes practicar en cualquier lugar.",            correct: "articulo" },
  { id: 4,  text: "Si ves a Cobi por la web, dile que lo estamos buscando.",                      correct: "pronombre" },
  { id: 5,  text: "A mi perro lo saco a pasear tres veces al día.",                               correct: "pronombre" },
  { id: 6,  text: "Lo malo de este restaurante es que siempre hay mucha cola.",                    correct: "articulo" },
  { id: 7,  text: "Ese coche es precioso, ¿dónde lo compraste?",                                  correct: "pronombre" },
  { id: 8,  text: "Hay que valorar lo mucho que han trabajado los alumnos este semestre.",         correct: "articulo" },
  { id: 9,  text: "¿El examen de ayer? Lo encontré bastante fácil.",                              correct: "pronombre" },
  { id: 10, text: "Lo raro es que no me haya llamado todavía.",                                    correct: "articulo" },
  { id: 11, text: "He visto un apartamento muy barato, pero no lo voy a alquilar.",               correct: "pronombre" },
  { id: 12, text: "Me gusta lo amable que es la gente en esta ciudad.",                           correct: "articulo" },
  { id: 13, text: "Ese cuadro es un poco feo, pero lo compramos porque era barato.",              correct: "pronombre" },
  { id: 14, text: "No sabes lo difícil que es coordinar un departamento entero.",                  correct: "articulo" },
  { id: 15, text: "¿Has visto mi móvil? No lo encuentro por ninguna parte.",                      correct: "pronombre" },
  { id: 16, text: "Lo esencial es invisible a los ojos.",                                          correct: "articulo" },
  { id: 17, text: "El regalo de boda ya lo tenemos preparado.",                                    correct: "pronombre" },
  { id: 18, text: "¡Mira lo alto que está el niño! Ha crecido muchísimo.",                        correct: "articulo" },
  { id: 19, text: "Si tienes el código del juego, pásamelo por correo electrónico.",              correct: "pronombre" },
  { id: 20, text: "No entiendo lo complicado que es este ejercicio de gramática.",                 correct: "articulo" },
];

export const PART2_COUNT = 10;

export function pickPart2(): Part2Sentence[] {
  return [...PART2_POOL].sort(() => Math.random() - 0.5).slice(0, PART2_COUNT);
}
