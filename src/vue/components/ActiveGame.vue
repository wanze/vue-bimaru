<template>
  <div class="flex flex-col">
    <div class="flex mb-6 justify-center md:justify-start">
      <v-button
        class="mr-2"
        type="icon"
        title="Undo"
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
          :v-if="initialized"
          :game="game"
          :board="board"
          :max-board-width="boardWidth"
        ></game-board>
      </div>
      <div class="w-full md:w-auto flex flex-col items-center">
        <h2 class="mb-8 font-heading text-gray-800 text-xl md:text-2xl">Hidden Ships</h2>
        <ships-legend
          :ships="game.ships"
          :cell-size="30"
          :completed-ships="completedShips"
        ></ships-legend>
      </div>
    </div>
    <modal
      v-if="showCompletedModal"
      @close="showCompletedModal = false"
    >
      <div class="font-heading text-2xl text-center">Congratulations! :)</div>
    </modal>
  </div>
</template>

<script>
    import GameBoard from './GameBoard.vue';
    import ShipsLegend from './ShipsLegend';
    import Button from './Button';
    import Modal from './Modal';

    export default {
        name: 'ActiveGame',
        components: {
            Modal,
            'v-button': Button,
            GameBoard,
            ShipsLegend,
        },
        props: {
            game: {
                type: Object,
                required: true,
            },
        },
        data() {
            return {
                boardWidth: 600,
                completedShips: {},
                initialized: false,
                showCompletedModal: false,
            };
        },
        created() {
            this.initGame();
            this.$root.$on('gameboard.updated', (board) => {
                this.$store.commit('saveBoard', board);
                this.detectCompletedShips();
            });
        },
        watch: {
            game() {
                this.initGame();
            },
            isCompleted: function(completed) {
                if (completed) {
                    this.showCompletedModal = true;
                }
            },
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
                return JSON.parse(JSON.stringify(this.$store.getters.board));
            },
            canUndo() {
                return this.$store.getters.undoStack.length > 0;
            },
            canRedo() {
                return this.$store.getters.redoStack.length > 0;
            },
            isCompleted() {
                // As long as we have empty cell, we are not finished.
                if (this.board.filter(cell => cell.type === 'empty').length) {
                    return false;
                }

                // Compare cells with the solution. Any cells not present in the solution must be of type water.
                for (let cell of this.board) {
                    const solutionCell = this.game.solution.find(solutionCell => solutionCell.x === cell.x && solutionCell.y === cell.y);
                    if (solutionCell && cell.type !== solutionCell.type) {
                        return false;
                    } else if (!solutionCell && cell.type !== 'water') {
                        return false;
                    }
                }

                return true;
            },
        },
        methods: {
            initGame() {
                this.initialized = false;

                const board = [];

                // Initialize board with empty cells.
                for (let x = 0; x < this.game.size; x++) {
                    for (let y = 0; y < this.game.size; y++) {
                        board.push({ x: x, y: y, type: 'empty' });
                    }
                }

                // Fill puzzle cells.
                this.game.puzzle.forEach((puzzleCell) => {
                    const cell = board.find(cell => cell.x === puzzleCell.x && cell.y === puzzleCell.y);
                    cell.type = puzzleCell.type;
                });

                // this.game.solution.forEach((puzzleCell) => {
                //     const cell = board.find(cell => cell.x === puzzleCell.x && cell.y === puzzleCell.y);
                //     cell.type = puzzleCell.type;
                // });

                this.$store.commit('clear');
                this.$store.commit('initBoard', board);
                this.initialized = true;
            },
            calculateMaxBoardWidth() {
                const $container = this.$el.querySelector('[data-game-board-container]');
                this.boardWidth = Math.min($container.clientWidth, 600);
            },
            undo() {
                this.$store.commit('undo');
                this.detectCompletedShips();
            },
            redo() {
                this.$store.commit('redo');
                this.detectCompletedShips();
            },
            detectCompletedShips() {
                const shipSizes = this.game.ships.map(ship => ship.size);
                const maxShipSize = Math.max(...shipSizes);
                const completedShips = {};

                for (let i = 1; i <= maxShipSize; i++) {
                    completedShips[i] = 0;
                }

                const singleShips = this.board.filter(cell => cell.type === 'ship_single');
                completedShips[1] = singleShips.length;

                // Find horizontal and vertical ships of size >= 2.
                const shipStartingCells = this.board.filter(
                    cell => cell.type === 'ship_top' || cell.type === 'ship_left',
                );

                shipStartingCells.forEach((startCell) => {
                    const isHorizontal = startCell.type === 'ship_left';
                    const isVertical = startCell.type === 'ship_top';

                    for (let shipSize = 2; shipSize <= maxShipSize; shipSize++) {
                        for (let index = 1; index < shipSize; index++) {
                            const x = isVertical ? startCell.x + index : startCell.x;
                            const y = isHorizontal ? startCell.y + index : startCell.y;

                            const cell = this.board.find(cell => cell.x === x && cell.y === y);
                            // Bail if we do not get a cell when traversing out of the game board.
                            if (!cell) {
                                break;
                            }

                            // The last iteration needs to be an ending ship matching the direction.
                            if (index === shipSize - 1) {
                                if (isHorizontal && cell.type === 'ship_right' || isVertical && cell.type === 'ship_bottom') {
                                    completedShips[shipSize] += 1;
                                    break;
                                }
                            }

                            // Any other cells between the start/end cells need to be of type ship.
                            if (cell.type !== 'ship') {
                                break;
                            }
                        }
                    }
                });

                this.completedShips = completedShips;
            },
        },
    };
</script>
