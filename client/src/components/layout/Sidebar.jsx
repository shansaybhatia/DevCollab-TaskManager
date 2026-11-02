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
    <aside className="fixed inset-y-0 left-0 z-[var(--z-sticky-nav)] flex w-64 flex-col border-r border-slate-200/90 bg-white/85 backdrop-blur-2xl shadow-sm">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-200/80">
        <Logo size={36} />
        <div>
          <span className="text-base font-bold text-slate-900 tracking-tight">
            DevCollab
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] text-slate-500 font-medium">
              Real-Time Agile
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-xs text-slate-400 font-medium">
          Workspaces
        </div>
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-[var(--radius-btn)] text-sm font-semibold transition-colors duration-200 ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 hover:translate-x-1'
              }`
            }
          >
            <Icon className="h-4.5 w-4.5 shrink-0" aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Live Sync Telemetry Status */}
      <div className="px-4 py-3 mx-4 mb-4 rounded-[var(--radius-card)] bg-slate-50/90 border border-slate-200/80 text-xs">
        <div className="flex items-center justify-between text-indigo-600 font-semibold">
          <div className="flex items-center gap-2">
            <Radio className="h-3.5 w-3.5 animate-pulse text-emerald-500" aria-hidden="true" />
            <span>WebSocket Duplex</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200/80">
            Live
          </span>
        </div>
        <p className="text-[11px] text-slate-500 mt-1.5 leading-snug">
          Instant multi-user card synchronization
        </p>
      </div>

      {/* User Session Footer */}
      <div className="border-t border-slate-200/80 p-4 bg-slate-50/80">
        <div className="flex items-center gap-3 mb-3 px-1">
          <Avatar src={user?.avatar} name={user?.name || ''} size="md" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-900 truncate">
              {user?.name || 'Engineer'}
            </p>
            <p className="text-xs text-slate-500 truncate">
              {user?.email || 'user@devcollab.io'}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-[var(--radius-btn)] border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 transition-colors duration-200 cursor-pointer shadow-xs"
        >
          <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
