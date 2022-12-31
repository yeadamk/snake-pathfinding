// events.js
'use strict'

import { AudioEngine } from "./audio.js";
import { AudioLibrary } from "./audioLibrary.js";

let inputDirection = { x: 0, y: 0 };
let lastInputDirection = { x: 0, y: 0 };
let gamePaused = false;
let automateOn = false;

/*
 * Remove loading screen after load
 */
export function removeLoadingScreen() {
  window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    loader.classList.add('loader-hidden');
    loader.addEventListener('transitioned', () => {
      document.body.removeChild('loader');
    })
  })
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
  .addEventListener("click", () => {
    // Play sound
    const startSound = new Audio(AudioLibrary.UI_START_BUTTON);
    startSound.play();

    // Make sure audio comes out before refreshing
    setTimeout(() => {
      // Call initGame() in game.js
      initFunc();
    }, 100);
  }); 
}

/*
 * Keydown Events
 */
export function initKeyDownEvents() {
  window.addEventListener('keydown', e => {
    switch (e.key) {
      case 'ArrowUp':
        if (lastInputDirection.y !== 0) break;
        inputDirection = { x: 0, y: -1 };
        break;
  
      case 'ArrowDown':
        if (lastInputDirection.y !== 0) break;
        inputDirection = { x: 0, y: 1 };
        break;
  
      case 'ArrowLeft':
        if (lastInputDirection.x !== 0) break;
        inputDirection = { x: -1, y: 0 };
        break;
  
      case 'ArrowRight':
        if (lastInputDirection.x !== 0) break;
        inputDirection = { x: 1, y: 0 };
        break;
  
      case 'a':
        toggleAutomate();
        console.log('automation ' + (automateOn ? 'turned on' : 'turned off'));
        break;
  
      case 'p':
      case 'Escape':
        togglePause();
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
   restartButton.addEventListener("click", () => {
    // Play sound
    const restartSound = AudioEngine.loadAudio(AudioLibrary.UI_START_BUTTON);
    AudioEngine.playAudio(restartSound);

    // Refresh -- make sure audio comes out before refreshing
    setTimeout(() => {
      window.location = '/';
    }, 200);
   });
  }

  // Resume button
  const resumeButton = document.querySelector('.resume-button');
  resumeButton.addEventListener("click", () => {
  // Play sound
  const resumeSound = AudioEngine.loadAudio(AudioLibrary.UI_START_BUTTON);
  AudioEngine.playAudio(resumeSound);

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

export function isGamePaused() {
  return gamePaused;
}

export function isAutomateOn() {
  return automateOn;
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
  const pauseSound = AudioEngine.loadAudio(AudioLibrary.UI_PAUSE);
  AudioEngine.playAudio(pauseSound);

  // Toggle pause after playing the sound
  pauseSound.addEventListener('canplaythrough', () => {
    if(gamePaused) {
      gamePaused = false;
    } else {
      gamePaused = true;
    }
  })
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