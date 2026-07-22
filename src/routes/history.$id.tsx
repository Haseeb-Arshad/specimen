import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Masthead } from '#/components/specimen/Masthead'
import { ResultsSheet } from '#/components/specimen/ResultsSheet'
import { Toast } from '#/components/specimen/Toast'
import { getHistoryEntry, deleteHistoryEntry } from '#/lib/history'
import { useCopyToast } from '#/lib/useCopyToast'
import type { HistoryEntry } from '#/lib/history'

export const Route = createFileRoute('/history/$id')({ component: HistoryDetail })

function formatDate(ts: number): string {
  return new Date(ts).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function HistoryDetail() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const [entry, setEntry] = useState<HistoryEntry | null | undefined>(undefined)
  const { toast, copy } = useCopyToast()

  useEffect(() => {
    setEntry(getHistoryEntry(id) ?? null)
  }, [id])

  const handleDelete = () => {
    deleteHistoryEntry(id)
    navigate({ to: '/history' })
  }

  return (
    <div className="specimen-app">
      <Masthead />

      <main className="specimen-shell specimen-main">
        <Link to="/history" className="history-back mono">
          &larr; Back to history
        </Link>

        {entry === null ? (
          <div className="history-empty">
            <p className="history-empty-text">That specimen isn&rsquo;t here anymore.</p>
            <Link to="/history" className="btn btn-solid">
              Back to history
            </Link>
          </div>
        ) : null}

        {entry ? (
          <>
            <div className="history-detail-header">
              <div className="history-detail-thumb">
                <img src={entry.thumbnail} alt={`Specimen: ${entry.fileName}`} />
              </div>
              <div className="history-detail-meta">
                <div className="preview-caption mono">
                  <span className="preview-caption-name" title={entry.fileName}>
                    {entry.fileName}
                  </span>
                  <span className="preview-caption-dims">
                    {entry.width} &times; {entry.height}px
                  </span>
                </div>
                <div className="history-detail-date mono">Analyzed {formatDate(entry.createdAt)}</div>
                <button type="button" className="btn btn-ghost small" onClick={handleDelete}>
                  Delete from history
                </button>
              </div>
            </div>

            <ResultsSheet tokens={entry.tokens} onCopy={copy} />
          </>
        ) : null}
      </main>

      <Toast message={toast} />
    </div>
  )
}
