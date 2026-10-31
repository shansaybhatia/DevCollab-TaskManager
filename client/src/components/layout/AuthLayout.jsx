import { Outlet } from 'react-router-dom';
import { Zap } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side — Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="flex items-center justify-center h-11 w-11 rounded-xl bg-white/20 backdrop-blur-sm">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              DevCollab
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Build together,<br />
            ship faster.
          </h1>
          <p className="text-indigo-100 text-lg max-w-md">
            The collaborative project manager built for developers who move fast
            and work as a team.
          </p>
        </div>

        <div className="relative z-10">
          <p className="text-indigo-200 text-sm">
            Real-time collaboration • Kanban boards • Team management
          </p>
        </div>
      </div>

      {/* Right Side — Forms */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
