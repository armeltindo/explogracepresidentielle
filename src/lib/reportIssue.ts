const ISSUES_URL = 'https://github.com/armeltindo/explogracepresidentielle/issues/new';

export interface IssueContext {
  num: number;
  nom: string;
  dossier: string;
}

/** Prefilled "new issue" link on the repo — used as the correction/feedback channel since this is an independent, non-official page with no real contact address to fabricate. */
export function buildReportIssueUrl(context?: IssueContext): string {
  const params = new URLSearchParams();
  if (context) {
    params.set('title', `Erreur de donnée — fiche n° ${context.num} (${context.nom})`);
    params.set(
      'body',
      `Concerne : fiche n° ${context.num} — ${context.nom} (dossier ${context.dossier})\n\nDécrivez l'erreur constatée :\n`,
    );
  } else {
    params.set('title', 'Erreur de donnée');
    params.set('body', "Décrivez l'erreur constatée (numéro de fiche si possible) :\n");
  }
  return `${ISSUES_URL}?${params.toString()}`;
}
