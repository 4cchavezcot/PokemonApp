import { PokemonTypeName } from '@domain/enums/PokemonTypeName';

export const palette = {
  primary: '#DC0A2D',
  background: '#F7F8FC',
  surface: '#FFFFFF',
  textPrimary: '#1D1D2C',
  textSecondary: '#6B6B7B',
  textOnColor: '#FFFFFF',
  border: '#E8E8F0',
  skeleton: '#E4E6EF',
  danger: '#D64545',
  statTrack: '#EEF0F6',
} as const;

export const typeColors: Record<PokemonTypeName, string> = {
  [PokemonTypeName.Normal]: '#A8A77A',
  [PokemonTypeName.Fire]: '#EE8130',
  [PokemonTypeName.Water]: '#6390F0',
  [PokemonTypeName.Electric]: '#F0C929',
  [PokemonTypeName.Grass]: '#7AC74C',
  [PokemonTypeName.Ice]: '#96D9D6',
  [PokemonTypeName.Fighting]: '#C22E28',
  [PokemonTypeName.Poison]: '#A33EA1',
  [PokemonTypeName.Ground]: '#E2BF65',
  [PokemonTypeName.Flying]: '#A98FF3',
  [PokemonTypeName.Psychic]: '#F95587',
  [PokemonTypeName.Bug]: '#A6B91A',
  [PokemonTypeName.Rock]: '#B6A136',
  [PokemonTypeName.Ghost]: '#735797',
  [PokemonTypeName.Dragon]: '#6F35FC',
  [PokemonTypeName.Dark]: '#705746',
  [PokemonTypeName.Steel]: '#B7B7CE',
  [PokemonTypeName.Fairy]: '#D685AD',
};

export const getTypeColor = (type: PokemonTypeName | undefined): string =>
  type ? typeColors[type] : palette.primary;

export const getSoftTypeColor = (type: PokemonTypeName | undefined): string =>
  `${getTypeColor(type)}26`;
