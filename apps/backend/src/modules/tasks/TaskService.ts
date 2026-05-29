import { AppError } from '../../shared/errors/AppError'
import { TaskStore } from './TaskStore'

export class TaskService {
  public constructor(private readonly taskStore: TaskStore) {}

  public listTasks() {
    return this.taskStore.list()
  }

  public createTask(title: string) {
    const cleanTitle = title.trim()

    if (!cleanTitle) {
      throw new AppError(400, 'Task title is required')
    }

    return this.taskStore.create(cleanTitle)
  }

  public renameTask(taskId: string, title: string) {
    const cleanTitle = title.trim()

    if (!cleanTitle) {
      throw new AppError(400, 'Task title is required')
    }

    const task = this.taskStore.update(taskId, cleanTitle)

    if (!task) {
      throw new AppError(404, 'Task not found')
    }

    return task
  }

  public removeTask(taskId: string) {
    const hasRemoved = this.taskStore.remove(taskId)

    if (!hasRemoved) {
      throw new AppError(404, 'Task not found')
    }
  }
}