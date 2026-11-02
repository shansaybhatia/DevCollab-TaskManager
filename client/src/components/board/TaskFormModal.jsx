import { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';

export default function TaskFormModal({
  isOpen,
  onClose,
  onSubmit,
  members = [],
  editingTask = null,
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || '');
      setDescription(editingTask.description || '');
      setPriority(editingTask.priority || 'medium');
      setAssignedTo(
        editingTask.assignedTo?._id || editingTask.assignedTo || ''
      );
      setDueDate(
        editingTask.duedate
          ? new Date(editingTask.duedate).toISOString().split('T')[0]
          : ''
      );
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setAssignedTo('');
      setDueDate('');
    }
  }, [editingTask, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({
        title,
        description,
        priority,
        assignedTo: assignedTo || undefined,
        dueDate: dueDate || undefined,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingTask ? 'Edit task' : 'Create task'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
          required
        />

        <div className="space-y-1.5 text-left">
          <label className="block text-xs font-medium text-[var(--color-ink-2)]">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add context or acceptance criteria..."
            rows={3}
            className="w-full rounded-[var(--radius-pill)] border border-[var(--color-rule)] bg-[var(--color-paper-3)] px-3.5 py-2.5
              text-sm text-[var(--color-ink)] placeholder:text-[var(--color-muted)]
              focus-visible:border-[var(--color-focus)] focus-visible:outline-none
              transition-colors resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 text-left">
          {/* Priority */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[var(--color-ink-2)]">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full rounded-[var(--radius-pill)] border border-[var(--color-rule)] bg-[var(--color-paper-3)] px-3 py-2
                text-xs text-[var(--color-ink)] focus-visible:border-[var(--color-focus)] focus-visible:outline-none
                transition-colors font-mono"
            >
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
            </select>
          </div>

          {/* Assignee */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[var(--color-ink-2)]">
              Assignee
            </label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full rounded-[var(--radius-pill)] border border-[var(--color-rule)] bg-[var(--color-paper-3)] px-3 py-2
                text-xs text-[var(--color-ink)] focus-visible:border-[var(--color-focus)] focus-visible:outline-none
                transition-colors font-mono"
            >
              <option value="">unassigned</option>
              {members.map((m) => {
                const memberId = m.User?._id || m.user?._id || m._id;
                const memberName = m.User?.name || m.user?.name || m.name;
                return (
                  <option key={memberId} value={memberId}>
                    {memberName}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Due Date */}
        <Input
          label="Due date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <div className="flex justify-end gap-2.5 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} size="sm">
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting} size="sm">
            {editingTask ? 'Save changes' : 'Create task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
