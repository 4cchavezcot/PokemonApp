import React, { memo } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { palette } from '../theme/colors';
import { fontSize, radius, spacing } from '../theme/metrics';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
}

export const SearchBar = memo(({ value, onChangeText }: Props) => (
  <View style={styles.container}>
    <Text style={styles.icon}>🔍</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder="Buscar por nombre o número"
      placeholderTextColor={palette.textSecondary}
      style={styles.input}
      autoCorrect={false}
      autoCapitalize="none"
      returnKeyType="search"
      accessibilityLabel="Buscar Pokémon por nombre o número"
    />
  </View>
));

SearchBar.displayName = 'SearchBar';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  icon: {
    fontSize: fontSize.md,
    marginRight: spacing.sm,
    opacity: 0.5,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: fontSize.md,
    color: palette.textPrimary,
  },
});
