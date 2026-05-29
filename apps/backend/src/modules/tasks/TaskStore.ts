import { randomUUID } from 'crypto'
import { TaskEntry } from './TaskEntry'

export class TaskStore {
  private readonly tasks: TaskEntry[] = []

  public list() {
    return [...this.tasks]
  }

  public create(title: string) {
    const task = new TaskEntry(randomUUID(), title, new Date().toISOString())
    this.tasks.unshift(task)
    return task
  }

  public update(taskId: string, nextTitle: string) {
    const targetIndex = this.tasks.findIndex((task) => task.id === taskId)

    if (targetIndex === -1) {
      return null
    }

    const updatedTask = this.tasks[targetIndex].rename(nextTitle)
    this.tasks[targetIndex] = updatedTask
    return updatedTask
  }

  public remove(taskId: string) {
    const previousLength = this.tasks.length
    const nextTasks = this.tasks.filter((task) => task.id !== taskId)

    if (nextTasks.length === previousLength) {
      return false
    }

    this.tasks.splice(0, this.tasks.length, ...nextTasks)
    return true
  }
}