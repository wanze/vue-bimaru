<template>
  <div id="app" class="p-4 md:pt-8">
    <main-navigation
      v-show="showMainNav"
      @close="showMainNav = false"
    />
    <div class="container mx-auto">
      <div class="flex items-center justify-between mb-4 md:mb-12">
        <div>
          <h1 class="font-heading mr-2 pt-2 text-gray-800 text-2xl md:text-4xl inline-block">Bimaru</h1>
        </div>
        <button
          @click="showMainNav = true"
          class="w-6 text-gray-700 hover:text-gray-900"
        >
          <div class="border border-gray-700 mb-1 hover:border-gray-900"></div>
          <div class="border border-blue-700 mb-1 hover:border-gray-900"></div>
          <div class="border border-gray-700 mb-1 hover:border-gray-900"></div>
          <div class="border border-blue-700 mb-1 hover:border-gray-900"></div>
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
