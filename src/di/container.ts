import { GetPokemonDetailUseCase } from '@application/use-cases/GetPokemonDetailUseCase';
import { GetPokemonPageUseCase } from '@application/use-cases/GetPokemonPageUseCase';
import { PokemonRepository } from '@domain/repositories/PokemonRepository';
import { PokeApiRemoteDataSource } from '@infrastructure/api/PokeApiRemoteDataSource';
import { createHttpClient } from '@infrastructure/http/httpClient';
import { CachedPokemonRepository } from '@infrastructure/repositories/CachedPokemonRepository';
import { AsyncStorageAdapter } from '@infrastructure/storage/AsyncStorageAdapter';
import { JsonCache } from '@infrastructure/storage/JsonCache';

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

export interface AppContainer {
  readonly pokemonRepository: PokemonRepository;
  readonly getPokemonPage: GetPokemonPageUseCase;
  readonly getPokemonDetail: GetPokemonDetailUseCase;
}

export const createContainer = (): AppContainer => {
  const httpClient = createHttpClient();
  const remoteDataSource = new PokeApiRemoteDataSource(httpClient);
  const cache = new JsonCache(new AsyncStorageAdapter(), CACHE_TTL_MS);
  const pokemonRepository = new CachedPokemonRepository(remoteDataSource, cache);

  return {
    pokemonRepository,
    getPokemonPage: new GetPokemonPageUseCase(pokemonRepository),
    getPokemonDetail: new GetPokemonDetailUseCase(pokemonRepository),
  };
};

export const container: AppContainer = createContainer();
