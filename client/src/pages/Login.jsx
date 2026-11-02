import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import useAuthStore from '../stores/authStore';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      toast.success('Welcome back to DevCollab');
      navigate('/dashboard');
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Authentication failed. Please check credentials or register.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel p-8 sm:p-10 space-y-6 shadow-2xl border-slate-800 bg-slate-900/80 backdrop-blur-2xl">
      <div className="space-y-1.5">
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Sign in
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          Access your real-time developer workspaces and sprint boards.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email address"
          type="email"
          placeholder="developer@example.com"
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
        />

        <div className="space-y-1.5 text-left">
          <label className="block text-xs font-semibold text-slate-300 tracking-wide">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="h-4 w-4" aria-hidden="true" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-[var(--radius-btn)] border border-slate-700/80 bg-slate-900/60 pl-10 pr-10 py-2.5
                text-sm text-white placeholder:text-slate-500
                focus:border-indigo-500 focus:bg-slate-900/90 focus:outline-none focus:ring-2 focus:ring-indigo-500/25
                transition-colors duration-200"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white cursor-pointer"
              aria-label="Toggle password visibility"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            isLoading={isLoading}
            size="lg"
            className="w-full text-sm font-semibold tracking-wide"
          >
            <span>Sign in to workspace</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </form>

      <div className="pt-4 border-t border-slate-800 text-center">
        <p className="text-xs text-slate-400">
          Need a developer account?{' '}
          <Link
            to="/register"
            className="font-semibold text-indigo-400 hover:underline hover:text-indigo-300 transition-colors inline-flex items-center gap-1"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
