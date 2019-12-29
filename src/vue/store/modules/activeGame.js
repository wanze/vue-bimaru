const clone = object => JSON.parse(JSON.stringify(object));

export default {
    namespaced: true,
    state: {
        game: {},
        board: [],
        completedShips: {},
        undoStack: [],
        redoStack: [],
        isSolved: false,
    },
    getters: {
        game: state => state.game,
        board: state => state.board,
        completedShips: state => state.completedShips,
        undoStack: state => state.undoStack,
        redoStack: state => state.redoStack,
        canUndo: state => state.undoStack.length > 0,
        canRedo: state => state.redoStack.length > 0,
        canReset: (state, getters) => getters.canUndo || getters.canRedo,
        isSolved: state => state.isSolved,
    },
    mutations: {
        setBoard(state, board) {
            state.board = board;
        },
        setGame(state, game) {
            state.game = clone(game);
        },
        undo(state) {
            state.redoStack.push(clone(state.board));
            state.board = state.undoStack.pop();
        },
        redo(state) {
            state.undoStack.push(clone(state.board));
            state.board = state.redoStack.pop();
        },
        updateUndoStack(state) {
            state.undoStack.push(clone(state.board));
        },
        setCompletedShips(state, completedShips) {
            state.completedShips = completedShips;
        },
        setSolved(state, isSolved) {
            state.isSolved = isSolved;
        },
        clear(state) {
            state.board = [];
            state.undoStack = [];
            state.redoStack = [];
            state.completedShips = {};
            state.isSolved = false;
        },
    },
    actions: {
        saveBoard({ commit, dispatch }, board) {
            commit('updateUndoStack');
            commit('setBoard', board);
            dispatch('detectCompletedShips');
            dispatch('checkIfSolved');
        },
        undo({ getters, commit, dispatch }) {
            if (getters.canUndo) {
                commit('undo');
                dispatch('detectCompletedShips');
            }
        },
        redo({ getters, commit, dispatch }) {
            if (getters.canRedo) {
                commit('redo');
                dispatch('detectCompletedShips');
            }
        },
        reset({ commit, dispatch }) {
            commit('clear');
            dispatch('initBoard');
        },
        newGame({ commit, dispatch }, game) {
            commit('clear');
            commit('setGame', game);
            dispatch('initBoard');
        },
        initBoard({ commit, getters }) {
            const board = [];

            // Initialize board with empty cells.
            for (let x = 0; x < getters.game.size; x++) {
                for (let y = 0; y < getters.game.size; y++) {
                    board.push({ x: x, y: y, type: 'empty' });
                }
            }

            // Fill puzzle cells.
            getters.game.puzzle.forEach((puzzleCell) => {
                const cell = board.find(cell => cell.x === puzzleCell.x && cell.y === puzzleCell.y);
                cell.type = puzzleCell.type;
            });

            commit('setBoard', board);
        },
        detectCompletedShips({ commit, getters }) {
            const shipSizes = getters.game.ships.map(ship => ship.size);
            const maxShipSize = Math.max(...shipSizes);
            const completedShips = {};

            for (let i = 1; i <= maxShipSize; i++) {
                completedShips[i] = 0;
            }

            const singleShips = getters.board.filter(cell => cell.type === 'ship_single');
            completedShips[1] = singleShips.length;

            // Find horizontal and vertical ships of size >= 2.
            const shipStartingCells = getters.board.filter(
                cell => cell.type === 'ship_top' || cell.type === 'ship_left',
            );

            shipStartingCells.forEach((startCell) => {
                const isHorizontal = startCell.type === 'ship_left';
                const isVertical = startCell.type === 'ship_top';

                for (let shipSize = 2; shipSize <= maxShipSize; shipSize++) {
                    for (let index = 1; index < shipSize; index++) {
                        const x = isVertical ? startCell.x + index : startCell.x;
                        const y = isHorizontal ? startCell.y + index : startCell.y;

                        const cell = getters.board.find(cell => cell.x === x && cell.y === y);
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

            commit('setCompletedShips', completedShips);
        },
        checkIfSolved({ getters, commit }) {
            // As long as we have empty cell, we are not finished.
            if (getters.board.filter(cell => cell.type === 'empty').length) {
                return false;
            }

            // Compare cells with the solution. Any cells not present in the solution must be of type water.
            for (let cell of getters.board) {
                const solutionCell = getters.game.solution.find(
                    solutionCell => solutionCell.x === cell.x && solutionCell.y === cell.y
                );
                if (solutionCell && cell.type !== solutionCell.type) {
                    commit('setSolved', false);
                } else if (!solutionCell && cell.type !== 'water') {
                    commit('setSolved', false);
                }
            }

            commit('setSolved', true);
        }
    },
};
