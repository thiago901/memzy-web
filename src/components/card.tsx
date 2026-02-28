type CardProps = {
  value?: string;
  flipped?: boolean;
  handleFlipCard: () => void;
};

export function Card({
  value = "🍎",
  flipped = false,
  handleFlipCard,
}: CardProps) {
  return (
    <button
      onClick={handleFlipCard}
      className="relative w-full h-full focus:outline-none"
      style={{ perspective: "1000px" }}
    >
      {/* elemento que gira */}
      <div
        className={`
          relative w-full h-full
          transition-transform duration-500 ease-out
          [transform-style:preserve-3d]
          ${flipped ? "[transform:rotateY(180deg)]" : ""}
        `}
      >
        {/* FRENTE */}
        <div
          className="
            absolute inset-0
            flex items-center justify-center
            rounded-xl
            bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900
            text-2xl
            text-cyan-300
            border border-cyan-400/30
            shadow-inner
            shadow-cyan-500/10
            [backface-visibility:hidden]
          "
        >
          ❓
        </div>

        {/* VERSO (inalterado) */}
        <div
          className="
            absolute inset-0
            flex items-center justify-center
            rounded-xl
            bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-500
            text-3xl
            shadow-lg shadow-cyan-500/40
            [transform:rotateY(180deg)]
            [backface-visibility:hidden]
          "
        >
          {value}
        </div>
      </div>
    </button>
  );
}
