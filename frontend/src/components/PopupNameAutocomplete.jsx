import { useEffect, useId, useRef, useState } from 'react'
import { IconSearch } from './Icons.jsx'
import { searchPopupNames } from '../utils/reviews.js'
import './CompanyAutocomplete.css'

const DEBOUNCE_MS = 180

/**
 * Optional combobox for naming a specific pop-up under the selected company(ies).
 * Suggestions are scoped to the canonical collab company name so "Refy x Ordinary"
 * + "collabName" groups reviews together across reviewers.
 */
export function PopupNameAutocomplete({
  id,
  value,
  onValueChange,
  companyCollabName,
  placeholder = 'e.g. Summer launch',
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
  const companyReady = Boolean(String(companyCollabName ?? '').trim())

  useEffect(() => {
    if (!companyReady) {
      setResults([])
      setLoading(false)
      return undefined
    }

    const currentSeq = ++requestSeq.current
    setLoading(true)
    const timer = window.setTimeout(async () => {
      try {
        const data = await searchPopupNames(companyCollabName, trimmed, 8)
        if (currentSeq !== requestSeq.current) return
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
  }, [companyCollabName, companyReady, trimmed])

  useEffect(() => {
    if (!open) return undefined
    const handleClickOutside = (event) => {
      if (!wrapperRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const selectSuggestion = (row) => {
    if (!row?.popup_name) return
    onValueChange(row.popup_name)
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

  const showDropdown = open && companyReady

  return (
    <div className="company-autocomplete" ref={wrapperRef}>
      <div className="review-search-wrap">
        <IconSearch className="review-search-wrap__icon" ariaHidden />
        <input
          id={id}
          ref={inputRef}
          type="search"
          name="popup_name"
          autoComplete="off"
          placeholder={placeholder}
          className="review-search-wrap__input"
          value={value}
          onChange={(ev) => {
            onValueChange(ev.target.value)
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
              ? `${listId}-opt-${highlight}`
              : undefined
          }
          maxLength={120}
          disabled={!companyReady}
          aria-disabled={!companyReady}
        />
      </div>

      {showDropdown && (
        <ul
          id={listId}
          className="company-autocomplete__list"
          role="listbox"
          aria-label="Pop-up name suggestions"
        >
          {loading && results.length === 0 ? (
            <li className="company-autocomplete__state" role="presentation">
              Searching…
            </li>
          ) : results.length === 0 ? (
            <li className="company-autocomplete__state" role="presentation">
              {trimmed
                ? `No existing pop-up — “${trimmed}” will start a new one.`
                : 'No named pop-ups yet — type a name to create one.'}
            </li>
          ) : (
            results.map((row, index) => (
              <li
                key={`${row.popup_name}-${index}`}
                id={`${listId}-opt-${index}`}
                role="option"
                aria-selected={index === highlight}
                className={`company-autocomplete__option ${
                  index === highlight ? 'is-active' : ''
                }`}
                onMouseDown={(ev) => {
                  ev.preventDefault()
                  selectSuggestion(row)
                }}
                onMouseEnter={() => setHighlight(index)}
              >
                <span className="company-autocomplete__name">{row.popup_name}</span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}
