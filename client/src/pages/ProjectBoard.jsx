import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Plus,
  ArrowLeft,
  UserPlus,
  Users,
  Radio,
  UserMinus,
  Shield,
} from 'lucide-react';
import useTaskStore from '../stores/taskStore';
import useProjectStore from '../stores/projectStore';
import useAuthStore from '../stores/authStore';
import KanbanColumn from '../components/board/KanbanColumn';
import TaskFormModal from '../components/board/TaskFormModal';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import Spinner from '../components/ui/Spinner';
import Badge from '../components/ui/Badge';
import { connectSocket, joinProject as socketJoinProject } from '../lib/socket';
import toast from 'react-hot-toast';

const STATUSES = ['to-do', 'inprogress', 'completed'];

export default function ProjectBoard() {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const {
    tasks,
    isLoading,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    handleSocketTaskUpdate,
    handleSocketTaskDelete,
    clearTasks,
  } = useTaskStore();
  const { projects, fetchProjects, inviteMember, removeMember } = useProjectStore();

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [draggedTask, setDraggedTask] = useState(null);

  const project = projects.find((p) => p._id === projectId);

  useEffect(() => {
    if (!projectId) return;
    fetchTasks(projectId);
    if (projects.length === 0) fetchProjects();

    return () => clearTasks();
  }, [projectId]);

  useEffect(() => {
    if (!projectId) return;
    const socket = connectSocket();
    socketJoinProject(projectId);

    socket.on('taskUpdated', (updatedTask) => {
      handleSocketTaskUpdate(updatedTask);
    });

    socket.on('taskDeleted', (deletedTaskId) => {
      handleSocketTaskDelete(deletedTaskId);
    });

    return () => {
      socket.off('taskUpdated');
      socket.off('taskDeleted');
    };
  }, [projectId]);

  // Compute accurate unique member roster (never duplicates)
  const getMembersList = () => {
    if (!project) return [];
    const membersMap = new Map();

    const ownerId = project.owner?._id
      ? String(project.owner._id)
      : String(project.owner || '');

    if (project.owner) {
      const ownerObj =
        typeof project.owner === 'object'
          ? project.owner
          : { _id: ownerId, name: 'Owner' };

      membersMap.set(ownerId, {
        _id: ownerId,
        name: ownerObj.name || 'Owner',
        email: ownerObj.email || '',
        avatar: ownerObj.avatar || '',
        role: 'owner',
        isOwner: true,
      });
    }

    if (Array.isArray(project.members)) {
      project.members.forEach((m) => {
        const u = m.user || m.User;
        if (!u) return;
        const uId = String(u._id || u);
        if (!membersMap.has(uId)) {
          membersMap.set(uId, {
            _id: uId,
            name: u.name || 'Member',
            email: u.email || '',
            avatar: u.avatar || '',
            role: uId === ownerId ? 'owner' : m.role || 'member',
            isOwner: uId === ownerId,
          });
        }
      });
    }

    return Array.from(membersMap.values());
  };

  const currentUserId = String(user?._id || user?.id || '');
  const projectOwnerId = project?.owner?._id
    ? String(project.owner._id)
    : String(project?.owner || '');
  const isCurrentUserOwner = Boolean(
    currentUserId && projectOwnerId && currentUserId === projectOwnerId
  );

  const handleCreateTask = async (taskData) => {
    try {
      await createTask({ ...taskData, projectId });
      toast.success('Task created');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
      throw err;
    }
  };

  const handleEditTask = async (taskData) => {
    try {
      await updateTask(editingTask._id, taskData);
      toast.success('Task updated');
      setEditingTask(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task');
      throw err;
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Delete this task?')) return;
    try {
      await deleteTask(taskId);
      toast.success('Task deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setIsInviting(true);
    try {
      await inviteMember(projectId, inviteEmail.trim());
      toast.success('Member added to workspace');
      setInviteEmail('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to invite member');
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemoveMember = async (memberUserId, memberName) => {
    if (
      !confirm(
        `Are you sure you want to remove ${memberName || 'this member'} from the workspace?`
      )
    )
      return;
    try {
      await removeMember(projectId, memberUserId);
      toast.success(`${memberName || 'Member'} removed from workspace`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove member');
    }
  };

  const handleDragStart = (task) => {
    setDraggedTask(task);
  };

  const handleDrop = async (newStatus) => {
    if (!draggedTask || draggedTask.status === newStatus) {
      setDraggedTask(null);
      return;
    }
    const previousStatus = draggedTask.status;
    try {
      await updateTask(draggedTask._id, { status: newStatus });
      toast.success(`Moved to ${newStatus}`);
    } catch {
      toast.error('Failed to move task');
      await updateTask(draggedTask._id, { status: previousStatus });
    } finally {
      setDraggedTask(null);
    }
  };

  if (isLoading && tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Spinner size="lg" />
        <span className="text-xs text-slate-400">
          Loading sprint board telemetry…
        </span>
      </div>
    );
  }

  const membersList = getMembersList();

  return (
    <div className="space-y-6">
      {/* Board Header Bar */}
      <div className="glass-panel p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl border-slate-800">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/projects')}
            className="p-2 rounded-[var(--radius-btn)] border border-slate-700 bg-slate-800/80 text-slate-300 hover:text-white hover:border-slate-500 transition-colors cursor-pointer"
            aria-label="Back to projects"
          >
            <ArrowLeft className="h-4.5 w-4.5" aria-hidden="true" />
          </button>

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold text-white tracking-tight">
                {project?.title || 'Project sprint board'}
              </h1>
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-700 font-medium">
                <Radio className="h-3 w-3 text-emerald-400 animate-pulse" aria-hidden="true" />
                <span>Live sync</span>
              </span>
            </div>
            {project?.description && (
              <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                {project.description}
              </p>
            )}
          </div>
        </div>

        {/* Actions & Roster */}
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2 mr-2">
            {membersList.slice(0, 4).map((m) => (
              <Avatar
                key={m._id}
                src={m.avatar}
                name={m.name || 'Member'}
                size="sm"
                className="ring-2 ring-slate-900"
              />
            ))}
          </div>

          <Button
            variant="secondary"
            size="sm"
            icon={isCurrentUserOwner ? UserPlus : Users}
            onClick={() => setShowInvite(true)}
          >
            {isCurrentUserOwner ? 'Manage Team' : `Members (${membersList.length})`}
          </Button>

          <Button
            size="sm"
            icon={Plus}
            onClick={() => {
              setEditingTask(null);
              setShowTaskForm(true);
            }}
          >
            New task
          </Button>
        </div>
      </div>

      {/* Kanban Board Columns Container */}
      <div className="flex gap-6 overflow-x-auto pb-6">
        {STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={tasks}
            onEditTask={(task) => {
              setEditingTask(task);
              setShowTaskForm(true);
            }}
            onDeleteTask={handleDeleteTask}
            onDragStart={handleDragStart}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          />
        ))}
      </div>

      {/* Task Modal */}
      <TaskFormModal
        isOpen={showTaskForm}
        onClose={() => {
          setShowTaskForm(false);
          setEditingTask(null);
        }}
        onSubmit={editingTask ? handleEditTask : handleCreateTask}
        members={membersList}
        editingTask={editingTask}
      />

      {/* Team & Members Management Modal */}
      <Modal
        isOpen={showInvite}
        onClose={() => setShowInvite(false)}
        title={isCurrentUserOwner ? 'Manage Workspace Team' : 'Workspace Members'}
        size="md"
      >
        <div className="space-y-6">
          {/* Owner-only Invite Form */}
          {isCurrentUserOwner ? (
            <form onSubmit={handleInvite} className="space-y-3">
              <Input
                label="Invite team member by email"
                type="email"
                placeholder="colleague@devcollab.io"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                autoFocus
              />
              <div className="flex justify-end gap-3 pt-1">
                <Button type="submit" isLoading={isInviting} size="sm">
                  Send invitation
                </Button>
              </div>
            </form>
          ) : (
            <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/60 text-xs text-slate-400 flex items-center gap-2">
              <Shield className="h-4 w-4 text-indigo-400 shrink-0" />
              <span>You are viewing this team roster as a member. Only the owner can invite or remove members.</span>
            </div>
          )}

          {/* Members Roster List */}
          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-medium">
                <Users className="h-4 w-4 text-indigo-400" aria-hidden="true" />
                Workspace members ({membersList.length})
              </span>
              {isCurrentUserOwner && (
                <span className="text-[11px] text-slate-500">
                  Owner permissions active
                </span>
              )}
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {membersList.map((m) => {
                const isThisMemberOwner = m.isOwner || m._id === projectOwnerId;

                return (
                  <div
                    key={m._id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar src={m.avatar} name={m.name || ''} size="sm" />
                      <div className="min-w-0 text-left">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-semibold text-white truncate">
                            {m.name || 'Member'}
                          </p>
                          {m._id === currentUserId && (
                            <span className="text-[10px] text-slate-400">(You)</span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">
                          {m.email || ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant={isThisMemberOwner ? 'owner' : 'member'}>
                        {isThisMemberOwner ? 'Owner' : 'Member'}
                      </Badge>

                      {/* Remove Button (Owner ONLY, and cannot remove themselves) */}
                      {isCurrentUserOwner && !isThisMemberOwner && (
                        <button
                          onClick={() => handleRemoveMember(m._id, m.name)}
                          className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title={`Remove ${m.name || 'member'} from workspace`}
                          aria-label={`Remove ${m.name || 'member'}`}
                        >
                          <UserMinus className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
