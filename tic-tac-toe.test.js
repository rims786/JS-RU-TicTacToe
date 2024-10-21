const { Board, TicTacToe, GameError } = require('./tic-tac-toe');

describe('Tic Tac Toe Board', () => {
    let board;

    beforeEach(() => {
        board = new Board();
    });

    test('should initialize with empty cells', () => {
        expect(board.cells.every(cell => cell === '')).toBe(true);
    });

    test('should make a valid move', () => {
        board.makeMove(0, 'X');
        expect(board.cells[0]).toBe('X');
    });

    test('should throw error for invalid move', () => {
        expect(() => board.makeMove(9, 'X')).toThrow(GameError);
    });

    test('should detect a winner', () => {
        board.cells = ['X', 'X', 'X', '', '', '', '', '', ''];
        expect(board.checkWinner()).toBe(true);
    });

    test('should detect a full board', () => {
        board.cells = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
        expect(board.isFull()).toBe(true);
    });
});