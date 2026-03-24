export function ToastHost({ toast }) {
  if (!toast) return null
  const isErr = toast.type === 'error'
  return (
    <div
      className="fixed bottom-6 left-1/2 z-[200] -translate-x-1/2 px-4 sm:left-auto sm:right-6 sm:translate-x-0"
      role="status"
    >
      <div
        className={`rounded-xl border px-4 py-3 text-sm shadow-lg ${
          isErr
            ? 'border-red-500/50 bg-red-950/90 text-red-100'
            : 'border-accent/40 bg-card text-white'
        }`}
      >
        {toast.message}
      </div>
    </div>
  )
}
