const Task = require('../models/Task');
const Project = require('../models/Project');

exports.getDashboardstats = async (req, res) => {
  try {
    const userProjects = await Project.find({
      $or: [{ owner: req.user._id }, { 'members.user': req.user._id }],
    });

    const projectIds = userProjects.map((p) => p._id);

    const taskStats = await Task.aggregate([
      { $match: { project: { $in: projectIds } } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const formattedStats = {
      todo: 0,
      inprogress: 0,
      done: 0,
      totalProjects: userProjects.length,
    };

    taskStats.forEach((stat) => {
      if (stat._id === 'to-do' || stat._id === 'todo') {
        formattedStats.todo += stat.count;
      } else if (stat._id === 'inprogress') {
        formattedStats.inprogress += stat.count;
      } else if (stat._id === 'completed' || stat._id === 'done') {
        formattedStats.done += stat.count;
      }
    });

    res.status(200).json(formattedStats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
