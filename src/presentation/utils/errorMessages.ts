import { DomainError, DomainErrorKind, toDomainError } from '@domain/errors/DomainError';

const messagesByKind: Record<DomainErrorKind, string> = {
  [DomainErrorKind.Network]: 'Parece que no tienes conexión. Revisa tu internet e inténtalo de nuevo.',
  [DomainErrorKind.NotFound]: 'No encontramos la información de este Pokémon.',
  [DomainErrorKind.Server]: 'La PokéAPI está teniendo problemas. Inténtalo de nuevo en unos minutos.',
  [DomainErrorKind.Unknown]: 'Algo salió mal. Inténtalo de nuevo.',
};

export const getFriendlyErrorMessage = (error: unknown): string => {
  const domainError: DomainError = toDomainError(error);
  return messagesByKind[domainError.kind];
};
