<template>
  <div
    id="app"
    class="flex flex-col min-h-screen"
  >
    <main-navigation
      v-if="showMainNav"
      @close="showMainNav = false"
    />
    <div class="container mx-auto p-2 flex-grow">
      <div class="flex items-center justify-between md:mb-12">
        <div>
          <h1
            class="font-heading mr-2 pt-2 text-gray-800 text-2xl md:text-4xl"
          >
            Battleships
          </h1>
        </div>
        <button
          @click="showMainNav = true"
        >
          <svg class="w-8 h-8 md:w-10 md:h-10" width="20" height="20" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <g id="menu" transform="translate(1.000000, 3.000000)" fill-rule="nonzero">
                <path
                  d="M1,0 L17,0 C17.5522847,0 18,0.44771525 18,1 C18,1.55228475 17.5522847,2 17,2 L1,2 C0.44771525,2 0,1.55228475 0,1 C0,0.44771525 0.44771525,0 1,0 Z"
                  id="Path" fill="#2D3748"/>
                <path
                  d="M1,6 L17,6 C17.5522847,6 18,6.44771525 18,7 C18,7.55228475 17.5522847,8 17,8 L1,8 C0.44771525,8 0,7.55228475 0,7 C0,6.44771525 0.44771525,6 1,6 Z"
                  id="Path" fill="#2B6CB0"/>
                <path
                  d="M1,12 L17,12 C17.5522847,12 18,12.4477153 18,13 C18,13.5522847 17.5522847,14 17,14 L1,14 C0.44771525,14 0,13.5522847 0,13 C0,12.4477153 0.44771525,12 1,12 Z"
                  id="Path" fill="#2D3748"/>
              </g>
          </svg>
        </button>
      </div>

      <active-game-panel
        v-if="panel === 'activeGame' && game"
        :game="game"
        :completed-ships="completedShips"
      />

      <new-game-panel
        v-show="panel === 'newGame'"
      />

    </div>
    <app-footer :game="game"/>
  </div>
</template>

<script>
    import ActiveGamePanel from './components/ActiveGamePanel';
    import MainNavigation from './components/MainNavigation';
    import NewGamePanel from './components/NewGamePanel';
    import StoreStorage from '../js/services/StoreStorage';
    import AppFooter from './components/AppFooter';

    const storeStorage = new StoreStorage();

    export default {
        name: 'app',
        components: {
            AppFooter,
            NewGamePanel,
            MainNavigation,
            ActiveGamePanel,
        },
        data() {
            return {
                showMainNav: false,
                panel: 'newGame',
            };
        },
        computed: {
            game() {
                return this.$store.getters['activeGame/game'];
            },
            completedShips() {
                return this.$store.getters['activeGame/completedShips'];
            },
        },
        methods: {
            newGame(size) {
                const game = this.getNextNewGame(size);
                this.$store.dispatch('newGame', game);
                this.persistState();
                this.panel = 'activeGame';
            },
            getNextNewGame(size) {
                return this.$store.getters.nextNewGame(size);
            },
            persistState() {
                this.$store.dispatch('persistState', storeStorage);
            },
        },
        beforeCreate() {
            this.$store.dispatch('loadState', storeStorage);
        },
        created() {
            if (this.game) {
                this.panel = 'activeGame';
            }

            this.$root.$on('app.new_game', (size) => {
                this.newGame(size);
            });

            this.$root.$on('app.finished_game', (game) => {
                this.$store.dispatch('finishedGame', game);
                this.persistState();
            });

            this.$root.$on('app.toggle_panel', (panel) => {
                this.panel = panel;
            });

            this.$root.$on('gameboard.updated', (board) => {
                this.$store.dispatch('activeGame/saveBoard', board);
                this.persistState();
            });
        },
    };
</script>

<style src="../css/styles.css">
