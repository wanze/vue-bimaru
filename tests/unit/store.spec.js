import store from '../../src/vue/store';

const dummyGame1 = {
    id: 'dummy-1',
};

const dummyGame2 = {
    id: 'dummy-2',
};

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

    store.dispatch('finishedGame', dummyGame1);
    store.dispatch('finishedGame', dummyGame2);

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
