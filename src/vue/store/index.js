import Vue from 'vue';
import Vuex from 'vuex';
import activeGame from './modules/activeGame';
import games from './games';

Vue.use(Vuex);

export default new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    modules: {
        activeGame: activeGame,
    },
    state: {
        currentGame: null,
        games: games,
        playedGames: [],
    },
    getters: {
        games: state => state.games,
        playedGames: state => state.playedGames,
        currentGame: state => state.currentGame,
        gamesBySize: state => size => state.games.filter(game => game.size === size),
        availableSizes: state => [...new Set(state.games.map(game => game.size))],
        nextNewGame: (state, getters) => (size) => {
            // Remove already played games and the current game from the available games.
            const games = getters.gamesBySize(size);
            const candidates = games.filter((game) => {
                if (getters.currentGame && getters.currentGame.id === game.id) {
                    return false;
                }

                return !getters.playedGames.includes(game.id);
            });

            if (candidates.length) {
                return candidates[0];
            }

            return games[Math.floor(Math.random() * games.length)];
        },
    },
    mutations: {
        updatePlayedGames(state, game) {
            if (!state.playedGames.includes(game.id)) {
                state.playedGames.push(game.id);
            }
        },
        setCurrentGame(state, game) {
            state.currentGame = game;
        },
        setGames(state, games) {
            state.games = games;
        },
        loadState(state, storeStorage) {
            this.replaceState(Object.assign(state, storeStorage.loadAppState()));
        },
    },
    actions: {
        newGame({ commit, dispatch }, game) {
            commit('setCurrentGame', game);
            dispatch('activeGame/newGame', game);
        },
        finishedGame({ commit }, game) {
            commit('updatePlayedGames', game);
        },
        loadState({ commit }, storeStorage) {
            commit('loadState', storeStorage);
        },
        persistState({ state }, storeStorage) {
            storeStorage.saveAppState(state);
        },
    },
});
