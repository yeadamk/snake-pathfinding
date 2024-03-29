// grid.js
'use strict'

/*
 * Settings
 */
const GRID_SIZE = 16; // MUST BE EVEN TO USE HAMILTONIAN 

export function getRandomGridPosition() {
  return [
    Math.floor(Math.random() * GRID_SIZE) + 1, 
    Math.floor(Math.random() * GRID_SIZE) + 1
  ];
}

export function outsideGrid(position) {
  return (
    (position[0] < 1) || (position[0] > GRID_SIZE) ||
    (position[1] < 1) || (position[1] > GRID_SIZE)
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