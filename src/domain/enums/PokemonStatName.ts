export enum PokemonStatName {
  Hp = 'hp',
  Attack = 'attack',
  Defense = 'defense',
  SpecialAttack = 'special-attack',
  SpecialDefense = 'special-defense',
  Speed = 'speed',
}

export const isPokemonStatName = (value: string): value is PokemonStatName =>
  (Object.values(PokemonStatName) as string[]).includes(value);
