export type TaskFilter = 'all' | 'active'

export type Task = {
  id: string
  title: string
  createdAt: string
  completed: boolean
}

export type CreateTaskInput = {
  title: string
}

export type UpdateTaskInput = {
  title: string
}