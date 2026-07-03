import React, { memo } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

import { PokemonTypeName } from '@domain/enums/PokemonTypeName';

import { getTypeColor, palette } from '../theme/colors';
import { fontSize, radius, spacing } from '../theme/metrics';
import { typeLabelsEs } from '../utils/typeLabels';

interface Props {
  type: PokemonTypeName;
  style?: ViewStyle;
}

export const TypeBadge = memo(({ type, style }: Props) => (
  <View
    accessibilityRole="text"
    accessibilityLabel={`Tipo ${typeLabelsEs[type]}`}
    style={[styles.badge, { backgroundColor: getTypeColor(type) }, style]}
  >
    <Text style={styles.label}>{typeLabelsEs[type]}</Text>
  </View>
));

TypeBadge.displayName = 'TypeBadge';

const styles = StyleSheet.create({
  badge: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    alignSelf: 'flex-start',
  },
  label: {
    color: palette.textOnColor,
    fontSize: fontSize.xs,
    fontWeight: '700',
  },
});
