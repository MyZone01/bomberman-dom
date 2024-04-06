export const gameBoard = document.getElementById('game-board')
const GRID_SIZE = 16

// Define the game board as a 2D array
export const board = [
    // 'V' for void cell, 'B' for indestructible block, 'W' for destructible wall
    ['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B'],
    ['B', 'V', 'W', 'W', 'W', 'W', 'W', 'W', 'B', 'W', 'W', 'V', 'V', 'V', 'V', 'B'],
    ['B', 'V', 'B', 'W', 'B', 'W', 'B', 'V', 'W', 'W', 'B', 'W', 'B', 'V', 'V', 'B'],
    ['B', 'V', 'V', 'V', 'W', 'V', 'V', 'V', 'B', 'V', 'V', 'V', 'V', 'V', 'V', 'B'],
    ['B', 'V', 'B', 'W', 'B', 'W', 'B', 'V', 'V', 'V', 'B', 'W', 'B', 'V', 'W', 'B'],
    ['B', 'W', 'W', 'W', 'W', 'B', 'V', 'W', 'B', 'W', 'W', 'W', 'W', 'V', 'W', 'B'],
    ['B', 'W', 'B', 'W', 'B', 'V', 'V', 'V', 'V', 'W', 'B', 'W', 'B', 'V', 'W', 'B'],
    ['B', 'W', 'W', 'W', 'V', 'V', 'B', 'V', 'V', 'V', 'W', 'V', 'V', 'V', 'W', 'B'],
    ['B', 'W', 'B', 'W', 'B', 'V', 'W', 'V', 'B', 'W', 'B', 'V', 'B', 'W', 'W', 'B'],
    ['B', 'V', 'V', 'V', 'V', 'V', 'B', 'W', 'W', 'V', 'V', 'V', 'W', 'W', 'W', 'B'],
    ['B', 'V', 'V', 'W', 'V', 'B', 'W', 'W', 'W', 'W', 'V', 'B', 'W', 'W', 'V', 'B'],
    ['B', 'V', 'W', 'W', 'W', 'V', 'B', 'V', 'W', 'V', 'V', 'V', 'B', 'V', 'V', 'B'],
    ['B', 'V', 'B', 'W', 'B', 'V', 'V', 'V', 'B', 'V', 'W', 'V', 'W', 'V', 'W', 'B'],
    ['B', 'V', 'W', 'W', 'W', 'V', 'B', 'V', 'V', 'V', 'W', 'V', 'V', 'V', 'W', 'B'],
    ['B', 'V', 'V', 'V', 'V', 'V', 'V', 'W', 'V', 'V', 'V', 'W', 'W', 'V', 'V', 'B'],
    ['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B'],
];