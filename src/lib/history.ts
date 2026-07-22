import type { DesignTokens } from './tokens'

export type HistoryEntry = {
  id: string
  fileName: string
  thumbnail: string
  width: number
  height: number
  tokens: DesignTokens
  createdAt: number
}

const STORAGE_KEY = 'specimen.history.v1'
const MAX_ENTRIES = 60

function readAll(): Array<HistoryEntry> {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeAll(entries: Array<HistoryEntry>) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch {
    // storage full or unavailable — history just won't persist this time
  }
}

export function getHistory(): Array<HistoryEntry> {
  return readAll().sort((a, b) => b.createdAt - a.createdAt)
}

export function getHistoryEntry(id: string): HistoryEntry | undefined {
  return readAll().find((entry) => entry.id === id)
}

export function saveHistoryEntry(entry: Omit<HistoryEntry, 'id' | 'createdAt'>): HistoryEntry {
  const full: HistoryEntry = {
    ...entry,
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: Date.now(),
  }
  const next = [full, ...readAll()].slice(0, MAX_ENTRIES)
  writeAll(next)
  return full
}

export function deleteHistoryEntry(id: string) {
  writeAll(readAll().filter((entry) => entry.id !== id))
}

export function clearHistory() {
  writeAll([])
}
