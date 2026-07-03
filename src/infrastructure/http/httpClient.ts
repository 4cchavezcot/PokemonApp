import axios, { AxiosError, AxiosInstance } from 'axios';

import { DomainError } from '@domain/errors/DomainError';

export const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

export const toDomainErrorFromAxios = (error: unknown): DomainError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      const { status } = axiosError.response;
      if (status === 404) return DomainError.notFound(axiosError.config?.url ?? 'recurso', error);
      if (status >= 500) return DomainError.server(error);
      return DomainError.unknown(error);
    }    
    return DomainError.network(error);
  }
  return DomainError.unknown(error);
};

export const createHttpClient = (): AxiosInstance =>
  axios.create({
    baseURL: POKEAPI_BASE_URL,
    timeout: 10_000,
    headers: { Accept: 'application/json' },
  });
