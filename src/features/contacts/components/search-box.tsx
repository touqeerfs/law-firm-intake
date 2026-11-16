'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Search } from 'lucide-react';

type SearchBoxProps = {
  query: string;
  onQueryChange: (query: string) => void;
};

const SEARCH_DELAY_MS = 120;

function isTypingIn(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
  );
}

export function SearchBox({ query, onQueryChange }: SearchBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(query);
  const [sentQuery, setSentQuery] = useState(query);
  const [urlQuery, setUrlQuery] = useState(query);

  // Our own debounced write comes back through the URL a moment later; only a change
  // made elsewhere (Clear filters, a nav link) should overwrite what is being typed.
  if (query !== urlQuery) {
    setUrlQuery(query);
    if (query !== sentQuery) {
      setSentQuery(query);
      setValue(query);
    }
  }

  useEffect(() => {
    const next = value.trim();
    if (next === sentQuery) return;

    const timer = setTimeout(() => {
      setSentQuery(next);
      onQueryChange(next);
    }, SEARCH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [value, sentQuery, onQueryChange]);

  useEffect(() => {
    function focusOnSlash(event: globalThis.KeyboardEvent) {
      if (event.key !== '/' || isTypingIn(event.target)) return;
      event.preventDefault();
      inputRef.current?.focus();
    }
    document.addEventListener('keydown', focusOnSlash);
    return () => document.removeEventListener('keydown', focusOnSlash);
  }, []);

  function clearOnEscape(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') setValue('');
  }

  return (
    <label className="flex h-8.5 w-full min-w-0 items-center gap-2 rounded-sm border border-border bg-surface pr-2 pl-2.5 text-muted shadow-xs transition focus-within:border-accent focus-within:ring-3 focus-within:ring-accent/30 desktop:w-75">
      <Search className="size-3.75 shrink-0" aria-hidden />
      <span className="sr-only">Search contacts</span>
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={clearOnEscape}
        placeholder="Search name, phone, email or ID"
        autoComplete="off"
        spellCheck={false}
        className="h-full min-w-0 flex-1 bg-transparent text-text outline-none placeholder:text-muted"
      />
      <kbd className="hidden h-4.5 min-w-4.5 place-items-center rounded-xs border border-b-2 border-border bg-surface-2 px-1 text-2xs font-medium text-muted desktop:inline-grid">
        /
      </kbd>
    </label>
  );
}
