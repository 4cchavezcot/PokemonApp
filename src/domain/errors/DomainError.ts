export enum DomainErrorKind {
  Network = 'network',
  NotFound = 'not-found',
  Server = 'server',
  Unknown = 'unknown',
}

export class DomainError extends Error {
  constructor(
    readonly kind: DomainErrorKind,
    message: string,
    readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'DomainError';
  }

  static network(cause?: unknown): DomainError {
    return new DomainError(DomainErrorKind.Network, 'No hay conexión con el servidor', cause);
  }

  static notFound(resource: string, cause?: unknown): DomainError {
    return new DomainError(DomainErrorKind.NotFound, `No se encontró: ${resource}`, cause);
  }

  static server(cause?: unknown): DomainError {
    return new DomainError(DomainErrorKind.Server, 'El servidor respondió con un error', cause);
  }

  static unknown(cause?: unknown): DomainError {
    return new DomainError(DomainErrorKind.Unknown, 'Ocurrió un error inesperado', cause);
  }
}

export const toDomainError = (error: unknown): DomainError =>
  error instanceof DomainError ? error : DomainError.unknown(error);
