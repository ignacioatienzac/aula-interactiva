import { useState, useCallback } from "react";
import BoardSquare from "./BoardSquare";
import Dice from "./Dice";
import PlayerToken from "./PlayerToken";

const SQUARES = [
  { label: "Puerta de entrada", isStart: true, isEnd: false },
  { label: "Mesa 1", isStart: false, isEnd: false },
  { label: "Mesa 2", isStart: false, isEnd: false },
  { label: "Mesa 3", isStart: false, isEnd: false },
  { label: "Mesa 4", isStart: false, isEnd: false },
  { label: "Mesa 5", isStart: false, isEnd: false },
  { label: "Mesa 6", isStart: false, isEnd: false },
  { label: "Mesa 7", isStart: false, isEnd: false },
  { label: "Mesa 8", isStart: false, isEnd: false },
  { label: "Mesa 9", isStart: false, isEnd: false },
  { label: "Mesa 10", isStart: false, isEnd: false },
  { label: "Mesa 11", isStart: false, isEnd: false },
  { label: "Mesa 12", isStart: false, isEnd: false },
  { label: "Mesa 13", isStart: false, isEnd: false },
  { label: "Mesa 14", isStart: false, isEnd: false },
  { label: "Mesa 15", isStart: false, isEnd: false },
  { label: "Mesa del Profesor 😴", isStart: false, isEnd: true },
];

const PLAYER_NAMES = ["Jugador 1", "Jugador 2", "Jugador 3", "Jugador 4"];

const GameBoard = () => {
  const [positions, setPositions] = useState([0, 0, 0, 0]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [lastRoll, setLastRoll] = useState<number | null>(null);
  const [winner, setWinner] = useState<number | null>(null);
  const [message, setMessage] = useState("¡Tira el dado para empezar!");

  const handleRoll = useCallback(
    (value: number) => {
      if (winner !== null) return;

      setLastRoll(value);
      const currentPos = positions[currentPlayer];
      let newPos = currentPos + value;

      if (newPos >= SQUARES.length - 1) {
        newPos = SQUARES.length - 1;
        setWinner(currentPlayer);
        setMessage(`🎉 ¡${PLAYER_NAMES[currentPlayer]} ha robado el examen! ¡Victoria!`);
      } else {
        setMessage(
          `${PLAYER_NAMES[currentPlayer]} avanza a "${SQUARES[newPos].label}". Turno de ${PLAYER_NAMES[(currentPlayer + 1) % 4]}.`
        );
      }

      setPositions((prev) => {
        const next = [...prev];
        next[currentPlayer] = newPos;
        return next;
      });

      if (newPos < SQUARES.length - 1) {
        setTimeout(() => setCurrentPlayer((prev) => (prev + 1) % 4), 600);
      }
    },
    [currentPlayer, positions, winner]
  );

  const resetGame = () => {
    setPositions([0, 0, 0, 0]);
    setCurrentPlayer(0);
    setLastRoll(null);
    setWinner(null);
    setMessage("¡Tira el dado para empezar!");
  };

  // Which squares are "active" (have a player on them)
  const activeSquares = new Set(positions);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-wide">
          🏫 Aula CPD-LG.35
        </h1>
        <p className="text-chalk text-sm mt-1">
          ¡Roba el examen antes de que despierte el profesor!
        </p>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* Board */}
        <div className="flex-1">
          <div className="bg-chalkboard rounded-xl p-4 md:p-6 border-4 border-desk shadow-2xl">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-3">
              {SQUARES.map((sq, i) => (
                <BoardSquare
                  key={i}
                  index={i}
                  label={sq.label}
                  isStart={sq.isStart}
                  isEnd={sq.isEnd}
                  isActive={activeSquares.has(i)}
                  playersHere={positions
                    .map((pos, pi) => ({ index: pi, name: PLAYER_NAMES[pi], pos }))
                    .filter((p) => p.pos === i)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="lg:w-72 flex flex-col gap-4">
          {/* Players */}
          <div className="bg-card rounded-xl p-4 border border-border">
            <h2 className="text-primary font-bold mb-3 text-sm uppercase tracking-wider">
              Jugadores
            </h2>
            <div className="space-y-2">
              {PLAYER_NAMES.map((name, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                    currentPlayer === i && winner === null
                      ? "bg-secondary ring-1 ring-primary"
                      : ""
                  } ${winner === i ? "bg-primary/20 ring-1 ring-primary" : ""}`}
                >
                  <PlayerToken playerIndex={i} name={name} />
                  <div className="flex-1">
                    <span className="text-foreground text-sm font-medium">{name}</span>
                    <span className="text-muted-foreground text-xs block">
                      Casilla {positions[i] + 1}
                    </span>
                  </div>
                  {currentPlayer === i && winner === null && (
                    <span className="text-primary text-xs">◀ Turno</span>
                  )}
                  {winner === i && <span className="text-lg">🏆</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Dice */}
          <div className="bg-card rounded-xl p-4 border border-border flex flex-col items-center gap-3">
            <h2 className="text-primary font-bold text-sm uppercase tracking-wider">
              Dado
            </h2>
            <Dice onRoll={handleRoll} disabled={winner !== null} />
            {lastRoll && (
              <p className="text-chalk text-sm">
                Último tiro: <span className="text-primary font-bold text-lg">{lastRoll}</span>
              </p>
            )}
          </div>

          {/* Message */}
          <div className="bg-card rounded-xl p-4 border border-border">
            <p className="text-chalk text-sm text-center">{message}</p>
          </div>

          {/* Reset */}
          {winner !== null && (
            <button
              onClick={resetGame}
              className="bg-primary text-primary-foreground rounded-lg py-3 px-4 font-bold 
                hover:opacity-90 transition-opacity text-sm uppercase tracking-wider"
            >
              🔄 Nueva partida
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
