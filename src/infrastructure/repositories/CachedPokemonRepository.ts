import { PokemonDetail, PokemonPage } from '@domain/entities/Pokemon';
import { DomainError, DomainErrorKind } from '@domain/errors/DomainError';
import { PokemonRepository } from '@domain/repositories/PokemonRepository';

import { PokeApiRemoteDataSource } from '../api/PokeApiRemoteDataSource';
import { JsonCache } from '../storage/JsonCache';

const pageKey = (offset: number, limit: number) => `pokedex:v2:page:${offset}:${limit}`;
const detailKey = (id: number) => `pokedex:v2:detail:${id}`;

export class CachedPokemonRepository implements PokemonRepository {
  constructor(
    private readonly remote: PokeApiRemoteDataSource,
    private readonly cache: JsonCache,
  ) {}

  async getPokemonPage({ offset, limit }: { offset: number; limit: number }): Promise<PokemonPage> {
    return this.readThroughCache(pageKey(offset, limit), () => this.remote.fetchPage(offset, limit));
  }

  async getPokemonDetail(id: number): Promise<PokemonDetail> {
    return this.readThroughCache(detailKey(id), () => this.remote.fetchDetail(id));
  }

  private async readThroughCache<T>(key: string, fetchRemote: () => Promise<T>): Promise<T> {
    const cached = await this.cache.read<T>(key);
    if (cached?.isFresh) return cached.value;

    try {
      const fresh = await fetchRemote();
      await this.cache.write(key, fresh);
      return fresh;
    } catch (error) {
      const domainError = error instanceof DomainError ? error : DomainError.unknown(error);      
      const canFallBack =
        domainError.kind === DomainErrorKind.Network || domainError.kind === DomainErrorKind.Server;
      if (canFallBack && cached) return cached.value;
      throw domainError;
    }
  }
}
