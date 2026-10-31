import { useState, useEffect } from 'react';
import { Plus, Search, FolderKanban, Trash2, Users, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useProjectStore from '../stores/projectStore';
import useAuthStore from '../stores/authStore';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import EmptyState from '../components/ui/EmptyState';
import Spinner from '../components/ui/Spinner';
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
      toast.success('Project workspace created!');
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
    if (!confirm('Are you sure you want to permanently delete this project?')) return;
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
    <div className="animate-fade-in space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight sm:text-3xl">
            Workspaces & Projects
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Organize tasks, collaborate across teams, and manage workflows.
          </p>
        </div>
        <Button icon={Plus} onClick={() => setShowCreate(true)} className="shadow-md shadow-indigo-500/20">
          Create Workspace
        </Button>
      </div>

      {/* Filter and Search Bar */}
      {projects.length > 0 && (
        <div className="flex items-center justify-between gap-4 max-w-md">
          <Input
            placeholder="Search projects by title or description..."
            icon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/80 backdrop-blur-sm"
          />
        </div>
      )}

      {/* Projects Grid */}
      {filtered.length === 0 && projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects initialized yet"
          description="Create your first team workspace to begin assigning tasks, tracking progress, and collaborating."
          action={
            <Button icon={Plus} onClick={() => setShowCreate(true)} className="shadow-md">
              Create Your First Project
            </Button>
          }
        />
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <p className="text-base font-semibold text-slate-700">No matching projects found</p>
          <p className="text-xs text-slate-400 mt-1">Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 
                  bg-white p-6 shadow-xs hover:shadow-xl hover:border-indigo-300 card-hover-lift cursor-pointer transition-all duration-300"
              >
                {/* Subtle top accent gradient */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-400 opacity-80 group-hover:opacity-100 transition-opacity" />

                <div>
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <div className="p-3 rounded-xl bg-indigo-50/80 text-indigo-600 transition-transform duration-300 group-hover:scale-110 shadow-xs">
                      <FolderKanban className="h-5 w-5" />
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                      {isOwner && (
                        <button
                          onClick={(e) => handleDelete(e, project._id)}
                          title="Delete workspace"
                          className="p-1.5 rounded-lg text-slate-300 opacity-0 group-hover:opacity-100
                            hover:bg-rose-50 hover:text-rose-600 transition-all cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                      <div className="p-1 rounded-lg text-slate-300 group-hover:text-indigo-600 transition-colors">
                        <ArrowUpRight className="h-4.5 w-4.5" />
                      </div>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-1.5 line-clamp-1">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed min-h-[2rem]">
                    {project.description || 'No description provided.'}
                  </p>
                </div>

                {/* Card Footer */}
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                    <Users className="h-3.5 w-3.5 text-slate-400" />
                    <span>
                      {memberCount} {memberCount === 1 ? 'member' : 'members'}
                    </span>
                  </div>

                  {isOwner && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                      <ShieldCheck className="h-3 w-3" />
                      <span>Owner</span>
                    </span>
                  )}
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
        title="Initialize New Project Workspace"
      >
        <form onSubmit={handleCreate} className="space-y-5">
          <Input
            label="Project Title"
            placeholder="e.g. NextGen Mobile Client, Cloud API Migration"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline high-level goals and milestones for your team..."
              rows={3}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5
                text-sm text-slate-900 placeholder:text-slate-400
                focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
                transition-colors duration-150 resize-none shadow-xs"
            />
          </div>
          <div className="flex justify-end gap-3 pt-3">
            <Button
              type="button"
              variant="ghost"
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
