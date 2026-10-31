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
import Spinner from '../components/ui/Spinner';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
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
      label: 'To Do',
      value: stats?.todo || 0,
      icon: ListTodo,
      color: 'text-slate-600',
      bg: 'bg-slate-50',
      ring: 'ring-slate-200',
    },
    {
      label: 'In Progress',
      value: stats?.inprogress || 0,
      icon: Timer,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      ring: 'ring-blue-200',
    },
    {
      label: 'Completed',
      value: stats?.done || 0,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      ring: 'ring-emerald-200',
    },
    {
      label: 'Projects',
      value: stats?.totalProjects || 0,
      icon: FolderKanban,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      ring: 'ring-indigo-200',
    },
  ];

  const totalTasks =
    (stats?.todo || 0) + (stats?.inprogress || 0) + (stats?.done || 0);
  const completionRate =
    totalTasks > 0 ? Math.round(((stats?.done || 0) / totalTasks) * 100) : 0;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">
          Overview of your tasks and projects
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {cards.map(({ label, value, icon: Icon, color, bg, ring }) => (
          <div
            key={label}
            className={`rounded-xl border border-slate-200 bg-white p-5 ring-1 ${ring} shadow-sm
              hover:shadow-md transition-shadow duration-200`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2.5 rounded-lg ${bg}`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900">{value}</p>
            <p className="text-sm text-slate-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Completion Rate */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-indigo-500" />
            <h3 className="font-semibold text-slate-900">Completion Rate</h3>
          </div>
          <div className="flex items-end gap-3 mb-3">
            <span className="text-4xl font-bold text-slate-900">
              {completionRate}%
            </span>
            <span className="text-sm text-slate-500 mb-1">of tasks done</span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-400">
            <span>{stats?.done || 0} completed</span>
            <span>{totalTasks} total</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/projects')}
              className="w-full flex items-center justify-between p-4 rounded-lg border border-slate-200 
                hover:border-indigo-300 hover:bg-indigo-50/50 transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <FolderKanban className="h-5 w-5 text-indigo-500" />
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-900">
                    View Projects
                  </p>
                  <p className="text-xs text-slate-500">
                    Manage your workspaces
                  </p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
