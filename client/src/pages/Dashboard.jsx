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
  CalendarDays,
  PlusCircle,
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
      label: 'To Do',
      value: stats?.todo || 0,
      icon: ListTodo,
      accent: 'from-amber-500/10 to-transparent',
      borderColor: 'hover:border-amber-300',
      textColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
      badge: 'Pending',
    },
    {
      label: 'In Progress',
      value: stats?.inprogress || 0,
      icon: Timer,
      accent: 'from-blue-500/10 to-transparent',
      borderColor: 'hover:border-blue-300',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      badge: 'Active',
    },
    {
      label: 'Completed',
      value: stats?.done || 0,
      icon: CheckCircle2,
      accent: 'from-emerald-500/10 to-transparent',
      borderColor: 'hover:border-emerald-300',
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      badge: 'Shipped',
    },
    {
      label: 'Workspaces',
      value: stats?.totalProjects || 0,
      icon: FolderKanban,
      accent: 'from-indigo-500/10 to-transparent',
      borderColor: 'hover:border-indigo-300',
      textColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      badge: 'Projects',
    },
  ];

  const totalTasks =
    (stats?.todo || 0) + (stats?.inprogress || 0) + (stats?.done || 0);
  const completionRate =
    totalTasks > 0 ? Math.round(((stats?.done || 0) / totalTasks) * 100) : 0;

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="animate-fade-in space-y-8 max-w-7xl mx-auto">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-8 shadow-xl">
        {/* Glow ambient background elements */}
        <div className="absolute -top-12 -right-12 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-16 left-1/3 h-48 w-48 rounded-full bg-purple-500/20 blur-2xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium text-indigo-200">
              <CalendarDays className="h-3.5 w-3.5" />
              <span>{todayStr}</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Welcome back, {user?.name ? user.name.split(' ')[0] : 'Engineer'}!
            </h1>
            <p className="text-indigo-200 text-sm sm:text-base max-w-xl leading-relaxed">
              Here is your agile task breakdown for today. Track progress, collaborate in real time, and ship high-impact features.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/projects')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-indigo-950 font-semibold text-sm shadow-md hover:bg-indigo-50 hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-95"
            >
              <span>Explore Projects</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map(({ label, value, icon: Icon, accent, borderColor, textColor, bgColor, badge }) => (
          <div
            key={label}
            className={`group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs
              hover:shadow-lg card-hover-lift transition-all duration-300 ${borderColor}`}
          >
            <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent}`} />
            
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${bgColor} transition-transform duration-300 group-hover:scale-110 shadow-xs`}>
                <Icon className={`h-5 w-5 ${textColor}`} />
              </div>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${bgColor} ${textColor}`}>
                {badge}
              </span>
            </div>

            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</p>
            <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">{label}</p>
          </div>
        ))}
      </div>

      {/* Detailed Analytics & Quick Workflow */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Completion Velocity */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-7 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Project Delivery Velocity</h3>
                <p className="text-xs text-slate-400">Total task completion ratio across workspaces</p>
              </div>
            </div>
            <span className="text-2xl font-black text-indigo-600">{completionRate}%</span>
          </div>

          <div className="space-y-4">
            <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 rounded-full transition-all duration-1000 ease-out shadow-xs"
                style={{ width: `${Math.max(completionRate, 3)}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-center">
              <div className="p-3 rounded-xl bg-slate-50">
                <p className="text-xs text-slate-400 font-medium">To Do</p>
                <p className="text-lg font-bold text-slate-800">{stats?.todo || 0}</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-50/60">
                <p className="text-xs text-blue-500 font-medium">In Progress</p>
                <p className="text-lg font-bold text-blue-700">{stats?.inprogress || 0}</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50/60">
                <p className="text-xs text-emerald-500 font-medium">Completed</p>
                <p className="text-lg font-bold text-emerald-700">{stats?.done || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Launch Panel */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-7 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-indigo-500" />
              <h3 className="font-bold text-slate-900 text-lg">Quick Actions</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              Accelerate your workflow with one-click navigation to your active projects and boards.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/projects')}
              className="group w-full flex items-center justify-between p-4 rounded-xl border border-slate-200/80 
                hover:border-indigo-300 hover:bg-gradient-to-r hover:from-indigo-50/60 hover:to-white 
                hover:shadow-md transition-all duration-200 cursor-pointer active:scale-98"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600 group-hover:scale-105 transition-transform">
                  <FolderKanban className="h-4.5 w-4.5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    Manage Workspaces
                  </p>
                  <p className="text-xs text-slate-400">View tasks and teammates</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
            </button>

            <button
              onClick={() => navigate('/profile')}
              className="group w-full flex items-center justify-between p-4 rounded-xl border border-slate-200/80 
                hover:border-slate-300 hover:bg-slate-50/70 transition-all duration-200 cursor-pointer active:scale-98"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-slate-100 text-slate-600 group-hover:scale-105 transition-transform">
                  <PlusCircle className="h-4.5 w-4.5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-900">Your Developer Profile</p>
                  <p className="text-xs text-slate-400">Avatar and bio settings</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
