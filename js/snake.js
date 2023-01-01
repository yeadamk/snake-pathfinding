// snake.js
'use strict'

import { getInputDirection, isAutomateOn } from './events.js';
import { getGridSize } from './grid.js';
import { getAgentDirection, getLastAgentDirection } from './agent.js'

/*
 * Settings
 */
export const SNAKE_SPEED = 40; // SNAKE_SPEED PER SECOND


/*
 * Initial conditions
 */
const snakeBody = [
  {x: 2, y: 2} // Starting position
];
let newSegments = 0;
let inputDirection = 0;

// Update function
export function update(delta) {
  if(!delta) return;

  addSegments();

  // Updates snake body
  for (let i = snakeBody.length - 2; i >= 0; i--) {
    // Body follows the block in front (e.g. head)
    snakeBody[i + 1] = { ...snakeBody[i] };
  }
  
  // Updates snake head
  if(isAutomateOn()) {
    inputDirection = getAgentDirection(snakeBody);
  } else {
    inputDirection = getInputDirection();

    if(inputDirection.x === 0 && inputDirection.y === 0) {
      inputDirection = getLastAgentDirection();
    }
  }

  snakeBody[0].x += inputDirection.x; // * delta;
  snakeBody[0].y += inputDirection.y; // * delta;

  // Handle border collisions
  const GRID_SIZE = getGridSize();
  if(snakeBody[0].x < 1) {
    snakeBody[0].x = GRID_SIZE;
  }
  if(snakeBody[0].x > GRID_SIZE) {
      snakeBody[0].x = 1;
  }
  if(snakeBody[0].y < 1) {
      snakeBody[0].y = GRID_SIZE;
  }
  if(snakeBody[0].y > GRID_SIZE) {
      snakeBody[0].y = 1;
  }
}

// Draw function
export function draw(gameBoard) {
  snakeBody.forEach((snake, index) => {
    const snakeContainer = document.createElement('div');
    const snakeElement = document.createElement('div');
    snakeContainer.style.gridRowStart = snake.y;
    snakeContainer.style.gridColumnStart = snake.x;

    if (index === 0) {
      snakeElement.classList.add('snake-head');
    } else {
      snakeElement.classList.add('snake-body');
    }

    snakeContainer.classList.add('snake');

    gameBoard.appendChild(snakeContainer);
    snakeContainer.appendChild(snakeElement);
  });
}

export function expandSnake(amount) {
  newSegments += amount;
}

export function onSnake(position, { ignoreHead = false } = {}) {
  return snakeBody.some((segment, index) => {
    if (ignoreHead && index === 0) {return false};
    return equalPositions(segment, position);
  })
}

export function getSnakeHead() {
  return snakeBody[0];
}

export function snakeIntersection() {
  return onSnake(snakeBody[0], { ignoreHead: true });
}

function equalPositions(pos1, pos2) {
  return (pos1.x === pos2.x) && (pos1.y === pos2.y);
}

function addSegments() {
  for (let i = 0; i < newSegments; i++) {
    snakeBody.push({ ...snakeBody[snakeBody.length - 1] })
  };

  newSegments = 0;
}
