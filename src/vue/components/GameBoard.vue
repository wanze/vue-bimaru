<template>
  <div
    @keyup="updateCellFocus($event)"
    tabindex="0"
  >
    <div class="flex">
      <div class="game-board shadow-xl">
        <div
          v-for="x in game.size"
          :key="'row' + x"
          class="row flex bg-white"
        >
          <a
            v-for="y in game.size"
            :key="x + '-' + y"
            href="#"
            class="cell border-r border-b border-gray-600"
            :data-cell="(x - 1) + '-' + (y - 1)"
            :data-x="x - 1"
            :data-y="y - 1"
            :class="{ 'border-l' : y === 1 , 'border-t' : x === 1}"
            :aria-label="getCellLabel(x - 1, y - 1)"
            @click.prevent="onCellClick(x - 1, y - 1)"
          >
            <cell
              :size="cellSize"
              :type="getCellType(x - 1, y - 1)"
              :is-muted="isPuzzleCell(x - 1, y - 1)"
              :x="x - 1"
              :y="y - 1 "
            >
            </cell>
          </a>
        </div>
      </div>
      <div class="flex flex-col">
        <a
          v-for="x in game.size"
          :key="'rowcount' + x"
          class="text-center text-gray-700"
          :style="countStyle"
          href="#"
          @click.prevent="onRowCountClick(x - 1)"
        >
          {{ game.shipsRows[x - 1] }}
        </a>
      </div>
    </div>
    <div class="flex">
      <a
        v-for="y in game.size"
        :key="'columncount-' + y"
        class="count text-center text-gray-700"
        :style="countStyle"
        href="#"
        @click="onColumnCountClick(y - 1)"
      >
        {{ game.shipsColumns[y - 1] }}
      </a>
    </div>
  </div>
</template>

