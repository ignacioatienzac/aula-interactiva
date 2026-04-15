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

export type Challenge = TextInputChallenge | GrammarCategoriesChallenge | MorphologyChallenge;

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
    type: "text-input",
    challengeText: "[Reto #3 por definir]",
    correctAnswer: "[respuesta]",
  },
  {
    stopIndex: 4,
    locationName: "Plaza entre edificios",
    icon: "⛲",
    type: "text-input",
    challengeText: "[Reto #4 por definir]",
    correctAnswer: "[respuesta]",
  },
  {
    stopIndex: 5,
    locationName: "Zona del café",
    icon: "☕",
    type: "text-input",
    challengeText: "[Reto #5 por definir]",
    correctAnswer: "[respuesta]",
  },
  {
    stopIndex: 6,
    locationName: "Entrada edificio CRT",
    icon: "🏛️",
    type: "text-input",
    challengeText: "[Reto #6 por definir]",
    correctAnswer: "[respuesta]",
  },
  {
    stopIndex: 7,
    locationName: "Recepción CRT",
    icon: "🛎️",
    type: "text-input",
    challengeText: "[Reto #7 por definir]",
    correctAnswer: "[respuesta]",
  },
  {
    stopIndex: 8,
    locationName: "Ascensor CRT",
    icon: "🛗",
    type: "text-input",
    challengeText: "[Reto #8 por definir]",
    correctAnswer: "[respuesta]",
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
