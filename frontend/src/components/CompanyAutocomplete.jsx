import { useEffect, useId, useRef, useState } from 'react'
import { IconSearch } from './Icons.jsx'
import { searchCompanies } from '../utils/reviews.js'
import './CompanyAutocomplete.css'

const DEBOUNCE_MS = 180
const MIN_CHARS = 1

/**
 * Accessible combobox for picking (or creating) a company by name.
 *
 * - Uses Supabase `ilike` search under the hood (wildcards escaped).
 * - Debounces keystrokes so we don't hammer the API.
 * - Keyboard: ArrowUp/Down to move, Enter to select, Esc to close.
 * - Ignores stale responses so the dropdown always reflects the latest query.
 * - onValueChange passes (name, companyId|null) — the id is set when the
 *   user clicks a suggestion so the form can skip the get-or-create lookup.
 */
export function CompanyAutocomplete({
  id,
  value,
  onValueChange,
  error,
  required = false,
  placeholder = 'Search company name...',
  autoComplete = 'organization',
}) {
  const [results, setResults] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [highlight, setHighlight] = useState(-1)

  const listId = useId()
  const wrapperRef = useRef(null)
  const inputRef = useRef(null)
  const requestSeq = useRef(0)

  const trimmed = (value ?? '').trim()

  useEffect(() => {
    if (trimmed.length < MIN_CHARS) {
      setResults([])
      setLoading(false)
      return undefined
    }

    const currentSeq = ++requestSeq.current
    setLoading(true)
    const timer = window.setTimeout(async () => {
      try {
        const data = await searchCompanies(trimmed, 8)
        if (currentSeq !== requestSeq.current) return // stale; newer query in flight
        setResults(data)
        setHighlight(data.length > 0 ? 0 : -1)
      } catch {
        if (currentSeq !== requestSeq.current) return
        setResults([])
        setHighlight(-1)
      } finally {
        if (currentSeq === requestSeq.current) setLoading(false)
      }
    }, DEBOUNCE_MS)

    return () => window.clearTimeout(timer)
  }, [trimmed])

  useEffect(() => {
    if (!open) return undefined
    const handleClickOutside = (event) => {
      if (!wrapperRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const selectSuggestion = (row) => {
    if (!row) return
    onValueChange(row.company_name, row.company_id)
    setOpen(false)
    setResults([])
    setHighlight(-1)
    inputRef.current?.focus()
  }

  const handleKeyDown = (event) => {
    if (!open && ['ArrowDown', 'ArrowUp'].includes(event.key)) {
      setOpen(true)
      return
    }
    if (!open) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setHighlight((h) => (results.length ? (h + 1) % results.length : -1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setHighlight((h) =>
        results.length ? (h - 1 + results.length) % results.length : -1
      )
    } else if (event.key === 'Enter') {
      if (highlight >= 0 && results[highlight]) {
        event.preventDefault()
        selectSuggestion(results[highlight])
      }
    } else if (event.key === 'Escape') {
      setOpen(false)
    } else if (event.key === 'Tab') {
      setOpen(false)
    }
  }

  const showDropdown = open && trimmed.length >= MIN_CHARS

  return (
    <div
      className="company-autocomplete"
      ref={wrapperRef}
      /*
       * role="combobox" goes on the INPUT (per ARIA 1.2). The wrapper just
       * groups things visually.
       */
    >
      <div className="review-search-wrap">
        <IconSearch className="review-search-wrap__icon" ariaHidden />
        <input
          id={id}
          ref={inputRef}
          type="search"
          name="company"
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={`review-search-wrap__input ${error ? 'review-input--error' : ''}`}
          value={value}
          onChange={(ev) => {
            onValueChange(ev.target.value, null)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={
            showDropdown && highlight >= 0 && results[highlight]
              ? `${listId}-opt-${results[highlight].company_id}`
              : undefined
          }
          required={required}
          aria-required={required}
          aria-invalid={error ? 'true' : 'false'}
        />
      </div>

      {showDropdown && (
        <ul
          id={listId}
          className="company-autocomplete__list"
          role="listbox"
          aria-label="Company suggestions"
        >
          {loading && results.length === 0 ? (
            <li className="company-autocomplete__state" role="presentation">
              Searching…
            </li>
          ) : results.length === 0 ? (
            <li className="company-autocomplete__state" role="presentation">
              No match — “{trimmed}” will be added as a new pop-up.
            </li>
          ) : (
            results.map((row, index) => (
              <li
                key={row.company_id}
                id={`${listId}-opt-${row.company_id}`}
                role="option"
                aria-selected={index === highlight}
                className={`company-autocomplete__option ${
                  index === highlight ? 'is-active' : ''
                }`}
                /*
                 * onMouseDown (not onClick) fires before input blur, so
                 * clicking a suggestion doesn't prematurely close the list.
                 */
                onMouseDown={(ev) => {
                  ev.preventDefault()
                  selectSuggestion(row)
                }}
                onMouseEnter={() => setHighlight(index)}
              >
                <span className="company-autocomplete__name">
                  {row.company_name}
                </span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}
