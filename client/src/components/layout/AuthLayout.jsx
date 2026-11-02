import { Outlet } from 'react-router-dom';
import Logo from '../ui/Logo';
import { Layers, Radio, ShieldCheck, Terminal, Users, CheckCircle2, Zap } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[var(--color-paper)] text-[var(--color-ink)] relative overflow-hidden select-none">
      {/* Left Stage - Technical Showcase in Light Glass */}
      <div className="relative z-10 hidden lg:flex lg:w-[55%] p-10 xl:p-14 flex-col justify-between border-r border-slate-200/90 bg-white/75 backdrop-blur-xl">
        {/* Brand Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <Logo size={40} />
            <div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">
                DevCollab
              </span>
              <span className="block text-xs text-slate-500">
                Agile Engineering Matrix
              </span>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-xs text-indigo-700 font-semibold border border-slate-200">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Duplex Live Sync</span>
          </div>
        </div>

        {/* Hero Narrative & Live Telemetry Card */}
        <div className="my-auto max-w-xl space-y-7 py-6">
          <h1 className="text-4xl xl:text-5xl font-extrabold text-slate-900 leading-[1.12] tracking-tight">
            Build together,{' '}
            <span className="text-indigo-600">
              ship faster.
            </span>
          </h1>

          <p className="text-base text-slate-600 leading-relaxed">
            The collaborative sprint manager built for modern developer teams. Organize backlogs, transition cards across real-time Kanban lanes, and keep teams in continuous duplex synchronization.
          </p>

          {/* Interactive Live Telemetry Kanban Card Mockup */}
          <div className="glass-card-interactive p-6 space-y-4 shadow-xl border-slate-200/90 bg-white/90">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-xs font-semibold text-indigo-700 tracking-wide">
                  SPRINT #14 • IN PROGRESS
                </span>
              </div>
              <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full font-medium">
                P0 High Priority
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-900 leading-snug">
              Implement duplex WebSocket telemetry & interactive card physics
            </h3>

            {/* Checklist progress */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-indigo-600" />
                  3 of 4 acceptance criteria passed
                </span>
                <span className="text-indigo-600 font-semibold">75%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full w-3/4" />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1.5">
                  <div className="h-6 w-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">
                    NB
                  </div>
                  <div className="h-6 w-6 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold text-[10px]">
                    SK
                  </div>
                </div>
                <span className="text-xs text-slate-600 font-medium">4 active collaborators</span>
              </div>
              <span className="text-xs text-indigo-600 font-semibold flex items-center gap-1">
                <Radio className="h-3 w-3 text-emerald-500 animate-pulse" />
                Live Duplex
              </span>
            </div>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-3 gap-3.5 pt-1">
            <div className="p-4 rounded-[var(--radius-card)] bg-white/80 border border-slate-200/80 shadow-xs">
              <Layers className="h-5 w-5 text-indigo-600 mb-2" aria-hidden="true" />
              <p className="text-xs font-bold text-slate-900">Kanban Lanes</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Drag & drop physics</p>
            </div>
            <div className="p-4 rounded-[var(--radius-card)] bg-white/80 border border-slate-200/80 shadow-xs">
              <Terminal className="h-5 w-5 text-sky-600 mb-2" aria-hidden="true" />
              <p className="text-xs font-bold text-slate-900">WebSocket Bus</p>
              <p className="text-[11px] text-slate-500 mt-0.5">&lt;10ms broadcast</p>
            </div>
            <div className="p-4 rounded-[var(--radius-card)] bg-white/80 border border-slate-200/80 shadow-xs">
              <ShieldCheck className="h-5 w-5 text-emerald-600 mb-2" aria-hidden="true" />
              <p className="text-xs font-bold text-slate-900">Zero-Trust Guard</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Encrypted JWT auth</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200/80 text-xs text-slate-500 flex items-center justify-between">
          <span>DevCollab Engineering Platform</span>
          <span className="text-emerald-600 flex items-center gap-1.5 font-semibold">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            100% Operational
          </span>
        </div>
      </div>

      {/* Right Stage - Auth Form Canvas */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center p-6 sm:p-10 lg:p-16">
        <div className="w-full max-w-md">
          {/* Mobile Brand Header */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
            <Logo size={42} />
            <div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">
                DevCollab
              </span>
              <span className="block text-xs text-slate-500">
                Agile Engineering Matrix
              </span>
            </div>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
}
