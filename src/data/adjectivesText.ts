export type AdjPosition = "antes" | "después" | "ambas";

export interface AdjBlank {
  id: number;
  /** Form with adjective BEFORE the noun */
  beforeForm: string;
  /** Form with adjective AFTER the noun */
  afterForm: string;
  /** Correct position */
  correct: AdjPosition;
  /** Explanation shown in the solucionario panel (on success only) */
  explanation: string;
}

export interface AdjExercise {
  segments: string[];
  /**
   * blankAfterSegment[i] = id of the blank that comes after segments[i],
   * or null if there is no blank between segments[i] and segments[i+1].
   */
  blankAfterSegment: (number | null)[];
  blanks: AdjBlank[];
}

export const ADJ_EXERCISE: AdjExercise = {
  segments: [
    /* 0 */ "Érase una vez un ",
    /* 1 */ " que vivía en un ",
    /* 2 */ ". Un día, mientras caminaba por un ",
    /* 3 */ ", encontró una ",
    /* 4 */ " de madera escondida entre las raíces de un árbol centenario.\nAl abrirla, apareció una ",
    /* 5 */ " que lo miraba con curiosidad. Ella no parecía peligrosa, sino más bien una ",
    /* 6 */ " que esperaba su llegada. La mujer sostenía en sus manos un ",
    /* 7 */ " envuelto en seda.\n—He guardado esto para ti —dijo ella con ",
    /* 8 */ "—. Pero solo podrás abrirlo si demuestras que tienes un ",
    /* 9 */ ".\nEl caballero aceptó el reto. Sabía que aquel ",
    /* 10 */ " cambiaría su destino para siempre.",
  ],
  blankAfterSegment: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, null],
  blanks: [
    {
      id: 0,
      beforeForm: "valiente caballero",
      afterForm: "caballero valiente",
      correct: "antes",
      explanation:
        "\"Valiente caballero\" (antes): resalta la valentía como una cualidad casi fija e intrínseca del caballero.",
    },
    {
      id: 1,
      beforeForm: "lejano reino",
      afterForm: "reino lejano",
      correct: "ambas",
      explanation:
        "Ambas posiciones son correctas. \"Reino lejano\" especifica qué tipo de reino es. \"Lejano reino\" es una construcción muy literaria, propia de los cuentos.",
    },
    {
      id: 2,
      beforeForm: "oscuro bosque",
      afterForm: "bosque oscuro",
      correct: "ambas",
      explanation:
        "Ambas son correctas. Antes del sustantivo, enfatiza la atmósfera de peligro. Después, diferencia este bosque de uno luminoso.",
    },
    {
      id: 3,
      beforeForm: "marrón puerta",
      afterForm: "puerta marrón",
      correct: "después",
      explanation:
        "\"Puerta marrón\" (después): «marrón» es un adjetivo objetivo de color; los adjetivos de color siempre van después del sustantivo.",
    },
    {
      id: 4,
      beforeForm: "anciana mujer",
      afterForm: "mujer anciana",
      correct: "ambas",
      explanation:
        "Ambas son correctas. \"Anciana mujer\" (antes) hace hincapié en todo lo que ha vivido. \"Mujer anciana\" (después) diferencia a esta mujer de edad avanzada de otras posibles personas que hubieran podido abrir la puerta.",
    },
    {
      id: 5,
      beforeForm: "vieja amiga",
      afterForm: "amiga vieja",
      correct: "antes",
      explanation:
        "¡Ojo al cambio de significado! «Vieja amiga» (antes) = amiga desde hace mucho tiempo. «Amiga vieja» (después) = amiga de edad avanzada. Aquí el significado correcto es el de antes.",
    },
    {
      id: 6,
      beforeForm: "rectangular paquete",
      afterForm: "paquete rectangular",
      correct: "después",
      explanation:
        "\"Paquete rectangular\" (después): «rectangular» describe una forma geométrica objetiva, igual para todos. Los adjetivos objetivos van después del sustantivo.",
    },
    {
      id: 7,
      beforeForm: "cariñosa voz",
      afterForm: "voz cariñosa",
      correct: "después",
      explanation:
        "\"Voz cariñosa\" (después): la persona elige deliberadamente usar una voz cariñosa, lo que convierte el adjetivo en una descripción que diferencia esta voz de otras posibles.",
    },
    {
      id: 8,
      beforeForm: "buen corazón",
      afterForm: "corazón bueno",
      correct: "antes",
      explanation:
        "\"Buen corazón\" (antes): es una colocación fija en español para hablar de la bondad intrínseca de alguien. Nótese también la apócope: «bueno» → «buen» delante del sustantivo.",
    },
    {
      id: 9,
      beforeForm: "misterioso objeto",
      afterForm: "objeto misterioso",
      correct: "ambas",
      explanation:
        "Ambas son correctas. \"Objeto misterioso\" (después) clasifica o describe el objeto. \"Misterioso objeto\" (antes) crea suspense y da énfasis narrativo, muy apropiado en un cuento.",
    },
  ],
};

export const TOTAL_ADJ_BLANKS = ADJ_EXERCISE.blanks.length;
