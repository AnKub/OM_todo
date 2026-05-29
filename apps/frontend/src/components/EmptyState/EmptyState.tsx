import './EmptyState.scss'

export function EmptyState() {
  return (
    <div className="empty-state">
      <div className="empty-state__orb" aria-hidden="true" />
      <div>
        <h3 className="empty-state__title">The list is ready for the first task.</h3>
        <p className="empty-state__copy">
          After the API integration is connected, this area will render the live task collection.
        </p>
      </div>
    </div>
  )
}