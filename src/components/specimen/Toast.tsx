type ToastProps = {
  message: string | null
}

export function Toast({ message }: ToastProps) {
  if (!message) return null

  return (
    <div className="toast mono" role="status">
      {message}
    </div>
  )
}
