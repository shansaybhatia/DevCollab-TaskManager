import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ListTodo,
  Timer,
  CheckCircle2,
  FolderKanban,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import api from '../lib/api';
import useAuthStore from '../stores/authStore';
import Spinner from '../components/ui/Spinner';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/dashboard/stats');
        setStats(data);
      } catch {
        setStats({ todo: 0, inprogress: 0, done: 0, totalProjects: 0 });
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  const cards = [
    {
      label: 'To do',
      value: stats?.todo || 0,
      icon: ListTodo,
      tone: 'text-[var(--color-muted)]',
    },
    {
      label: 'In progress',
      value: stats?.inprogress || 0,
      icon: Timer,
      tone: 'text-[var(--color-cool)]',
    },
    {
      label: 'Completed',
      value: stats?.done || 0,
      icon: CheckCircle2,
      tone: 'text-[var(--color-ok)]',
    },
    {
      label: 'Workspaces',
      value: stats?.totalProjects || 0,
      icon: FolderKanban,
      tone: 'text-[var(--color-accent)]',
    },
  ];

  const totalTasks =
    (stats?.todo || 0) + (stats?.inprogress || 0) + (stats?.done || 0);
  const completionRate =
    totalTasks > 0 ? Math.round(((stats?.done || 0) / totalTasks) * 100) : 0;

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-ink)] tracking-tight">
          Dashboard
        </h1>
        <p className="text-xs text-[var(--color-muted)] mt-1 font-mono">
          Overview for {user?.name || 'developer'}
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, tone }) => (
          <div
            key={label}
            className="console-panel p-5 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="text-[var(--color-muted)]">{label}</span>
              <Icon className={`h-4 w-4 ${tone}`} aria-hidden="true" />
            </div>
            <p className="text-3xl font-semibold text-[var(--color-ink)] mono-metric">
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Analytics and Quick Link */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Velocity */}
        <div className="lg:col-span-2 console-panel p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[var(--color-accent)]" aria-hidden="true" />
              <h2 className="text-sm font-semibold text-[var(--color-ink)]">
                Task completion ratio
              </h2>
            </div>
            <span className="text-xl font-semibold text-[var(--color-accent)] mono-metric">
              {completionRate}%
            </span>
          </div>

          <div className="w-full h-2 bg-[var(--color-paper-3)] rounded-[var(--radius-pill)] overflow-hidden border border-[var(--color-rule)]">
            <div
              className="h-full bg-[var(--color-accent)] rounded-[var(--radius-pill)]"
              style={{ width: `${completionRate}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
            <div className="p-2.5 rounded-[var(--radius-pill)] bg-[var(--color-paper-3)] border border-[var(--color-rule)]">
              <span className="text-[var(--color-muted)] block text-[11px]">To do</span>
              <span className="font-semibold text-[var(--color-ink)] mono-metric">
                {stats?.todo || 0}
              </span>
            </div>
            <div className="p-2.5 rounded-[var(--radius-pill)] bg-[var(--color-paper-3)] border border-[var(--color-rule)]">
              <span className="text-[var(--color-muted)] block text-[11px]">In progress</span>
              <span className="font-semibold text-[var(--color-cool)] mono-metric">
                {stats?.inprogress || 0}
              </span>
            </div>
            <div className="p-2.5 rounded-[var(--radius-pill)] bg-[var(--color-paper-3)] border border-[var(--color-rule)]">
              <span className="text-[var(--color-muted)] block text-[11px]">Completed</span>
              <span className="font-semibold text-[var(--color-ok)] mono-metric">
                {stats?.done || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Navigate */}
        <div className="console-panel p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[var(--color-ink)] mb-2">
              Workspaces
            </h2>
            <p className="text-xs text-[var(--color-muted)] leading-relaxed mb-4">
              Open your sprint boards or create new project workspaces.
            </p>
          </div>

          <button
            onClick={() => navigate('/projects')}
            className="w-full flex items-center justify-between p-3 rounded-[var(--radius-pill)] bg-[var(--color-paper-3)] border border-[var(--color-rule)] hover:border-[var(--color-rule-2)] text-xs font-medium text-[var(--color-ink)] transition-colors cursor-pointer"
          >
            <span>View all projects</span>
            <ArrowRight className="h-4 w-4 text-[var(--color-muted)]" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
