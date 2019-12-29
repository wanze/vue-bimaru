import store from '../../src/vue/store';

/**
 The dummy Bimaru game used in the tests.

 Solution:           Puzzle:             Legend:
 L  M  M  R  4       L  .  M  .  4       L = Left ship
 ~  ~  ~  ~  0       .  .  .  .  0       T = Top ship
 S  ~  T  ~  2       .  ~  .  .  2       R = Right ship
 ~  ~  B  ~  1       .  .  .  .  1       B = Bottom ship
 2  1  2  0          2  1  2  0          S = Single ship
 ~ = Water
 **/

const dummyGame = {
    difficulty: 'easy',
    id: 'test',
    size: 4,
    puzzle: [
        { x: 0, y: 0, type: 'ship_left' },
        { x: 0, y: 2, type: 'ship' },
        { x: 2, y: 1, type: 'water' },
    ],
    solution: [
        { x: 0, y: 0, type: 'ship_left' },
        { x: 0, y: 1, type: 'ship' },
        { x: 0, y: 2, type: 'ship' },
        { x: 0, y: 3, type: 'ship_right' },
        { x: 2, y: 0, type: 'ship_single' },
        { x: 2, y: 2, type: 'ship_top' },
        { x: 3, y: 2, type: 'ship_bottom' },
    ],
    shipRows: [4, 0, 2, 1],
    shipColumns: [2, 1, 2, 0],
    ships: [
        { size: 1, count: 1 },
        { size: 2, count: 1 },
        { size: 4, count: 1 },
    ],
};

// The initial board when starting a new game.
const initialBoard = [
    { x: 0, y: 0, type: 'ship_left' },
    { x: 0, y: 1, type: 'empty' },
    { x: 0, y: 2, type: 'ship' },
    { x: 0, y: 3, type: 'empty' },
    { x: 1, y: 0, type: 'empty' },
    { x: 1, y: 1, type: 'empty' },
    { x: 1, y: 2, type: 'empty' },
    { x: 1, y: 3, type: 'empty' },
    { x: 2, y: 0, type: 'empty' },
    { x: 2, y: 1, type: 'water' },
    { x: 2, y: 2, type: 'empty' },
    { x: 2, y: 3, type: 'empty' },
    { x: 3, y: 0, type: 'empty' },
    { x: 3, y: 1, type: 'empty' },
    { x: 3, y: 2, type: 'empty' },
    { x: 3, y: 3, type: 'empty' },
];

beforeEach(() => {
    store.dispatch('activeGame/newGame', dummyGame);
});

it('initializes a new game', () => {
    const game = store.getters['activeGame/game'];
    const board = store.getters['activeGame/board'];
    const completedShips = store.getters['activeGame/completedShips'];
    const undoStack = store.getters['activeGame/undoStack'];
    const redoStack = store.getters['activeGame/redoStack'];
    const canUndo = store.getters['activeGame/canUndo'];
    const canRedo = store.getters['activeGame/canRedo'];
    const canReset = store.getters['activeGame/canReset'];

    expect(game).toEqual(dummyGame);
    expect(board).toEqual(initialBoard);
    expect(completedShips).toEqual({});
    expect(undoStack).toEqual([]);
    expect(redoStack).toEqual([]);
    expect(canUndo).toBeFalsy();
    expect(canRedo).toBeFalsy();
    expect(canReset).toBeFalsy();
});

it('saves the current board', () => {
    const currentBoard = [
        { x: 0, y: 0, type: 'ship_left' },
        { x: 0, y: 1, type: 'ship' },
        { x: 0, y: 2, type: 'ship' },
        { x: 0, y: 3, type: 'ship_right' },
        { x: 2, y: 1, type: 'water' },
    ];

    store.dispatch('activeGame/saveBoard', currentBoard);

    const board = store.getters['activeGame/board'];
    const undoStack = store.getters['activeGame/undoStack'];
    const redoStack = store.getters['activeGame/redoStack'];
    const canUndo = store.getters['activeGame/canUndo'];
    const canRedo = store.getters['activeGame/canRedo'];
    const canReset = store.getters['activeGame/canReset'];

    expect(board).toEqual(currentBoard);
    expect(undoStack).toEqual([initialBoard]);
    expect(redoStack).toEqual([]);
    expect(canUndo).toBeTruthy();
    expect(canRedo).toBeFalsy();
    expect(canReset).toBeTruthy();
});

it('is possible to undo and redo', () => {
    // Change cell [3,3] to water.
    const currentBoard = JSON.parse(JSON.stringify(initialBoard));
    const cell = currentBoard.find(cell => cell.x === 3 && cell.y === 3);
    cell.type = 'water';

    store.dispatch('activeGame/saveBoard', currentBoard);
    expect(store.getters['activeGame/board']).toEqual(currentBoard);

    store.dispatch('activeGame/undo');
    expect(store.getters['activeGame/board']).toEqual(initialBoard);

    store.dispatch('activeGame/redo');
    expect(store.getters['activeGame/board']).toEqual(currentBoard);
});

it('detects completed ships', () => {
    const currentBoard = [
        { x: 0, y: 0, type: 'ship_left' },
        { x: 0, y: 1, type: 'ship' },
        { x: 0, y: 2, type: 'ship' },
        { x: 0, y: 3, type: 'ship_right' },
        { x: 2, y: 0, type: 'ship_single' },
        { x: 2, y: 1, type: 'water' },
    ];

    store.dispatch('activeGame/saveBoard', currentBoard);

    const completedShips = store.getters['activeGame/completedShips'];

    expect(completedShips).toEqual({
        1: 1,
        2: 0,
        3: 0,
        4: 1,
    });
});

it('detects when the game is solved', () => {
    expect(store.getters['activeGame/isSolved']).toBeFalsy();

    const completedBoard = [];
    for (let x = 0; x < dummyGame.size; x++) {
        for (let y = 0; y < dummyGame.size; y++) {
            const solutionCell = dummyGame.solution.find(cell => cell.x === x && cell.y === y);
            completedBoard.push({ x: x, y: y, type: solutionCell ? solutionCell.type : 'water' });
        }
    }

    store.dispatch('activeGame/saveBoard', completedBoard);

    expect(store.getters['activeGame/isSolved']).toBeTruthy();
});

it('resets a game', () => {
    const currentBoard = [
        { x: 0, y: 0, type: 'ship_left' },
        { x: 0, y: 1, type: 'ship' },
        { x: 0, y: 2, type: 'ship' },
        { x: 0, y: 3, type: 'ship_right' },
        { x: 2, y: 0, type: 'ship_single' },
        { x: 2, y: 1, type: 'water' },
    ];

    store.dispatch('activeGame/saveBoard', currentBoard);
    store.dispatch('activeGame/reset');

    const board = store.getters['activeGame/board'];
    const canReset = store.getters['activeGame/canReset'];

    expect(board).toEqual(initialBoard);
    expect(canReset).toBeFalsy();
});
