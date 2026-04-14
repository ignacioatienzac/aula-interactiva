import { createContext, useContext, ReactNode } from "react";
import { useGameState, GameState, AVATARS } from "@/hooks/use-game-state";

interface GameContextValue {
  state: GameState;
  setPlayerName: (name: string) => void;
  setSelectedAvatar: (index: number) => void;
  openModal: (stopIndex: number) => void;
  closeModal: () => void;
  submitAnswer: (challengeIndex: number, answer: string, correctAnswer: string) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const gameState = useGameState();
  return <GameContext.Provider value={gameState}>{children}</GameContext.Provider>;
};

export const useGameContext = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGameContext must be used inside GameProvider");
  return ctx;
};

// Re-export for convenience so components can import from one place
export { AVATARS };
