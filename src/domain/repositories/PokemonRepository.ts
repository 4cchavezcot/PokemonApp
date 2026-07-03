import { PokemonDetail, PokemonPage } from '../entities/Pokemon';

export interface PokemonRepository {
  getPokemonPage(params: { offset: number; limit: number }): Promise<PokemonPage>;
  getPokemonDetail(id: number): Promise<PokemonDetail>;
}
