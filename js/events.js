// events.js
'use strict'

import { AudioEngine } from "./audio.js";
import { AudioLibrary } from "./audioLibrary.js";

let inputDirection = [0, 0];
let lastInputDirection = [0, 0];
let gamePaused = false;
let automateOn = false;
let borderCollision = true;

/*
 * Remove loading screen
 */
export function removeLoadingScreen() {
  const loader = document.querySelector('.loader');
  loader.classList.add('loader-hidden'); // For fade-out effect

  // Delete loader after transition
  setTimeout(() => {
    loader.remove();
  }, 750);
}

/*
 * Create loading screen
 */
export function createLoadingScreen() {
  const loader = document.createElement('div');
  loader.classList.add('loader');
  document.body.prepend(loader);
}


/*
 * Pre-game click Events
 */

// Activate automation button
export function activateAutomationButton() {
  // Automation button
  document.querySelector('#automate')
  .addEventListener("click", toggleAutomationButton);
}

/*
 * Activate Press to start button
 */
export function activatePressToStart(initFunc) {
  document.querySelector('#start')
  .addEventListener("click", async () => {
    // Display loading screen
    createLoadingScreen();

    // Play sound
    const startSound = AudioEngine.loadAudio(AudioLibrary.UI_START_BUTTON);

    // Make sure audio comes out before proceeding
    await AudioEngine.playAudio(startSound);

    // Call initGame() in game.js
    initFunc();

    // Remove loading screen
    removeLoadingScreen();
  }); 
}

/*
 * Keydown Events
 */
export function initKeyDownEvents() {
  window.addEventListener('keydown', e => {
    switch (e.key) {
      case 'w':
      case 'ArrowUp':
        if (lastInputDirection[1] !== 0) break;
        if (isAutomateOn()) break;
        inputDirection = [0, -1];
        break;
      
      case 's':
      case 'ArrowDown':
        if (lastInputDirection[1] !== 0) break;
        if (isAutomateOn()) break;
        inputDirection = [0, 1];
        break;

      case 'a':
      case 'ArrowLeft':
        if (lastInputDirection[0] !== 0) break;
        if (isAutomateOn()) break;
        inputDirection = [-1, 0];
        break;
  
      case 'd':
      case 'ArrowRight':
        if (lastInputDirection[0] !== 0) break;
        if (isAutomateOn()) break;
        inputDirection = [1, 0];
        break;
  
      case ' ':
        toggleAutomate();
        displayToggleMessage('Automate', automateOn);
        break;
  
      case 'p':
      case 'Escape':
        togglePause();
        break;

      case 'b':
        toggleBorderCollision();
        displayToggleMessage('Border Collision', borderCollision);
        break;

      default:
        break;
    }
  });
}


/*
 * In-game click Events
 */
export function initClickEvents() {
  // Restart button
  const restartButtons = document.querySelectorAll('.restart-button');
  for(let restartButton of restartButtons) {
   restartButton.addEventListener("click", async () => {
     // Play sound
     const restartSound = AudioEngine.loadAudio(AudioLibrary.UI_START_BUTTON);
     await AudioEngine.playAudio(restartSound);
    
    // Refresh
    window.location = '/';
   });
  }

  // Resume button
  const resumeButton = document.querySelector('.resume-button');
  resumeButton.addEventListener("click", async () => {
  // Play sound
  const resumeSound = AudioEngine.loadAudio(AudioLibrary.UI_START_BUTTON);

  // Make sure audio comes out before proceeding
  await AudioEngine.playAudio(resumeSound);

  // Set gamePaused to false
  gamePaused = false
  });
}

/*
 * Helper functions
 */
export function getInputDirection() {
  lastInputDirection = inputDirection;
  return inputDirection;
}

export function getLastInputDirection() {
  return lastInputDirection;
}

export function isGamePaused() {
  return gamePaused;
}

export function isAutomateOn() {
  return automateOn;
}

export function isBorderCollisionOn() {
  return borderCollision;
}

function toggleAutomate() {
  if(automateOn) {
    automateOn = false;
  } else {
    automateOn = true;
  }
}

function togglePause() {

  // Play sound
  (async () => {
    // No need to catch error here but just trying things out
    try {
      const pauseSound = AudioEngine.loadAudio(AudioLibrary.UI_PAUSE);
      await AudioEngine.playAudio(pauseSound);
    } catch (err) {
      console.error(err);
    }
  })();

  // Toggle pause
  if(gamePaused) {
    gamePaused = false;
  } else {
    gamePaused = true;
  }
}

export function toggleBorderCollision() {
  // Toggle border collision
  if(borderCollision) {
    borderCollision = false;
  } else {
    borderCollision = true;
  }
}

function toggleAutomationButton() {
  const automateButton = document.querySelector('#automate');

  // Play sound
  const toggleSound = AudioEngine.loadAudio(AudioLibrary.UI_TOGGLE_BUTTON);
  AudioEngine.playAudio(toggleSound);

  // Toggle automation
  if(isAutomateOn()) {
    console.log('automation turned off');
    automateButton.innerHTML = 'Automate: Off';
    automateButton.classList.add('toggleOff');
    automateButton.classList.remove('toggleOn');
    toggleAutomate();
  } else {
    console.log('automation turned on');
    automateButton.innerHTML = 'Automate: On';
    automateButton.classList.add('toggleOn');
    automateButton.classList.remove('toggleOff');
    toggleAutomate();
  }
}

// e.g. msg: On/Off (based on status)
function displayToggleMessage(msg, status) {
  const OnOffMessage = document.querySelector('#onOffMessage');
  OnOffMessage.style.animation = '';
  
  if(status) {
    OnOffMessage.firstElementChild.innerHTML = msg + ': on';
  } else {
    OnOffMessage.firstElementChild.innerHTML = msg + ': off';
  }

  // For logging
  console.log(msg + (status ? ': turned ON' : ': turned OFF'));

  setTimeout(() => {
    OnOffMessage.style.animation = 'fadeout 2s ease-out';
  }, 10);
}