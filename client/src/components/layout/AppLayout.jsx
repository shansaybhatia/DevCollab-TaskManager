import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)]">
      <Sidebar />
      <main className="ml-60 min-h-screen">
        <div className="max-w-[var(--container)] mx-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
