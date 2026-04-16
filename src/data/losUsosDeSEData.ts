export type SeType =
  | "reflexivo"
  | "reciproco"
  | "cambio"
  | "oi"
  | "ingestion"
  | "impersonal"
  | "pasiva";

export const SE_TYPES: SeType[] = [
  "reflexivo",
  "reciproco",
  "cambio",
  "oi",
  "ingestion",
  "impersonal",
  "pasiva",
];

export const SE_TYPE_LABELS: Record<SeType, string> = {
  reflexivo:  "Reflexivo",
  reciproco:  "Recíproco",
  cambio:     "Cambio de estado",
  oi:         "Pronombre OI",
  ingestion:  "Verbos de ingestión",
  impersonal: "Impersonal",
  pasiva:     "Pasiva refleja",
};

export interface SeSentence {
  id: number;
  /** Text with *se* / *Se* markers for bold rendering */
  text: string;
  type: SeType;
}

export const SE_POOL: SeSentence[] = [
  // ── Reflexivo (1–3) ──────────────────────────────────────────────────────
  { id: 1,  text: "Marcos *se* corta el pelo una vez al mes en la peluquería de su barrio.", type: "reflexivo" },
  { id: 2,  text: "Ella *se* mira en el espejo durante mucho tiempo antes de salir de fiesta.", type: "reflexivo" },
  { id: 3,  text: "El niño *se* viste solo desde que cumplió cuatro años.", type: "reflexivo" },

  // ── Recíproco (4–6) ──────────────────────────────────────────────────────
  { id: 4,  text: "Los jugadores *se* saludaron con deportividad al finalizar el partido.", type: "reciproco" },
  { id: 5,  text: "Mis padres *se* quieren muchísimo después de treinta años de casados.", type: "reciproco" },
  { id: 6,  text: "Ellos *se* escriben mensajes por WhatsApp a todas horas.", type: "reciproco" },

  // ── Cambio de estado (7–9) ───────────────────────────────────────────────
  { id: 7,  text: "Mi madre *se* puso muy feliz cuando le di la noticia de mi boda.", type: "cambio" },
  { id: 8,  text: "Los estudiantes *se* aburren si la clase de gramática es demasiado teórica.", type: "cambio" },
  { id: 9,  text: "Él *se* enfadó mucho porque nadie le avisó del cambio de hora.", type: "cambio" },

  // ── Sustituto de le/les — OI (10–12) ────────────────────────────────────
  { id: 10, text: "¿Quieres el libro de español? *Se* lo daré a los alumnos mañana en clase.", type: "oi" },
  { id: 11, text: "Si ves a María, *se* lo cuentas todo, por favor.", type: "oi" },
  { id: 12, text: "Ayer compré flores para mi madre y *se* las envié a su casa.", type: "oi" },

  // ── Verbos de ingestión (13–15) ──────────────────────────────────────────
  { id: 13, text: "*Se* comió una pizza entera él solo mientras veía la película.", type: "ingestion" },
  { id: 14, text: "*Se* bebieron tres botellas de agua después de la caminata por Lamma Island.", type: "ingestion" },
  { id: 15, text: "¡No me lo puedo creer! *Se* desayunó cuatro cruasanes antes de venir.", type: "ingestion" },

  // ── Impersonal (16–18) ───────────────────────────────────────────────────
  { id: 16, text: "En Hong Kong *se* vive muy rápido, todo el mundo tiene prisa.", type: "impersonal" },
  { id: 17, text: "*Se* dice que el próximo examen de español va a ser bastante difícil.", type: "impersonal" },
  { id: 18, text: "En este restaurante *se* come de maravilla por muy poco dinero.", type: "impersonal" },

  // ── Pasiva refleja (19–21) ───────────────────────────────────────────────
  { id: 19, text: "*Se* venden entradas para el festival en la recepción de la universidad.", type: "pasiva" },
  { id: 20, text: "*Se* canceló la reunión de profesores a última hora por un imprevisto.", type: "pasiva" },
  { id: 21, text: "*Se* necesitan voluntarios para un proyecto de investigación este verano.", type: "pasiva" },
];

/**
 * Pick exactly one sentence per SeType (7 total), avoiding already-used IDs.
 * If all sentences of a type are excluded, resets just that type.
 * Returns the 7 sentences in a random order.
 */
export function pickSeSentences(excludeIds: number[] = []): SeSentence[] {
  const result: SeSentence[] = [];
  for (const type of SE_TYPES) {
    const pool = SE_POOL.filter((s) => s.type === type);
    let available = pool.filter((s) => !excludeIds.includes(s.id));
    if (available.length === 0) available = pool; // reset this type if exhausted
    result.push(available[Math.floor(Math.random() * available.length)]);
  }
  return result.sort(() => Math.random() - 0.5);
}
