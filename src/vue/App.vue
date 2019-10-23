<template>
  <div id="app" class="p-4 md:pt-8">
    <div class="container mx-auto">
      <div class="flex items-center justify-between md:justify-start mb-4 md:mb-12">
        <h1 class="font-heading mr-6 pt-2 text-gray-800 text-2xl md:text-4xl">Bimaru</h1>
        <v-button
          type="primary"
          @click="showNewGameModal = true"
        >
          New Game
        </v-button>
      </div>
      <active-game
        v-if="game"
        :game="game"
      ></active-game>

      <modal
        v-if="showNewGameModal"
        @close="showNewGameModal = false"
      >
        <div class="font-heading text-2xl text-center">Difficulty</div>

        <div class="flex flex-col mt-8 items-center">
          <v-button type="primary" class="mb-3" @click="newGame('easy')">Easy</v-button>
          <v-button type="primary" class="mb-3" @click="newGame('medium')">Medium</v-button>
          <v-button type="primary" class="mb-3" @click="newGame('hard')">Hard</v-button>
        </div>
      </modal>
    </div>
  </div>
</template>

<script>
    import ActiveGame from './components/ActiveGame';
    import Modal from './components/Modal';
    import Button from './components/Button';

    export default {
        name: 'app',
        components: {
            'v-button': Button,
            Modal,
            ActiveGame,
        },
        data() {
            return {
                showNewGameModal: false,
                game: this.getRandomGame('easy'),
            };
        },
        methods: {
            newGame(difficulty) {
                this.game = this.getRandomGame(difficulty);
                this.showNewGameModal = false;
            },
            getRandomGame(difficulty) {
                const games = this.$store.getters.games.filter(game => game.difficulty === difficulty);

                return games[Math.floor(Math.random() * games.length)];
            }
        },
        created() {
        },
    };
</script>

<style src="../css/styles.css">
