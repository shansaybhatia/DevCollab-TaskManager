import { Link } from "react-router-dom";
import BrandMark from "../components/layout/BrandMark";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center bg-gradient-to-b from-white to-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-24">
        {/* <header className="flex items-center justify-between">
          <BrandMark />
          <nav className="flex gap-3">
            <Link
              to="/auth"
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Sign in
            </Link>
            <Link
              to="/auth/register"
              className="ml-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Create workspace
            </Link>
          </nav>
        </header> */}

        <section className="mt-16 grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h1 className="hero-title">
              DevCollab — From personal tasks to team success
            </h1>
            <p className="mt-6 text-lg text-slate-600">
              Create workspaces, manage tasks, collaborate with others, and
              track progress—all in one place.
            </p>

            <div className="mt-8 flex gap-3">
              <Link
                to="/auth/register"
                className="inline-flex items-center rounded-md bg-sky-600 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-700"
              >
                Create Account
              </Link>
              <Link
                to="/auth"
                className="inline-flex items-center rounded-md border border-slate-200 px-5 py-3 bg-white text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Sign in
              </Link>
            </div>

            <ul className="mt-10 grid gap-4 sm:grid-cols-3">
              <li className="flex flex-col">
                <strong className="text-sm font-semibold text-slate-900">
                  Personal Productivity
                </strong>
                <span className="mt-1 text-sm text-slate-600">
                  Stay on top of your goals, deadlines, and daily tasks.
                </span>
              </li>
              <li className="flex flex-col">
                <strong className="text-sm font-semibold text-slate-900">
                  Team Collaboration
                </strong>
                <span className="mt-1 text-sm text-slate-600">
                  Assign work, manage members, and collaborate in shared
                  workspaces.
                </span>
              </li>
              <li className="flex flex-col">
                <strong className="text-sm font-semibold text-slate-900">
                  Progress Insights
                </strong>
                <span className="mt-1 text-sm text-slate-600">
                  Visualize task completion, priorities, and team performance
                  with real-time analytics.
                </span>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
