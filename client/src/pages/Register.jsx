import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
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
      toast.error('Please fill in all required fields');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setIsLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
      toast.success('Account created! Please sign in with your credentials.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
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
          <span>New Engineer Account</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Create Account
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Join DevCollab and organize tasks across agile projects.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          placeholder="e.g. Alex Rivera"
          icon={User}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
        />

        <Input
          label="Work Email"
          type="email"
          placeholder="developer@company.com"
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
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
              placeholder="Minimum 6 characters"
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
          <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
            <ShieldCheck className="h-3 w-3 text-emerald-500" />
            <span>Encrypted with bcrypt cryptographic hashing</span>
          </p>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full py-3 shadow-lg shadow-indigo-500/25 text-sm font-semibold hover:shadow-indigo-500/35 active:scale-98"
          >
            <span>Create Developer Account</span>
            <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
        </div>
      </form>

      {/* Switch to Login */}
      <div className="pt-4 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-500">
          Already registered?{' '}
          <Link
            to="/login"
            className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors inline-flex items-center gap-1"
          >
            <span>Sign in to account</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </p>
      </div>
    </div>
  );
}
