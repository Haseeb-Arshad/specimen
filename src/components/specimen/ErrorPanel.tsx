type ErrorPanelProps = {
  message: string
  onRetry: () => void
}

export function ErrorPanel({ message, onRetry }: ErrorPanelProps) {
  return (
    <div className="error-panel" role="alert">
      <p className="error-panel-message">{message}</p>
      <button type="button" className="btn btn-ghost small" onClick={onRetry}>
        Try again
      </button>
    </div>
  )
}
