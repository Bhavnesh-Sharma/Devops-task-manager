import express from 'express'
import {
  listTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask
} from '../controllers/taskController.js'

const router = express.Router()

router.get('/', listTasks)
router.post('/', createTask)
router.get('/:id', getTask)
router.put('/:id', updateTask)
router.delete('/:id', deleteTask)

export default router


