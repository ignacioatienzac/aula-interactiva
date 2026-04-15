/**
 * Data for Mission 7 — Ser, Estar y Haber.
 *
 * Each question has:
 *   segments  — text split around blank(s): length 2 → 1 blank, length 3 → 2 blanks
 *   options   — display labels for the <select>
 *   correct   — the correct option string (must match one of `options` exactly)
 *
 * For 2-blank questions the option string uses " / " as separator (e.g. "es / está").
 * Parts are recovered by splitting on " / ".
 */
export interface SerEstarHaberQuestion {
  id: number;
  segments: string[];
  options: string[];
  correct: string;
}

// ─── 48-question pool ─────────────────────────────────────────────────────────

export const ALL_SEH_QUESTIONS: SerEstarHaberQuestion[] = [
  {
    id: 1,
    segments: ["Perdone, ¿sabe si ", " algún cajero automático por aquí cerca?"],
    options: ["es", "está", "hay"],
    correct: "hay",
  },
  {
    id: 2,
    segments: ["La conferencia sobre nuevas tecnologías ", " en el salón de actos."],
    options: ["es", "está", "hay"],
    correct: "es",
  },
  {
    id: 3,
    segments: ["No te fíes de él, parece simpático pero en realidad ", " muy interesado."],
    options: ["es", "está", "hay"],
    correct: "es",
  },
  {
    id: 4,
    segments: ["¡Qué buena cara tienes! Se nota que ", " de vacaciones."],
    options: ["eres", "estás", "has"],
    correct: "estás",
  },
  {
    id: 5,
    segments: ["En esta ciudad ", " demasiada contaminación en invierno."],
    options: ["es", "está", "hay"],
    correct: "hay",
  },
  {
    // Two-blank question — options are compound: "A / B"
    id: 6,
    segments: ["Mi hermana ", " arquitecta, pero ahora mismo ", " en el paro."],
    options: ["es / está", "está / es", "hay / está"],
    correct: "es / está",
  },
  {
    id: 7,
    segments: ["Lo siento, no puedo hablar ahora, ", " conduciendo."],
    options: ["soy", "estoy", "he"],
    correct: "estoy",
  },
  {
    id: 8,
    segments: ["Espero que ", " tenido un buen viaje de vuelta a Hong Kong."],
    options: ["has", "hayas", "habías"],
    correct: "hayas",
  },
  {
    id: 9,
    segments: ["El coche de mi abuelo ", " muy viejo, pero funciona perfectamente."],
    options: ["es", "está", "hay"],
    correct: "está",
  },
  {
    id: 10,
    segments: ["¿Te puedes creer que todavía no ", " llegado el profesor?"],
    options: ["es", "está", "ha"],
    correct: "ha",
  },
  {
    id: 11,
    segments: ["La fiesta de cumpleaños de Lucía ", " en un barco el sábado pasado."],
    options: ["fue", "estuvo", "hubo"],
    correct: "fue",
  },
  {
    id: 12,
    segments: ["Tienes que ", " más puntual si no quieres tener problemas con el jefe."],
    options: ["ser", "estar", "haber"],
    correct: "ser",
  },
  {
    id: 13,
    segments: ["No entres en la cocina, el suelo ", " recién fregado."],
    options: ["es", "está", "hay"],
    correct: "está",
  },
  {
    id: 14,
    segments: ["En el siglo XIX no ", " Internet, la gente se escribía cartas."],
    options: ["era", "estaba", "había"],
    correct: "había",
  },
  {
    id: 15,
    segments: ["¡Oye! ¿Quién ", " ese chico que te ha saludado de forma tan rara?"],
    options: ["es", "está", "hay"],
    correct: "es",
  },
  {
    id: 16,
    segments: ["Estoy preocupado porque mi perro ", " muy raro hoy, no quiere comer."],
    options: ["es", "está", "hay"],
    correct: "está",
  },
  {
    id: 17,
    segments: ["No creo que ", " mucha gente en el cine un lunes por la mañana."],
    options: ["sea", "esté", "haya"],
    correct: "haya",
  },
  {
    id: 18,
    segments: ["El Real Madrid ", " el equipo con más títulos de la Champions."],
    options: ["es", "está", "hay"],
    correct: "es",
  },
  {
    id: 19,
    segments: ["Si me ", " avisado antes, te habría ido a buscar al aeropuerto."],
    options: ["habrías", "hubieras", "habías"],
    correct: "hubieras",
  },
  {
    id: 20,
    segments: ["El examen final ", " el próximo día 15 de mayo a las nueve."],
    options: ["será", "estará", "habrá"],
    correct: "será",
  },
  {
    id: 21,
    segments: ["Mi madre ", " muy joven para su edad, parece mi hermana."],
    options: ["es", "está", "hay"],
    correct: "está",
  },
  {
    id: 22,
    segments: ["Me encanta este barrio porque ", " mucha vida y muchas tiendas."],
    options: ["es", "está", "hay"],
    correct: "hay",
  },
  {
    id: 23,
    segments: ["Juan ", " muy despistado, siempre pierde las llaves de casa."],
    options: ["es", "está", "hay"],
    correct: "es",
  },
  {
    id: 24,
    segments: ["¿Dónde ", " los libros que te presté el mes pasado?"],
    options: ["son", "están", "hay"],
    correct: "están",
  },
  {
    id: 25,
    segments: ["", " de ser muy difícil aprender español en tan poco tiempo."],
    options: ["Es", "Está", "Ha"],
    correct: "Ha",
  },
  {
    id: 26,
    segments: ["El café de esta cafetería ", " riquísimo, tienes que probarlo."],
    options: ["es", "está", "hay"],
    correct: "está",
  },
  {
    id: 27,
    segments: ["Dicen que ha ", " cambios importantes en la dirección de la empresa."],
    options: ["sido", "estado", "habido"],
    correct: "habido",
  },
  {
    id: 28,
    segments: ["No ", " para bromas hoy, he tenido un día horrible en el trabajo."],
    options: ["soy", "estoy", "he"],
    correct: "estoy",
  },
  {
    id: 29,
    segments: ["La mesa de la oficina ", " de cristal, así que ten cuidado."],
    options: ["es", "está", "hay"],
    correct: "es",
  },
  {
    id: 30,
    segments: ["Me parece que ", " un error en tu factura, revísala bien."],
    options: ["es", "está", "hay"],
    correct: "hay",
  },
  {
    id: 31,
    segments: ["Cuando ", " terminado de leer el informe, dímelo."],
    options: ["has", "hayas", "habías"],
    correct: "hayas",
  },
  {
    id: 32,
    segments: ["Madrid ", " en el centro de la Península Ibérica."],
    options: ["es", "está", "hay"],
    correct: "está",
  },
  {
    id: 33,
    segments: ["Mi mejor amigo ", " de Sevilla, pero vive en Londres."],
    options: ["es", "está", "hay"],
    correct: "es",
  },
  {
    id: 34,
    segments: ["Para ser un hotel de cinco estrellas, el servicio ", " muy mal."],
    options: ["es", "está", "hay"],
    correct: "está",
  },
  {
    id: 35,
    segments: ["No te preocupes, no ", " pasado nada grave, solo un susto."],
    options: ["has", "hay", "ha"],
    correct: "ha",
  },
  {
    id: 36,
    segments: ["¿Sabes si ", " algún voluntario para el proyecto de verano?"],
    options: ["es", "está", "hay"],
    correct: "hay",
  },
  {
    id: 37,
    segments: ["", " obvio que no ha estudiado nada para la presentación."],
    options: ["Es", "Está", "Hay"],
    correct: "Es",
  },
  {
    id: 38,
    segments: ["Las ventanas de mi casa ", " muy grandes y entra mucha luz."],
    options: ["son", "están", "hay"],
    correct: "son",
  },
  {
    id: 39,
    segments: ["Los documentos que buscas ", " encima de mi escritorio."],
    options: ["son", "están", "hay"],
    correct: "están",
  },
  {
    id: 40,
    segments: ["Si no ", " tanta gente en la cola, entraríamos al museo."],
    options: ["fuera", "estuviera", "hubiera"],
    correct: "hubiera",
  },
  {
    id: 41,
    segments: ["Ramón ", " abogado y el año pasado creó su propia empresa."],
    options: ["es", "está", "hay"],
    correct: "es",
  },
  {
    id: 42,
    segments: ["Debes ", " más claro con tus respuestas o nadie te va a entender."],
    options: ["ser", "estar", "haber"],
    correct: "ser",
  },
  {
    id: 43,
    segments: ["Nuestra clase de gramática ", " en el aula CPD-LG.35."],
    options: ["es", "está", "hay"],
    correct: "es",
  },
  {
    id: 44,
    segments: ["Pepe ", " muy aburrido, no quiero salir con él."],
    options: ["es", "está", "hay"],
    correct: "es",
  },
  {
    id: 45,
    segments: ["Pepa ", " muy aburrida, ¡casi se duerme en clase!"],
    options: ["es", "está", "hay"],
    correct: "está",
  },
  {
    id: 46,
    segments: ["Ha ", " un accidente en una carretera que va a Sham Shui Po."],
    options: ["sido", "estado", "habido"],
    correct: "habido",
  },
  {
    id: 47,
    segments: ["Compré el coche hace 15 años, pero como casi no lo he usado ", " como nuevo."],
    options: ["es", "está", "hay"],
    correct: "está",
  },
  {
    id: 48,
    segments: ["Cuando ", " vivido lo que he vivido yo, podrás opinar."],
    options: ["has", "hayas", "habías"],
    correct: "hayas",
  },
];

// ─── Selection helper ─────────────────────────────────────────────────────────

/** Pick 15 questions at random, avoiding IDs in `excludeIds` when possible. */
export function pickSEHQuestions(excludeIds?: number[]): SerEstarHaberQuestion[] {
  const excluded = new Set(excludeIds ?? []);
  const pool = ALL_SEH_QUESTIONS.filter((q) => !excluded.has(q.id));
  const source = pool.length >= 15 ? pool : ALL_SEH_QUESTIONS;
  return [...source].sort(() => Math.random() - 0.5).slice(0, 15);
}

/** Human-readable sentence text for error display (replaces blank(s) with ___). */
export function questionText(q: SerEstarHaberQuestion): string {
  if (q.segments.length === 2) {
    return `${q.segments[0]}___${q.segments[1]}`;
  }
  return `${q.segments[0]}___${q.segments[1]}___${q.segments[2]}`;
}

// ─── Timer ────────────────────────────────────────────────────────────────────

export const TOTAL_TIME = 90; // seconds
export const QUESTION_COUNT = 15;
