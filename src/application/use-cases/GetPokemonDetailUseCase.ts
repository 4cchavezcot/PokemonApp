import { PokemonDetail } from '@domain/entities/Pokemon';
import { DomainError } from '@domain/errors/DomainError';
import { PokemonRepository } from '@domain/repositories/PokemonRepository';

export class GetPokemonDetailUseCase {
  constructor(private readonly repository: PokemonRepository) {}

  execute(id: number): Promise<PokemonDetail> {
    if (!Number.isInteger(id) || id <= 0) {
      return Promise.reject(DomainError.notFound(`Pokémon con id ${id}`));
    }
    return this.repository.getPokemonDetail(id);
  }
}
