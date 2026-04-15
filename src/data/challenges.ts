interface ChallengeBase {
  stopIndex: number;
  locationName: string;
  icon: string;
}

export interface TextInputChallenge extends ChallengeBase {
  type: "text-input";
  challengeText: string;
  correctAnswer: string;
}

export interface GrammarCategoriesChallenge extends ChallengeBase {
  type: "grammar-categories";
}

export interface MorphologyChallenge extends ChallengeBase {
  type: "morphology";
}

export interface DeterminantsChallenge extends ChallengeBase {
  type: "determinants";
}

export interface NounsChallenge extends ChallengeBase {
  type: "nouns";
}

export interface AdjectivesChallenge extends ChallengeBase {
  type: "adjectives";
}

export interface VerbsChallenge extends ChallengeBase {
  type: "verbs";
}

export interface SerEstarHaberChallenge extends ChallengeBase {
  type: "ser-estar-haber";
}

export interface LosUsosDeLoChallenge extends ChallengeBase {
  type: "los-usos-de-lo";
}

export type Challenge = TextInputChallenge | GrammarCategoriesChallenge | MorphologyChallenge | DeterminantsChallenge | NounsChallenge | AdjectivesChallenge | VerbsChallenge | SerEstarHaberChallenge | LosUsosDeLoChallenge;

// stopIndex 0 = CPD-LG.35 (inicio, sin reto)
// stopIndex 11 = CRT-5.22 (final, sin reto)
// Los retos están en stopIndex 1 a 10

export const STOPS = [
  { index: 0,  label: "CPD-LG.35",               icon: "🚪", sublabel: "Punto de partida",   isStart: true,  isEnd: false },
  { index: 1,  label: "Pasillo sótano CPD",       icon: "🚶", sublabel: "Reto #1",            isStart: false, isEnd: false },
  { index: 2,  label: "Recepción CPD",            icon: "🏢", sublabel: "Reto #2",            isStart: false, isEnd: false },
  { index: 3,  label: "Salida exterior CPD",      icon: "🌳", sublabel: "Reto #3",            isStart: false, isEnd: false },
  { index: 4,  label: "Plaza entre edificios",    icon: "⛲", sublabel: "Reto #4",            isStart: false, isEnd: false },
  { index: 5,  label: "Zona del café",            icon: "☕", sublabel: "Reto #5",            isStart: false, isEnd: false },
  { index: 6,  label: "Entrada edificio CRT",     icon: "🏛️", sublabel: "Reto #6",            isStart: false, isEnd: false },
  { index: 7,  label: "Recepción CRT",            icon: "🛎️", sublabel: "Reto #7",            isStart: false, isEnd: false },
  { index: 8,  label: "Ascensor CRT",             icon: "🛗", sublabel: "Reto #8",            isStart: false, isEnd: false },
  { index: 9,  label: "Pasillo piso 5",           icon: "🔦", sublabel: "Reto #9",            isStart: false, isEnd: false },
  { index: 10, label: "Puerta CRT-5.22",          icon: "🔐", sublabel: "Reto #10 — Último", isStart: false, isEnd: false },
  { index: 11, label: "CRT-5.22",                 icon: "🏆", sublabel: "¡El examen!",        isStart: false, isEnd: true  },
];

export const CHALLENGES: Challenge[] = [
  {
    stopIndex: 1,
    locationName: "Pasillo sótano CPD",
    icon: "🚶",
    type: "grammar-categories",
  },
  {
    stopIndex: 2,
    locationName: "Recepción CPD",
    icon: "🏢",
    type: "morphology",
  },
  {
    stopIndex: 3,
    locationName: "Salida exterior CPD",
    icon: "🌳",
    type: "determinants",
  },
  {
    stopIndex: 4,
    locationName: "Plaza entre edificios",
    icon: "⛲",
    type: "nouns",
  },
  {
    stopIndex: 5,
    locationName: "Zona del café",
    icon: "☕",
    type: "adjectives",
  },
  {
    stopIndex: 6,
    locationName: "Entrada edificio CRT",
    icon: "🏛️",
    type: "verbs",
  },
  {
    stopIndex: 7,
    locationName: "Recepción CRT",
    icon: "🛎️",
    type: "ser-estar-haber",
  },
  {
    stopIndex: 8,
    locationName: "Ascensor CRT",
    icon: "🛗",
    type: "los-usos-de-lo",
  },
  {
    stopIndex: 9,
    locationName: "Pasillo piso 5",
    icon: "🔦",
    type: "text-input",
    challengeText: "[Reto #9 por definir]",
    correctAnswer: "[respuesta]",
  },
  {
    stopIndex: 10,
    locationName: "Puerta CRT-5.22",
    icon: "🔐",
    type: "text-input",
    challengeText: "[Reto #10 por definir — el último obstáculo antes de entrar]",
    correctAnswer: "[respuesta]",
  },
];
