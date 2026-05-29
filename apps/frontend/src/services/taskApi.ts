import type { CreateTaskInput, Task, UpdateTaskInput } from '../types/task'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

async function request<T>(path: string, options?: RequestInit) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

export const taskApi = {
  fetchTasks() {
    return request<Task[]>('/tasks')
  },
  createTask(payload: CreateTaskInput) {
    return request<Task>('/tasks', {
      body: JSON.stringify(payload),
      method: 'POST',
    })
  },
  updateTask(taskId: string, payload: UpdateTaskInput) {
    return request<Task>(`/tasks/${taskId}`, {
      body: JSON.stringify(payload),
      method: 'PATCH',
    })
  },
  deleteTask(taskId: string) {
    return request<void>(`/tasks/${taskId}`, {
      method: 'DELETE',
    })
  },
}