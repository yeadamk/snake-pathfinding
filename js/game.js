// game.js
'use strict'

/*
 * Imports
 */
import { AudioEngine } from "./audio.js";

import { 
  update as updateSnake, 
  draw as drawSnake, 
  SNAKE_SPEED, 
  getSnakeHead, 
  snakeIntersection,
} from './snake.js';

import {
  update as updateFruit,
  draw as drawFruit,
  getScore,
} from './fruit.js';

import { 
  outsideGrid,
  setupGrid,
  getGridSize,
} from './grid.js';

import {
  initKeyDownEvents, 
  initClickEvents, 
  isGamePaused, 
  createLoadingScreen,
  removeLoadingScreen,
  activateAutomationButton,
  activatePressToStart,
} from "./events.js";

/*
 * Check for browser
 */
if (!navigator.userAgent.includes('Chrome')) {
  // NOT running Chrome
  console.warn('The game may not be compatible with other browsers other than Chrome');
}

/*
 * Root function
 */
(function(window, document, undefined) {

// Mutable Settings
const SHOW_FPS = false;
const targetFrameRate = SNAKE_SPEED;

// Immutable Settings
const gameBoard = document.querySelector('#game-board');
const TIMESTEP = 1000 / targetFrameRate;
const TOLERANCE = 0.1; // For FPS stability
let lastRenderTimeMs = 0;
let delta = 0;
let deltaTimeMs = 0;
let animationID = null;
let gameOver = false;
let gameWin = false;

////////////////////////////////////////////////////////////////////////

/*
 * Load start screen
 */
(function() {
  // Remove loading screen after load is complete
  window.addEventListener('load', () => {
    removeLoadingScreen();
  });

  // Preload audio
  AudioEngine.loadAll();

  // Activate buttons
  activateAutomationButton();
  activatePressToStart(initGame); // Calls initGame
})();


/*
 * Main Loop
 *
 * timestamp = performance.now(); // default
 */
function main(timestamp) {
  // Schedule animation before screen refresh
  animationID =
  window.requestAnimationFrame(main)       || 
  window.webkitRequestAnimationFrame(main) || 
  window.mozRequestAnimationFrame(main)    || 
  window.oRequestAnimationFrame(main)      || 
  window.msRequestAnimationFrame(main);

  // Check gameover & win conditions
  if(gameOver || gameWin) {
    endGame();
    displayEndScreen();
    // Cancels animation frame
  }
  
  // Pause check
  if(isGamePaused()) {
    pauseGame();
    // Cancels animation frame
  }
  
  // Throttle FPS (Settings)
  deltaTimeMs = timestamp - lastRenderTimeMs;
  if(deltaTimeMs < TIMESTEP - TOLERANCE) return; // throttles fps

  lastRenderTimeMs = timestamp;
  delta = deltaTimeMs / 1000; // delta in seconds (should match 1/fps)

  // Update & Draw
  update(delta); // Not quite using delta since using CSS grid..

  if(!(gameOver || gameWin)){
    draw();
  }

  // Logs
  // let currentFPS = Math.round(1 / delta);
  // console.log(`FPS: ${currentFPS}`);
  // console.log('timestamp: ', timestamp);
  // console.log('TIMESTEP: ', TIMESTEP);
  // console.log('deltaTimeMs: ', deltaTimeMs);
}

/*
 * Initialize game
 */
function initGame() {
  console.log('Game started!');

  // Setup grid
  if(gameBoard) {
    setupGrid(gameBoard);
  } else {
    alert('initGame() - Error: game-board is null!');
    window.location = '/'; // refresh
  }
  
  // Initialize Events
  initKeyDownEvents();
  initClickEvents();
  
  // Remove startscreen
  const startScreen = document.querySelector('.start-screen');
  if(startScreen) {
   startScreen.style.display = 'none';
  } else {
    alert('initGame() - Error: start-screen is null!');
    window.location = '/'; // refresh
  }

  // Load game  
  animationID =
  window.requestAnimationFrame(main)       || 
  window.webkitRequestAnimationFrame(main) || 
  window.mozRequestAnimationFrame(main)    || 
  window.oRequestAnimationFrame(main)      || 
  window.msRequestAnimationFrame(main);
}

/*
 * Pause game
 */
function pauseGame() {
  window.cancelAnimationFrame(animationID);
  console.log('game is paused');

  // Overlay pause screen
  document.querySelector('#pause').style.display = 'flex';

  // Check pause state every 100ms
  const checkPauseState = () => {
    if(isGamePaused()) {
      setTimeout(checkPauseState, 100);
    } else {
      resumeGame();
    }
  }

  checkPauseState();
}

/*
 * Resume game
 */
function resumeGame() {
  // Remove pause screen
  document.querySelector('#pause').style.display = 'none';
  console.log('game is resumed');

  // Resume animation before screen refresh      
  animationID =
  window.requestAnimationFrame(main)       || 
  window.webkitRequestAnimationFrame(main) || 
  window.mozRequestAnimationFrame(main)    || 
  window.oRequestAnimationFrame(main)      || 
  window.msRequestAnimationFrame(main);
}


/*
 * End game
 */
function endGame() {
  window.cancelAnimationFrame(animationID);

  if(gameOver) {
    console.log('Gameover');
  }

  if(gameWin) {
    console.log('You beat the game!');
  }
}

/*
 * Update gameboard
 */
function update(delta) {
  updateSnake(delta);
  updateFruit(); // Also updates score
  checkWinCondition();
  checkDeath();
}

/*
 * Draw gameboard
 */
function draw() {
  // Clears grid except for the pause state overlay text
  gameBoard.innerHTML = ''; 

  if(gameBoard) {
    drawSnake(gameBoard); // defined in snake.js
    drawFruit(gameBoard); // defined in snake.js
    drawUpdatedScore(); // defined in game.js
  } else {
     alert('draw() - Error: game-board is null!');
     window.location = '/'; // refresh
  }
}

/*
 * Check gameover conditions
 */
function checkDeath() {
  // optional: || outsideGrid(getSnakeHead());
  gameOver = snakeIntersection();
}

/*
 * Check win conditions
 */
function checkWinCondition() {
  const GRID_SIZE = getGridSize();

  gameWin = (getScore() === (GRID_SIZE * GRID_SIZE -1 )) ? true : false;
}

/*
 * Display end screen
 */
function displayEndScreen() {
  const endScreen = document.querySelector('#end-screen');

  // Default text = 'Game Over!'
  if(gameWin) {
    endScreen.firstElementChild.innerHTML = 'You won!';
  }

  // Display score
  document.querySelector('#final-score').innerHTML = `Score: ${getScore()}`;

  // Finally
  endScreen.style.display = 'flex';
}

/*
 * Display updated scoreboard
 */
function drawUpdatedScore() {
  document.querySelector('#score-board')
  .firstElementChild.innerHTML = `Score: ${getScore()}`;
}


// Show FPS
if(SHOW_FPS) {
  (function() {
    var script = document.createElement('script');
    
    script.onload = function() {
      var stats = new Stats();
      document.body.appendChild(stats.dom);
      window.requestAnimationFrame(function loop() {
        stats.update();
        window.requestAnimationFrame(loop)
      });
    };
    
    script.src='//mrdoob.github.io/stats.js/build/stats.min.js';
    
    document.head.appendChild(script);
  })(); 
}

})(window, window.document);

