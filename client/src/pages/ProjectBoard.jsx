import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Plus,
  ArrowLeft,
  UserPlus,
  Users,
  Sparkles,
  Layers,
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

  // Fetch project & task data
  useEffect(() => {
    if (!projectId) return;
    fetchTasks(projectId);
    if (projects.length === 0) fetchProjects();

    return () => clearTasks();
  }, [projectId]);

  // Real-time socket sync
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

  // Build members list (owner + members)
  const getMembersList = () => {
    if (!project) return [];
    const members = [];

    if (project.owner) {
      const ownerObj =
        typeof project.owner === 'object'
          ? project.owner
          : { _id: project.owner, name: 'Project Owner' };
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
      toast.success('Task created successfully');
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
    if (!confirm('Are you sure you want to delete this task?')) return;
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
      toast.success('Invitation sent to team member!');
      setInviteEmail('');
      setShowInvite(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send invite');
    } finally {
      setIsInviting(false);
    }
  };

  // Drag & Drop
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
      const statusTitle =
        newStatus === 'to-do'
          ? 'To Do'
          : newStatus === 'inprogress'
          ? 'In Progress'
          : 'Completed';
      toast.success(`Moved to ${statusTitle}`);
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
    <div className="animate-fade-in space-y-6 max-w-7xl mx-auto">
      {/* Board Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/projects')}
            className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 
              hover:bg-slate-100 hover:text-slate-900 transition-all cursor-pointer active:scale-95"
            title="Back to projects"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {project?.title || 'Interactive Kanban Board'}
              </h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Sync
              </span>
            </div>
            {project?.description && (
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                {project.description}
              </p>
            )}
          </div>
        </div>

        {/* Action Controls & Members */}
        <div className="flex items-center gap-3">
          {/* Member Avatars */}
          <div className="flex -space-x-2 mr-1">
            {membersList.slice(0, 4).map((m, i) => (
              <Avatar
                key={m._id || i}
                src={m.avatar}
                name={m.name || 'Member'}
                size="sm"
                className="ring-2 ring-white shadow-xs"
              />
            ))}
            {membersList.length > 4 && (
              <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 ring-2 ring-white shadow-xs">
                +{membersList.length - 4}
              </div>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            icon={UserPlus}
            onClick={() => setShowInvite(true)}
            className="border-slate-200"
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
            className="shadow-sm shadow-indigo-500/20"
          >
            New Task
          </Button>
        </div>
      </div>

      {/* Kanban Board Columns Container */}
      <div className="flex gap-6 overflow-x-auto pb-6 pt-2">
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

      {/* Task Creation & Edit Modal */}
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

      {/* Invite Teammates Modal */}
      <Modal
        isOpen={showInvite}
        onClose={() => setShowInvite(false)}
        title="Invite Teammates to Project"
        size="sm"
      >
        <form onSubmit={handleInvite} className="space-y-4">
          <Input
            label="Collaborator Email"
            type="email"
            placeholder="developer@company.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            autoFocus
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowInvite(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isInviting} icon={UserPlus}>
              Send Invitation
            </Button>
          </div>
        </form>

        {/* Existing Member List */}
        {membersList.length > 0 && (
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-4 w-4 text-slate-400" />
              <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Current Workspace Members ({membersList.length})
              </h4>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {membersList.map((m, i) => (
                <div
                  key={m._id || i}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <Avatar src={m.avatar} name={m.name || ''} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {m.name || 'Team Member'}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {m.email || 'Member of project'}
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
