import type { Task } from '../../types/task'
import './TaskItem.scss'

type TaskItemProps = {
  isBusy?: boolean
  task: Task
  onDelete: (taskId: string) => void
  onEdit: (taskId: string) => void
}

export function TaskItem({ isBusy = false, task, onDelete, onEdit }: TaskItemProps) {
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
          <p className="task-item__copy">Editable item placeholder with delete action and smooth appearance.</p>
        </div>
      </div>

      <div className="task-item__footer">
        <div className="task-item__meta">
          <span className="task-item__chip">Created {createdAt}</span>
          <span className="task-item__chip">{task.completed ? 'Completed' : 'Active'}</span>
        </div>

        <div className="task-item__actions">
          <button className="button button--secondary" type="button" onClick={() => onEdit(task.id)}>
            Edit
          </button>
          <button className="button button--ghost" type="button" disabled={isBusy} onClick={() => onDelete(task.id)}>
            {isBusy ? 'Removing...' : 'Delete'}
          </button>
        </div>
      </div>
    </article>
  )
}