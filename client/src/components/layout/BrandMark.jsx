export default function BrandMark({ compact = false, inverted = false }) {
  const colorClasses = inverted ? "text-white" : "text-slate-950";
  const subtleClasses = inverted ? "text-slate-300" : "text-slate-500";

  return (
    <div className={`flex items-center gap-3 ${colorClasses}`}>
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-teal-400 text-sm font-bold text-white shadow-lg shadow-sky-500/25">
        D
      </div>
      <div className={compact ? "leading-tight" : "space-y-0.5"}>
        <p className="text-sm font-semibold uppercase tracking-[0.3em]">
          DevCollab
        </p>
        <p className={`text-xs ${subtleClasses}`}>Collaborative task manager</p>
      </div>
    </div>
  );
}
