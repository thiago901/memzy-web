type ComboBadgeProps = {
  combo: number;
};

export function ComboBadge({ combo }: ComboBadgeProps) {
  if (combo <= 0) return null;

  return (
    <div
      className="inline-flex items-center gap-1 rounded-full
      bg-gradient-to-r from-emerald-500/20 to-lime-500/20
      px-2 py-0.5 text-[10px] font-bold text-emerald-400
      border border-emerald-500/30
      shadow-[0_0_12px_rgba(16,185,129,0.25)]
      animate-pulse
    "
    >
      <span className="uppercase tracking-wide">combo</span>
      <span className="text-white">x{combo}</span>
    </div>
  );
}
