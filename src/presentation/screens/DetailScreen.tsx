import React, { useCallback, useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EvolutionStage, PokemonDetail } from '@domain/entities/Pokemon';
import { PokemonTypeName } from '@domain/enums/PokemonTypeName';

import { SkeletonBox } from '../components/Skeleton';
import { StatBar } from '../components/StatBar';
import { TypeBadge } from '../components/TypeBadge';
import { ErrorState } from '../components/StatusViews';
import { DetailScreenProps } from '../navigation/types';
import { usePokemonDetailStore } from '../state/pokemonDetailStore';
import { getSoftTypeColor, getTypeColor, palette } from '../theme/colors';
import { fontSize, radius, spacing } from '../theme/metrics';
import { formatKilograms, formatMeters, formatName, formatPokedexNumber } from '../utils/format';

interface CurrentPokemon {
  id: number;
  name: string;
  primaryType?: PokemonTypeName;
  imageUrl?: string | null;
}

export const DetailScreen = ({ route, navigation }: DetailScreenProps) => {
  const { id, name, primaryType, imageUrl } = route.params;
  const [current, setCurrent] = useState<CurrentPokemon>({ id, name, primaryType, imageUrl });

  useEffect(() => {
    setCurrent({ id, name, primaryType, imageUrl });
  }, [id, name, primaryType, imageUrl]);

  const entry = usePokemonDetailStore((state) => state.entries[current.id]);
  const loadDetail = usePokemonDetailStore((state) => state.loadDetail);

  useEffect(() => {
    void loadDetail(current.id);
  }, [current.id, loadDetail]);

  const detail = entry?.detail ?? null;
  const headerType = detail?.types[0] ?? current.primaryType;
  const accentColor = getTypeColor(headerType);
  const softColor = getSoftTypeColor(headerType);
  const headerImage = detail?.imageUrl ?? current.imageUrl ?? null;

  const handleEvolutionPress = useCallback(
    (stage: EvolutionStage) => {
      if (stage.id === current.id) return;
      setCurrent((previous) => ({
        id: stage.id,
        name: stage.name,
        imageUrl: stage.imageUrl,
        primaryType: detail?.types[0] ?? previous.primaryType,
      }));
    },
    [current.id, detail],
  );

  return (
    <View style={[styles.container, { backgroundColor: softColor }]}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          <View style={styles.hero}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Volver al listado"
              onPress={() => navigation.goBack()}
              hitSlop={12}
              style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
            >
              <Text style={styles.backIcon}>‹</Text>
            </Pressable>

            <View style={styles.heroRow}>
              <View style={styles.heroInfo}>
                <Text style={styles.heroNumber}>{formatPokedexNumber(current.id)}</Text>
                <Text style={styles.heroName} numberOfLines={2}>
                  {formatName(detail?.name ?? current.name)}
                </Text>
                <View style={styles.heroTypes}>
                  {(detail?.types ?? (current.primaryType ? [current.primaryType] : [])).map(
                    (type) => (
                      <TypeBadge key={type} type={type} style={styles.typeBadge} />
                    ),
                  )}
                </View>
              </View>

              {headerImage ? (
                <Image
                  source={{ uri: headerImage }}
                  style={styles.heroImage}
                  resizeMode="contain"
                  accessibilityLabel={`Imagen de ${formatName(current.name)}`}
                  accessibilityIgnoresInvertColors
                />
              ) : (
                <View style={[styles.heroImage, styles.heroImageFallback]} />
              )}
            </View>
          </View>

          <View style={styles.sheet}>
            {entry?.status === 'error' ? (
              <ErrorState
                message={entry.errorMessage ?? ''}
                onRetry={() => void loadDetail(current.id)}
              />
            ) : detail === null ? (
              <DetailSkeleton />
            ) : (
              <DetailContent
                detail={detail}
                accentColor={accentColor}
                onEvolutionPress={handleEvolutionPress}
              />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const DetailSkeleton = () => (
  <View accessible accessibilityLabel="Cargando detalle del Pokémon">
    <SkeletonBox style={skeletonStyles.textLine} />
    <SkeletonBox style={skeletonStyles.textLineShort} />
    <View style={styles.measuresRow}>
      <SkeletonBox style={skeletonStyles.measureBox} />
      <SkeletonBox style={skeletonStyles.measureBox} />
    </View>
    <SkeletonBox style={skeletonStyles.sectionLabel} />
    <View style={styles.chipsRow}>
      <SkeletonBox style={skeletonStyles.chip} />
      <SkeletonBox style={skeletonStyles.chip} />
    </View>
    <SkeletonBox style={skeletonStyles.sectionLabel} />
    <View style={styles.chipsRow}>
      <SkeletonBox style={skeletonStyles.chip} />
      <SkeletonBox style={skeletonStyles.chip} />
      <SkeletonBox style={skeletonStyles.chip} />
    </View>
    <SkeletonBox style={skeletonStyles.sectionLabel} />
    <View style={styles.evolutionRow}>
      <SkeletonBox style={skeletonStyles.evolutionCard} />
      <SkeletonBox style={skeletonStyles.evolutionCard} />
      <SkeletonBox style={skeletonStyles.evolutionCard} />
    </View>
  </View>
);

interface DetailContentProps {
  detail: PokemonDetail;
  accentColor: string;
  onEvolutionPress: (stage: EvolutionStage) => void;
}

const DetailContent = ({ detail, accentColor, onEvolutionPress }: DetailContentProps) => (
  <View>
    {detail.description !== null && <Text style={styles.description}>{detail.description}</Text>}

    <View style={styles.measuresRow}>
      <MeasureBox label="Altura" value={formatMeters(detail.heightMeters)} />
      <MeasureBox label="Peso" value={formatKilograms(detail.weightKilograms)} />
    </View>

    {detail.abilities.length > 0 && (
      <>
        <Text style={styles.sectionTitle}>Habilidades</Text>
        <View style={styles.chipsRow}>
          {detail.abilities.map((ability) => (
            <View key={ability} style={styles.abilityChip}>
              <Text style={styles.abilityLabel}>{ability}</Text>
            </View>
          ))}
        </View>
      </>
    )}

    {detail.weaknesses.length > 0 && (
      <>
        <Text style={styles.sectionTitle}>Débil contra</Text>
        <View style={styles.chipsRow}>
          {detail.weaknesses.map((type) => (
            <TypeBadge key={type} type={type} style={styles.weaknessBadge} />
          ))}
        </View>
      </>
    )}

    {detail.evolutionChain.length > 1 && (
      <>
        <Text style={styles.sectionTitle}>Evolución</Text>
        <View style={styles.evolutionRow}>
          {detail.evolutionChain.map((stage) => {
            const isCurrent = stage.id === detail.id;
            return (
              <Pressable
                key={stage.id}
                accessibilityRole="button"
                accessibilityLabel={
                  isCurrent
                    ? `${formatName(stage.name)}, Pokémon actual`
                    : `Ver detalle de ${formatName(stage.name)}`
                }
                onPress={() => onEvolutionPress(stage)}
                style={({ pressed }) => [
                  styles.evolutionCard,
                  isCurrent && {
                    borderColor: accentColor,
                    backgroundColor: getSoftTypeColor(detail.types[0]),
                  },
                  pressed && !isCurrent && styles.pressed,
                ]}
              >
                <Image
                  source={{ uri: stage.imageUrl }}
                  style={styles.evolutionImage}
                  resizeMode="contain"
                  accessibilityIgnoresInvertColors
                />
                <Text style={styles.evolutionName} numberOfLines={1}>
                  {formatName(stage.name)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </>
    )}

    <Text style={styles.sectionTitle}>Estadísticas base</Text>
    {detail.stats.map((stat) => (
      <StatBar key={stat.name} name={stat.name} value={stat.baseValue} color={accentColor} />
    ))}
  </View>
);

const MeasureBox = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.measureBox} accessible accessibilityLabel={`${label}: ${value}`}>
    <Text style={styles.measureLabel}>{label.toUpperCase()}</Text>
    <Text style={styles.measureValue}>{value}</Text>
  </View>
);

const HERO_IMAGE_SIZE = 170;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
  },
  hero: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: palette.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#101828',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  pressed: {
    opacity: 0.6,
  },
  backIcon: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: palette.textPrimary,
    marginTop: -2,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: spacing.xl,
  },
  heroInfo: {
    flex: 1,
    paddingBottom: spacing.lg,
  },
  heroNumber: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: palette.textSecondary,
  },
  heroName: {
    fontSize: fontSize.xxl,
    fontWeight: '800',
    color: palette.textPrimary,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  heroTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  typeBadge: {
    marginRight: spacing.sm,
    marginBottom: spacing.xs,
  },
  heroImage: {
    width: HERO_IMAGE_SIZE,
    height: HERO_IMAGE_SIZE,
    marginBottom: -spacing.xl,
    zIndex: 1,
  },
  heroImageFallback: {
    borderRadius: HERO_IMAGE_SIZE / 2,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  sheet: {
    flexGrow: 1,
    backgroundColor: palette.surface,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  description: {
    fontSize: fontSize.md,
    lineHeight: 22,
    color: palette.textPrimary,
    marginBottom: spacing.lg,
  },
  measuresRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  measureBox: {
    flex: 1,
    backgroundColor: palette.background,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  measureLabel: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: palette.textSecondary,
  },
  measureValue: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: palette.textPrimary,
    marginTop: spacing.xs,
  },
  sectionTitle: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: palette.textSecondary,
    textTransform: 'uppercase',
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.lg,
  },
  abilityChip: {
    backgroundColor: palette.surface,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  abilityLabel: {
    fontSize: fontSize.sm,
    color: palette.textPrimary,
    fontWeight: '600',
  },
  weaknessBadge: {
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  evolutionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  evolutionCard: {
    width: '30%',
    backgroundColor: palette.background,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  evolutionImage: {
    width: 72,
    height: 72,
  },
  evolutionName: {
    marginTop: spacing.sm,
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: palette.textPrimary,
  },
});

const skeletonStyles = StyleSheet.create({
  textLine: {
    height: 14,
    width: '100%',
    marginBottom: spacing.sm,
  },
  textLineShort: {
    height: 14,
    width: '65%',
    marginBottom: spacing.lg,
  },
  measureBox: {
    flex: 1,
    height: 76,
    borderRadius: radius.lg,
  },
  sectionLabel: {
    height: 12,
    width: 110,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  chip: {
    height: 30,
    width: 88,
    borderRadius: radius.pill,
    marginRight: spacing.sm,
  },
  evolutionCard: {
    width: '30%',
    height: 116,
    borderRadius: radius.lg,
  },
});
