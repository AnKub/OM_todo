import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { TodoPage } from './TodoPage'

const fetchTasksMock = vi.fn()
const createTaskMock = vi.fn()
const updateTaskMock = vi.fn()
const deleteTaskMock = vi.fn()

vi.mock('../../services/taskApi', () => ({
  taskApi: {
    fetchTasks: () => fetchTasksMock(),
    createTask: (payload: { title: string }) => createTaskMock(payload),
    updateTask: (taskId: string, payload: { title: string }) => updateTaskMock(taskId, payload),
    deleteTask: (taskId: string) => deleteTaskMock(taskId),
  },
}))

describe('TodoPage', () => {
  beforeEach(() => {
    fetchTasksMock.mockReset()
    createTaskMock.mockReset()
    updateTaskMock.mockReset()
    deleteTaskMock.mockReset()
    localStorage.clear()
  })

  it('renders tasks from the backend', async () => {
    fetchTasksMock.mockResolvedValue([
      {
        id: '1',
        title: 'Write tests',
        createdAt: '2026-05-30T10:00:00.000Z',
        completed: false,
      },
    ])

    render(<TodoPage />)

    expect(screen.getByText('Loading ...')).toBeInTheDocument()

    expect(await screen.findByText('Write tests')).toBeInTheDocument()
  })

  it('creates a new task', async () => {
    fetchTasksMock.mockResolvedValue([])
    createTaskMock.mockResolvedValue({
      id: '2',
      title: 'Ship feature',
      createdAt: '2026-05-30T10:30:00.000Z',
      completed: false,
    })

    render(<TodoPage />)

    await screen.findByText('The list is ready for the first task.')

    fireEvent.change(screen.getByLabelText('New task'), {
      target: { value: 'Ship feature' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'Add task' }))

    expect(await screen.findByText('Ship feature')).toBeInTheDocument()
    expect(createTaskMock).toHaveBeenCalledWith({ title: 'Ship feature' })
  })

  it('deletes a task', async () => {
    fetchTasksMock.mockResolvedValue([
      {
        id: '3',
        title: 'Delete me gently',
        createdAt: '2026-05-30T11:00:00.000Z',
        completed: false,
      },
    ])

    deleteTaskMock.mockResolvedValue(undefined)

    render(<TodoPage />)

    expect(await screen.findByText('Delete me gently')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))

    await waitFor(() => {
      expect(screen.queryByText('Delete me gently')).not.toBeInTheDocument()
    })

    expect(deleteTaskMock).toHaveBeenCalledWith('3')
  })

  it('shows an error when tasks fail to load', async () => {
  fetchTasksMock.mockRejectedValue(new Error('Server is taking a coffee break'))

  render(<TodoPage />)

  expect(await screen.findByText('Server is taking a coffee break')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()
})
})