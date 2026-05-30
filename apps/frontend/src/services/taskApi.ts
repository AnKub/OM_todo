import type { CreateTaskInput, Task, UpdateTaskInput } from '../types/task'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

async function getJson<T>(response: Response): Promise<T> {
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong')
  }

  return data
}

export const taskApi = {
  async fetchTasks() {
    const response = await fetch(`${API_URL}/tasks`)
    return getJson<Task[]>(response)
  },

  async createTask(payload: CreateTaskInput) {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    return getJson<Task>(response)
  },

  async updateTask(taskId: string, payload: UpdateTaskInput) {
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    return getJson<Task>(response)
  },

  async deleteTask(taskId: string) {
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || 'Something went wrong')
    }
  },
}