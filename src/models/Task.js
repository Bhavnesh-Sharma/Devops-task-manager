import mongoose from 'mongoose'

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['todo', 'in-progress', 'done'],
      default: 'todo'
    },
    dueDate: {
      type: Date
    }
  },
  {
    timestamps: true
  }
)

const Task = mongoose.model('Task', TaskSchema)

export default Task


