import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItemInfo,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PokemonSummary } from '@domain/entities/Pokemon';

import { PokemonCard } from '../components/PokemonCard';
import { SearchBar } from '../components/SearchBar';
import { SkeletonCard } from '../components/Skeleton';
import { EmptyState, ErrorState } from '../components/StatusViews';
import { HomeScreenProps } from '../navigation/types';
import { usePokemonListStore } from '../state/pokemonListStore';
import { palette } from '../theme/colors';
import { fontSize, spacing } from '../theme/metrics';
import { formatPokedexNumber } from '../utils/format';

const SKELETON_PLACEHOLDERS = Array.from({ length: 8 }, (_, index) => index);

const matchesQuery = (pokemon: PokemonSummary, query: string): boolean => {
  const normalized = query.trim().toLowerCase();
  if (normalized.length === 0) return true;
  return (
    pokemon.name.toLowerCase().includes(normalized) ||
    formatPokedexNumber(pokemon.id).includes(normalized) ||
    String(pokemon.id) === normalized.replace(/^#?0*/, '')
  );
};

export const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const {
    items,
    status,
    errorMessage,
    nextOffset,
    totalCount,
    loadFirstPage,
    loadNextPage,
    refresh,
  } = usePokemonListStore();
  const [query, setQuery] = useState('');

  useEffect(() => {
    void loadFirstPage();
  }, [loadFirstPage]);

  const filteredItems = useMemo(
    () => items.filter((pokemon) => matchesQuery(pokemon, query)),
    [items, query],
  );
  const isSearching = query.trim().length > 0;

  const handleSelect = useCallback(
    (pokemon: PokemonSummary) => {
      navigation.navigate('Detail', {
        id: pokemon.id,
        name: pokemon.name,
        primaryType: pokemon.types[0],
        imageUrl: pokemon.imageUrl,
      });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<PokemonSummary>) => (
      <PokemonCard pokemon={item} onPress={handleSelect} />
    ),
    [handleSelect],
  );

  const keyExtractor = useCallback((item: PokemonSummary) => String(item.id), []);

  const handleEndReached = useCallback(() => {
    if (!isSearching) void loadNextPage();
  }, [isSearching, loadNextPage]);

  const isFirstLoad = status === 'loading' || (status === 'idle' && items.length === 0);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title} accessibilityRole="header">
          Pokédex
        </Text>
        <Text style={styles.subtitle}>
          {totalCount > 0 ? `${totalCount} Pokémon disponibles` : 'Encuentra a tu Pokémon favorito'}
        </Text>
      </View>

      <SearchBar value={query} onChangeText={setQuery} />

      {isFirstLoad ? (
        <FlatList
          data={SKELETON_PLACEHOLDERS}
          renderItem={() => <SkeletonCard />}
          keyExtractor={(item) => `skeleton-${item}`}
          contentContainerStyle={styles.listContent}
          scrollEnabled={false}
        />
      ) : status === 'error' ? (
        <ErrorState message={errorMessage ?? ''} onRetry={() => void loadFirstPage()} />
      ) : filteredItems.length === 0 ? (
        <EmptyState
          message={
            isSearching ? `No hay resultados para "${query.trim()}".` : 'No hay Pokémon para mostrar.'
          }
        />
      ) : (
        <>
          {errorMessage !== null && (
            <Text style={styles.inlineError} accessibilityLiveRegion="polite">
              {errorMessage}
            </Text>
          )}
          <FlatList
            data={filteredItems}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.4}
            refreshControl={
              <RefreshControl
                refreshing={status === 'refreshing'}
                onRefresh={() => void refresh()}
                tintColor={palette.primary}
                colors={[palette.primary]}
              />
            }
            ListFooterComponent={
              status === 'loadingMore' ? (
                <ActivityIndicator style={styles.footer} color={palette.primary} />
              ) : nextOffset === null && !isSearching ? (
                <Text style={styles.endOfList}>Has visto todos los Pokémon 🎉</Text>
              ) : null
            }
            initialNumToRender={8}
            maxToRenderPerBatch={10}
            windowSize={7}
            removeClippedSubviews
          />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '800',
    color: palette.textPrimary,
  },
  subtitle: {
    marginTop: spacing.xs,
    fontSize: fontSize.md,
    color: palette.textSecondary,
  },
  listContent: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  inlineError: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    color: palette.danger,
    fontSize: fontSize.sm,
  },
  footer: {
    marginVertical: spacing.lg,
  },
  endOfList: {
    textAlign: 'center',
    color: palette.textSecondary,
    marginVertical: spacing.lg,
    fontSize: fontSize.sm,
  },
});
