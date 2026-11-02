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
    <aside className="fixed inset-y-0 left-0 z-[var(--z-sticky-nav)] flex w-60 flex-col border-r border-[var(--color-rule)] bg-[var(--color-paper-2)]">
      {/* Brand Header with Custom Logo */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--color-rule)]">
        <Logo size={28} />
        <div>
          <span className="text-sm font-semibold text-[var(--color-ink)] tracking-tight">
            DevCollab
          </span>
          <span className="block text-[10px] font-mono text-[var(--color-muted)]">
            v1.0.0
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-mono text-[var(--color-muted)]">
          Navigation
        </div>
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-[var(--radius-pill)] text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[var(--color-paper-3)] text-[var(--color-accent)] border border-[var(--color-rule-2)]'
                  : 'text-[var(--color-ink-2)] hover:bg-[var(--color-paper)] hover:text-[var(--color-ink)]'
              }`
            }
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Connection Indicator */}
      <div className="px-4 py-3 mx-3 mb-3 rounded-[var(--radius-card)] bg-[var(--color-paper-3)] border border-[var(--color-rule)] text-xs">
        <div className="flex items-center gap-2 text-[var(--color-cool)]">
          <Radio className="h-3.5 w-3.5 animate-pulse" aria-hidden="true" />
          <span className="font-mono text-[11px]">Duplex sync live</span>
        </div>
      </div>

      {/* User Session Footer */}
      <div className="border-t border-[var(--color-rule)] p-3 bg-[var(--color-paper)]">
        <div className="flex items-center gap-2.5 mb-2 px-1">
          <Avatar src={user?.avatar} name={user?.name || ''} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-[var(--color-ink)] truncate">
              {user?.name || 'Developer'}
            </p>
            <p className="text-[11px] font-mono text-[var(--color-muted)] truncate">
              {user?.email || ''}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 px-3 py-1.5 rounded-[var(--radius-pill)] text-xs font-mono text-[var(--color-muted)] hover:bg-[var(--color-bad-soft)] hover:text-[var(--color-bad)] transition-colors cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
