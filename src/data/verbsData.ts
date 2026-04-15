export type VerbRole = "principal" | "auxiliar";
export type VerbTransitivity = "transitivo" | "intransitivo";
export type VerbVoice = "reflexivo" | "recíproco" | "ninguno";
export type VerbDefective = "defectivo" | "no defectivo";
export type VerbPredType = "predicativo" | "copulativo";

export interface VerbAnswers {
  role: VerbRole;
  transitivity: VerbTransitivity;
  voice: VerbVoice;
  defective: VerbDefective;
  predType: VerbPredType;
}

export type FieldKey = keyof VerbAnswers;

export interface VerbSentence {
  id: number;
  /** Sentence text. The verb to analyse is wrapped in **…** */
  text: string;
  answers: VerbAnswers;
}

// ─── 30-sentence pool ─────────────────────────────────────────────────────────

export const ALL_VERB_SENTENCES: VerbSentence[] = [
  {
    id: 1,
    text: "**Pareces** cansado, ¿has dormido bien?",
    answers: { role: "principal", transitivity: "intransitivo", voice: "ninguno", defective: "no defectivo", predType: "copulativo" },
  },
  {
    id: 2,
    text: "Mañana **va** a llover todo el día.",
    answers: { role: "auxiliar", transitivity: "intransitivo", voice: "ninguno", defective: "no defectivo", predType: "predicativo" },
  },
  {
    id: 3,
    text: "Voy a **comprar** fruta fresca en el mercado.",
    answers: { role: "principal", transitivity: "transitivo", voice: "ninguno", defective: "no defectivo", predType: "predicativo" },
  },
  {
    id: 4,
    text: "Mis hermanos **se abrazaron** al verse.",
    answers: { role: "principal", transitivity: "transitivo", voice: "recíproco", defective: "no defectivo", predType: "predicativo" },
  },
  {
    id: 5,
    text: "No **hay** entradas para el concierto.",
    answers: { role: "principal", transitivity: "transitivo", voice: "ninguno", defective: "defectivo", predType: "predicativo" },
  },
  {
    id: 6,
    text: "Lucía **se maquilla** antes de salir.",
    answers: { role: "principal", transitivity: "transitivo", voice: "reflexivo", defective: "no defectivo", predType: "predicativo" },
  },
  {
    id: 7,
    text: "Mis abuelos **son** de un pueblo pequeño.",
    answers: { role: "principal", transitivity: "intransitivo", voice: "ninguno", defective: "no defectivo", predType: "copulativo" },
  },
  {
    id: 8,
    text: "**Debes** estudiar más para el examen.",
    answers: { role: "auxiliar", transitivity: "intransitivo", voice: "ninguno", defective: "no defectivo", predType: "predicativo" },
  },
  {
    id: 9,
    text: "**Granizó** mucho durante la tormenta.",
    answers: { role: "principal", transitivity: "intransitivo", voice: "ninguno", defective: "defectivo", predType: "predicativo" },
  },
  {
    id: 10,
    text: "**He** terminado todos mis deberes.",
    answers: { role: "auxiliar", transitivity: "intransitivo", voice: "ninguno", defective: "no defectivo", predType: "predicativo" },
  },
  {
    id: 11,
    text: "Los jugadores se **saludaron** antes del partido.",
    answers: { role: "principal", transitivity: "transitivo", voice: "recíproco", defective: "no defectivo", predType: "predicativo" },
  },
  {
    id: 12,
    text: "**Estamos** muy felices con la noticia.",
    answers: { role: "principal", transitivity: "intransitivo", voice: "ninguno", defective: "no defectivo", predType: "copulativo" },
  },
  {
    id: 13,
    text: "**Suelo** salir a correr por las tardes.",
    answers: { role: "auxiliar", transitivity: "intransitivo", voice: "ninguno", defective: "defectivo", predType: "predicativo" },
  },
  {
    id: 14,
    text: "**Me afeito** cada dos días.",
    answers: { role: "principal", transitivity: "transitivo", voice: "reflexivo", defective: "no defectivo", predType: "predicativo" },
  },
  {
    id: 15,
    text: "Estoy **leyendo** un libro muy interesante.",
    answers: { role: "principal", transitivity: "transitivo", voice: "ninguno", defective: "no defectivo", predType: "predicativo" },
  },
  {
    id: 16,
    text: "En España **anochece** mucho más tarde en verano, casi a las 10pm.",
    answers: { role: "principal", transitivity: "intransitivo", voice: "ninguno", defective: "defectivo", predType: "predicativo" },
  },
  {
    id: 17,
    text: "**Puedo** ayudarte con las maletas.",
    answers: { role: "auxiliar", transitivity: "intransitivo", voice: "ninguno", defective: "no defectivo", predType: "predicativo" },
  },
  {
    id: 18,
    text: "Los amigos **se ayudan** en los momentos difíciles.",
    answers: { role: "principal", transitivity: "transitivo", voice: "recíproco", defective: "no defectivo", predType: "predicativo" },
  },
  {
    id: 19,
    text: "El coche **está** en el taller.",
    answers: { role: "principal", transitivity: "intransitivo", voice: "ninguno", defective: "no defectivo", predType: "copulativo" },
  },
  {
    id: 20,
    text: "**Había** mucha gente en la calle.",
    answers: { role: "principal", transitivity: "transitivo", voice: "ninguno", defective: "defectivo", predType: "predicativo" },
  },
  {
    id: 21,
    text: "Juan y María **se escriben** Whatsapps todos los días. ¿Estarán juntos?",
    answers: { role: "principal", transitivity: "transitivo", voice: "recíproco", defective: "no defectivo", predType: "predicativo" },
  },
  {
    id: 22,
    text: "**Quiero** viajar a Japón el año que viene.",
    answers: { role: "auxiliar", transitivity: "intransitivo", voice: "ninguno", defective: "no defectivo", predType: "predicativo" },
  },
  {
    id: 23,
    text: "El examen final de SPAN2030 **parece** bastante complicado.",
    answers: { role: "principal", transitivity: "intransitivo", voice: "ninguno", defective: "no defectivo", predType: "copulativo" },
  },
  {
    id: 24,
    text: "**Me despierto** siempre a las siete.",
    answers: { role: "principal", transitivity: "transitivo", voice: "reflexivo", defective: "no defectivo", predType: "predicativo" },
  },
  {
    id: 25,
    text: "En Hong Kong **amanece** a las siete en invierno.",
    answers: { role: "principal", transitivity: "intransitivo", voice: "ninguno", defective: "defectivo", predType: "predicativo" },
  },
  {
    id: 26,
    text: "¿Les **has** dicho la verdad a tus padres?",
    answers: { role: "auxiliar", transitivity: "intransitivo", voice: "ninguno", defective: "no defectivo", predType: "predicativo" },
  },
  {
    id: 27,
    text: "**Caminamos** por la playa cada mañana.",
    answers: { role: "principal", transitivity: "intransitivo", voice: "ninguno", defective: "no defectivo", predType: "predicativo" },
  },
  {
    id: 28,
    text: "Mis padres **se quieren** mucho, llevan juntos más de 20 años.",
    answers: { role: "principal", transitivity: "transitivo", voice: "recíproco", defective: "no defectivo", predType: "predicativo" },
  },
  {
    id: 29,
    text: "La película **fue** muy divertida, la voy a volver a ver.",
    answers: { role: "principal", transitivity: "intransitivo", voice: "ninguno", defective: "no defectivo", predType: "copulativo" },
  },
  {
    id: 30,
    text: "Yo siempre **me lavo** la cara con agua fría.",
    answers: { role: "principal", transitivity: "transitivo", voice: "reflexivo", defective: "no defectivo", predType: "predicativo" },
  },
];

