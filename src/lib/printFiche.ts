const PRINT_FICHE_CLASS = 'print-fiche-only';

/** Prints just the currently open detail panel instead of the whole registry — see the `.print-fiche-only` rules in index.css. */
export function printFiche(): void {
  document.body.classList.add(PRINT_FICHE_CLASS);
  const cleanup = () => document.body.classList.remove(PRINT_FICHE_CLASS);
  window.addEventListener('afterprint', cleanup, { once: true });
  setTimeout(() => window.print(), 150);
}
