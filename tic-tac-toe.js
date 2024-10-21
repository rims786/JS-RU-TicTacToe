/**
 * Tic Tac Toe Game
 * 
 * This program implements a Tic Tac Toe game using JavaScript, HTML, and CSS.
 * It follows SOLID principles and includes features for scalability, error handling, and testing.
 * 
 * @author Rahim uddin
 * @version 1.0
 */

// Game state and constants
const EMPTY = '';
const PLAYER_X = 'X';
const PLAYER_O = 'O';
const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

/**
 * Custom error for game-related exceptions
 */
class GameError extends Error {
    constructor(message) {
        super(message);
        this.name = "GameError";
    }
}

/**
 * Represents the Tic Tac Toe game board
 */
class Board {
    constructor() {
        this.cells = Array(9).fill(EMPTY);
    }

    /**
     * Make a move on the board
     * @param {number} index - The cell index (0-8)
     * @param {string} player - The player making the move (X or O)
     * @throws {GameError} If the move is invalid
     */
    makeMove(index, player) {
        if (index < 0 || index > 8) {
            throw new GameError("Invalid cell index");
        }
        if (this.cells[index] !== EMPTY) {
            throw new GameError("Cell already occupied");
        }
        this.cells[index] = player;
    }

    /**
     * Check if the board has a winning combination
     * @returns {boolean} True if there's a winner, false otherwise
     */
    checkWinner() {
        return WINNING_COMBINATIONS.some(combo => 
            this.cells[combo[0]] !== EMPTY &&
            this.cells[combo[0]] === this.cells[combo[1]] &&
            this.cells[combo[0]] === this.cells[combo[2]]
        );
    }

    /**
     * Check if the board is full
     * @returns {boolean} True if the board is full, false otherwise
     */
    isFull() {
        return this.cells.every(cell => cell !== EMPTY);
    }

    /**
     * Reset the board
     */
    reset() {
        this.cells = Array(9).fill(EMPTY);
    }
}

/**
 * Represents the Tic Tac Toe game
 */
class TicTacToe {
    constructor() {
        this.board = new Board();
        this.currentPlayer = PLAYER_X;
        this.gameStatus = 'stopped'; // 'stopped', 'running', 'paused'
        this.initializeUI();
    }

    /**
     * Initialize the game UI
     */
    initializeUI() {
        this.boardElement = document.getElementById('board');
        this.statusElement = document.getElementById('status');
        this.startButton = document.getElementById('startBtn');
        this.pauseButton = document.getElementById('pauseBtn');
        this.quitButton = document.getElementById('quitBtn');

        this.startButton.addEventListener('click', () => this.startGame());
        this.pauseButton.addEventListener('click', () => this.pauseGame());
        this.quitButton.addEventListener('click', () => this.quitGame());

        this.renderBoard();
    }

    /**
     * Render the game board
     */
    renderBoard() {
        this.boardElement.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i;
            cell.textContent = this.board.cells[i];
            cell.addEventListener('click', () => this.handleCellClick(i));
            this.boardElement.appendChild(cell);
        }
    }

    /**
     * Handle a cell click event
     * @param {number} index - The index of the clicked cell
     */
    handleCellClick(index) {
        if (this.gameStatus !== 'running') return;

        try {
            this.board.makeMove(index, this.currentPlayer);
            this.renderBoard();

            if (this.board.checkWinner()) {
                this.endGame(`Player ${this.currentPlayer} wins!`);
            } else if (this.board.isFull()) {
                this.endGame("It's a draw!");
            } else {
                this.currentPlayer = this.currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;
                this.updateStatus(`Player ${this.currentPlayer}'s turn`);
            }
        } catch (error) {
            if (error instanceof GameError) {
                this.updateStatus(error.message);
            } else {
                console.error("Unexpected error:", error);
                this.updateStatus("An unexpected error occurred");
            }
        }
    }

    /**
     * Start or resume the game
     */
    startGame() {
        if (this.gameStatus === 'stopped') {
            this.board.reset();
            this.currentPlayer = PLAYER_X;
            this.gameStatus = 'running';
            this.updateStatus(`Game started. Player ${this.currentPlayer}'s turn`);
            this.renderBoard();
        } else if (this.gameStatus === 'paused') {
            this.gameStatus = 'running';
            this.updateStatus(`Game resumed. Player ${this.currentPlayer}'s turn`);
        }
    }

    /**
     * Pause the game
     */
    pauseGame() {
        if (this.gameStatus === 'running') {
            this.gameStatus = 'paused';
            this.updateStatus('Game paused');
        }
    }

    /**
     * Quit the game
     */
    quitGame() {
        if (confirm('Are you sure you want to quit the game?')) {
            this.gameStatus = 'stopped';
            this.board.reset();
            this.renderBoard();
            this.updateStatus('Game quit');
        }
    }

    /**
     * End the game
     * @param {string} message - The end game message
     */
    endGame(message) {
        this.gameStatus = 'stopped';
        this.updateStatus(message);
    }

    /**
     * Update the game status message
     * @param {string} message - The status message
     */
    updateStatus(message) {
        this.statusElement.textContent = message;
        console.log(`Game Status: ${message}`); // Simple logging
    }
}

// Initialize the game when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});
