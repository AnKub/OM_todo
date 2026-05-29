import { useState } from 'react'
import { AddTaskForm, FilterBar, TaskList, TaskSummary } from '../../components'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import type { Task, TaskFilter } from '../../types/task'
import './TodoPage.scss'

const initialTasks: Task[] = []

export function TodoPage() {
  const [draft, setDraft] = useState('')
  const [currentFilter, setCurrentFilter] = useLocalStorage<TaskFilter>('omtodo-filter', 'all')

  const visibleTasks = initialTasks.filter((task) => {
    if (currentFilter === 'active') {
      return !task.completed
    }

    return true
  })

  return (
    <main className="todo-page">
      <div className="todo-page__frame">
        <section className="todo-page__hero card-surface">
          <p className="todo-page__eyebrow">Junior Full Stack Test</p>
          <h1 className="todo-page__title">Todo flow with a clean React and TypeScript setup.</h1>
          <p className="todo-page__description">
            The project skeleton is ready for live API integration, editing, smooth task appearance, local filter persistence and responsive states.
          </p>
          <div className="todo-page__highlights">
            <span className="todo-page__pill">Responsive layout</span>
            <span className="todo-page__pill">Edit-ready task cards</span>
            <span className="todo-page__pill">Filter persisted locally</span>
          </div>
        </section>

        <section className="todo-page__workspace">
          <div className="content-stack">
            <section className="card-surface todo-page__section">
              <div className="section-head">
                <div>
                  <h2 className="section-head__title">Task composer</h2>
                  <p className="section-head__copy">This section will receive validation, API calls and error handling in the next pass.</p>
                </div>
                <span className="todo-page__counter">{visibleTasks.length}</span>
              </div>

              <AddTaskForm value={draft} onChange={setDraft} onSubmit={() => undefined} />
            </section>

            <section className="card-surface todo-page__section">
              <div className="section-head">
                <div>
                  <h2 className="section-head__title">Task board</h2>
                  <p className="section-head__copy">The list area already has slots for empty, loading, error and populated states.</p>
                </div>
              </div>

              <TaskList tasks={visibleTasks} onDelete={() => undefined} onEdit={() => undefined} />
            </section>
          </div>

          <div className="content-stack">
            <TaskSummary activeCount={visibleTasks.length} totalCount={initialTasks.length} />
            <FilterBar currentFilter={currentFilter} onChange={setCurrentFilter} />

            <section className="card-surface todo-page__section">
              <div className="section-head">
                <div>
                  <h2 className="section-head__title">What comes next</h2>
                  <p className="section-head__copy">
                    Next we wire the backend endpoints, task fetching, add flow, delete flow, editing flow and interaction tests.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  )
}