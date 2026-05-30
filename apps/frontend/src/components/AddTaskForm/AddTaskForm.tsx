import './AddTaskForm.scss'

type AddTaskFormProps = {
  isSubmitting?: boolean
  value: string
  onChange: (nextValue: string) => void
  onSubmit: () => void
}

export function AddTaskForm({
  isSubmitting = false,
  value,
  onChange,
  onSubmit,
}: AddTaskFormProps) {
  return (
    <form
      className="add-task-form"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <label className="add-task-form__label" htmlFor="task-title">
        New task
        <input
          id="task-title"
          className="add-task-form__input"
          name="title"
          placeholder="Write the next task you want to finish"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </label>

      <p className="add-task-form__note">One task at a time. World domination can wait.</p>

      <div className="add-task-form__actions">
        <button className="button button--primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add task'}
        </button>

        <button className="button button--ghost" type="button" onClick={() => onChange('')} disabled={isSubmitting}>
          Clear
        </button>
      </div>
    </form>
  )
}