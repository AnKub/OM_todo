import type { RequestHandler } from 'express'
import { TaskService } from './TaskService'

export class TaskController {
  public constructor(private readonly taskService: TaskService) {}

  public list: RequestHandler = (_request, response) => {
    response.status(200).json(this.taskService.listTasks())
  }

  public create: RequestHandler = (request, response) => {
    const task = this.taskService.createTask(String(request.body.title ?? ''))
    response.status(201).json(task)
  }

  public update: RequestHandler = (request, response) => {
    const taskId = String(request.params.taskId ?? '')
    const task = this.taskService.renameTask(taskId, String(request.body.title ?? ''))
    response.status(200).json(task)
  }

  public remove: RequestHandler = (request, response) => {
    const taskId = String(request.params.taskId ?? '')
    this.taskService.removeTask(taskId)
    response.status(204).send()
  }
}