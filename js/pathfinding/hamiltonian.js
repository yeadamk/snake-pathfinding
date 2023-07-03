// hamiltonian.js
'use strict'

import { goUp, goDown, goLeft, goRight } from "../agent.js";
import { getGridSize } from "../grid.js";

// The Hamiltonian cycle method -- brute force
// Only works with even grid sizes
export function HamiltonianCycle(snakeBody) {
  const GRID_SIZE = getGridSize();
  let agentDirection;

  // First column
  if(snakeBody[0][0] === 1) {
    if(snakeBody[0][1] === GRID_SIZE) {
      agentDirection = goRight();
    }
    else {
      agentDirection = goDown();
    }
  }

  // Last column
  if(snakeBody[0][0] === GRID_SIZE) {
    if(snakeBody[0][1] === 1) {
      agentDirection = goLeft();
    }
    else {
      agentDirection = goUp();
    }
  }

  // First row
  if(snakeBody[0][1] === 1) {
    if(snakeBody[0][0] === 1) {
      agentDirection = goDown();
    }
    else {
      agentDirection = goLeft();
    }
  }

  // Others
  if(!(snakeBody[0][0] === 1 || // NOT FIRST COLUMN
        snakeBody[0][0] === GRID_SIZE || // NOT LAST COLUMN
        snakeBody[0][1] === 1)) // NOT FIRST ROW
  {
    // Even columns
    if((snakeBody[0][0] % 2) === 0) {

      // Second rows
      if(snakeBody[0][1]  === 2) {
        agentDirection = goRight();
      }
      // All other rows
      else {
        agentDirection = goUp();
      }
    }
    // Odd columns 
    else {
      // Bottom rows
      if(snakeBody[0][1]  === GRID_SIZE) {
        agentDirection = goRight();
      }
      // All other rows
      else {
        agentDirection = goDown();
      }
    }
  }

  return agentDirection;
}