import { isRoutedPath } from '~/utils/relationshipConfig'

export interface EntryRecordLike {
  path?: string
  title?: string
  chinese?: string
  description?: string
  category?: string
  status?: string
  image?: string
}

export interface ResolvedEntryLink {
  raw: string
  label: string
  path: string
  exists: boolean
  isRoute: boolean
  shouldLink: boolean
  isInternalOnly: boolean
  isMissingRoute: boolean
  chinese?: string
  record?: EntryRecordLike
}

const INTERNAL_ROUTE_PREFIXES = ['/titles/']

function normalizeRoutePath(value: string): string {
  const trimmed = value.trim()
  if (!trimmed.startsWith('/')) return trimmed
  const normalized = trimmed.replace(/\/+$/g, '')
  return normalized || '/'
}

function normalizeLookupKey(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[’]/g, "'")
    .replace(/[\s_\-]+/g, ' ')
    .replace(/[^\p{L}\p{N}'\s]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function isInternalOnlyRoute(value: string): boolean {
  const normalized = normalizeRoutePath(value)
  return INTERNAL_ROUTE_PREFIXES.some((prefix) => normalized.startsWith(prefix))
}

function titleCase(value: string): string {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => {
      if (!part) return part
      const lower = part.toLowerCase()
      return `${lower.charAt(0).toUpperCase()}${lower.slice(1)}`
    })
    .join(' ')
}

export function humanizePath(value: string): string {
  if (!value) return ''
  const clean = value.trim().replace(/^\/+|\/+$/g, '')
  if (!clean) return ''
  const segments = clean.split('/')
  const slug = segments[segments.length - 1] || clean
  return titleCase(decodeURIComponent(slug))
}

export function humanizePlainValue(value: string): string {
  const trimmed = `${value || ''}`.trim()
  if (!trimmed) return ''
  if (trimmed.startsWith('/')) return humanizePath(trimmed)
  return trimmed
}

export function createEntryResolver(entries: EntryRecordLike[] = []) {
  const byPath = new Map<string, EntryRecordLike>()
  const byDisplayName = new Map<string, EntryRecordLike>()

  function registerDisplayName(value: unknown, entry: EntryRecordLike) {
    if (typeof value !== 'string') return
    const key = normalizeLookupKey(value)
    if (!key || byDisplayName.has(key)) return
    byDisplayName.set(key, entry)
  }

  for (const entry of entries) {
    const path = typeof entry?.path === 'string' ? normalizeRoutePath(entry.path) : ''
    if (!isRoutedPath(path)) continue

    const normalizedEntry = { ...entry, path }
    byPath.set(path, normalizedEntry)
    registerDisplayName(normalizedEntry.title, normalizedEntry)
    registerDisplayName(normalizedEntry.chinese, normalizedEntry)
    registerDisplayName(humanizePath(path), normalizedEntry)
  }

  function fromRecord(raw: string, record: EntryRecordLike, isRoute: boolean): ResolvedEntryLink {
    const path = typeof record.path === 'string' ? normalizeRoutePath(record.path) : raw
    return {
      raw,
      label: record.title || humanizePlainValue(raw),
      path,
      exists: true,
      isRoute,
      shouldLink: isRoutedPath(path),
      isInternalOnly: false,
      isMissingRoute: false,
      chinese: record.chinese,
      record,
    }
  }

  function resolveEntryLink(value: unknown): ResolvedEntryLink | null {
    if (typeof value !== 'string') return null
    const raw = value.trim()
    if (!raw) return null

    const isRoute = raw.startsWith('/')
    const normalizedPath = isRoute ? normalizeRoutePath(raw) : raw
    const isInternalOnly = isRoute && isInternalOnlyRoute(normalizedPath)

    if (isRoute) {
      const record = !isInternalOnly && isRoutedPath(normalizedPath) ? byPath.get(normalizedPath) : undefined
      return {
        raw,
        label: record?.title || humanizePath(normalizedPath),
        path: normalizedPath,
        exists: Boolean(record),
        isRoute: true,
        shouldLink: Boolean(record && isRoutedPath(normalizedPath)),
        isInternalOnly,
        isMissingRoute: !isInternalOnly && isRoutedPath(normalizedPath) && !record,
        chinese: record?.chinese,
        record,
      }
    }

    const record = byDisplayName.get(normalizeLookupKey(raw))
    if (record) return fromRecord(raw, record, false)

    return {
      raw,
      label: humanizePlainValue(raw),
      path: raw,
      exists: false,
      isRoute: false,
      shouldLink: false,
      isInternalOnly: false,
      isMissingRoute: false,
    }
  }

  function resolveMany(values: unknown): ResolvedEntryLink[] {
    const rawValues = Array.isArray(values) ? values : typeof values === 'string' ? [values] : []
    return rawValues
      .map((value) => resolveEntryLink(value))
      .filter((value): value is ResolvedEntryLink => Boolean(value && value.label))
  }

  return {
    byPath,
    resolveEntryLink,
    resolveMany,
  }
}

export type EntryResolver = ReturnType<typeof createEntryResolver>
