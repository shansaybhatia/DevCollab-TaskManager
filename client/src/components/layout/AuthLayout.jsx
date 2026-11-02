import { Outlet } from 'react-router-dom';
import Logo from '../ui/Logo';
import { Layers, Radio, ShieldCheck, Terminal, Users } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[var(--color-paper)] text-[var(--color-ink)] relative overflow-hidden">
      {/* Background Dusk Scrim Elements */}
      <div className="absolute -top-40 -left-40 w-[36rem] h-[36rem] rounded-full bg-[color-mix(in_oklch,var(--color-accent)_8%,transparent)] blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 -right-40 w-[32rem] h-[32rem] rounded-full bg-[color-mix(in_oklch,var(--color-accent-2)_6%,transparent)] blur-[130px] pointer-events-none" />

      {/* Left Stage */}
      <div className="relative z-10 hidden lg:flex lg:w-[52%] p-12 lg:p-16 flex-col justify-between border-r border-[var(--color-rule)] bg-[color-mix(in_oklch,var(--color-paper-2)_60%,transparent)] backdrop-blur-md">
        {/* Brand Header */}
        <div className="flex items-center gap-3.5">
          <Logo size={42} />
          <div>
            <span className="text-lg font-bold text-[var(--color-ink)] tracking-tight">
              DevCollab
            </span>
            <span className="block text-xs font-mono text-[var(--color-muted)]">
              Agile Engineering Matrix
            </span>
          </div>
        </div>

        {/* Hero Narrative */}
        <div className="my-auto max-w-lg space-y-8 py-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[var(--radius-pill)] glass-panel text-xs text-[var(--color-accent)] font-medium">
            <Radio className="h-3.5 w-3.5 text-[var(--color-accent)] animate-pulse" aria-hidden="true" />
            <span>Duplex WebSocket Synchronization Active</span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-bold text-[var(--color-ink)] leading-[1.15] tracking-tight">
            Build together,{' '}
            <span className="text-[var(--color-accent)]">
              ship faster.
            </span>
          </h1>

          <p className="text-base text-[var(--color-ink-2)] leading-relaxed">
            The collaborative sprint manager for developer teams. Move cards smoothly across real-time Kanban boards with zero-latency synchronization.
          </p>

          {/* Interactive Smoked Glass Mockup Panel */}
          <div className="glass-panel p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
                <span className="text-xs font-medium text-[var(--color-accent)]">
                  Sprint in progress
                </span>
              </div>
              <span className="text-xs text-[var(--color-accent-2)] bg-[color-mix(in_oklch,var(--color-accent-2)_15%,transparent)] px-2.5 py-0.5 rounded-[var(--radius-pill)] font-mono">
                high priority
              </span>
            </div>

            <p className="text-sm font-semibold text-[var(--color-ink)] leading-snug">
              Implement duplex WebSocket events for real-time card transitions
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-[var(--color-rule)] text-xs text-[var(--color-muted)]">
              <div className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Active workspace session</span>
              </div>
              <span className="font-mono text-[var(--color-accent)]">Live sync</span>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-[var(--radius-card)] glass-panel">
              <Layers className="h-4 w-4 text-[var(--color-accent)] mb-2" aria-hidden="true" />
              <p className="text-xs font-semibold text-[var(--color-ink)]">Kanban lanes</p>
              <p className="text-[11px] text-[var(--color-muted)] mt-0.5">Drag & drop</p>
            </div>
            <div className="p-3.5 rounded-[var(--radius-card)] glass-panel">
              <Terminal className="h-4 w-4 text-[var(--color-accent-2)] mb-2" aria-hidden="true" />
              <p className="text-xs font-semibold text-[var(--color-ink)]">WebSockets</p>
              <p className="text-[11px] text-[var(--color-muted)] mt-0.5">Instant sync</p>
            </div>
            <div className="p-3.5 rounded-[var(--radius-card)] glass-panel">
              <ShieldCheck className="h-4 w-4 text-[var(--color-ok)] mb-2" aria-hidden="true" />
              <p className="text-xs font-semibold text-[var(--color-ink)]">Session guard</p>
              <p className="text-[11px] text-[var(--color-muted)] mt-0.5">Encrypted JWT</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[var(--color-rule)] text-xs text-[var(--color-muted)] flex items-center justify-between">
          <span>DevCollab engineering workspace</span>
          <span className="text-[var(--color-ok)] flex items-center gap-1 font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-ok)]" />
            Operational
          </span>
        </div>
      </div>

      {/* Right Form Container */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
