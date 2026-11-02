import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[var(--color-paper)] text-[var(--color-ink)] relative flex">
      <Sidebar />
      <main className="ml-64 flex-1 min-h-screen relative z-10 overflow-x-hidden">
        <div className="p-6 sm:p-8 xl:p-10 max-w-[1550px] w-full mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
