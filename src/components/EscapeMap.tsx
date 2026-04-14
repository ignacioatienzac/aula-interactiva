import { useNavigate } from "react-router-dom";
import { useGameContext, AVATARS } from "@/context/GameContext";
import { STOPS, CHALLENGES } from "@/data/challenges";
import LocationStop from "./LocationStop";
import ChallengeModal from "./ChallengeModal";

// Layout: split the 12 stops into rows for a zigzag path
// Row 1 (left→right): stops 0-3
// Row 2 (right→left): stops 4-7
// Row 3 (left→right): stops 8-11
const ROW_1 = [0, 1, 2, 3];
const ROW_2 = [4, 5, 6, 7];
const ROW_3 = [8, 9, 10, 11];

const EscapeMap = () => {
  const { state, openModal, closeModal } = useGameContext();
  const navigate = useNavigate();
  const { currentStop, modalOpen, activeStop, completedChallenges, playerName, selectedAvatar } = state;

  const isVictory = currentStop >= 11;

  const getStopStatus = (index: number): "completed" | "active" | "locked" => {
    if (index < currentStop) return "completed";
    if (index === currentStop) return "active";
    return "locked";
  };

  const activeChallenge = activeStop !== null
    ? CHALLENGES.find((c) => c.stopIndex === activeStop)
    : null;

  const avatar = AVATARS[selectedAvatar];

  const renderRow = (indices: number[], reversed: boolean) => (
    <div className={`flex items-center gap-2 sm:gap-4 ${reversed ? "flex-row-reverse" : "flex-row"}`}>
      {indices.map((stopIdx, i) => {
        const stop = STOPS[stopIdx];
        const status = getStopStatus(stopIdx);
        // Connector line between stops
        const showConnector = i < indices.length - 1;
        // Color the connector based on the "earlier" stop's status
        const connectorStatus = getStopStatus(stopIdx);

        return (
          <div key={stopIdx} className={`flex items-center gap-2 sm:gap-4 ${reversed ? "flex-row-reverse" : "flex-row"}`}>
            <LocationStop
              index={stopIdx}
              label={stop.label}
              icon={stop.icon}
              sublabel={stop.sublabel}
              isStart={stop.isStart}
              isEnd={stop.isEnd}
              status={status}
              onClick={status === "active" && !stop.isStart && !stop.isEnd ? () => openModal(stopIdx) : undefined}
            />
            {showConnector && (
              <div
                className={`h-0.5 w-8 sm:w-12 flex-shrink-0 transition-all duration-500
                  ${connectorStatus === "completed" ? "bg-heist-green" : ""}
                  ${connectorStatus === "active" ? "bg-heist-red" : ""}
                  ${connectorStatus === "locked" ? "bg-gray-700" : ""}
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );

  // Vertical connector between rows
  const VerticalConnector = ({ rowEndStopIdx }: { rowEndStopIdx: number }) => {
    const status = getStopStatus(rowEndStopIdx);
    return (
      <div className="flex justify-end pr-4 sm:pr-8">
        <div
          className={`w-0.5 h-8 transition-all duration-500
            ${status === "completed" ? "bg-heist-green" : "bg-gray-700"}
          `}
        />
      </div>
    );
  };

  const VerticalConnectorLeft = ({ rowEndStopIdx }: { rowEndStopIdx: number }) => {
    const status = getStopStatus(rowEndStopIdx);
    return (
      <div className="flex justify-start pl-4 sm:pl-8">
        <div
          className={`w-0.5 h-8 transition-all duration-500
            ${status === "completed" ? "bg-heist-green" : "bg-gray-700"}
          `}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-heist-bg laser-grid flex flex-col">
      {/* Victory overlay */}
      {isVictory && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-6 text-center">
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-heist-gold opacity-60" />
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-heist-gold opacity-60" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-heist-gold opacity-60" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-heist-gold opacity-60" />

          <div className="text-6xl mb-4">{avatar.emoji}</div>
          <p className="text-heist-gold text-sm uppercase tracking-widest font-bold mb-2">
            Misión completada, agente
          </p>
          <h1 className="mission-text text-5xl sm:text-6xl text-heist-red mb-2">
            EXAMEN
          </h1>
          <h2 className="mission-text text-4xl sm:text-5xl text-heist-red mb-6">
            ROBADO
          </h2>
          <p className="text-gray-300 text-sm mb-8">
            <span className="text-white font-bold">{playerName}</span> se ha infiltrado en CRT-5.22<br />
            y ha tomado el examen final de SPAN2030.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-10 py-3 border-2 border-heist-gold text-heist-gold font-bold uppercase tracking-widest text-sm hover:bg-heist-gold hover:text-black transition-all duration-200"
          >
            ▶ NUEVA MISIÓN
          </button>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-heist-red/30 bg-heist-bg/90 px-4 py-3 flex items-center justify-between sticky top-0 z-10 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${avatar.color}`}>
            {avatar.emoji}
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Agente</p>
            <p className="text-heist-gold font-bold text-sm uppercase tracking-wide">{playerName}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex flex-col items-end gap-1">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">
            Objetivos: {Math.min(currentStop, 10)}/10
          </p>
          <div className="w-32 h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-heist-gold transition-all duration-500"
              style={{ width: `${(Math.min(currentStop, 10) / 10) * 100}%` }}
            />
          </div>
        </div>
      </header>

      {/* Map area */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 gap-0">
        {/* Title */}
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-widest text-heist-red font-bold mb-1">
            Mapa táctico
          </p>
          <h2 className="mission-text text-xl text-white">
            CENTENNIAL CAMPUS — HKU
          </h2>
        </div>

        {/* Zigzag map */}
        <div className="flex flex-col">
          {renderRow(ROW_1, false)}
          <VerticalConnector rowEndStopIdx={3} />
          {renderRow(ROW_2, true)}
          <VerticalConnectorLeft rowEndStopIdx={7} />
          {renderRow(ROW_3, false)}
        </div>
      </main>

      {/* Challenge modal */}
      {modalOpen && activeChallenge && (
        <ChallengeModal challenge={activeChallenge} onClose={closeModal} />
      )}
    </div>
  );
};

export default EscapeMap;
