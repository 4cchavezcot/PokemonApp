import { GetPokemonPageUseCase } from '@application/use-cases/GetPokemonPageUseCase';
import { PokemonPage, PokemonSummary } from '@domain/entities/Pokemon';
import { DomainError } from '@domain/errors/DomainError';
import { PokemonTypeName } from '@domain/enums/PokemonTypeName';

import { createPokemonListStore } from '../pokemonListStore';

const makePokemon = (id: number): PokemonSummary => ({
  id,
  name: `pokemon-${id}`,
  imageUrl: null,
  types: [PokemonTypeName.Normal],
});

const makePage = (ids: number[], nextOffset: number | null): PokemonPage => ({
  items: ids.map(makePokemon),
  totalCount: 1302,
  nextOffset,
});

const makeUseCase = () =>
  ({ execute: jest.fn() }) as unknown as jest.Mocked<GetPokemonPageUseCase>;

describe('pokemonListStore (listado)', () => {
  it('carga la primera página y queda en estado success', async () => {
    const useCase = makeUseCase();
    useCase.execute.mockResolvedValue(makePage([1, 2], 20));
    const store = createPokemonListStore(useCase);

    await store.getState().loadFirstPage();

    expect(store.getState().status).toBe('success');
    expect(store.getState().items).toHaveLength(2);
  });

  it('queda en estado error con un mensaje amigable si la API falla', async () => {
    const useCase = makeUseCase();
    useCase.execute.mockRejectedValue(DomainError.network());
    const store = createPokemonListStore(useCase);

    await store.getState().loadFirstPage();

    expect(store.getState().status).toBe('error');
    expect(store.getState().errorMessage).not.toBeNull();
  });

  it('agrega la página siguiente al hacer scroll (paginación)', async () => {
    const useCase = makeUseCase();
    useCase.execute
      .mockResolvedValueOnce(makePage([1, 2], 20))
      .mockResolvedValueOnce(makePage([3, 4], null));
    const store = createPokemonListStore(useCase);

    await store.getState().loadFirstPage();
    await store.getState().loadNextPage();

    expect(store.getState().items.map((p) => p.id)).toEqual([1, 2, 3, 4]);
    expect(store.getState().nextOffset).toBeNull();
  });
});
