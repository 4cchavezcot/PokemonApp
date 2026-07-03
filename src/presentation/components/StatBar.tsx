import React, { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { PokemonStatName } from '@domain/enums/PokemonStatName';

import { palette } from '../theme/colors';
import { fontSize, radius, spacing } from '../theme/metrics';

const MAX_BASE_STAT = 255;

const statLabels: Record<PokemonStatName, string> = {
  [PokemonStatName.Hp]: 'PS',
  [PokemonStatName.Attack]: 'Ataque',
  [PokemonStatName.Defense]: 'Defensa',
  [PokemonStatName.SpecialAttack]: 'At. Esp.',
  [PokemonStatName.SpecialDefense]: 'Def. Esp.',
  [PokemonStatName.Speed]: 'Velocidad',
};

interface Props {
  name: PokemonStatName;
  value: number;
  color: string;
}

export const StatBar = memo(({ name, value, color }: Props) => {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: Math.min(value / MAX_BASE_STAT, 1),
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [progress, value]);

  const width = progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <View
      style={styles.row}
      accessible
      accessibilityLabel={`${statLabels[name]}: ${value} de ${MAX_BASE_STAT}`}
    >
      <Text style={[styles.label, { color }]}>{statLabels[name]}</Text>
      <Text style={styles.value}>{String(value).padStart(3, '0')}</Text>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, { backgroundColor: color, width }]} />
      </View>
    </View>
  );
});

StatBar.displayName = 'StatBar';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  label: {
    width: 76,
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
  value: {
    width: 40,
    fontSize: fontSize.sm,
    color: palette.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  track: {
    flex: 1,
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: palette.statTrack,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.pill,
  },
});
