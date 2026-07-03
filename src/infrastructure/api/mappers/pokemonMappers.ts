import {
  EvolutionStage,
  PokemonDetail,
  PokemonStat,
  PokemonSummary,
} from '@domain/entities/Pokemon';
import { isPokemonStatName } from '@domain/enums/PokemonStatName';
import { PokemonTypeName, isPokemonTypeName } from '@domain/enums/PokemonTypeName';
import { calculateWeaknesses } from '@domain/services/typeEffectiveness';

import {
  EvolutionChainDto,
  EvolutionChainLinkDto,
  PokemonDetailDto,
  PokemonSpeciesDto,
} from '../dto/pokeApiDtos';

const DECIMETERS_PER_METER = 10;
const HECTOGRAMS_PER_KILOGRAM = 10;

const mapTypes = (dto: PokemonDetailDto): PokemonTypeName[] =>
  [...dto.types]
    .sort((a, b) => a.slot - b.slot)
    .map((slot) => slot.type.name)
    .filter(isPokemonTypeName);

const mapStats = (dto: PokemonDetailDto): PokemonStat[] =>
  dto.stats.flatMap((slot) =>
    isPokemonStatName(slot.stat.name) ? [{ name: slot.stat.name, baseValue: slot.base_stat }] : [],
  );

const mapImageUrl = (dto: PokemonDetailDto): string | null =>
  dto.sprites.other?.['official-artwork']?.front_default ?? dto.sprites.front_default;

export const mapToPokemonSummary = (dto: PokemonDetailDto): PokemonSummary => ({
  id: dto.id,
  name: dto.name,
  imageUrl: mapImageUrl(dto),
  types: mapTypes(dto),
});

export const visibleAbilitySlots = (dto: PokemonDetailDto) =>
  dto.abilities.filter((slot) => !slot.is_hidden).sort((a, b) => a.slot - b.slot);

export interface DetailExtras {
  description?: string | null;
  evolutionChain?: EvolutionStage[];
  abilityNames?: string[];
}

export const mapToPokemonDetail = (
  dto: PokemonDetailDto,
  extras: DetailExtras = {},
): PokemonDetail => {
  const summary = mapToPokemonSummary(dto);
  return {
    ...summary,
    heightMeters: dto.height / DECIMETERS_PER_METER,
    weightKilograms: dto.weight / HECTOGRAMS_PER_KILOGRAM,
    baseExperience: dto.base_experience,
    abilities:
      extras.abilityNames ?? visibleAbilitySlots(dto).map((slot) => titleCase(slot.ability.name)),
    stats: mapStats(dto),
    description: extras.description ?? null,
    weaknesses: calculateWeaknesses(summary.types),
    evolutionChain: extras.evolutionChain ?? [],
  };
};

export const titleCase = (value: string): string =>
  value
    .split('-')
    .map((word) => (word.length === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
    .join(' ');

export const officialArtworkUrl = (id: number): string =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

export const pickSpanishDescription = (dto: PokemonSpeciesDto): string | null => {
  const entry = dto.flavor_text_entries.find((item) => item.language.name === 'es');
  return entry ? entry.flavor_text.replace(/[\n\f\r]+/g, ' ').trim() : null;
};

export const flattenEvolutionChain = (dto: EvolutionChainDto): EvolutionStage[] => {
  const stages: EvolutionStage[] = [];
  const walk = (link: EvolutionChainLinkDto): void => {
    const id = extractIdFromResourceUrl(link.species.url);
    if (id !== null) {
      stages.push({ id, name: link.species.name, imageUrl: officialArtworkUrl(id) });
    }
    link.evolves_to.forEach(walk);
  };
  walk(dto.chain);
  return stages;
};

export const extractIdFromResourceUrl = (url: string): number | null => {
  const match = /\/(\d+)\/?$/.exec(url);
  const id = match?.[1] ? Number.parseInt(match[1], 10) : Number.NaN;
  return Number.isNaN(id) ? null : id;
};
