<template>
  <div id="app" class="p-2 md:p-4 md:pt-8">
    <main-navigation
      v-if="showMainNav"
      @close="showMainNav = false"
    />
    <div class="container mx-auto">
      <div class="flex items-center justify-between md:mb-12">
        <div>
          <h1 class="font-heading mr-2 pt-2 text-gray-800 text-2xl md:text-4xl inline-block">Bimaru</h1>
        </div>
        <button
          @click="showMainNav = true"
          class="text-gray-800"
        >
          <svg class="fill-current w-8 h-8 md:w-10 md:h-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path class="heroicon-ui shadow-lg" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"/>
          </svg>
        </button>
      </div>

      <active-game-panel
        v-if="panel === 'activeGame'"
        :game="game"
        :completed-ships="completedShips"
      />

      <new-game-panel
        v-show="panel === 'newGame'"
      />
    </div>
  </div>
</template>

<script>
    import ActiveGamePanel from './components/ActiveGamePanel';
    import MainNavigation from './components/MainNavigation';
    import NewGamePanel from './components/NewGamePanel';

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
            hasActiveGame() {
                return this.game.hasOwnProperty('id');
            },
        },
        methods: {
            newGame(size) {
                this.$store.dispatch('newGame', this.getNewGame(size));
                this.panel = 'activeGame';
            },
            getNewGame(size) {
                const games = this.$store.getters.gamesBySize(size);

                return games[0];
            },
        },
        created() {
            if (this.hasActiveGame) {
                this.panel = 'activeGame';
            }

            this.$root.$on('app.new_game', (size) => {
                this.newGame(size);
            });

            this.$root.$on('app.toggle_panel', (panel) => {
                this.panel = panel;
            });
        },
    };
</script>

<style src="../css/styles.css">
