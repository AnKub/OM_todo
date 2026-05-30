import type { Task } from '../../types/task'
import { EmptyState } from '../EmptyState'
import { TaskItem } from '../TaskItem'
import './TaskList.scss'

type TaskListProps = {
  tasks: Task[]
  onDelete: (taskId: string) => void
  onEdit: (taskId: string) => void
  removingTaskId?: string
  editingTaskId?: string
}

export function TaskList({
  tasks,
  onDelete,
  onEdit,
  removingTaskId = '',
  editingTaskId = '',
}: TaskListProps) {
  if (tasks.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onDelete={onDelete}
          onEdit={onEdit}
          isBusy={removingTaskId === task.id}
          isEditing={editingTaskId === task.id}
        />
      ))}
    </div>
  )
}