<template>
  <div
    id="app"
    class="flex flex-col min-h-screen"
  >
    <main-navigation
      v-if="showMainNav"
      @close="showMainNav = false"
    />
    <div class="container mx-auto p-2 md:p-4 md:pt-8 flex-grow">
      <div class="flex items-center justify-between md:mb-12">
        <div>
          <h1 class="font-heading mr-2 pt-2 text-gray-800 text-2xl md:text-4xl inline-block">Bimaru</h1>
        </div>
        <button
          @click="showMainNav = true"
          class="text-gray-800"
        >
          <svg class="fill-current w-8 h-8 md:w-10 md:h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
               width="24" height="24">
            <path class="heroicon-ui shadow-lg"
                  d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"/>
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
    <footer
      class="md:bg-gray-300 text-gray-600 md:text-gray-700 text-xs mt-4"
    >
      <div class="container mx-auto px-4 py-2 md:py-8">
        <div class="flex justify-between md:justify-start">
          <div class="flex flex-col md:flex-row">
            <div v-if="game">
              Current puzzle: <span class="font-semibold">{{ game.id }}</span>
            </div>

            <div class="text-gray-500 inline-block px-2 hidden md:block">/</div>

            <div>
              Puzzles by <a class="font-semibold underline hover:no-underline"
                            href="https://krazydad.com">krazydad.com</a>
            </div>

            <div class="text-gray-500 inline-block px-2 hidden md:block">/</div>
          </div>
          <div class="flex flex-col md:flex-row">
            <div>
              Made with <span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="inline-block mr-1 w-5 h-5"><path class="heroicon-ui fill-current" d="M12.76 3.76a6 6 0 0 1 8.48 8.48l-8.53 8.54a1 1 0 0 1-1.42 0l-8.53-8.54a6 6 0 0 1 8.48-8.48l.76.75.76-.75zm7.07 7.07a4 4 0 1 0-5.66-5.66l-1.46 1.47a1 1 0 0 1-1.42 0L9.83 5.17a4 4 0 1 0-5.66 5.66L12 18.66l7.83-7.83z"/></svg></span>by <a href="https://twitter.com/schtifu" class="font-semibold underline hover:no-underline">Stifu</a>
            </div>

            <div class="text-gray-500 inline-block px-2 hidden md:block">/</div>

            <div>
              <span><svg xmlns="http://www.w3.org/2000/svg" class="inline-block mr-1 w-5 h-5" viewBox="0 0 24 24" width="24" height="24"><path class="heroicon-ui fill-current" d="M20.59 12l-3.3-3.3a1 1 0 1 1 1.42-1.4l4 4a1 1 0 0 1 0 1.4l-4 4a1 1 0 0 1-1.42-1.4l3.3-3.3zM3.4 12l3.3 3.3a1 1 0 0 1-1.42 1.4l-4-4a1 1 0 0 1 0-1.4l4-4a1 1 0 0 1 1.42 1.4L3.4 12zm7.56 8.24a1 1 0 0 1-1.94-.48l4-16a1 1 0 1 1 1.94.48l-4 16z"/></svg></span>
              Fork me on <a href="https://github.com/wanze/vue-bimaru" class="font-semibold underline hover:no-underline">GitHub</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
    import ActiveGamePanel from './components/ActiveGamePanel';
    import MainNavigation from './components/MainNavigation';
    import NewGamePanel from './components/NewGamePanel';
    import StoreStorage from '../js/services/StoreStorage';

    const storeStorage = new StoreStorage();

    export default {
        name: 'app',
        components: {
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
