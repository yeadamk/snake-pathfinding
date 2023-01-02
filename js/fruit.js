// fruit.js
'use strict'

import { onSnake, expandSnake } from './snake.js'
import { getGridSize, getRandomGridPosition } from './grid.js'
import { AudioEngine } from "./audio.js";
import { AudioLibrary } from "./audioLibrary.js";

let score = 0;
let fruit = getRandomFoodPosition();
const EXPANSION_RATE = 1;

export function update() {
  if (onSnake(fruit)) {
    // Increment score
    score++;
    
    // Animate scoreboard every point
    if(true || !(score % 5)) { // can change later to every x points
      animateScoreboard();
    }

    // Play sound
    const fruitEatingSound = AudioEngine.loadAudio(AudioLibrary.GAME_SNAKE_FRUIT);
    AudioEngine.playAudio(fruitEatingSound);
    
    // Expand snake and get new fruit location
    expandSnake(EXPANSION_RATE);
    fruit = getRandomFoodPosition();
  }
}

export function draw(gameBoard) {
  // Only draw if fruit is not NULL
  if (fruit) {
    const fruitElement = document.createElement('div');
    fruitElement.style.gridRowStart = fruit.y;
    fruitElement.style.gridColumnStart = fruit.x;
    fruitElement.classList.add('apple');
    gameBoard.appendChild(fruitElement);
  
    // Load fruit image
    const fruitImage = document.createElement('img');
    fruitImage.src = 'images/smaller-apple2.png';
    fruitElement.appendChild(fruitImage);
  }
}

export function getScore() {
  return score;
}

function getRandomFoodPosition() {
  // Don't spawn another fruit when all other grids are filled
  const GRID_SIZE = getGridSize();
  if(score === GRID_SIZE * GRID_SIZE) {
    return null;
  }

  let newFoodPosition;
  while (newFoodPosition == null || onSnake(newFoodPosition)) {
    newFoodPosition = getRandomGridPosition();
  }
  return newFoodPosition;
}

function animateScoreboard() {
  const scoreBoard = document.querySelector('#score-board');
  scoreBoard.style.animation = '';
  scoreBoard.firstElementChild.style.animation = '';

  setTimeout(() => {
    scoreBoard.style.animation = 'scoreboard-increment-effect 3s linear';
    scoreBoard.firstElementChild.style.animation = 'scoretext-increment-effect 3s ease-out';
  }, 10);
}