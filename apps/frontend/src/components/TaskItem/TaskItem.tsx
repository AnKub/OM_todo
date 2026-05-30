import type { Task } from '../../types/task'
import './TaskItem.scss'

type TaskItemProps = {
  isBusy?: boolean
  isEditing?: boolean
  task: Task
  onDelete: (taskId: string) => void
  onEdit: (taskId: string) => void
}

export function TaskItem({
  isBusy = false,
  isEditing = false,
  task,
  onDelete,
  onEdit,
}: TaskItemProps) {
  const createdAt = new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(task.createdAt))

  return (
    <article className="task-item">
      <div className="task-item__content">
        <div>
          <h3 className="task-item__title">{task.title}</h3>
          <p className="task-item__copy">Small task, big plans.</p>
        </div>
      </div>

      <div className="task-item__footer">
        <div className="task-item__meta">
          <span className="task-item__chip">Created {createdAt}</span>
          <span className="task-item__chip">{task.completed ? 'Completed' : 'Active'}</span>
        </div>

        <div className="task-item__actions">
          <button
            className="button button--secondary"
            type="button"
            onClick={() => onEdit(task.id)}
            disabled={isEditing || isBusy}
          >
            {isEditing ? 'Saving...' : 'Edit'}
          </button>

          <button
            className="button button--ghost"
            type="button"
            disabled={isBusy || isEditing}
            onClick={() => onDelete(task.id)}
          >
            {isBusy ? 'Removing...' : 'Delete'}
          </button>
        </div>
      </div>
    </article>
  )
}