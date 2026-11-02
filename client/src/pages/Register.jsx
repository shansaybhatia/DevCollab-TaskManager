import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react';
import useAuthStore from '../stores/authStore';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import toast from 'react-hot-toast';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const register = useAuthStore((s) => s.register);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Please complete all required fields');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setIsLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
      toast.success('Account created. Please sign in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel p-8 sm:p-10 space-y-6 shadow-2xl border-[var(--color-rule-2)] bg-[var(--color-paper-2)]/80 backdrop-blur-2xl">
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[var(--color-ink)] tracking-tight">
            Create account
          </h2>
          <span className="flex items-center gap-1.5 text-xs text-[var(--color-accent)] font-medium">
            <Sparkles className="h-3.5 w-3.5" />
            Vantage
          </span>
        </div>
        <p className="text-sm text-[var(--color-muted)] leading-relaxed">
          Set up an engineering profile to collaborate on real-time sprint boards.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full name"
          type="text"
          placeholder="Engineer name"
          icon={User}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
        />

        <Input
          label="Work email"
          type="email"
          placeholder="engineer@devcollab.io"
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="space-y-1.5 text-left">
          <label className="block text-xs font-semibold text-[var(--color-ink-2)] tracking-wide">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--color-muted)]">
              <Lock className="h-4 w-4" aria-hidden="true" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-[var(--radius-btn)] border border-[var(--color-rule-2)] bg-[var(--color-paper-2)] pl-10 pr-10 py-2.5
                text-sm text-[var(--color-ink)] placeholder:text-[var(--color-muted)]
                focus:border-[var(--color-focus)] focus:bg-[var(--color-paper-3)] focus:outline-none focus:ring-1 focus:ring-[var(--color-focus)]
                transition-colors duration-200"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[var(--color-muted)] hover:text-[var(--color-ink)] cursor-pointer"
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
            className="w-full text-sm font-bold tracking-wide"
          >
            <span>Create developer account</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </form>

      <div className="pt-4 border-t border-[var(--color-rule)] text-center">
        <p className="text-xs text-[var(--color-muted)]">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-[var(--color-accent)] hover:underline hover:text-[var(--color-accent-hi)] transition-colors inline-flex items-center gap-1"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
