import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  UserCircle,
  LogOut,
  Radio,
  Zap,
} from 'lucide-react';
import useAuthStore from '../../stores/authStore';
import Avatar from '../ui/Avatar';
import Logo from '../ui/Logo';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/profile', label: 'Profile', icon: UserCircle },
];

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out');
      navigate('/login');
    } catch {
      toast.error('Logout failed');
    }
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-[var(--z-sticky-nav)] flex w-64 flex-col border-r border-[var(--color-rule)] bg-[color-mix(in_oklch,var(--color-paper-2)_88%,transparent)] backdrop-blur-2xl shadow-2xl">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-[var(--color-rule)]">
        <Logo size={36} />
        <div>
          <span className="text-base font-bold text-[var(--color-ink)] tracking-tight">
            DevCollab
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
            <span className="text-[11px] font-mono text-[var(--color-accent)] font-medium">
              v2.4 • Vantage
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-xs text-[var(--color-muted)] font-medium">
          Workspaces
        </div>
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-[var(--radius-btn)] text-sm font-semibold transition-colors duration-200 ${
                isActive
                  ? 'bg-[color-mix(in_oklch,var(--color-accent)_14%,transparent)] text-[var(--color-accent)] border border-[color-mix(in_oklch,var(--color-accent)_35%,transparent)] shadow-[0_0_15px_-3px_color-mix(in_oklch,var(--color-accent)_30%,transparent)]'
                  : 'text-[var(--color-ink-2)] hover:bg-[var(--color-paper-3)] hover:text-white hover:translate-x-1'
              }`
            }
          >
            <Icon className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Live Sync Telemetry Status */}
      <div className="px-4 py-3 mx-4 mb-4 rounded-[var(--radius-card)] glass-panel border-[var(--color-rule-2)] text-xs">
        <div className="flex items-center justify-between text-[var(--color-accent)] font-semibold">
          <div className="flex items-center gap-2">
            <Radio className="h-3.5 w-3.5 animate-pulse" aria-hidden="true" />
            <span>WebSocket Duplex</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[color-mix(in_oklch,var(--color-accent)_20%,transparent)] font-semibold">
            Live
          </span>
        </div>
        <p className="text-[11px] text-[var(--color-muted)] mt-1.5 leading-snug">
          Instant sync across board columns and active sessions
        </p>
      </div>

      {/* User Session Footer */}
      <div className="border-t border-[var(--color-rule)] p-4 bg-[var(--color-paper-2)]/70 backdrop-blur-md">
        <div className="flex items-center gap-3 mb-3 px-1">
          <Avatar src={user?.avatar} name={user?.name || ''} size="md" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-[var(--color-ink)] truncate">
              {user?.name || 'Engineer'}
            </p>
            <p className="text-xs text-[var(--color-muted)] truncate font-mono">
              {user?.email || 'user@devcollab.io'}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-[var(--radius-btn)] border border-[var(--color-rule-2)] text-xs font-semibold text-[var(--color-muted)] hover:text-white hover:border-[var(--color-accent)] hover:bg-[var(--color-paper-3)] transition-colors duration-200 cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
