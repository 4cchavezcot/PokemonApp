import { PokemonStatName } from '../enums/PokemonStatName';
import { PokemonTypeName } from '../enums/PokemonTypeName';

export interface PokemonSummary {
  readonly id: number;
  readonly name: string;
  readonly imageUrl: string | null;
  readonly types: readonly PokemonTypeName[];
}

export interface PokemonStat {
  readonly name: PokemonStatName;
  readonly baseValue: number;
}

export interface EvolutionStage {
  readonly id: number;
  readonly name: string;
  readonly imageUrl: string;
}

export interface PokemonDetail extends PokemonSummary {
  readonly heightMeters: number;
  readonly weightKilograms: number;
  readonly baseExperience: number | null;
  readonly abilities: readonly string[];
  readonly stats: readonly PokemonStat[];
  readonly description: string | null;
  readonly weaknesses: readonly PokemonTypeName[];
  readonly evolutionChain: readonly EvolutionStage[];
}

export interface PokemonPage {
  readonly items: readonly PokemonSummary[];
  readonly totalCount: number;
  readonly nextOffset: number | null;
}
