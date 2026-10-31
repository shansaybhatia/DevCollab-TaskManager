const Task = require('../models/Task');
const Project = require('../models/Project');

exports.createTask = async (req, res) => {
  try {
    const { title, description, projectId, assignedTo, priority, dueDate, duedate } =
      req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Task title is required' });
    }

    if (!projectId) {
      return res.status(400).json({ message: 'Project ID is required' });
    }

    const project = await Project.findOne({
      _id: projectId,
      $or: [{ owner: req.user._id }, { 'members.user': req.user._id }],
    });

    if (!project) {
      return res
        .status(403)
        .json({ message: 'Not authorized to add tasks to this project' });
    }

    const task = new Task({
      title: title.trim(),
      description: description ? description.trim() : '',
      project: projectId,
      assignedTo: assignedTo || null,
      priority: priority || 'medium',
      duedate: dueDate || duedate || undefined,
    });

    await task.save();
    await task.populate('assignedTo', 'name email avatar');

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getTasksByProject = async (req, res) => {
  try {
    const projectId = req.params.projectId;

    const project = await Project.findOne({
      _id: projectId,
      $or: [{ owner: req.user._id }, { 'members.user': req.user._id }],
    });

    if (!project) {
      return res
        .status(403)
        .json({ message: 'Not authorized to view these tasks' });
    }

    const tasks = await Task.find({ project: projectId })
      .populate('assignedTo', 'name email avatar')
      .sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const { title, description, status, priority, assignedTo, dueDate, duedate } =
      req.body;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const project = await Project.findOne({
      _id: task.project,
      $or: [{ owner: req.user._id }, { 'members.user': req.user._id }],
    });

    if (!project) {
      return res
        .status(403)
        .json({ message: 'Not authorized to edit this task' });
    }

    const updateFields = {};
    if (title !== undefined) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;
    if (status !== undefined) updateFields.status = status;
    if (priority !== undefined) updateFields.priority = priority;
    if (assignedTo !== undefined) updateFields.assignedTo = assignedTo || null;
    if (dueDate !== undefined || duedate !== undefined) {
      updateFields.duedate = dueDate || duedate;
    }

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name email avatar');

    const io = req.app.get('io');
    if (io) {
      io.to(task.project.toString()).emit('taskUpdated', updatedTask);
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const project = await Project.findOne({
      _id: task.project,
      $or: [{ owner: req.user._id }, { 'members.user': req.user._id }],
    });

    if (!project) {
      return res
        .status(403)
        .json({ message: 'Not authorized to delete this task' });
    }

    await Task.findByIdAndDelete(taskId);

    const io = req.app.get('io');
    if (io) {
      io.to(task.project.toString()).emit('taskDeleted', taskId);
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
