import { PokemonTypeName } from '../enums/PokemonTypeName';

interface TypeMatchup {  
  readonly strongAgainst: readonly PokemonTypeName[]; 
  readonly weakAgainst: readonly PokemonTypeName[];
  readonly noEffectAgainst: readonly PokemonTypeName[];
}

const T = PokemonTypeName;

const TYPE_CHART: Record<PokemonTypeName, TypeMatchup> = {
  [T.Normal]: { strongAgainst: [], weakAgainst: [T.Rock, T.Steel], noEffectAgainst: [T.Ghost] },
  [T.Fire]: {
    strongAgainst: [T.Grass, T.Ice, T.Bug, T.Steel],
    weakAgainst: [T.Fire, T.Water, T.Rock, T.Dragon],
    noEffectAgainst: [],
  },
  [T.Water]: {
    strongAgainst: [T.Fire, T.Ground, T.Rock],
    weakAgainst: [T.Water, T.Grass, T.Dragon],
    noEffectAgainst: [],
  },
  [T.Electric]: {
    strongAgainst: [T.Water, T.Flying],
    weakAgainst: [T.Electric, T.Grass, T.Dragon],
    noEffectAgainst: [T.Ground],
  },
  [T.Grass]: {
    strongAgainst: [T.Water, T.Ground, T.Rock],
    weakAgainst: [T.Fire, T.Grass, T.Poison, T.Flying, T.Bug, T.Dragon, T.Steel],
    noEffectAgainst: [],
  },
  [T.Ice]: {
    strongAgainst: [T.Grass, T.Ground, T.Flying, T.Dragon],
    weakAgainst: [T.Fire, T.Water, T.Ice, T.Steel],
    noEffectAgainst: [],
  },
  [T.Fighting]: {
    strongAgainst: [T.Normal, T.Ice, T.Rock, T.Dark, T.Steel],
    weakAgainst: [T.Poison, T.Flying, T.Psychic, T.Bug, T.Fairy],
    noEffectAgainst: [T.Ghost],
  },
  [T.Poison]: {
    strongAgainst: [T.Grass, T.Fairy],
    weakAgainst: [T.Poison, T.Ground, T.Rock, T.Ghost],
    noEffectAgainst: [T.Steel],
  },
  [T.Ground]: {
    strongAgainst: [T.Fire, T.Electric, T.Poison, T.Rock, T.Steel],
    weakAgainst: [T.Grass, T.Bug],
    noEffectAgainst: [T.Flying],
  },
  [T.Flying]: {
    strongAgainst: [T.Grass, T.Fighting, T.Bug],
    weakAgainst: [T.Electric, T.Rock, T.Steel],
    noEffectAgainst: [],
  },
  [T.Psychic]: {
    strongAgainst: [T.Fighting, T.Poison],
    weakAgainst: [T.Psychic, T.Steel],
    noEffectAgainst: [T.Dark],
  },
  [T.Bug]: {
    strongAgainst: [T.Grass, T.Psychic, T.Dark],
    weakAgainst: [T.Fire, T.Fighting, T.Poison, T.Flying, T.Ghost, T.Steel, T.Fairy],
    noEffectAgainst: [],
  },
  [T.Rock]: {
    strongAgainst: [T.Fire, T.Ice, T.Flying, T.Bug],
    weakAgainst: [T.Fighting, T.Ground, T.Steel],
    noEffectAgainst: [],
  },
  [T.Ghost]: {
    strongAgainst: [T.Psychic, T.Ghost],
    weakAgainst: [T.Dark],
    noEffectAgainst: [T.Normal],
  },
  [T.Dragon]: { strongAgainst: [T.Dragon], weakAgainst: [T.Steel], noEffectAgainst: [T.Fairy] },
  [T.Dark]: {
    strongAgainst: [T.Psychic, T.Ghost],
    weakAgainst: [T.Fighting, T.Dark, T.Fairy],
    noEffectAgainst: [],
  },
  [T.Steel]: {
    strongAgainst: [T.Ice, T.Rock, T.Fairy],
    weakAgainst: [T.Fire, T.Water, T.Electric, T.Steel],
    noEffectAgainst: [],
  },
  [T.Fairy]: {
    strongAgainst: [T.Fighting, T.Dragon, T.Dark],
    weakAgainst: [T.Fire, T.Poison, T.Steel],
    noEffectAgainst: [],
  },
};

const multiplierAgainst = (attacker: PokemonTypeName, defender: PokemonTypeName): number => {
  const matchup = TYPE_CHART[attacker];
  if (matchup.noEffectAgainst.includes(defender)) return 0;
  if (matchup.strongAgainst.includes(defender)) return 2;
  if (matchup.weakAgainst.includes(defender)) return 0.5;
  return 1;
};

export const calculateWeaknesses = (
  defendingTypes: readonly PokemonTypeName[],
): PokemonTypeName[] =>
  Object.values(PokemonTypeName).filter((attacker) => {
    const total = defendingTypes.reduce(
      (multiplier, defender) => multiplier * multiplierAgainst(attacker, defender),
      1,
    );
    return total > 1;
  });
