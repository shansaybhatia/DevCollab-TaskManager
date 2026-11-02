import { useState, useEffect } from 'react';
import { Plus, Search, FolderKanban, Trash2, Users, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useProjectStore from '../stores/projectStore';
import useAuthStore from '../stores/authStore';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import EmptyState from '../components/ui/EmptyState';
import Spinner from '../components/ui/Spinner';
import Badge from '../components/ui/Badge';
import toast from 'react-hot-toast';

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
      toast.success('Project workspace created');
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

  const handleDelete = async (e, projectId) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this project?')) return;
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
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-ink)] tracking-tight">
            Projects
          </h1>
          <p className="text-xs text-[var(--color-muted)] mt-1 font-mono">
            Workspaces and collaborative task boards
          </p>
        </div>
        <Button icon={Plus} onClick={() => setShowCreate(true)} size="sm">
          New project
        </Button>
      </div>

      {/* Search */}
      {projects.length > 0 && (
        <div className="max-w-xs">
          <Input
            placeholder="Search projects..."
            icon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 && projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects initialized"
          description="Create a project workspace to start delegating tasks and managing sprints."
          action={
            <Button icon={Plus} onClick={() => setShowCreate(true)} size="sm">
              Create project
            </Button>
          }
        />
      ) : filtered.length === 0 ? (
        <div className="console-panel p-8 text-center text-xs text-[var(--color-muted)]">
          No projects match &quot;{search}&quot;
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((project) => {
            const isOwner =
              project.owner === user?.id ||
              project.owner?._id === user?.id ||
              project.owner === user?._id ||
              project.owner?._id === user?._id;
            const memberCount = (project.members?.length || 0) + 1;

            return (
              <div
                key={project._id}
                onClick={() => navigate(`/projects/${project._id}`)}
                className="console-panel-interactive p-5 flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <FolderKanban className="h-5 w-5 text-[var(--color-accent)]" aria-hidden="true" />
                    <div className="flex items-center gap-1">
                      {isOwner && (
                        <button
                          onClick={(e) => handleDelete(e, project._id)}
                          title="Delete project"
                          className="p-1 rounded text-[var(--color-muted)] hover:text-[var(--color-bad)] transition-colors cursor-pointer"
                          aria-label="Delete project"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      )}
                      <ArrowUpRight className="h-4 w-4 text-[var(--color-muted)] group-hover:text-[var(--color-ink)] transition-colors" aria-hidden="true" />
                    </div>
                  </div>

                  <h3 className="text-sm font-semibold text-[var(--color-ink)] mb-1 truncate">
                    {project.title}
                  </h3>
                  <p className="text-xs text-[var(--color-muted)] line-clamp-2 leading-relaxed min-h-[2rem]">
                    {project.description || 'No description provided.'}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 mt-4 border-t border-[var(--color-rule)] text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-[var(--color-muted)]">
                    <Users className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>
                      {memberCount} {memberCount === 1 ? 'member' : 'members'}
                    </span>
                  </div>

                  {isOwner && <Badge variant="medium">owner</Badge>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* New Project Modal */}
      <Modal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        title="Create new project workspace"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Title"
            placeholder="e.g. Core API Service"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-medium text-[var(--color-ink-2)]">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Workspace objectives and scope..."
              rows={3}
              className="w-full rounded-[var(--radius-pill)] border border-[var(--color-rule)] bg-[var(--color-paper-3)] px-3.5 py-2.5
                text-sm text-[var(--color-ink)] placeholder:text-[var(--color-muted)]
                focus-visible:border-[var(--color-focus)] focus-visible:outline-none
                transition-colors resize-none"
            />
          </div>
          <div className="flex justify-end gap-2.5 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowCreate(false)}
              size="sm"
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isCreating} size="sm">
              Create workspace
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
