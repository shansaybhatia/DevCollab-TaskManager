import { useState } from "react";

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-slate-900/60 border border-slate-800 backdrop-blur-md rounded-2xl p-8 shadow-2xl">
        <h1 className="text-3xl font-extrabold text-sky-400 text-center mb-2">
          DevCollab
        </h1>
        <p className="text-slate-400 text-center text-sm mb-6">
          Manage tasks seamlessly with your team.
        </p>

        {/* Your components will go here */}
        <div className="space-y-4">
          <p className="text-center text-xs text-slate-500">
            Workspace Active • Branch: feature/frontend-ui
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
