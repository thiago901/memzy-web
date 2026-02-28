import { Avatar } from "./avatar";
import { ComboBadge } from "./combo-score";

export const ScoreCard = ({
  homeTeam = {
    id: "",
    name: "Wolves",
    logo: "",
    score: 2450,
    comboCount: 5,
  },
  awayTeam = {
    id: "",
    name: "Leicester",
    logo: "",
    score: 1820,
    comboCount: 7,
  },
  time = "12:45",
  isLive = true,
  turn = "",
}) => {
  const isHomeTurn = turn === homeTeam.id;

  return (
    <div
      className="
        w-full
        overflow-hidden rounded-2xl
        bg-slate-900/80 backdrop-blur
        border border-cyan-500/20
        shadow-lg shadow-cyan-500/10
      "
    >
      <div
        className="
          relative flex items-center justify-between
          p-3 sm:p-4
          bg-gradient-to-r
          from-cyan-500/10 via-slate-900 to-indigo-500/10
        "
      >
        {/* HOME */}
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-shrink-0">
            <div className={isHomeTurn ? "animated-border" : ""}>
              <Avatar photoURL={homeTeam.logo} email={homeTeam.name} />
            </div>

            {homeTeam.comboCount > 1 && (
              <div className="absolute -bottom-4 -right-4 scale-75">
                <ComboBadge combo={homeTeam.comboCount} />
              </div>
            )}
          </div>

          <span className="hidden sm:block text-xs font-bold uppercase tracking-wider text-cyan-200 truncate">
            {homeTeam.name}
          </span>
        </div>

        {/* CENTER */}
        <div className="flex flex-col items-center justify-center px-4 min-w-[110px]">
          <div className="flex items-baseline gap-2">
            <span
              className={`
                text-xl sm:text-2xl font-black tabular-nums
                ${isHomeTurn ? "text-cyan-400" : "text-slate-300"}
              `}
            >
              {homeTeam.score}
            </span>

            <span className="text-slate-500 font-bold text-sm">vs</span>

            <span
              className={`
                text-xl sm:text-2xl font-black tabular-nums
                ${!isHomeTurn ? "text-indigo-400" : "text-slate-300"}
              `}
            >
              {awayTeam.score}
            </span>
          </div>

          <div
            className="
              mt-1 flex items-center gap-1.5
              rounded-full
              bg-slate-800/80
              px-2.5 py-0.5
              border border-slate-700
            "
          >
            {isLive && (
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
            )}
            <span className="text-[10px] font-bold text-slate-300 uppercase">
              {time}
            </span>
          </div>
        </div>

        {/* AWAY */}
        <div className="flex flex-1 flex-row-reverse items-center gap-3 text-right">
          <div className="relative flex-shrink-0">
            <div className={!isHomeTurn ? "animated-border" : ""}>
              <Avatar photoURL={awayTeam.logo} email={awayTeam.name} />
            </div>

            {awayTeam.comboCount > 1 && (
              <div className="absolute -bottom-4 right-4 scale-75">
                <ComboBadge combo={awayTeam.comboCount} />
              </div>
            )}
          </div>

          <span className="hidden sm:block text-xs font-bold uppercase tracking-wider text-indigo-200 truncate">
            {awayTeam.name}
          </span>
        </div>
      </div>
    </div>
  );
};
