// grid.js
'use strict'

/*
 * Settings
 */
const GRID_SIZE = 6; // MUST BE EVEN TO USE AUTOMODE

export function getRandomGridPosition() {
  return {
    x: Math.floor(Math.random() * GRID_SIZE) + 1,
    y: Math.floor(Math.random() * GRID_SIZE) + 1
  };
}

export function outsideGrid(position) {
  return (
    (position.x < 1) || (position.x > GRID_SIZE) ||
    (position.y < 1) || (position.y > GRID_SIZE)
  );
}

export function setupGrid(gameBoard) {
  gameBoard.parentElement.style.display = 'block';
  gameBoard.style.gridTemplateRows = `repeat(${GRID_SIZE}, 1fr)`;
  gameBoard.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 1fr)`;
}

export function getGridSize() {
  return GRID_SIZE;
}