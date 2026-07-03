import React, { memo, useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, ViewStyle } from 'react-native';

import { palette } from '../theme/colors';
import { radius, spacing } from '../theme/metrics';

interface SkeletonBoxProps {
  style?: ViewStyle;
}

export const SkeletonBox = memo(({ style }: SkeletonBoxProps) => {
  const opacity = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.45, duration: 600, useNativeDriver: true }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return <Animated.View style={[styles.box, style, { opacity }]} />;
});

SkeletonBox.displayName = 'SkeletonBox';

export const SkeletonCard = memo(() => (
  <View style={styles.card} accessibilityLabel="Cargando Pokémon" accessible>
    <SkeletonBox style={styles.image} />
    <View style={styles.info}>
      <SkeletonBox style={styles.shortLine} />
      <SkeletonBox style={styles.line} />
      <View style={styles.chips}>
        <SkeletonBox style={styles.chip} />
        <SkeletonBox style={styles.chip} />
      </View>
    </View>
  </View>
));

SkeletonCard.displayName = 'SkeletonCard';

const styles = StyleSheet.create({
  box: {
    backgroundColor: palette.skeleton,
    borderRadius: radius.sm,
  },
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
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: radius.md,
  },
  info: {
    flex: 1,
    marginLeft: spacing.lg,
  },
  shortLine: {
    width: 48,
    height: 10,
  },
  line: {
    width: 120,
    height: 16,
    marginTop: spacing.sm,
  },
  chips: {
    flexDirection: 'row',
    marginTop: spacing.sm,
  },
  chip: {
    width: 56,
    height: 18,
    borderRadius: radius.pill,
    marginRight: spacing.sm,
  },
});
