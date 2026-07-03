import { AxiosInstance } from 'axios';

import { PokemonDetail, PokemonPage } from '@domain/entities/Pokemon';

import { EvolutionStage } from '@domain/entities/Pokemon';

import {
  AbilityDto,
  EvolutionChainDto,
  PokemonDetailDto,
  PokemonListResponseDto,
  PokemonSpeciesDto,
} from './dto/pokeApiDtos';
import {
  extractIdFromResourceUrl,
  flattenEvolutionChain,
  mapToPokemonDetail,
  mapToPokemonSummary,
  pickSpanishDescription,
  titleCase,
  visibleAbilitySlots,
} from './mappers/pokemonMappers';
import { toDomainErrorFromAxios } from '../http/httpClient';

export class PokeApiRemoteDataSource {
  constructor(private readonly http: AxiosInstance) {}

  async fetchPage(offset: number, limit: number): Promise<PokemonPage> {
    try {
      const { data } = await this.http.get<PokemonListResponseDto>('/pokemon', {
        params: { offset, limit },
      });
      
      const ids = data.results
        .map((resource) => extractIdFromResourceUrl(resource.url))
        .filter((id): id is number => id !== null);

      const details = await Promise.all(ids.map((id) => this.fetchDetailDto(id)));

      return {
        items: details.map(mapToPokemonSummary),
        totalCount: data.count,
        nextOffset: data.next !== null ? offset + limit : null,
      };
    } catch (error) {
      throw toDomainErrorFromAxios(error);
    }
  }

  async fetchDetail(id: number): Promise<PokemonDetail> {
    const dto = await this.fetchDetailDto(id);
    const [species, abilityNames] = await Promise.all([
      this.fetchSpeciesExtras(id),
      this.fetchLocalizedAbilityNames(dto),
    ]);
    return mapToPokemonDetail(dto, {
      description: species.description,
      evolutionChain: species.evolutionChain,
      abilityNames,
    });
  }

  private async fetchSpeciesExtras(
    id: number,
  ): Promise<{ description: string | null; evolutionChain: EvolutionStage[] }> {
    try {
      const { data: species } = await this.http.get<PokemonSpeciesDto>(`/pokemon-species/${id}`);
      const chainId = species.evolution_chain
        ? extractIdFromResourceUrl(species.evolution_chain.url)
        : null;
      let evolutionChain: EvolutionStage[] = [];
      if (chainId !== null) {
        const { data: chain } = await this.http.get<EvolutionChainDto>(
          `/evolution-chain/${chainId}`,
        );
        evolutionChain = flattenEvolutionChain(chain);
      }
      return { description: pickSpanishDescription(species), evolutionChain };
    } catch {
      return { description: null, evolutionChain: [] };
    }
  }

  private async fetchLocalizedAbilityNames(dto: PokemonDetailDto): Promise<string[]> {
    return Promise.all(
      visibleAbilitySlots(dto).map(async (slot) => {
        try {
          const { data } = await this.http.get<AbilityDto>(`/ability/${slot.ability.name}`);
          const spanish = data.names.find((entry) => entry.language.name === 'es');
          return spanish?.name ?? titleCase(slot.ability.name);
        } catch {
          return titleCase(slot.ability.name);
        }
      }),
    );
  }

  private async fetchDetailDto(id: number): Promise<PokemonDetailDto> {
    try {
      const { data } = await this.http.get<PokemonDetailDto>(`/pokemon/${id}`);      
      return data;
    } catch (error) {
      throw toDomainErrorFromAxios(error);
    }
  }
}
