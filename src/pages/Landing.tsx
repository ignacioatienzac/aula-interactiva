import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AvatarSelector from "@/components/AvatarSelector";
import { useGameContext } from "@/context/GameContext";

const Landing = () => {
  const { state, setPlayerName, setSelectedAvatar } = useGameContext();
  const [inputValue, setInputValue] = useState(state.playerName);
  const navigate = useNavigate();

  const handleStart = () => {
    if (inputValue.trim()) {
      setPlayerName(inputValue.trim());
      navigate("/game");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleStart();
  };

  return (
    <div className="min-h-screen bg-heist-bg laser-grid flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative corner brackets */}
      <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-heist-red opacity-60" />
      <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-heist-red opacity-60" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-heist-red opacity-60" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-heist-red opacity-60" />

      {/* Classification badge */}
      <div className="mb-6 px-4 py-1 border border-heist-red text-heist-red text-xs font-bold uppercase tracking-widest">
        ⚠ Misión clasificada — SPAN2030
      </div>

      {/* Main title */}
      <h1 className="mission-text text-4xl sm:text-5xl text-center mb-2 text-white">
        MISIÓN:
      </h1>
      <h2 className="mission-text text-3xl sm:text-4xl text-center mb-6 text-heist-red">
        ROBAR EL EXAMEN
      </h2>

      {/* Briefing text */}
      <div className="max-w-md text-center mb-8 border border-heist-red/30 bg-heist-red/5 rounded p-4">
        <p className="text-sm text-gray-300 leading-relaxed">
          Agente, tu misión es infiltrarte en{" "}
          <span className="text-heist-gold font-bold">CRT-5.22</span> y
          hacerte con el examen final de SPAN2030.
          <br />
          <br />
          Comenzarás en{" "}
          <span className="text-heist-gold font-bold">CPD-LG.35</span> y
          deberás superar <span className="text-heist-gold font-bold">10 obstáculos</span> por
          el Centennial Campus.
          <br />
          <br />
          <span className="text-heist-red font-bold">¿Aceptas la misión?</span>
        </p>
      </div>

      {/* Agent name input */}
      <div className="w-full max-w-sm mb-8 flex flex-col gap-2">
        <label className="text-xs uppercase tracking-widest text-heist-red font-bold text-center">
          Nombre en clave
        </label>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Introduce tu nombre..."
          maxLength={30}
          className="
            w-full bg-transparent border-b-2 border-heist-gold text-white text-center
            text-lg py-2 outline-none placeholder:text-gray-600
            focus:border-heist-red transition-colors duration-200
          "
        />
      </div>

      {/* Avatar selector */}
      <div className="mb-10">
        <AvatarSelector
          selected={state.selectedAvatar}
          onSelect={setSelectedAvatar}
        />
      </div>

      {/* Start button */}
      <button
        onClick={handleStart}
        disabled={!inputValue.trim()}
        className={`
          px-10 py-3 font-bold uppercase tracking-widest text-sm border-2 transition-all duration-200
          ${
            inputValue.trim()
              ? "border-heist-red bg-heist-red text-white hover:bg-transparent hover:text-heist-red cursor-pointer"
              : "border-gray-700 text-gray-600 cursor-not-allowed"
          }
        `}
      >
        ▶ ACEPTAR MISIÓN
      </button>

      {!inputValue.trim() && (
        <p className="mt-3 text-xs text-gray-600 uppercase tracking-wider">
          Introduce tu nombre para continuar
        </p>
      )}
    </div>
  );
};

export default Landing;
