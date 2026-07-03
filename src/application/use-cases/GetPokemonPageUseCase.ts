import { PokemonPage } from '@domain/entities/Pokemon';
import { PokemonRepository } from '@domain/repositories/PokemonRepository';

export const DEFAULT_PAGE_SIZE = 20;

export class GetPokemonPageUseCase {
  constructor(private readonly repository: PokemonRepository) {}

  execute(offset = 0, limit = DEFAULT_PAGE_SIZE): Promise<PokemonPage> {
    const safeOffset = Math.max(0, Math.trunc(offset));
    const safeLimit = Math.min(Math.max(1, Math.trunc(limit)), DEFAULT_PAGE_SIZE);
    return this.repository.getPokemonPage({ offset: safeOffset, limit: safeLimit });
  }
}
