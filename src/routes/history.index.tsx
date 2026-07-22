import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Masthead } from '#/components/specimen/Masthead'
import { getHistory, deleteHistoryEntry, clearHistory } from '#/lib/history'
import type { HistoryEntry } from '#/lib/history'

export const Route = createFileRoute('/history/')({ component: History })

function formatDate(ts: number): string {
  return new Date(ts).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function History() {
  const [entries, setEntries] = useState<Array<HistoryEntry>>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setEntries(getHistory())
    setLoaded(true)
  }, [])

  const handleDelete = (id: string) => {
    deleteHistoryEntry(id)
    setEntries(getHistory())
  }

  const handleClearAll = () => {
    clearHistory()
    setEntries([])
  }

  return (
    <div className="specimen-app">
      <Masthead />

      <main className="specimen-shell specimen-main">
        <div className="history-header">
          <div>
            <h1 className="history-title">History</h1>
            <p className="history-subtitle mono">
              Past specimens analyzed in this browser &mdash; nothing leaves your device.
            </p>
          </div>
          {entries.length > 0 ? (
            <button type="button" className="btn btn-ghost small" onClick={handleClearAll}>
              Clear all
            </button>
          ) : null}
        </div>

        {loaded && entries.length === 0 ? (
          <div className="history-empty">
            <p className="history-empty-text">No specimens analyzed yet.</p>
            <Link to="/" className="btn btn-solid">
              Extract your first
            </Link>
          </div>
        ) : null}

        {entries.length > 0 ? (
          <div className="history-grid">
            {entries.map((entry) => (
              <Link key={entry.id} to="/history/$id" params={{ id: entry.id }} className="history-card">
                <button
                  type="button"
                  className="history-card-delete"
                  aria-label={`Delete ${entry.fileName} from history`}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleDelete(entry.id)
                  }}
                >
                  &times;
                </button>
                <div className="history-card-thumb">
                  <img src={entry.thumbnail} alt="" />
                </div>
                <div className="history-card-body">
                  <div className="history-card-style">{entry.tokens?.style?.name || 'Untitled specimen'}</div>
                  <div className="history-card-meta mono">
                    <span className="history-card-filename" title={entry.fileName}>
                      {entry.fileName}
                    </span>
                    <span>{formatDate(entry.createdAt)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : null}
      </main>
    </div>
  )
}
