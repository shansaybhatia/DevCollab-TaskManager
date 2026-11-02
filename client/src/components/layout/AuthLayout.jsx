import { Outlet } from 'react-router-dom';
import Logo from '../ui/Logo';
import { Layers, Radio, ShieldCheck, Terminal } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[var(--color-paper)] text-[var(--color-ink)]">
      {/* Left Stage */}
      <div className="hidden lg:flex lg:w-1/2 p-12 lg:p-16 flex-col justify-between border-r border-[var(--color-rule)] bg-[var(--color-paper-2)]">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Logo size={36} />
          <div>
            <span className="text-base font-semibold text-[var(--color-ink)] tracking-tight">
              DevCollab
            </span>
            <span className="block text-[11px] font-mono text-[var(--color-muted)]">
              Agile project matrix
            </span>
          </div>
        </div>

        {/* Narrative */}
        <div className="my-auto max-w-md space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[var(--radius-pill)] bg-[var(--color-paper-3)] border border-[var(--color-rule)] text-xs font-mono text-[var(--color-accent)]">
            <Radio className="h-3 w-3 animate-pulse" aria-hidden="true" />
            <span>Duplex socket synchronization</span>
          </div>

          <h1 className="text-3xl font-semibold text-[var(--color-ink)] leading-snug tracking-tight">
            Coordinated sprint tracking for agile engineering teams.
          </h1>

          <p className="text-sm text-[var(--color-muted)] leading-relaxed">
            Organize backlogs, drag cards through Kanban columns, and track team delivery with instant WebSocket propagation.
          </p>

          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[var(--color-rule)]">
            <div className="p-3 rounded-[var(--radius-card)] bg-[var(--color-paper-3)] border border-[var(--color-rule)]">
              <Layers className="h-4 w-4 text-[var(--color-accent)] mb-1.5" aria-hidden="true" />
              <p className="text-xs font-semibold text-[var(--color-ink)]">Kanban lanes</p>
              <p className="text-[11px] text-[var(--color-muted)] mt-0.5">Drag and drop</p>
            </div>
            <div className="p-3 rounded-[var(--radius-card)] bg-[var(--color-paper-3)] border border-[var(--color-rule)]">
              <Terminal className="h-4 w-4 text-[var(--color-cool)] mb-1.5" aria-hidden="true" />
              <p className="text-xs font-semibold text-[var(--color-ink)]">WebSockets</p>
              <p className="text-[11px] text-[var(--color-muted)] mt-0.5">Zero polling</p>
            </div>
            <div className="p-3 rounded-[var(--radius-card)] bg-[var(--color-paper-3)] border border-[var(--color-rule)]">
              <ShieldCheck className="h-4 w-4 text-[var(--color-ok)] mb-1.5" aria-hidden="true" />
              <p className="text-xs font-semibold text-[var(--color-ink)]">Session guard</p>
              <p className="text-[11px] text-[var(--color-muted)] mt-0.5">Signed tokens</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[var(--color-rule)] text-xs text-[var(--color-muted)] font-mono">
          DevCollab engineering platform
        </div>
      </div>

      {/* Right Form Container */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-[var(--color-paper)]">
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
