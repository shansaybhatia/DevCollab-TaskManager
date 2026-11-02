import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ListTodo,
  Timer,
  CheckCircle2,
  FolderKanban,
  ArrowRight,
  TrendingUp,
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
        <span className="text-xs text-slate-500">
          Calculating sprint metrics…
        </span>
      </div>
    );
  }

  const cards = [
    {
      label: 'To do Backlog',
      value: stats?.todo || 0,
      icon: ListTodo,
      tone: 'text-slate-500',
      borderTone: 'hover:border-slate-300',
      iconBg: 'bg-slate-100',
    },
    {
      label: 'In Progress Sprint',
      value: stats?.inprogress || 0,
      icon: Timer,
      tone: 'text-indigo-600',
      borderTone: 'hover:border-indigo-300',
      iconBg: 'bg-indigo-50',
    },
    {
      label: 'Completed Tasks',
      value: stats?.done || 0,
      icon: CheckCircle2,
      tone: 'text-emerald-600',
      borderTone: 'hover:border-emerald-300',
      iconBg: 'bg-emerald-50',
    },
    {
      label: 'Active Workspaces',
      value: stats?.totalProjects || 0,
      icon: FolderKanban,
      tone: 'text-sky-600',
      borderTone: 'hover:border-sky-300',
      iconBg: 'bg-sky-50',
    },
  ];

  const totalTasks =
    (stats?.todo || 0) + (stats?.inprogress || 0) + (stats?.done || 0);
  const completionRate =
    totalTasks > 0 ? Math.round(((stats?.done || 0) / totalTasks) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Executive Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time delivery telemetry and sprint metrics for {user?.name || 'Engineer'}
          </p>
        </div>
        <Button onClick={() => navigate('/projects')} size="md">
          Open Workspaces
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map(({ label, value, icon: Icon, tone, borderTone, iconBg }) => (
          <div
            key={label}
            className={`glass-card-interactive p-6 flex flex-col justify-between border-slate-200/90 bg-white/90 shadow-xs ${borderTone}`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-500">
                {label}
              </span>
              <div className={`p-2.5 rounded-[var(--radius-btn)] ${iconBg} border border-slate-100`}>
                <Icon className={`h-4.5 w-4.5 ${tone}`} aria-hidden="true" />
              </div>
            </div>
            <p className="text-4xl font-extrabold text-slate-900 num-metric">
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Analytics and Quick Link */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Velocity */}
        <div className="lg:col-span-2 glass-panel p-8 space-y-6 border-slate-200/90 bg-white/90 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-[var(--radius-btn)] bg-indigo-50 border border-indigo-100 text-indigo-600">
                <TrendingUp className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Delivery Velocity
                </h2>
                <p className="text-xs text-slate-500">
                  Ratio of completed tasks across all sprint matrices
                </p>
              </div>
            </div>
            <span className="text-3xl font-extrabold text-indigo-600 num-metric">
              {completionRate}%
            </span>
          </div>

          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200/80 p-0.5">
            <div
              className="h-full bg-indigo-600 rounded-full transition-transform duration-300 origin-left"
              style={{ width: `${completionRate}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-4 pt-2 text-center text-xs">
            <div className="p-3.5 rounded-[var(--radius-btn)] bg-slate-50 border border-slate-200/70">
              <span className="text-slate-500 block text-xs font-medium">To do</span>
              <span className="text-xl font-bold text-slate-900 num-metric mt-1 block">
                {stats?.todo || 0}
              </span>
            </div>
            <div className="p-3.5 rounded-[var(--radius-btn)] bg-indigo-50/50 border border-indigo-100">
              <span className="text-slate-500 block text-xs font-medium">In progress</span>
              <span className="text-xl font-bold text-indigo-600 num-metric mt-1 block">
                {stats?.inprogress || 0}
              </span>
            </div>
            <div className="p-3.5 rounded-[var(--radius-btn)] bg-emerald-50/50 border border-emerald-100">
              <span className="text-slate-500 block text-xs font-medium">Completed</span>
              <span className="text-xl font-bold text-emerald-600 num-metric mt-1 block">
                {stats?.done || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Navigate */}
        <div className="glass-panel p-8 flex flex-col justify-between border-slate-200/90 bg-white/90 shadow-xs">
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-slate-900">
              Sprint Workspaces
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Navigate straight to your project Kanban boards or initialize new sprints with real-time multi-user synchronization.
            </p>
          </div>

          <div className="pt-6">
            <button
              onClick={() => navigate('/projects')}
              className="w-full flex items-center justify-between p-4 rounded-[var(--radius-btn)] bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-sm font-semibold text-slate-800 transition-colors duration-200 cursor-pointer group shadow-xs"
            >
              <span>View All Projects</span>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
