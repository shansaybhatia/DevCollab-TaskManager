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
      toast.success('Welcome back');
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
    <div className="console-panel p-8 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[var(--color-ink)] tracking-tight">
          Sign in
        </h2>
        <p className="text-xs text-[var(--color-muted)] mt-1">
          Enter credentials to access active project workspaces.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="engineer@devcollab.io"
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
        />

        <div className="space-y-1.5 text-left">
          <label className="block text-xs font-medium text-[var(--color-ink-2)]">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--color-muted)]">
              <Lock className="h-4 w-4" aria-hidden="true" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-[var(--radius-pill)] border border-[var(--color-rule)] bg-[var(--color-paper-3)] pl-9 pr-9 py-2.5
                text-sm text-[var(--color-ink)] placeholder:text-[var(--color-muted)]
                focus-visible:border-[var(--color-focus)] focus-visible:outline-none
                transition-colors"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--color-muted)] hover:text-[var(--color-ink)] cursor-pointer"
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
            className="w-full py-2.5 text-sm"
          >
            <span>Sign in</span>
            <ArrowRight className="h-4 w-4 ml-1" aria-hidden="true" />
          </Button>
        </div>
      </form>

      <div className="pt-3 border-t border-[var(--color-rule)] text-center">
        <p className="text-xs text-[var(--color-muted)]">
          Need an account?{' '}
          <Link
            to="/register"
            className="font-medium text-[var(--color-accent)] hover:underline inline-flex items-center gap-1"
          >
            <span>Create account</span>
          </Link>
        </p>
      </div>
    </div>
  );
}
