import type { TaskFilter } from '../../types/task'
import './FilterBar.scss'

type FilterBarProps = {
  currentFilter: TaskFilter
  onChange: (filter: TaskFilter) => void
}

const filters: Array<{ label: string; value: TaskFilter }> = [
  { label: 'All tasks', value: 'all' },
  { label: 'Active only', value: 'active' },
]

export function FilterBar({ currentFilter, onChange }: FilterBarProps) {
  return (
    <section className="filter-bar panel-card">
      <div className="section-head">
        <div>
          <h2 className="filter-bar__title">View filter</h2>
          <p className="filter-bar__copy">This value is already persisted in localStorage.</p>
        </div>
      </div>

      <div className="filter-bar__actions">
        {filters.map((filter) => (
          <button
            key={filter.value}
            className={`button button--filter ${currentFilter === filter.value ? 'is-active' : ''}`}
            type="button"
            onClick={() => onChange(filter.value)}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </section>
  )
}