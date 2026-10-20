'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export type LineSelectOption = { value: string; label: string; hint?: string; disabled?: boolean };

type LineSelectProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: LineSelectOption[];
    placeholder?: string;
    name?: string;
    disabled?: boolean;
    required?: boolean;
    error?: string;
    searchable?: boolean;
    /** Hide the visible label (still announced). Used inside phone fields. */
    bare?: boolean;
    triggerClassName?: string;
};

export default function LineSelect({
    label,
    value,
    onChange,
    options,
    placeholder = 'Select',
    name,
    disabled = false,
    required = false,
    error,
    searchable = false,
    bare = false,
    triggerClassName = '',
}: LineSelectProps) {
    const [open, setOpen] = useState(false);
    const [box, setBox] = useState<{ top: number; left: number; width: number } | null>(null);
    const rootRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const listId = useId();
    const [query, setQuery] = useState('');
    const current = options.find((option) => option.value === value);
    const shown = useMemo(() => {
        const rows = searchable
            ? [...options].sort((left, right) => left.label.localeCompare(right.label))
            : options;
        const needle = query.trim().toLowerCase();
        if (!needle) return rows;
        return rows.filter((option) =>
            `${option.label} ${option.hint ?? ''}`.toLowerCase().includes(needle),
        );
    }, [options, query, searchable]);

    useEffect(() => {
        if (!open) return;
        const place = () => {
            const rect = buttonRef.current?.getBoundingClientRect();
            if (!rect) return;
            setBox({ top: rect.bottom + 4, left: rect.left, width: rect.width });
        };
        place();
        const onPointer = (event: MouseEvent) => {
            const target = event.target as Node;
            if (rootRef.current?.contains(target) || listRef.current?.contains(target)) return;
            setOpen(false);
        };
        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setOpen(false);
        };
        window.addEventListener('resize', place);
        window.addEventListener('scroll', place, true);
        document.addEventListener('mousedown', onPointer);
        document.addEventListener('keydown', onKey);
        return () => {
            window.removeEventListener('resize', place);
            window.removeEventListener('scroll', place, true);
            document.removeEventListener('mousedown', onPointer);
            document.removeEventListener('keydown', onKey);
        };
    }, [open]);

    return (
        <div className="relative" ref={rootRef}>
            <span
                className={bare ? 'sr-only' : 'mb-1.5 block text-sm text-[#003E48]/70'}
                id={`${listId}-label`}
            >
                {label}
                {!bare && required ? <span className="text-[#c23b2e]"> *</span> : null}
            </span>
            <button
                ref={buttonRef}
                type="button"
                name={name}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-labelledby={`${listId}-label`}
                aria-required={required || undefined}
                aria-invalid={error ? true : undefined}
                disabled={disabled}
                onClick={() => {
                    if (!disabled) {
                        setQuery('');
                        setOpen((next) => !next);
                    }
                }}
                className={`flex h-11 w-full items-center justify-between gap-3 bg-transparent text-left text-sm outline-none focus:border-[#003E48] ${
                    bare ? '' : 'border-b'
                } ${error ? 'border-[#c23b2e]' : bare ? '' : 'border-[#d5d1c8]'} ${
                    disabled ? 'cursor-default opacity-60' : ''
                } ${triggerClassName}`}
            >
                <span className={`truncate ${current ? 'text-[#003E48]' : 'text-[#003E48]/35'}`}>
                    {current?.label ?? placeholder}
                </span>
                {disabled ? null : (
                    <svg
                        viewBox="0 0 24 24"
                        className={`h-4 w-4 shrink-0 text-[#003E48]/50 transition-transform ${open ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden
                    >
                        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )}
            </button>
            {open && box
                ? createPortal(
                      <ul
                          ref={listRef}
                          id={listId}
                          role="listbox"
                          aria-labelledby={`${listId}-label`}
                          style={{
                              position: 'fixed',
                              top: box.top,
                              left: box.left,
                              width: box.width,
                              zIndex: 800,
                          }}
                          className="max-h-80 overflow-auto border border-[#003E48]/12 bg-white py-1 shadow-[0_16px_40px_rgba(8,32,56,0.12)]"
                      >
                          {searchable ? (
                              <li className="px-3 py-2">
                                  <input
                                      autoFocus
                                      value={query}
                                      onChange={(event) => setQuery(event.target.value)}
                                      placeholder="Search"
                                      className="w-full border-b border-[#d5d1c8] bg-transparent py-1 text-sm text-[#003E48] outline-none focus:border-[#003E48]"
                                  />
                              </li>
                          ) : null}
                          {shown.length === 0 ? (
                              <li className="px-3 py-2.5 text-sm text-[#003E48]/50">No matches</li>
                          ) : null}
                          {shown.map((option) => {
                              const selected = option.value === value;
                              return (
                                  <li key={option.value} role="presentation">
                                      <button
                                          type="button"
                                          role="option"
                                          aria-selected={selected}
                                          aria-disabled={option.disabled || undefined}
                                          disabled={option.disabled}
                                          onClick={() => {
                                              if (option.disabled) return;
                                              onChange(option.value);
                                              setQuery('');
                                              setOpen(false);
                                          }}
                                          className={`flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-sm text-[#003E48] hover:bg-[#F6F3EE] disabled:cursor-default disabled:text-[#003E48]/35 disabled:line-through disabled:hover:bg-transparent ${
                                              selected ? 'bg-[#F6F3EE] font-semibold' : ''
                                          }`}
                                      >
                                          <span className="min-w-0">
                                              <span className="block truncate">{option.label}</span>
                                              {option.hint ? (
                                                  <span className="block truncate text-xs font-normal text-[#003E48]/50">
                                                      {option.hint}
                                                  </span>
                                              ) : null}
                                          </span>
                                          {selected ? (
                                              <svg
                                                  viewBox="0 0 24 24"
                                                  className="h-4 w-4 text-[#003E48]"
                                                  fill="currentColor"
                                                  aria-hidden
                                              >
                                                  <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                              </svg>
                                          ) : null}
                                      </button>
                                  </li>
                              );
                          })}
                      </ul>,
                      document.body,
                  )
                : null}
            {error ? <span className="mt-1 block text-xs text-[#c23b2e]">{error}</span> : null}
        </div>
    );
}