// ─── Column metadata ──────────────────────────────────────────────────────────

export const VERB_FIELDS: FieldKey[] = [
  "role",
  "transitivity",
  "voice",
  "defective",
  "predType",
];

export const FIELD_META: Record<FieldKey, { header: string; options: { value: string; label: string }[] }> = {
  role: {
    header: "Princ./Aux.",
    options: [
      { value: "principal", label: "Principal" },
      { value: "auxiliar",  label: "Auxiliar" },
    ],
  },
  transitivity: {
    header: "Trans./Intrans.",
    options: [
      { value: "transitivo",   label: "Transitivo" },
      { value: "intransitivo", label: "Intransitivo" },
    ],
  },
  voice: {
    header: "Reflex./Recíp./ø",
    options: [
      { value: "ninguno",   label: "ø" },
      { value: "reflexivo", label: "Reflexivo" },
      { value: "recíproco", label: "Recíproco" },
    ],
  },
  defective: {
    header: "Defect./No def.",
    options: [
      { value: "no defectivo", label: "No defectivo" },
      { value: "defectivo",    label: "Defectivo" },
    ],
  },
  predType: {
    header: "Predic./Copul.",
    options: [
      { value: "predicativo", label: "Predicativo" },
      { value: "copulativo",  label: "Copulativo" },
    ],
  },
};

// ─── Selection helper ─────────────────────────────────────────────────────────

/** Pick 8 sentences at random, avoiding IDs in `excludeIds` when possible. */
export function pickVerbSentences(excludeIds?: number[]): VerbSentence[] {
  const excluded = new Set(excludeIds ?? []);
  const pool = ALL_VERB_SENTENCES.filter((s) => !excluded.has(s.id));
  const source = pool.length >= 8 ? pool : ALL_VERB_SENTENCES;
  return [...source].sort(() => Math.random() - 0.5).slice(0, 8);
}

/** Human-readable label for a given field value (for error display). */
export function fieldValueLabel(field: FieldKey, value: string): string {
  if (!value) return "—";
  return FIELD_META[field].options.find((o) => o.value === value)?.label ?? value;
}
