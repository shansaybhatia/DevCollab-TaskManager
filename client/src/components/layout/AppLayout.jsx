import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)] relative">
      <Sidebar />
      <main className="ml-64 min-h-screen">
        <div className="p-8 lg:p-12 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
