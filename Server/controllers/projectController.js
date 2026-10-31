const Project = require('../models/Project');
const User = require('../models/User');

// GET /api/projects - List all projects where user is owner or member
exports.getProjects = async (req, res) => {
  try {
    const userId = req.user._id;
    const projects = await Project.find({
      $or: [{ owner: userId }, { 'members.user': userId }],
    })
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar')
      .sort({ updatedAt: -1 });

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /api/projects - Create a new project
exports.createProject = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Project title is required' });
    }

    const newProject = new Project({
      title: title.trim(),
      description: description ? description.trim() : '',
      owner: req.user._id,
      members: [{ user: req.user._id, role: 'owner' }],
    });

    await newProject.save();
    await newProject.populate('owner', 'name email avatar');
    await newProject.populate('members.user', 'name email avatar');

    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PUT /api/projects/:id - Update an existing project
exports.updateProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const { title, description } = req.body;

    const project = await Project.findOneAndUpdate(
      { _id: projectId, owner: req.user._id },
      { $set: { title, description } },
      { new: true, runValidators: true }
    )
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar');

    if (!project) {
      return res.status(404).json({
        message: 'Project not found or you are not authorized to update this project',
      });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE /api/projects/:id - Delete project
exports.deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const deletedProject = await Project.findOneAndDelete({
      _id: projectId,
      owner: req.user._id,
    });

    if (!deletedProject) {
      return res.status(404).json({
        message: 'Project not found or you are not the owner of this project',
      });
    }

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /api/projects/:id/invite - Invite member to project
exports.inviteMember = async (req, res) => {
  try {
    const projectId = req.params.id;
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ message: 'Please provide user email' });
    }

    const project = await Project.findOne({
      _id: projectId,
      owner: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        message: 'Project not found or you are not the owner of this project',
      });
    }

    const userToInvite = await User.findOne({ email: email.toLowerCase().trim() });
    if (!userToInvite) {
      return res.status(404).json({ message: 'User with this email not found' });
    }

    const isAlreadyMember = project.members.some(
      (m) => m.user && m.user.toString() === userToInvite._id.toString()
    );

    if (isAlreadyMember) {
      return res.status(400).json({ message: 'User is already a member of this project' });
    }

    project.members.push({ user: userToInvite._id, role: 'member' });
    await project.save();

    await project.populate('owner', 'name email avatar');
    await project.populate('members.user', 'name email avatar');

    res.status(200).json({ message: 'Member added successfully', project });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
