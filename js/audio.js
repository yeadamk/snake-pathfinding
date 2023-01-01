// audio.js
'use strict'

import { AudioLibrary } from "./audioLibrary.js";

/*
 * Audio Engine
 */
export const AudioEngine = (function() {

  // Get the src of an audio file from AudioLibrary
  function getAudioFromAudioLibrary(key) {
    return AudioLibrary[key]; // src
  }

  function loadAllAudioFiles() {
    Object.values(AudioLibrary).forEach(src => {
      loadAudioFile(src);
    })
  }

  function loadAudioFile(src) {
    const audioElement = new Audio(src);
    audioElement.autoplay = false;

    return audioElement;
  }

  function playAudioFile(audioElement) {
    audioElement.addEventListener('canplaythrough', () => {
      audioElement.play();
    });
  }

  return {
    getAudioSrc: getAudioFromAudioLibrary,
    loadAll: loadAllAudioFiles,
    loadAudio: loadAudioFile,
    playAudio: playAudioFile, // Don't use this yet
  };

})(); 