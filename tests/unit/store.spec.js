import StoreStorage from '../../src/js/services/StoreStorage';

// Mock the StoreStorage service.
jest.mock('../../src/js/services/StoreStorage');

import store from '../../src/vue/store';

beforeEach(() => {
    StoreStorage.mockClear();
});

it('returns the available sizes', () => {
    const games = [
        { size: 8 },
        { size: 9 },
        { size: 9 },
        { size: 10 },
        { size: 10 },
        { size: 10 },
    ];

    store.commit('setGames', games);

    expect(store.getters.availableSizes).toEqual([8, 9, 10]);
});

it('stores played games', () => {
    expect(store.getters.playedGames).toEqual([]);

    const game1 = { id: 'dummy-1' };
    const game2 = { id: 'dummy-2'};

    store.dispatch('finishedGame', game1);
    store.dispatch('finishedGame', game2);

    expect(store.getters.playedGames).toEqual(['dummy-1', 'dummy-2']);
});

it('returns the next game', () => {
    const game1 = { size: 9, id: '9-1' };
    const game2 = { size: 9, id: '9-2' };
    const game3 = { size: 9, id: '9-3' };

    store.commit('setGames', [game1, game2, game3]);

    store.dispatch('finishedGame', game1);
    expect(store.getters.nextNewGame(9)).toEqual(game2);

    store.dispatch('finishedGame', game2);
    expect(store.getters.nextNewGame(9)).toEqual(game3);

    store.dispatch('finishedGame', game3);
    expect(store.getters.nextNewGame(9).id).toMatch(/^9-(1|2|3)$/)
});

it('persists the state', () => {
    store.dispatch('persistState', new StoreStorage());

    const storeStorageMock = StoreStorage.mock.instances[0];
    const storeStorageSaveAppState = storeStorageMock.saveAppState;
    expect(storeStorageSaveAppState).toHaveBeenCalledTimes(1);
});

it('loads the state', () => {
    store.dispatch('loadState', new StoreStorage());

    const storeStorageMock = StoreStorage.mock.instances[0];
    const storeStorageLoadAppState = storeStorageMock.loadAppState;
    expect(storeStorageLoadAppState).toHaveBeenCalledTimes(1);
});
