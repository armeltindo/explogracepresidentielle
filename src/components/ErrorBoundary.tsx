import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Erreur non interceptée dans l\'application :', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="mx-auto max-w-[560px] px-6 py-24 text-center">
          <p className="m-0 mb-2 font-display text-2xl">Une erreur est survenue</p>
          <p className="m-0 mb-5 text-sm leading-[1.6] text-muted">
            L'affichage du registre a rencontré un problème inattendu. Recharger la page devrait résoudre le
            souci ; si cela persiste, merci de le signaler.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="cursor-pointer border-none bg-green px-[18px] py-[11px] text-sm font-semibold text-white hover:bg-green-dark"
          >
            Recharger la page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
