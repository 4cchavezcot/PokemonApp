import { create } from 'zustand';

import { DEFAULT_PAGE_SIZE, GetPokemonPageUseCase } from '@application/use-cases/GetPokemonPageUseCase';
import { PokemonSummary } from '@domain/entities/Pokemon';
import { container } from '@di/container';

import { getFriendlyErrorMessage } from '../utils/errorMessages';

export type ListStatus = 'idle' | 'loading' | 'refreshing' | 'loadingMore' | 'success' | 'error';

export interface PokemonListState {
  items: PokemonSummary[];
  status: ListStatus;
  errorMessage: string | null;
  nextOffset: number | null;
  totalCount: number;
  loadFirstPage: () => Promise<void>;
  refresh: () => Promise<void>;
  loadNextPage: () => Promise<void>;
}

export const createPokemonListStore = (getPokemonPage: GetPokemonPageUseCase) =>
  create<PokemonListState>((set, get) => ({
    items: [],
    status: 'idle',
    errorMessage: null,
    nextOffset: 0,
    totalCount: 0,

    loadFirstPage: async () => {
      const { status } = get();
      if (status === 'loading') return;
      set({ status: 'loading', errorMessage: null });
      try {
        const page = await getPokemonPage.execute(0, DEFAULT_PAGE_SIZE);
        set({
          items: [...page.items],
          nextOffset: page.nextOffset,
          totalCount: page.totalCount,
          status: 'success',
        });
      } catch (error) {
        set({ status: 'error', errorMessage: getFriendlyErrorMessage(error) });
      }
    },

    refresh: async () => {
      const { status } = get();
      if (status === 'refreshing' || status === 'loading') return;
      set({ status: 'refreshing', errorMessage: null });
      try {
        const page = await getPokemonPage.execute(0, DEFAULT_PAGE_SIZE);
        set({
          items: [...page.items],
          nextOffset: page.nextOffset,
          totalCount: page.totalCount,
          status: 'success',
        });
      } catch (error) {        
        set({ status: 'success', errorMessage: getFriendlyErrorMessage(error) });
      }
    },

    loadNextPage: async () => {
      const { status, nextOffset, items } = get();
      if (status !== 'success' || nextOffset === null) return;
      set({ status: 'loadingMore' });
      try {
        const page = await getPokemonPage.execute(nextOffset, DEFAULT_PAGE_SIZE);
        const known = new Set(items.map((item) => item.id));
        const newItems = page.items.filter((item) => !known.has(item.id));
        set({ items: [...items, ...newItems], nextOffset: page.nextOffset, status: 'success' });
      } catch (error) {
        set({ status: 'success', errorMessage: getFriendlyErrorMessage(error) });
      }
    },
  }));

export const usePokemonListStore = createPokemonListStore(container.getPokemonPage);
