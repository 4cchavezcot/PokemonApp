import React, { memo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { PokemonSummary } from '@domain/entities/Pokemon';

import { TypeBadge } from './TypeBadge';
import { getSoftTypeColor, palette } from '../theme/colors';
import { fontSize, radius, spacing } from '../theme/metrics';
import { formatName, formatPokedexNumber } from '../utils/format';

interface Props {
  pokemon: PokemonSummary;
  onPress: (pokemon: PokemonSummary) => void;
}

export const PokemonCard = memo(({ pokemon, onPress }: Props) => {
  const primaryType = pokemon.types[0];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${formatName(pokemon.name)}, número ${pokemon.id}. Ver detalle`}
      onPress={() => onPress(pokemon)}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={[styles.imageBox, { backgroundColor: getSoftTypeColor(primaryType) }]}>
        {pokemon.imageUrl ? (
          <Image
            source={{ uri: pokemon.imageUrl }}
            style={styles.image}
            resizeMode="contain"
            accessibilityIgnoresInvertColors
          />
        ) : (
          <View style={styles.image} />
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.number}>{formatPokedexNumber(pokemon.id)}</Text>
        <Text style={styles.name} numberOfLines={1}>
          {formatName(pokemon.name)}
        </Text>
        <View style={styles.types}>
          {pokemon.types.map((type) => (
            <TypeBadge key={type} type={type} style={styles.typeBadge} />
          ))}
        </View>
      </View>

      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
});

PokemonCard.displayName = 'PokemonCard';

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: palette.border,
    shadowColor: '#101828',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.99 }],
  },
  imageBox: {
    width: 72,
    height: 72,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 64,
    height: 64,
  },
  info: {
    flex: 1,
    marginLeft: spacing.lg,
  },
  number: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: palette.textSecondary,
  },
  name: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: palette.textPrimary,
    marginTop: 2,
    marginBottom: spacing.sm,
  },
  types: {
    flexDirection: 'row',
  },
  typeBadge: {
    marginRight: spacing.sm,
  },
  chevron: {
    fontSize: fontSize.xl,
    color: palette.textSecondary,
    opacity: 0.5,
    marginLeft: spacing.sm,
  },
});
