import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ListTodo,
  Timer,
  CheckCircle2,
  FolderKanban,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Zap,
} from 'lucide-react';
import api from '../lib/api';
import useAuthStore from '../stores/authStore';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';

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
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Spinner size="lg" />
        <span className="text-xs text-[var(--color-muted)]">
          Calculating sprint metrics...
        </span>
      </div>
    );
  }

  const cards = [
    {
      label: 'To do Backlog',
      value: stats?.todo || 0,
      icon: ListTodo,
      tone: 'text-[var(--color-muted)]',
      borderTone: 'hover:border-[var(--color-muted)]',
    },
    {
      label: 'In Progress Sprint',
      value: stats?.inprogress || 0,
      icon: Timer,
      tone: 'text-[var(--point-mid)]',
      borderTone: 'hover:border-[var(--point-mid)]',
    },
    {
      label: 'Completed Tasks',
      value: stats?.done || 0,
      icon: CheckCircle2,
      tone: 'text-[var(--color-accent)]',
      borderTone: 'hover:border-[var(--color-accent)]',
    },
    {
      label: 'Active Workspaces',
      value: stats?.totalProjects || 0,
      icon: FolderKanban,
      tone: 'text-[var(--color-accent)]',
      borderTone: 'hover:border-[var(--color-accent)]',
    },
  ];

  const totalTasks =
    (stats?.todo || 0) + (stats?.inprogress || 0) + (stats?.done || 0);
  const completionRate =
    totalTasks > 0 ? Math.round(((stats?.done || 0) / totalTasks) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[var(--color-rule)]">
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--color-ink)] tracking-tight">
            Executive Dashboard
          </h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">
            Real-time delivery telemetry and sprint metrics for {user?.name || 'Engineer'}
          </p>
        </div>
        <Button onClick={() => navigate('/projects')} size="md">
          Open Workspaces
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map(({ label, value, icon: Icon, tone, borderTone }) => (
          <div
            key={label}
            className={`glass-card-interactive p-6 flex flex-col justify-between border-[var(--color-rule-2)] ${borderTone}`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-[var(--color-muted)]">
                {label}
              </span>
              <div className="p-2.5 rounded-[var(--radius-btn)] bg-[var(--color-paper-3)] border border-[var(--color-rule-2)]">
                <Icon className={`h-4.5 w-4.5 ${tone}`} aria-hidden="true" />
              </div>
            </div>
            <p className="text-4xl font-extrabold text-[var(--color-ink)] num-metric">
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Analytics and Quick Link */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Velocity */}
        <div className="lg:col-span-2 glass-panel p-8 space-y-6 border-[var(--color-rule-2)] shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-[var(--radius-btn)] bg-[var(--color-paper-3)] border border-[var(--color-rule-2)] text-[var(--color-accent)]">
                <TrendingUp className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[var(--color-ink)]">
                  Delivery Velocity
                </h2>
                <p className="text-xs text-[var(--color-muted)]">
                  Ratio of completed tasks across all sprint matrices
                </p>
              </div>
            </div>
            <span className="text-3xl font-extrabold text-[var(--color-accent)] num-metric">
              {completionRate}%
            </span>
          </div>

          <div className="w-full h-3 bg-[var(--color-paper-3)] rounded-full overflow-hidden border border-[var(--color-rule)] p-0.5">
            <div
              className="h-full bg-[var(--color-accent)] rounded-full transition-transform duration-300 origin-left"
              style={{ width: `${completionRate}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-4 pt-2 text-center text-xs">
            <div className="p-3.5 rounded-[var(--radius-btn)] bg-[var(--color-paper-3)] border border-[var(--color-rule-2)]">
              <span className="text-[var(--color-muted)] block text-xs font-medium">To do</span>
              <span className="text-xl font-bold text-[var(--color-ink)] num-metric mt-1 block">
                {stats?.todo || 0}
              </span>
            </div>
            <div className="p-3.5 rounded-[var(--radius-btn)] bg-[var(--color-paper-3)] border border-[var(--color-rule-2)]">
              <span className="text-[var(--color-muted)] block text-xs font-medium">In progress</span>
              <span className="text-xl font-bold text-[var(--point-mid)] num-metric mt-1 block">
                {stats?.inprogress || 0}
              </span>
            </div>
            <div className="p-3.5 rounded-[var(--radius-btn)] bg-[var(--color-paper-3)] border border-[var(--color-rule-2)]">
              <span className="text-[var(--color-muted)] block text-xs font-medium">Completed</span>
              <span className="text-xl font-bold text-[var(--color-accent)] num-metric mt-1 block">
                {stats?.done || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Navigate */}
        <div className="glass-panel p-8 flex flex-col justify-between border-[var(--color-rule-2)] shadow-xl">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-[var(--color-accent)] font-semibold">
              <Zap className="h-4 w-4" />
              <span>Agile Hub</span>
            </div>
            <h2 className="text-lg font-bold text-[var(--color-ink)]">
              Sprint Workspaces
            </h2>
            <p className="text-xs text-[var(--color-muted)] leading-relaxed">
              Navigate straight to your project Kanban boards or initialize new sprints with real-time multi-user synchronization.
            </p>
          </div>

          <div className="pt-6">
            <button
              onClick={() => navigate('/projects')}
              className="w-full flex items-center justify-between p-4 rounded-[var(--radius-btn)] bg-[var(--color-paper-3)] border border-[var(--color-rule-2)] hover:border-[var(--color-accent)] hover:bg-[color-mix(in_oklch,var(--color-accent)_10%,transparent)] text-sm font-bold text-[var(--color-ink)] transition-colors duration-200 cursor-pointer group"
            >
              <span>View All Projects</span>
              <ArrowRight className="h-4 w-4 text-[var(--color-muted)] group-hover:text-[var(--color-accent)] group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
