import { Outlet } from 'react-router-dom';
import {
  Zap,
  Sparkles,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowUpRight,
} from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-900 overflow-hidden">
      {/* Left Showcase Side */}
      <div className="relative hidden lg:flex lg:w-[54%] p-12 lg:p-16 flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-violet-950 text-white">
        {/* Animated Background Mesh & Orbs */}
        <div className="absolute -top-32 -left-32 w-[34rem] h-[34rem] bg-indigo-500/20 rounded-full blur-[110px] pointer-events-none animate-pulse-subtle" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-purple-500/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-28 left-1/4 w-80 h-80 bg-cyan-500/15 rounded-full blur-[90px] pointer-events-none" />

        {/* Top Header */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-11 w-11 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-400 text-white shadow-lg shadow-indigo-500/30">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-white">
                DevCollab
              </span>
              <span className="block text-[11px] font-semibold text-indigo-300 uppercase tracking-widest">
                Agile Matrix
              </span>
            </div>
          </div>
        </div>

        {/* Center Presentation: Headline & Floating Interactive Kanban Showcase */}
        <div className="relative z-10 my-auto space-y-8 max-w-xl">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-xs font-semibold text-indigo-300 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
              <span>Real-Time Collaborative Engineering</span>
            </div>

            <h1 className="text-4xl xl:text-5xl font-black tracking-tight text-white leading-[1.15]">
              Build together,{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                ship faster.
              </span>
            </h1>

            <p className="text-slate-300 text-base leading-relaxed max-w-lg">
              The collaborative sprint manager crafted for developers. Zero-latency WebSockets, physics-based Kanban boards, and role-based workspace permissions.
            </p>
          </div>

          {/* Interactive Floating Card Mockup */}
          <div className="relative group p-5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 shadow-2xl shadow-black/40 transition-all duration-300 hover:border-indigo-400/40 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-[11px] font-bold tracking-wide uppercase text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
                  Sprint Active
                </span>
                <span className="text-[11px] font-semibold text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-400/20">
                  High Priority
                </span>
              </div>
              <div className="flex items-center gap-1 text-slate-300 text-xs">
                <Clock className="h-3 w-3 text-indigo-300" />
                <span>Today, 6:00 PM</span>
              </div>
            </div>

            <h3 className="text-sm font-bold text-white mb-2 leading-snug">
              ⚡ Duplex WebSocket Synchronization & Live Task Delegation
            </h3>

            {/* Micro Progress Bar */}
            <div className="space-y-1.5 mb-4">
              <div className="flex justify-between text-[11px] text-slate-300">
                <span>Task Completion</span>
                <span className="font-bold text-indigo-300">85%</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-400 to-violet-400 rounded-full w-[85%]" />
              </div>
            </div>

            {/* Teammates Stack */}
            <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="h-6 w-6 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-[10px] text-white ring-2 ring-slate-900">
                    SB
                  </div>
                  <div className="h-6 w-6 rounded-full bg-purple-500 flex items-center justify-center font-bold text-[10px] text-white ring-2 ring-slate-900">
                    VD
                  </div>
                  <div className="h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-[10px] text-white ring-2 ring-slate-900">
                    +3
                  </div>
                </div>
                <span className="text-[11px] text-slate-300">collaborators active</span>
              </div>

              <span className="text-[11px] font-semibold text-indigo-300 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Live Room <ArrowUpRight className="h-3 w-3" />
              </span>
            </div>
          </div>

          {/* Value Badges */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <Layers className="h-4 w-4 text-indigo-400 mb-1" />
              <p className="text-xs font-bold text-white">Dynamic Kanban</p>
              <p className="text-[11px] text-slate-400">Physics drag & drop</p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <Zap className="h-4 w-4 text-purple-400 mb-1" />
              <p className="text-xs font-bold text-white">Socket Sync</p>
              <p className="text-[11px] text-slate-400">Instant multi-user</p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <ShieldCheck className="h-4 w-4 text-emerald-400 mb-1" />
              <p className="text-xs font-bold text-white">JWT Guard</p>
              <p className="text-[11px] text-slate-400">httpOnly cookies</p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <p>© 2026 DevCollab Engineering. Fast, reliable task tracking.</p>
          <div className="flex items-center gap-1 text-emerald-400 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Systems Operational</span>
          </div>
        </div>
      </div>

      {/* Right Interactive Form Container */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-16 bg-slate-50 relative">
        {/* Subtle background ambient glow on form side */}
        <div className="absolute top-12 right-12 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-12 left-12 w-72 h-72 bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
