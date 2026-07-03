export interface NamedResourceDto {
  name: string;
  url: string;
}

export interface PokemonListResponseDto {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedResourceDto[];
}

export interface PokemonTypeSlotDto {
  slot: number;
  type: NamedResourceDto;
}

export interface PokemonAbilitySlotDto {
  ability: NamedResourceDto;
  is_hidden: boolean;
  slot: number;
}

export interface PokemonStatSlotDto {
  base_stat: number;
  effort: number;
  stat: NamedResourceDto;
}

export interface PokemonSpritesDto {
  front_default: string | null;
  other?: {
    'official-artwork'?: {
      front_default: string | null;
    };
  };
}

export interface PokemonDetailDto {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number | null;
  sprites: PokemonSpritesDto;
  types: PokemonTypeSlotDto[];
  abilities: PokemonAbilitySlotDto[];
  stats: PokemonStatSlotDto[];
}

export interface FlavorTextEntryDto {
  flavor_text: string;
  language: NamedResourceDto;
}

export interface PokemonSpeciesDto {
  flavor_text_entries: FlavorTextEntryDto[];
  evolution_chain: { url: string } | null;
}

export interface EvolutionChainLinkDto {
  species: NamedResourceDto;
  evolves_to: EvolutionChainLinkDto[];
}

export interface EvolutionChainDto {
  chain: EvolutionChainLinkDto;
}

export interface LocalizedNameDto {
  name: string;
  language: NamedResourceDto;
}

export interface AbilityDto {
  names: LocalizedNameDto[];
}
