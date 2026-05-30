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
  const [editingTaskId, setEditingTaskId] = useState('')
  const [pageError, setPageError] = useState('')
  const [actionError, setActionError] = useState('')
  const [currentFilter, setCurrentFilter] = useLocalStorage<TaskFilter>('omtodo-filter', 'all')

  async function loadTasks() {
    setIsLoading(true)
    setPageError('')

    try {
      const nextTasks = await taskApi.fetchTasks()
      setTasks(nextTasks)
    } catch (error) {
      if (error instanceof Error) {
        setPageError(error.message)
      } else {
        setPageError('Could not load tasks right now.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // -----------тут створення завадання 

  async function handleCreateTask() {
    const title = draft.trim()

    if (!title) {
      setActionError('Task title cannot be empty.')
      return
    }

    setIsCreating(true)
    setActionError('')

    try {
      const newTask = await taskApi.createTask({ title })
      setTasks((currentTasks) => [newTask, ...currentTasks])
      setDraft('')
    } catch (error) {
      if (error instanceof Error) {
        setActionError(error.message)
      } else {
        setActionError('Could not create task.')
      }
    } finally {
      setIsCreating(false)
    }
  }

 // -----------тут про логіку видалення завадання 

  async function handleDeleteTask(taskId: string) {
    setRemovingTaskId(taskId)
    setActionError('')

    try {
      await taskApi.deleteTask(taskId)
      setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId))
    } catch (error) {
      if (error instanceof Error) {
        setActionError(error.message)
      } else {
        setActionError('Could not delete task.')
      }
    } finally {
      setRemovingTaskId('')
    }
  }

  // -----------тут про внесення змін 

  async function handleEditTask(taskId: string) {
    const task = tasks.find((item) => item.id === taskId)

    if (!task) {
      return
    }

    const nextTitle = window.prompt('Give this task a better name:', task.title)

    if (nextTitle === null) {
      return
    }

    const cleanTitle = nextTitle.trim()

    if (!cleanTitle) {
      setActionError('Task title cannot be empty.')
      return
    }

    setEditingTaskId(taskId)
    setActionError('')

    try {
      const updatedTask = await taskApi.updateTask(taskId, { title: cleanTitle })

      setTasks((currentTasks) =>
        currentTasks.map((item) => {
          if (item.id === taskId) {
            return updatedTask
          }

          return item
        }),
      )
    } catch (error) {
      if (error instanceof Error) {
        setActionError(error.message)
      } else {
        setActionError('Could not update task.')
      }
    } finally {
      setEditingTaskId('')
    }
  }

  useEffect(() => {
    void loadTasks()
  }, [])

// спрощений приклад реалізації фільтрації лише виконані чи всі

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
            This page already loads tasks from the server. Now it can create, remove and rename them too.
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

              {actionError ? <p className="section-head__copy">{actionError}</p> : null}
            </section>

            <section className="card-surface todo-page__section">
              <div className="section-head">
                <div>
                  <h2 className="section-head__title">Tasks</h2>
                  <p className="section-head__copy">This list now loads, creates, removes and updates tasks.</p>
                </div>
              </div>

              {isLoading ? (
                <p className="section-head__copy">Loading ...</p>
              ) : pageError ? (
                <div className="content-stack">
                  <p className="section-head__copy">{pageError}</p>
                  <button className="button button--secondary" type="button" onClick={() => void loadTasks()}>
                    Try again
                  </button>
                </div>
              ) : (
                <TaskList
                  tasks={visibleTasks}
                  onDelete={handleDeleteTask}
                  onEdit={handleEditTask}
                  removingTaskId={removingTaskId}
                  editingTaskId={editingTaskId}
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
                  <p className="section-head__copy">After this we can move to frontend tests and visual polish.</p>
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  )
}