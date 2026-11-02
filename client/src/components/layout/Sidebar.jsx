import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  UserCircle,
  LogOut,
  Radio,
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
    <aside className="fixed inset-y-0 left-0 z-[var(--z-sticky-nav)] flex w-64 flex-col border-r border-[var(--color-rule)] bg-[color-mix(in_oklch,var(--color-paper-2)_85%,transparent)] backdrop-blur-xl shadow-xl">
      {/* Brand Header */}
      <div className="flex items-center gap-3.5 px-6 py-5 border-b border-[var(--color-rule)]">
        <Logo size={34} />
        <div>
          <span className="text-base font-bold text-[var(--color-ink)] tracking-tight">
            DevCollab
          </span>
          <span className="block text-xs font-mono text-[var(--color-muted)]">
            v1.0.0 • Dusk
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-xs text-[var(--color-muted)]">
          Navigation
        </div>
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-[var(--radius-pill)] text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? 'bg-[var(--color-accent)] text-[var(--color-accent-ink)] font-semibold shadow-sm'
                  : 'text-[var(--color-ink-2)] hover:bg-[var(--color-paper-3)] hover:text-[var(--color-ink)] hover:translate-x-1'
              }`
            }
          >
            <Icon className="h-4.5 w-4.5" aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Live sync badge */}
      <div className="px-4 py-3 mx-4 mb-4 rounded-[var(--radius-card)] glass-panel text-xs">
        <div className="flex items-center gap-2 text-[var(--color-accent)] font-medium">
          <Radio className="h-3.5 w-3.5 animate-pulse" aria-hidden="true" />
          <span>WebSocket duplex live</span>
        </div>
        <p className="text-[11px] text-[var(--color-muted)] mt-1">
          Instant multi-user updates
        </p>
      </div>

      {/* User Session Footer */}
      <div className="border-t border-[var(--color-rule)] p-4 bg-[var(--color-paper-2)]">
        <div className="flex items-center gap-3 mb-3 px-1">
          <Avatar src={user?.avatar} name={user?.name || ''} size="md" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[var(--color-ink)] truncate">
              {user?.name || 'Developer'}
            </p>
            <p className="text-xs font-mono text-[var(--color-muted)] truncate">
              {user?.email || ''}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 px-3 py-2 rounded-[var(--radius-pill)] text-xs font-medium text-[var(--color-muted)] hover:bg-[color-mix(in_oklch,var(--color-error)_15%,transparent)] hover:text-[var(--color-error)] transition-colors cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
