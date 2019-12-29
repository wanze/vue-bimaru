import store from '../../src/vue/store';

const dummyGame1 = {
    id: 'dummy-1',
};

const dummyGame2 = {
    id: 'dummy-2',
};

it('stores played games', () => {
    expect(store.getters.playedGames).toEqual([]);

    store.dispatch('finishedGame', dummyGame1);
    store.dispatch('finishedGame', dummyGame2);

    expect(store.getters.playedGames).toEqual(['dummy-1', 'dummy-2']);
});
