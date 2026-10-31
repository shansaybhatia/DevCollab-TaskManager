const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    status: {
      type: String,
      enum: ['to-do', 'inprogress', 'completed'],
      default: 'to-do',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    duedate: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Virtual alias so task.dueDate and task.duedate work interchangeably
taskSchema
  .virtual('dueDate')
  .get(function () {
    return this.duedate;
  })
  .set(function (value) {
    this.duedate = value;
  });

taskSchema.set('toJSON', { virtuals: true });
taskSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Task', taskSchema);
