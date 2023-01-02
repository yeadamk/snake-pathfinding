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

  // Caches every audio file in AudioLibrary
  // Returns an array of audio elements
  function loadAllAudioFiles() {
    let loadedAudioFiles = [];

    Object.values(AudioLibrary).forEach(src => {
      loadedAudioFiles.push(loadAudioFile(src));
    })

    return loadedAudioFiles;
  }

  // Caches the given audio file
  // Returns the audio element
  function loadAudioFile(src) {
    const audioElement = new Audio(src);
    audioElement.autoplay = false;

    return audioElement;
  }

  // Plays audio
  // Use 'await' to play audio before proceeding
  function playAudio(audioElement) {
    return new Promise((resolve, reject) => {
      if(!audioElement) {
        reject(new Error("Audio element not found!"));
      }
      audioElement.play();
      audioElement.onended = resolve; // Resolve when audio ends
    });
  }

  return {
    getAudioSrc: getAudioFromAudioLibrary,
    loadAll: loadAllAudioFiles,
    loadAudio: loadAudioFile,
    playAudio: playAudio,
  };

})(); 