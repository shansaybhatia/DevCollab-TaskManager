import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  Info,
  CheckCircle,
} from 'lucide-react';
import useAuthStore from '../stores/authStore';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Login failed. If you haven\'t created an account yet, please register.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-6 bg-white/90 backdrop-blur-xl border border-slate-200/90 p-8 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/50">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100/70 text-indigo-700 text-xs font-semibold mb-3">
          <Sparkles className="h-3.5 w-3.5 text-indigo-500 animate-pulse" />
          <span>DevCollab Client Portal</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome back
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Sign in to your DevCollab account to continue collaborating.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="developer@example.com"
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
        />

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-700">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-10 py-2.5
                text-sm text-slate-900 placeholder:text-slate-400
                focus:outline-none focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-600
                transition-all duration-150 shadow-xs"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full py-3 shadow-lg shadow-indigo-500/25 text-sm font-semibold hover:shadow-indigo-500/35 active:scale-98"
          >
            <span>Sign In to Workspace</span>
            <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
        </div>
      </form>

      {/* Quick Help / Info Accordion */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowHelp(!showHelp)}
          className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 text-[11px] font-semibold text-slate-600 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5 text-indigo-500" />
            <span>First time logging in? Click here</span>
          </span>
          <span className="text-slate-400 font-bold">{showHelp ? '▲' : '▼'}</span>
        </button>

        {showHelp && (
          <div className="mt-2 p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 space-y-1.5 animate-slide-down">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-3.5 w-3.5 text-indigo-600 mt-0.5 flex-shrink-0" />
              <p>
                <strong>No default password:</strong> Accounts are registered directly on the Register tab.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-3.5 w-3.5 text-indigo-600 mt-0.5 flex-shrink-0" />
              <p>
                Click <strong>&quot;Register new account&quot;</strong> below, sign up with your email and password, and then sign in.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Switch to Register */}
      <div className="pt-4 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-500">
          Need a developer workspace?{' '}
          <Link
            to="/register"
            className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors inline-flex items-center gap-1"
          >
            <span>Register new account</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </p>
      </div>
    </div>
  );
}
