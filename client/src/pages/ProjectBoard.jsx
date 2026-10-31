import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Plus,
  ArrowLeft,
  UserPlus,
  Settings,
  Users,
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
import { connectSocket, joinProject as socketJoinProject, getSocket } from '../lib/socket';
import toast from 'react-hot-toast';

const STATUSES = ['to-do', 'inprogress', 'completed'];

export default function ProjectBoard() {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { tasks, isLoading, fetchTasks, createTask, updateTask, deleteTask, handleSocketTaskUpdate, clearTasks } =
    useTaskStore();
  const { projects, fetchProjects, inviteMember } = useProjectStore();

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [draggedTask, setDraggedTask] = useState(null);

  const project = projects.find((p) => p._id === projectId);

  // Fetch project data
  useEffect(() => {
    if (!projectId) return;
    fetchTasks(projectId);
    if (projects.length === 0) fetchProjects();

    return () => clearTasks();
  }, [projectId]);

  // Socket connection
  useEffect(() => {
    if (!projectId) return;
    const socket = connectSocket();
    socketJoinProject(projectId);

    socket.on('taskUpdated', (updatedTask) => {
      handleSocketTaskUpdate(updatedTask);
    });

    return () => {
      socket.off('taskUpdated');
    };
  }, [projectId]);

  // Build members list (owner + members)
  const getMembersList = () => {
    if (!project) return [];
    const members = [];

    // Add owner
    if (project.owner) {
      const ownerObj =
        typeof project.owner === 'object'
          ? project.owner
          : { _id: project.owner, name: 'Owner' };
      members.push(ownerObj);
    }

    // Add members
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
      toast.success('Invitation sent!');
      setInviteEmail('');
      setShowInvite(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to invite');
    } finally {
      setIsInviting(false);
    }
  };

  // Drag & Drop handlers
  const handleDragStart = (task) => {
    setDraggedTask(task);
  };

  const handleDrop = async (newStatus) => {
    if (!draggedTask || draggedTask.status === newStatus) {
      setDraggedTask(null);
      return;
    }
    try {
      await updateTask(draggedTask._id, { status: newStatus });
      toast.success(`Moved to ${newStatus === 'to-do' ? 'To Do' : newStatus === 'inprogress' ? 'In Progress' : 'Completed'}`);
    } catch (err) {
      toast.error('Failed to move task');
    }
    setDraggedTask(null);
  };

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/projects')}
            className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {project?.title || 'Project Board'}
            </h1>
            {project?.description && (
              <p className="text-sm text-slate-500 mt-0.5">
                {project.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Members Avatars */}
          <div className="flex -space-x-2 mr-2">
            {getMembersList()
              .slice(0, 4)
              .map((m, i) => (
                <Avatar
                  key={m._id || i}
                  src={m.avatar}
                  name={m.name || ''}
                  size="sm"
                  className="ring-2 ring-white"
                />
              ))}
            {getMembersList().length > 4 && (
              <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-600 ring-2 ring-white">
                +{getMembersList().length - 4}
              </div>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            icon={UserPlus}
            onClick={() => setShowInvite(true)}
          >
            Invite
          </Button>
          <Button size="sm" icon={Plus} onClick={() => setShowTaskForm(true)}>
            Add Task
          </Button>
        </div>
      </div>

      {/* Kanban Board */}
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

      {/* Task Form Modal */}
      <TaskFormModal
        isOpen={showTaskForm}
        onClose={() => {
          setShowTaskForm(false);
          setEditingTask(null);
        }}
        onSubmit={editingTask ? handleEditTask : handleCreateTask}
        members={getMembersList()}
        editingTask={editingTask}
      />

      {/* Invite Modal */}
      <Modal
        isOpen={showInvite}
        onClose={() => setShowInvite(false)}
        title="Invite Team Member"
        size="sm"
      >
        <form onSubmit={handleInvite} className="space-y-5">
          <Input
            label="Email Address"
            type="email"
            placeholder="teammate@example.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            autoFocus
          />
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowInvite(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isInviting} icon={UserPlus}>
              Send Invite
            </Button>
          </div>
        </form>

        {/* Current members */}
        {getMembersList().length > 0 && (
          <div className="mt-6 pt-5 border-t border-slate-100">
            <h4 className="text-sm font-medium text-slate-700 mb-3">
              <Users className="h-4 w-4 inline mr-1.5" />
              Current Members ({getMembersList().length})
            </h4>
            <div className="space-y-2">
              {getMembersList().map((m, i) => (
                <div key={m._id || i} className="flex items-center gap-3 py-1.5">
                  <Avatar src={m.avatar} name={m.name || ''} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {m.name}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{m.email}</p>
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
