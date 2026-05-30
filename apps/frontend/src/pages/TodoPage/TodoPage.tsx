import { useEffect, useState } from 'react'
import { AddTaskForm, FilterBar, TaskList, TaskSummary } from '../../components'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { taskApi } from '../../services/taskApi'
import type { Task, TaskFilter } from '../../types/task'
import './TodoPage.scss'

export function TodoPage() {
  const [draft, setDraft] = useState('')
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [removingTaskId, setRemovingTaskId] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [currentFilter, setCurrentFilter] = useLocalStorage<TaskFilter>('omtodo-filter', 'all')

  async function loadTasks() {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const nextTasks = await taskApi.fetchTasks()
      setTasks(nextTasks)
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage('Unable to load tasks right now.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCreateTask() {
    const title = draft.trim()

    if (!title) {
      setErrorMessage('Task title cannot be empty.')
      return
    }

    setIsCreating(true)
    setErrorMessage('')

    try {
      const newTask = await taskApi.createTask({ title })
      setTasks((currentTasks) => [newTask, ...currentTasks])
      setDraft('')
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage('Could not create task.')
      }
    } finally {
      setIsCreating(false)
    }
  }

  async function handleDeleteTask(taskId: string) {
    setRemovingTaskId(taskId)
    setErrorMessage('')

    try {
      await taskApi.deleteTask(taskId)
      setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId))
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage('Could not delete task.')
      }
    } finally {
      setRemovingTaskId('')
    }
  }

  useEffect(() => {
    void loadTasks()
  }, [])

  const visibleTasks = tasks.filter((task) => {
    if (currentFilter === 'active') {
      return !task.completed
    }

    return true
  })

  return (
    <main className="todo-page">
      <div className="todo-page__frame">
        <section className="todo-page__hero card-surface">
          <p className="todo-page__eyebrow">Todo app</p>
          <h1 className="todo-page__title">Keep your tasks in one place.</h1>
          <p className="todo-page__description">
            This page already loads tasks from the server. Now the form can create, and the list can delete.
          </p>
          <div className="todo-page__highlights">
            <span className="todo-page__pill">Responsive base</span>
            <span className="todo-page__pill">API connected</span>
            <span className="todo-page__pill">Filter saved locally</span>
          </div>
        </section>

        <section className="todo-page__workspace">
          <div className="content-stack">
            <section className="card-surface todo-page__section">
              <div className="section-head">
                <div>
                  <h2 className="section-head__title">New task</h2>
                  <p className="section-head__copy">Write a task and send it straight to the backend.</p>
                </div>
                <span className="todo-page__counter">{visibleTasks.length}</span>
              </div>

              <AddTaskForm
                value={draft}
                onChange={setDraft}
                onSubmit={handleCreateTask}
                isSubmitting={isCreating}
              />
            </section>

            <section className="card-surface todo-page__section">
              <div className="section-head">
                <div>
                  <h2 className="section-head__title">Tasks</h2>
                  <p className="section-head__copy">This list reads data from the backend and now also removes tasks.</p>
                </div>
              </div>

              {isLoading ? (
                <p className="section-head__copy">Loading ...</p>
              ) : errorMessage ? (
                <div className="content-stack">
                  <p className="section-head__copy">{errorMessage}</p>
                  <button className="button button--secondary" type="button" onClick={() => void loadTasks()}>
                    Try again
                  </button>
                </div>
              ) : (
                <TaskList
                  tasks={visibleTasks}
                  onDelete={handleDeleteTask}
                  onEdit={() => undefined}
                  removingTaskId={removingTaskId}
                />
              )}
            </section>
          </div>

          <div className="content-stack">
            <TaskSummary activeCount={visibleTasks.length} totalCount={tasks.length} />
            <FilterBar currentFilter={currentFilter} onChange={setCurrentFilter} />

            <section className="card-surface todo-page__section">
              <div className="section-head">
                <div>
                  <h2 className="section-head__title">Next step</h2>
                  <p className="section-head__copy">We will connect editing tasks next.</p>
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  )
}