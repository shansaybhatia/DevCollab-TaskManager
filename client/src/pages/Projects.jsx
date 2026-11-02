import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  FolderKanban,
  Trash2,
  Users,
  ArrowRight,
  Radio,
  KanbanSquare,
  Layers,
  Zap,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useProjectStore from '../stores/projectStore';
import useAuthStore from '../stores/authStore';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Spinner from '../components/ui/Spinner';
import Badge from '../components/ui/Badge';
import toast from 'react-hot-toast';

const PROJECT_TEMPLATES = [
  {
    title: 'Sprint Scrum Board',
    description: 'Two-week agile sprint cycle with To-Do, In-Progress, and Completed lanes.',
    tag: 'Agile Sprint',
  },
  {
    title: 'Bug Triage & QA Matrix',
    description: 'Track regressions, customer issues, and hotfixes with priority tags.',
    tag: 'QA / Bugfix',
  },
  {
    title: 'Core Platform Roadmap',
    description: 'Quarterly milestones, architecture enhancements, and infrastructure goals.',
    tag: 'Roadmap',
  },
];

export default function Projects() {
  const { projects, isLoading, fetchProjects, createProject, deleteProject } =
    useProjectStore();
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Project title is required');
      return;
    }
    setIsCreating(true);
    try {
      const project = await createProject(title.trim(), description.trim());
      toast.success('Project workspace initialized');
      setShowCreate(false);
      setTitle('');
      setDescription('');
      navigate(`/projects/${project._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create project');
    } finally {
      setIsCreating(false);
    }
  };

  const handleTemplateSelect = (template) => {
    setTitle(template.title);
    setDescription(template.description);
    setShowCreate(true);
  };

  const handleDelete = async (e, projectId) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this project workspace?')) return;
    try {
      await deleteProject(projectId);
      toast.success('Project deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete project');
    }
  };

  const filtered = projects.filter(
    (p) =>
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Spinner size="lg" />
        <span className="text-xs text-slate-500">
          Synchronizing project matrices…
        </span>
      </div>
    );
  }

  const currentUserId = String(user?._id || user?.id || '');

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Projects & Workspaces
          </h1>
          <p className="text-sm text-slate-500 mt-1 leading-relaxed">
            Manage collaborative team sprint boards with real-time duplex synchronization.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button icon={Plus} onClick={() => setShowCreate(true)} size="md">
            New Project
          </Button>
        </div>
      </div>

      {/* Top Metrics Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-[var(--radius-card)] bg-white/85 border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Active Workspaces</span>
            <p className="text-2xl font-extrabold text-slate-900 mt-0.5 num-metric">
              {projects.length}
            </p>
          </div>
          <div className="p-2.5 rounded-[var(--radius-btn)] bg-indigo-50 border border-indigo-100 text-indigo-600">
            <FolderKanban className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-[var(--radius-card)] bg-white/85 border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Duplex Sync Status</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-bold text-slate-800">
                Connected
              </span>
            </div>
          </div>
          <div className="p-2.5 rounded-[var(--radius-btn)] bg-sky-50 border border-sky-100 text-sky-600">
            <Radio className="h-5 w-5" />
          </div>
        </div>

        <div className="p-4 rounded-[var(--radius-card)] bg-white/85 border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Board Telemetry</span>
            <p className="text-sm font-bold text-slate-800 mt-1">
              Drag & Drop Enabled
            </p>
          </div>
          <div className="p-2.5 rounded-[var(--radius-btn)] bg-indigo-50 border border-indigo-100 text-indigo-600">
            <Layers className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      {projects.length > 0 && (
        <div className="flex items-center justify-between gap-4">
          <div className="max-w-md w-full">
            <Input
              placeholder="Filter projects by title or description…"
              icon={Search}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <span className="text-xs text-slate-500">
            Showing {filtered.length} of {projects.length} workspaces
          </span>
        </div>
      )}

      {/* Empty State / Welcome Launchpad */}
      {filtered.length === 0 && projects.length === 0 ? (
        <div className="space-y-8">
          {/* Main Hero Card */}
          <div className="glass-panel p-8 sm:p-12 text-center space-y-6 border-slate-200 shadow-xl bg-white/90 relative overflow-hidden">
            <div className="relative z-10 inline-flex p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 shadow-sm">
              <KanbanSquare className="h-10 w-10" aria-hidden="true" />
            </div>

            <div className="relative z-10 space-y-2 max-w-xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome to DevCollab Workspaces
              </h2>
              <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
                Initialize an agile sprint board to start organizing tasks, inviting team members, and synchronizing delivery live across Kanban columns.
              </p>
            </div>

            <div className="relative z-10 pt-2">
              <Button icon={Plus} onClick={() => setShowCreate(true)} size="lg" className="px-8 shadow-md">
                Create First Project Workspace
              </Button>
            </div>
          </div>

          {/* Quick-Start Templates Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  Quick-Start Templates
                </h3>
                <p className="text-xs text-slate-500">
                  Launch a pre-configured agile workflow in one click
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {PROJECT_TEMPLATES.map((tmpl) => (
                <div
                  key={tmpl.title}
                  onClick={() => handleTemplateSelect(tmpl)}
                  className="glass-card-interactive p-6 flex flex-col justify-between cursor-pointer group border-slate-200/90 bg-white/85 hover:border-indigo-300 shadow-xs hover:shadow-md"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 font-semibold">
                        {tmpl.tag}
                      </span>
                      <Zap className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                    </div>

                    <h4 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {tmpl.title}
                    </h4>

                    <p className="text-xs text-slate-500 leading-relaxed">
                      {tmpl.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
                    <span>Use this template</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-panel p-12 text-center text-sm text-slate-500 border-slate-200 bg-white/85 shadow-xs">
          No project workspaces match &quot;{search}&quot;. Try clearing your filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => {
            const ownerId = project.owner?._id
              ? String(project.owner._id)
              : String(project.owner || '');
            const isOwner = Boolean(
              currentUserId && ownerId && currentUserId === ownerId
            );

            // Accurate unique members count (owner + distinct invited members)
            const memberIds = new Set();
            if (ownerId) memberIds.add(ownerId);
            if (Array.isArray(project.members)) {
              project.members.forEach((m) => {
                const u = m.user?._id || m.user || m.User?._id || m.User;
                if (u) memberIds.add(String(u));
              });
            }
            const memberCount = memberIds.size || 1;

            return (
              <div
                key={project._id}
                onClick={() => navigate(`/projects/${project._id}`)}
                className="glass-card-interactive p-6 flex flex-col justify-between cursor-pointer group border-slate-200/90 bg-white/90 hover:border-indigo-300 shadow-xs hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <div className="p-3 rounded-[var(--radius-btn)] bg-indigo-50 border border-indigo-100 text-indigo-600 group-hover:shadow-xs transition-colors">
                      <FolderKanban className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      {isOwner && (
                        <button
                          onClick={(e) => handleDelete(e, project._id)}
                          title="Delete project"
                          className="p-1.5 rounded-[var(--radius-btn)] text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          aria-label="Delete project"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      )}
                      <span className="text-xs text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 font-semibold">
                        Open <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                    {project.title}
                  </h3>

                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {project.description || 'No description provided for this workspace.'}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-indigo-600" aria-hidden="true" />
                    <span>
                      {memberCount} {memberCount === 1 ? 'member' : 'members'}
                    </span>
                  </div>
                  <Badge variant={isOwner ? 'owner' : 'member'}>
                    {isOwner ? 'Owner' : 'Member'}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Project Modal */}
      <Modal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        title="Initialize New Project Workspace"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Project Title"
            placeholder="e.g. Q3 Sprint Platform Architecture"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
          />

          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-semibold text-slate-700 tracking-wide">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Outline project objectives, milestones, or team responsibilities…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-[var(--radius-btn)] border border-slate-200 bg-white px-4 py-2.5
                text-sm text-slate-900 placeholder:text-slate-400
                focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20
                transition-colors duration-200 shadow-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCreate(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isCreating}>
              Create Workspace
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
