import { create } from 'zustand';

import { GetPokemonDetailUseCase } from '@application/use-cases/GetPokemonDetailUseCase';
import { PokemonDetail } from '@domain/entities/Pokemon';
import { container } from '@di/container';

import { getFriendlyErrorMessage } from '../utils/errorMessages';

export type DetailStatus = 'loading' | 'success' | 'error';

export interface DetailEntry {
  status: DetailStatus;
  detail: PokemonDetail | null;
  errorMessage: string | null;
}

export interface PokemonDetailState {
  entries: Record<number, DetailEntry>;
  loadDetail: (id: number) => Promise<void>;
}

const loadingEntry: DetailEntry = { status: 'loading', detail: null, errorMessage: null };

export const createPokemonDetailStore = (getPokemonDetail: GetPokemonDetailUseCase) =>
  create<PokemonDetailState>((set, get) => ({
    entries: {},

    loadDetail: async (id: number) => {
      const existing = get().entries[id];
      if (existing?.status === 'loading' || existing?.status === 'success') return;

      set((state) => ({ entries: { ...state.entries, [id]: loadingEntry } }));
      try {
        const detail = await getPokemonDetail.execute(id);
        set((state) => ({
          entries: { ...state.entries, [id]: { status: 'success', detail, errorMessage: null } },
        }));
      } catch (error) {
        set((state) => ({
          entries: {
            ...state.entries,
            [id]: { status: 'error', detail: null, errorMessage: getFriendlyErrorMessage(error) },
          },
        }));
      }
    },
  }));

export const usePokemonDetailStore = createPokemonDetailStore(container.getPokemonDetail);
