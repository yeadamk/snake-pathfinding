// agent.js
'use strict'

import { getLastInputDirection } from "./events.js";
import { getGridSize } from "./grid.js";

let lastAgentDirection = { x: 0, y: 0 };
const lastInputDirection = getLastInputDirection();

// Currently works with even GRID_SIZE only
export function getAgentDirection(snakeBody) {
  const GRID_SIZE = getGridSize();
  const FRUIT_LOCATION = getFruitLocation();

  const agentDirection = bruteForce(snakeBody);

  lastAgentDirection = agentDirection;
  return agentDirection;
}

export function getLastAgentDirection() {
  return lastAgentDirection;
}

function goUp() {
  if (lastInputDirection.y !== 0) return;
  return { x: 0, y: -1 };
}

function goDown() {
  if (lastInputDirection.y !== 0) return;
  return { x: 0, y: 1 };
}

function goLeft() {
  if (lastInputDirection.x !== 0) return;
  return { x: -1, y: 0 };
}

function goRight() {
  if (lastInputDirection.x !== 0) return;
  return { x: 1, y: 0 };
}

async function getFruitLocation() {
  // Wait for the fruit element to be created
  const fruitElement = await new Promise(() => {
    document.querySelector('.apple');
  });
  
  let x = fruitElement.style.gridColumnStart;
  let y = fruitElement.style.gridRowStart;

  return {x, y};
}

function bruteForce(snakeBody) {
  const GRID_SIZE = getGridSize();
  let agentDirection = { x: 0, y: 0 };

  // First column
  if(snakeBody[0].x === 1) {
    if(snakeBody[0].y === GRID_SIZE) {
      agentDirection = goRight();
    }
    else {
      agentDirection = goDown();
    }
  }

  // Last column
  if(snakeBody[0].x === GRID_SIZE) {
    if(snakeBody[0].y === 1) {
      agentDirection = goLeft();
    }
    else {
      agentDirection = goUp();
    }
  }

  // First row
  if(snakeBody[0].y === 1) {
    if(snakeBody[0].x === 1) {
      agentDirection = goDown();
    }
    else {
      agentDirection = goLeft();
    }
  }

  // Others
  if(!(snakeBody[0].x === 1 || // NOT FIRST COLUMN
       snakeBody[0].x === GRID_SIZE || // NOT LAST COLUMN
       snakeBody[0].y === 1)) // NOT FIRST ROW
  {
    // Even columns
    if((snakeBody[0].x % 2) === 0) {

      // Second rows
      if(snakeBody[0].y  === 2) {
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
      if(snakeBody[0].y  === GRID_SIZE) {
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