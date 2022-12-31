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
    
    // Play sound
    const fruitEatingSound = AudioEngine.loadAudio(AudioLibrary.GAME_SNAKE_FRUIT);
    AudioEngine.playAudio(fruitEatingSound);
    
    // Expand snake and get new fruit location
    expandSnake(EXPANSION_RATE);
    fruit = getRandomFoodPosition();

    // Increment score
    score++;

    // Animate scoreboard every 5 points
    if(!(score % 5)) {
      animateScoreboard();
    }
  }
}

export function draw(gameBoard) {
  const fruitElement = document.createElement('div');
  fruitElement.style.gridRowStart = fruit.y;
  fruitElement.style.gridColumnStart = fruit.x;
  fruitElement.classList.add('apple');
  gameBoard.appendChild(fruitElement);

  // Draw fruit image
  const fruitImage = document.createElement('img');
  fruitImage.src = 'images/smaller-apple2.png';
  fruitElement.appendChild(fruitImage);
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

  scoreBoard.style.animation = 'scoreboard-increment-effect 3s linear';
  scoreBoard.firstElementChild.style.animation = 'scoretext-increment-effect 3s ease-out';

  setTimeout(() => {
    scoreBoard.style.animation = '';
    scoreBoard.firstElementChild.style.animation = '';
  }, 3000);
  
}