import { useState, useCallback } from "react";

export const AVATARS = [
  { emoji: "🕵️", label: "El espía", color: "bg-red-600" },
  { emoji: "🥷", label: "El ninja", color: "bg-slate-700" },
  { emoji: "🦹", label: "El villano", color: "bg-purple-700" },
  { emoji: "🎭", label: "El actor", color: "bg-blue-600" },
  { emoji: "🧤", label: "El ladrón", color: "bg-amber-600" },
  { emoji: "👓", label: "El genio", color: "bg-green-700" },
];

export interface GameState {
  playerName: string;
  selectedAvatar: number;
  currentStop: number;
  completedChallenges: boolean[];
  modalOpen: boolean;
  activeStop: number | null;
  answerStatus: null | "correct" | "wrong";
}

const initialState: GameState = {
  playerName: "",
  selectedAvatar: 0,
  currentStop: 1,
  completedChallenges: Array(10).fill(false),
  modalOpen: false,
  activeStop: null,
  answerStatus: null,
};

export function useGameState() {
  const [state, setState] = useState<GameState>(initialState);

  const setPlayerName = useCallback((name: string) => {
    setState((prev) => ({ ...prev, playerName: name }));
  }, []);

  const setSelectedAvatar = useCallback((index: number) => {
    setState((prev) => ({ ...prev, selectedAvatar: index }));
  }, []);

  const openModal = useCallback((stopIndex: number) => {
    setState((prev) => ({
      ...prev,
      modalOpen: true,
      activeStop: stopIndex,
      answerStatus: null,
    }));
  }, []);

  const closeModal = useCallback(() => {
    setState((prev) => ({
      ...prev,
      modalOpen: false,
      activeStop: null,
      answerStatus: null,
    }));
  }, []);

  const submitAnswer = useCallback(
    (challengeIndex: number, answer: string, correctAnswer: string) => {
      const isCorrect =
        answer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();

      if (isCorrect) {
        setState((prev) => {
          const newCompleted = [...prev.completedChallenges];
          newCompleted[challengeIndex] = true;
          return {
            ...prev,
            completedChallenges: newCompleted,
            currentStop: prev.currentStop + 1,
            answerStatus: "correct",
          };
        });
        // Close modal after showing success briefly
        setTimeout(() => {
          setState((prev) => ({
            ...prev,
            modalOpen: false,
            activeStop: null,
            answerStatus: null,
          }));
        }, 1500);
      } else {
        setState((prev) => ({ ...prev, answerStatus: "wrong" }));
        // Reset wrong status after animation
        setTimeout(() => {
          setState((prev) => ({ ...prev, answerStatus: null }));
        }, 800);
      }
    },
    []
  );

  const completeChallenge = useCallback((challengeIndex: number) => {
    setState((prev) => {
      const newCompleted = [...prev.completedChallenges];
      newCompleted[challengeIndex] = true;
      return {
        ...prev,
        completedChallenges: newCompleted,
        currentStop: prev.currentStop + 1,
        modalOpen: false,
        activeStop: null,
        answerStatus: null,
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    setState(initialState);
  }, []);

  /** DEV ONLY — jump to any stop for testing */
  const debugSetStop = useCallback((n: number) => {
    setState((prev) => ({ ...prev, currentStop: Math.max(1, Math.min(11, n)), modalOpen: false, activeStop: null }));
  }, []);

  return {
    state,
    setPlayerName,
    setSelectedAvatar,
    openModal,
    closeModal,
    submitAnswer,
    completeChallenge,
    resetGame,
    debugSetStop,
  };
}
