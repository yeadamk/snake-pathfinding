// fruit.js
'use strict'

import { onSnake, expandSnake } from './snake.js'
import { getRandomGridPosition } from './grid.js'
import { AudioEngine } from "./audio.js";
import { AudioLibrary } from "./audioLibrary.js";

let fruit = getRandomFoodPosition();
const EXPANSION_RATE = 1;
let score = 0;

export function update() {
  if (onSnake(fruit)) {
    expandSnake(EXPANSION_RATE);
    fruit = getRandomFoodPosition();

    // Play sound
    const fruitEatingSound = AudioEngine.loadAudio(AudioLibrary.GAME_SNAKE_FRUIT);
    AudioEngine.playAudio(fruitEatingSound);

    // Increment score
    animateScoreboard();
    score++;
  }
}

export function draw(gameBoard) {
  const foodElement = document.createElement('div');
  foodElement.style.gridRowStart = fruit.y;
  foodElement.style.gridColumnStart = fruit.x;
  foodElement.classList.add('apple');
  gameBoard.appendChild(foodElement);
}

export function getScore() {
  return score;
}

function getRandomFoodPosition() {
  let newFoodPosition;
  while (newFoodPosition == null || onSnake(newFoodPosition)) {
    newFoodPosition = getRandomGridPosition();
  }
  return newFoodPosition;
}

function animateScoreboard() {
  const scoreBoard = document.querySelector('#score-board');

  scoreBoard.classList.add('.score-board-increment-effect');
  scoreBoard.firstElementChild.classList.add('.score-text-increment-effect');

  setTimeout(() => {
    scoreBoard.classList.remove('.score-board-increment-effect');
    scoreBoard.firstElementChild.classList.remove('.score-text-increment-effect');
  }, 200);
  
}