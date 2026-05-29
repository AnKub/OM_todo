import './TaskSummary.scss'

type TaskSummaryProps = {
  activeCount: number
  totalCount: number
}

export function TaskSummary({ activeCount, totalCount }: TaskSummaryProps) {
  return (
    <section className="task-summary panel-card">
      <div className="section-head">
        <div>
          <h2 className="task-summary__title">Quick summary</h2>
          <p className="task-summary__copy">Counters for the list status live here.</p>
        </div>
      </div>

      <div className="task-summary__grid">
        <div className="task-summary__tile">
          <span className="task-summary__number">{totalCount}</span>
          <p className="task-summary__label">All tasks</p>
        </div>
        <div className="task-summary__tile">
          <span className="task-summary__number">{activeCount}</span>
          <p className="task-summary__label">Active tasks</p>
        </div>
      </div>
    </section>
  )
}