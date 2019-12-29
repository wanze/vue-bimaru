<template>
  <div class="flex flex-col">
    <div class="flex mb-6 justify-center md:justify-start items-center md:w-2/3 lg:w-1/2">
      <v-button
        class="mr-2"
        title="Undo"
        type="icon"
        @click="undo()"
        :disabled="!canUndo"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path class="heroicon-ui" style="fill: currentColor;" d="M14.7 15.3a1 1 0 0 1-1.4 1.4l-4-4a1 1 0 0 1 0-1.4l4-4a1 1 0 0 1 1.4 1.4L11.42 12l3.3 3.3z"/></svg>
      </v-button>
      <v-button
        @click="redo()"
        type="icon"
        title="Redo"
        :disabled="!canRedo"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path class="heroicon-ui" style="fill: currentColor;" d="M9.3 8.7a1 1 0 0 1 1.4-1.4l4 4a1 1 0 0 1 0 1.4l-4 4a1 1 0 0 1-1.4-1.4l3.29-3.3-3.3-3.3z"/></svg>
      </v-button>
    </div>
    <div class="flex flex-col md:flex-row">
      <div class="flex justify-center w-full md:justify-start md:w-2/3 lg:w-1/2 mb-8" data-game-board-container>
        <game-board
          :game="game"
          :board="board"
          :max-board-width="boardWidth"
        />
      </div>
      <div class="w-full md:w-auto flex flex-col items-center">
        <h2 class="mb-8 font-heading text-gray-800 text-xl md:text-2xl">Hidden Ships</h2>
        <ships-legend
          :ships="game.ships"
          :cell-size="30"
          :completed-ships="completedShips"
        />
      </div>
    </div>
  </div>
</template>

<script>
    import GameBoard from './GameBoard.vue';
    import ShipsLegend from './ShipsLegend';
    import Button from './Button';

    export default {
        name: 'ActiveGamePanel',
        components: {
            'v-button': Button,
            GameBoard,
            ShipsLegend,
        },
        props: {
            game: {
                type: Object,
                required: true,
            },
            completedShips: {
                type: Object,
                required: true,
            },
        },
        data() {
            return {
                boardWidth: 600,
            };
        },
        created() {
            this.$root.$on('gameboard.updated', (board) => {
                this.$store.dispatch('activeGame/saveBoard', board);
            });
        },
        mounted() {
            this.calculateMaxBoardWidth();

            let resizeTimer;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => {
                    this.calculateMaxBoardWidth();
                }, 250);
            });
        },
        computed: {
            board() {
                return JSON.parse(JSON.stringify(this.$store.getters['activeGame/board']));
            },
            canUndo() {
                return this.$store.getters['activeGame/canUndo'];
            },
            canRedo() {
                return this.$store.getters['activeGame/canRedo'];
            },
            canReset() {
                return this.$store.getters['activeGame/canReset'];
            },
            isSolved() {
                return this.$store.getters['activeGame/isSolved'];
            },
        },
        methods: {
            calculateMaxBoardWidth() {
                const $container = this.$el.querySelector('[data-game-board-container]');
                this.boardWidth = Math.min($container.clientWidth, 600);
            },
            undo() {
                this.$store.dispatch('activeGame/undo');
            },
            redo() {
                this.$store.dispatch('activeGame/redo');
            },
        },
    };
</script>
