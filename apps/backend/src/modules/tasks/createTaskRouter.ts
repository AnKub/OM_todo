import { Router } from 'express'
import { TaskController } from './TaskController'

export function createTaskRouter(taskController: TaskController) {
  const router = Router()

  router.get('/', taskController.list)
  router.post('/', taskController.create)
  router.patch('/:taskId', taskController.update)
  router.delete('/:taskId', taskController.remove)

  return router
}