<script>
    import Cell from './Cell';

    export default {
        name: 'GameBoard',
        components: { Cell },
        props: {
            game: {
                type: Object,
                required: true,
            },
            maxBoardWidth: {
                type: Number,
                default: 600,
            },
            board: {
                type: Array,
                required: true,
            }
        },
        computed: {
            countStyle() {
                const size = this.cellSize + 1;

                return `width: ${size}px; height: ${size}px; line-height: ${size}px;`;
            },
            cellSize() {
                return Math.round(this.maxBoardWidth / (this.game.size + 1));
            }
        },
        methods: {
            onCellClick(x, y) {
                if (this.isPuzzleCell(x, y)) {
                    return;
                }

                const cell = this.getCell(x, y);
                cell.type = this.getNextCellType(cell.type);

                // Check if we can update the type of the clicked cell based on its neighbours.
                this.updateCell(cell);

                // Also check if we can update any of the 8 neighbours of the clicked cell.
                this.updateNeighbours(cell);

                // Let parent components know that we have updated the board.
                this.emitBoardUpdatedEvent();
            },
            updateNeighbours(cell) {
                this.get8Neighbours(cell.x, cell.y).forEach((neighbour) => {
                    this.updateCell(neighbour);
                });
            },
            updateCell(cell) {
                // Bail if the cell is in the puzzle or if it is not of type ship.
                if (this.isPuzzleCell(cell.x, cell.y) || !this.isShipCellType(cell.type)) {
                    return;
                }

                const neighbours = this.get4Neighbours(cell.x, cell.y);
                const waterNeighbours = neighbours.filter(cell => cell.type === 'water');

                // When completely surrounded by water, the cell is a single ship.
                if (waterNeighbours.length === neighbours.length) {
                    cell.type = 'ship_single';
                    return;
                }

                // When surrounded by water except on one side, we know the direction of the ship.
                if (waterNeighbours.length === neighbours.length - 1) {
                    const otherCell = neighbours.find(cell => cell.type !== 'water');

                    if (otherCell.y > cell.y && otherCell.x === cell.x) {
                        cell.type = 'ship_left';
                    } else if (otherCell.y === cell.y && otherCell.x > cell.x) {
                        cell.type = 'ship_top';
                    } else if (otherCell.x === cell.x && otherCell.y < cell.y) {
                        cell.type = 'ship_right';
                    } else {
                        cell.type = 'ship_bottom';
                    }
                } else {
                    // When surrounded by two or more ships, the cell should be a "middle" ship.
                    cell.type = 'ship';
                }
            },
            getCellLabel(x, y) {
                const type = this.getCellType(x, y);

                const labels = {
                    'empty': 'Empty',
                    'water': 'Water',
                    'ship': 'Ship middle',
                    'ship_left': 'Ship left',
                    'ship_right': 'Ship right',
                    'ship_top': 'Ship top',
                    'ship_bottom': 'Ship bottom',
                    'ship_single': 'Single ship',
                };

                return labels[type];
            },
            getNextCellType(type) {
                const nextTypes = {
                    'empty': 'water',
                    'water': 'ship',
                    'ship': 'empty',
                    'ship_left': 'empty',
                    'ship_top': 'empty',
                    'ship_right': 'empty',
                    'ship_bottom': 'empty',
                    'ship_single': 'empty',
                };

                return nextTypes[type];
            },
            isShipCellType(type) {
                return type.startsWith('ship');
            },
            isPuzzleCell(x, y) {
                const cell = this.game.puzzle.find(cell => cell.x === x && cell.y === y);

                return cell !== undefined;
            },
            getCell(x, y) {
                return this.board.find(cell => cell.x === x && cell.y === y);
            },
            getCellType(x, y) {
                const cell = this.getCell(x, y);

                return cell.type;
            },
            get4Neighbours(x, y) {
                return this.board.filter((cell) => {
                    return (cell.x === x && cell.y === (y - 1))
                        || (cell.x === (x - 1) && cell.y === y)
                        || (cell.x === x && cell.y === (y + 1))
                        || (cell.x === (x + 1) && cell.y === y);
                });
            },
            get8Neighbours(x, y) {
                return this.board.filter((cell) => {
                    return cell.x >= (x - 1) && cell.x <= (x + 1)
                        && cell.y >= (y - 1) && cell.y <= (y + 1)
                        && (cell.x !== x || cell.y !== y);
                });
            },
            onRowCountClick(rowIndex) {
                if (this.game.shipsRows[rowIndex] === 0) {
                    this.board
                        .filter(cell => cell.x === rowIndex)
                        .forEach((cell) => {
                            cell.type = 'water';
                            this.updateNeighbours(cell);
                        });
                    this.emitBoardUpdatedEvent();
                }
            },
            onColumnCountClick(colIndex) {
                if (this.game.shipsColumns[colIndex] === 0) {
                    this.board
                        .filter(cell => cell.y === colIndex)
                        .forEach((cell) => {
                            cell.type = 'water';
                            this.updateNeighbours(cell);
                        });
                    this.emitBoardUpdatedEvent();
                }
            },
            emitBoardUpdatedEvent() {
                const board = JSON.parse(JSON.stringify(this.board));
                this.$root.$emit('gameboard.updated', board);
            },
            updateCellFocus(event) {
                const keys = ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'];
                if (!keys.includes(event.key)) {
                    return;
                }

                const $target = event.target;
                if (!('cell' in $target.dataset)) {
                    return;
                }

                const x = parseInt($target.dataset.x);
                const y = parseInt($target.dataset.y);

                let nextCell = null;
                if (event.key === 'ArrowUp') {
                    nextCell = this.getCell(x - 1, y);
                } else if (event.key === 'ArrowRight') {
                    nextCell = this.getCell(x, y + 1);
                } else if (event.key === 'ArrowDown') {
                    nextCell = this.getCell(x + 1, y);
                } else if (event.key === 'ArrowLeft') {
                    nextCell = this.getCell(x, y - 1);
                }

                if (!nextCell) {
                    return;
                }

                this.$nextTick(() => {
                    const $nextCell = this.$el.querySelector(`[data-cell="${nextCell.x}-${nextCell.y}"]`);
                    if ($nextCell) {
                        $nextCell.focus();
                    }
                });
            },
        },
    };
</script>
