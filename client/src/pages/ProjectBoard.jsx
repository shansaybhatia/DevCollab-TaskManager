import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Plus,
  ArrowLeft,
  UserPlus,
  Users,
  Radio,
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
  const { projects, fetchProjects, inviteMember } = useProjectStore();

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

  const getMembersList = () => {
    if (!project) return [];
    const members = [];

    if (project.owner) {
      const ownerObj =
        typeof project.owner === 'object'
          ? project.owner
          : { _id: project.owner, name: 'Owner' };
      members.push(ownerObj);
    }

    if (project.members) {
      project.members.forEach((m) => {
        const memberUser = m.User || m.user;
        if (memberUser && memberUser._id !== project.owner?._id) {
          members.push(memberUser);
        }
      });
    }

    return members;
  };

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
      toast.success('Invitation sent');
      setInviteEmail('');
      setShowInvite(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to invite');
    } finally {
      setIsInviting(false);
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
    const currentTask = draggedTask;
    setDraggedTask(null);

    try {
      await updateTask(currentTask._id, { status: newStatus });
      toast.success(`Moved to ${newStatus}`);
    } catch (err) {
      toast.error('Failed to move task');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  const membersList = getMembersList();

  return (
    <div className="space-y-6">
      {/* Board Header Bar */}
      <div className="glass-panel p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/projects')}
            className="p-2 rounded-[var(--radius-pill)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] text-[var(--color-muted)] hover:text-[var(--color-ink)] hover:border-[var(--color-accent)] transition-colors cursor-pointer"
            aria-label="Back to projects"
          >
            <ArrowLeft className="h-4.5 w-4.5" aria-hidden="true" />
          </button>

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold text-[var(--color-ink)] tracking-tight">
                {project?.title || 'Project sprint board'}
              </h1>
              <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--color-accent)] bg-[color-mix(in_oklch,var(--color-accent)_12%,transparent)] px-2.5 py-0.5 rounded-[var(--radius-pill)]">
                <Radio className="h-3 w-3 animate-pulse" aria-hidden="true" />
                <span>Live sync</span>
              </span>
            </div>
            {project?.description && (
              <p className="text-xs text-[var(--color-muted)] mt-1 line-clamp-1">
                {project.description}
              </p>
            )}
          </div>
        </div>

        {/* Actions & Roster */}
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2 mr-2">
            {membersList.slice(0, 4).map((m, i) => (
              <Avatar
                key={m._id || i}
                src={m.avatar}
                name={m.name || 'Member'}
                size="sm"
                className="ring-2 ring-[var(--color-paper-2)]"
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            icon={UserPlus}
            onClick={() => setShowInvite(true)}
          >
            Invite
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

      {/* Invite Modal */}
      <Modal
        isOpen={showInvite}
        onClose={() => setShowInvite(false)}
        title="Invite team member"
        size="sm"
      >
        <form onSubmit={handleInvite} className="space-y-4">
          <Input
            label="Email address"
            type="email"
            placeholder="colleague@devcollab.io"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            autoFocus
          />
          <div className="flex justify-end gap-3 pt-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowInvite(false)}
              size="sm"
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isInviting} size="sm">
              Send invitation
            </Button>
          </div>
        </form>

        {membersList.length > 0 && (
          <div className="mt-6 pt-4 border-t border-[var(--color-rule)]">
            <div className="flex items-center gap-2 mb-3 text-xs font-mono text-[var(--color-muted)]">
              <Users className="h-4 w-4" aria-hidden="true" />
              <span>Workspace members ({membersList.length})</span>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {membersList.map((m, i) => (
                <div
                  key={m._id || i}
                  className="flex items-center gap-3 p-2 rounded-[var(--radius-pill)] hover:bg-[var(--color-paper-3)] transition-colors"
                >
                  <Avatar src={m.avatar} name={m.name || ''} size="sm" />
                  <div className="min-w-0 flex-1 text-left">
                    <p className="text-xs font-semibold text-[var(--color-ink)] truncate">
                      {m.name || 'Member'}
                    </p>
                    <p className="text-[11px] font-mono text-[var(--color-muted)] truncate">
                      {m.email || ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
