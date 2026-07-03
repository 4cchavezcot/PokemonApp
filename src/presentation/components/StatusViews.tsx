import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { palette } from '../theme/colors';
import { fontSize, radius, spacing } from '../theme/metrics';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export const ErrorState = ({ message, onRetry }: ErrorStateProps) => (
  <View style={styles.container}>
    <Text style={styles.emoji}>😵</Text>
    <Text style={styles.title}>Ups, algo salió mal</Text>
    <Text style={styles.message}>{message}</Text>
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Reintentar"
      onPress={onRetry}
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
    >
      <Text style={styles.buttonLabel}>Reintentar</Text>
    </Pressable>
  </View>
);

interface EmptyStateProps {
  message?: string;
}

export const EmptyState = ({ message = 'No hay Pokémon para mostrar.' }: EmptyStateProps) => (
  <View style={styles.container}>
    <Text style={styles.emoji}>🔍</Text>
    <Text style={styles.title}>Sin resultados</Text>
    <Text style={styles.message}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
  },
  emoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: palette.textPrimary,
    marginBottom: spacing.sm,
  },
  message: {
    fontSize: fontSize.md,
    color: palette.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  button: {
    backgroundColor: palette.primary,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonLabel: {
    color: palette.textOnColor,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
});
