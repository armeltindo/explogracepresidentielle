import type { ReactNode } from 'react';

/** Wraps the first case-insensitive match of `query` inside `text` in a <mark>. */
export function highlight(text: string, query: string): ReactNode {
  if (!query) return text;
  const i = text.toLowerCase().indexOf(query.toLowerCase());
  if (i === -1) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark>{text.slice(i, i + query.length)}</mark>
      {text.slice(i + query.length)}
    </>
  );
}
