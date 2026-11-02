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
      tone: 'text-[var(--color-accent)]',
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
      tone: 'text-[var(--color-accent-2)]',
    },
  ];

  const totalTasks =
    (stats?.todo || 0) + (stats?.inprogress || 0) + (stats?.done || 0);
  const completionRate =
    totalTasks > 0 ? Math.round(((stats?.done || 0) / totalTasks) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--color-ink)] tracking-tight">
          Executive Dashboard
        </h1>
        <p className="text-sm text-[var(--color-muted)] mt-1.5">
          Sprint performance overview for {user?.name || 'developer'}
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map(({ label, value, icon: Icon, tone }) => (
          <div
            key={label}
            className="glass-card-interactive p-6 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-[var(--color-muted)]">
                {label}
              </span>
              <div className="p-2.5 rounded-[var(--radius-card)] bg-[var(--color-paper-3)] border border-[var(--color-rule)]">
                <Icon className={`h-4.5 w-4.5 ${tone}`} aria-hidden="true" />
              </div>
            </div>
            <p className="text-4xl font-bold text-[var(--color-ink)] num-metric">
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Analytics and Quick Link */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Velocity */}
        <div className="lg:col-span-2 glass-panel p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-[var(--radius-pill)] bg-[var(--color-paper-3)] border border-[var(--color-rule)]">
                <TrendingUp className="h-4.5 w-4.5 text-[var(--color-accent)]" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[var(--color-ink)]">
                  Delivery velocity
                </h2>
                <p className="text-xs text-[var(--color-muted)]">
                  Ratio of completed tasks across all active workspaces
                </p>
              </div>
            </div>
            <span className="text-3xl font-bold text-[var(--color-accent)] num-metric">
              {completionRate}%
            </span>
          </div>

          <div className="w-full h-3 bg-[var(--color-paper-3)] rounded-[var(--radius-pill)] overflow-hidden border border-[var(--color-rule)] p-0.5">
            <div
              className="h-full bg-[var(--color-accent)] rounded-[var(--radius-pill)]"
              style={{ width: `${completionRate}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-4 pt-2 text-center text-xs">
            <div className="p-3 rounded-[var(--radius-card)] bg-[var(--color-paper-3)] border border-[var(--color-rule)]">
              <span className="text-[var(--color-muted)] block text-xs">To do</span>
              <span className="text-xl font-bold text-[var(--color-ink)] num-metric mt-1 block">
                {stats?.todo || 0}
              </span>
            </div>
            <div className="p-3 rounded-[var(--radius-card)] bg-[var(--color-paper-3)] border border-[var(--color-rule)]">
              <span className="text-[var(--color-muted)] block text-xs">In progress</span>
              <span className="text-xl font-bold text-[var(--color-accent)] num-metric mt-1 block">
                {stats?.inprogress || 0}
              </span>
            </div>
            <div className="p-3 rounded-[var(--radius-card)] bg-[var(--color-paper-3)] border border-[var(--color-rule)]">
              <span className="text-[var(--color-muted)] block text-xs">Completed</span>
              <span className="text-xl font-bold text-[var(--color-ok)] num-metric mt-1 block">
                {stats?.done || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Navigate */}
        <div className="glass-panel p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-[var(--color-ink)] mb-2">
              Sprint workspaces
            </h2>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed mb-6">
              Navigate to your active Kanban boards or create new project workflows.
            </p>
          </div>

          <button
            onClick={() => navigate('/projects')}
            className="w-full flex items-center justify-between p-4 rounded-[var(--radius-pill)] bg-[var(--color-paper-3)] border border-[var(--color-rule)] hover:border-[var(--color-accent)] text-sm font-semibold text-[var(--color-ink)] transition-colors duration-200 cursor-pointer hover:-translate-y-0.5"
          >
            <span>View all projects</span>
            <ArrowRight className="h-4 w-4 text-[var(--color-muted)] group-hover:text-[var(--color-accent)]" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
