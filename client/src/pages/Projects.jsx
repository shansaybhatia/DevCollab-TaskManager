import { useState } from 'react';
import { Plus, Search, FolderKanban, Trash2, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useProjectStore from '../stores/projectStore';
import useAuthStore from '../stores/authStore';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import EmptyState from '../components/ui/EmptyState';
import Spinner from '../components/ui/Spinner';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

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
      toast.error('Project name is required');
      return;
    }
    setIsCreating(true);
    try {
      const project = await createProject(title.trim(), description.trim());
      toast.success('Project created!');
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
      toast.error(err.response?.data?.message || 'Failed to delete');
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
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
          <p className="text-slate-500 mt-1">
            {projects.length} project{projects.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button icon={Plus} onClick={() => setShowCreate(true)}>
          New Project
        </Button>
      </div>

      {/* Search */}
      {projects.length > 0 && (
        <div className="mb-6 max-w-sm">
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
          title="No projects yet"
          description="Create your first project to start organizing tasks with your team."
          action={
            <Button icon={Plus} onClick={() => setShowCreate(true)}>
              Create Project
            </Button>
          }
        />
      ) : filtered.length === 0 ? (
        <p className="text-center text-slate-500 py-12">
          No projects match &quot;{search}&quot;
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((project) => {
            const isOwner =
              project.owner === user?.id ||
              project.owner?._id === user?.id ||
              project.owner === user?._id;
            const memberCount = (project.members?.length || 0) + 1;

            return (
              <div
                key={project._id}
                onClick={() => navigate(`/projects/${project._id}`)}
                className="group bg-white rounded-xl border border-slate-200 p-5 shadow-sm
                  hover:shadow-md hover:border-indigo-200 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 rounded-lg bg-indigo-50">
                    <FolderKanban className="h-5 w-5 text-indigo-500" />
                  </div>
                  {isOwner && (
                    <button
                      onClick={(e) => handleDelete(e, project._id)}
                      className="p-1.5 rounded-lg text-slate-400 opacity-0 group-hover:opacity-100
                        hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <h3 className="text-base font-semibold text-slate-900 mb-1 truncate">
                  {project.title}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-4 min-h-[2.5rem]">
                  {project.description || 'No description'}
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Users className="h-3.5 w-3.5" />
                  <span>
                    {memberCount} member{memberCount !== 1 ? 's' : ''}
                  </span>
                  {isOwner && (
                    <span className="ml-auto text-xs font-medium text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
                      Owner
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        title="Create New Project"
      >
        <form onSubmit={handleCreate} className="space-y-5">
          <Input
            label="Project Name"
            placeholder="e.g., Mobile App Redesign"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this project about?"
              rows={3}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5
                text-sm text-slate-900 placeholder:text-slate-400
                focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
                transition-colors duration-150 resize-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowCreate(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isCreating}>
              Create Project
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
