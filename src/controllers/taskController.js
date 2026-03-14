import Task from '../models/Task.js'

export async function listTasks (req, res, next) {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 })
    res.json(tasks)
  } catch (err) {
    next(err)
  }
}

export async function createTask (req, res, next) {
  try {
    const { title, description, status, dueDate } = req.body

    // FIXED: Using optional chaining and nullish coalescing for cleaner check
    if (!title?.trim()) {
      return res.status(400).json({ message: 'Title is required' })
    }

    const task = await Task.create({
      title: title.trim(),
      description,
      status,
      dueDate
    })

    res.status(201).json(task)
  } catch (err) {
    next(err)
  }
}

export async function getTask (req, res, next) {
  try {
    const { id } = req.params
    const task = await Task.findById(id)

    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    res.json(task)
  } catch (err) {
    next(err)
  }
}

export async function updateTask (req, res, next) {
  try {
    const { id } = req.params
    const { title, description, status, dueDate } = req.body

    // Optional: You could also add optional chaining here for title validation in update
    // But it's not required since title might be optional in updates
    const updateData = {};
    if (title !== undefined) updateData.title = title?.trim();
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (dueDate !== undefined) updateData.dueDate = dueDate;

    const task = await Task.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )

    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    res.json(task)
  } catch (err) {
    next(err)
  }
}

export async function deleteTask (req, res, next) {
  try {
    const { id } = req.params
    const task = await Task.findByIdAndDelete(id)

    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    res.status(204).send()
  } catch (err) {
    next(err)
  }
}
