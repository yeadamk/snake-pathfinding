// audio.js
'use strict'

import { AudioLibrary } from "./audioLibrary.js";

/*
 * Audio Engine
 */
export const AudioEngine = {

  // Get the src of an audio file from AudioLibrary
  getAudioSrc: function(key) {
    return AudioLibrary[key]; // src
  },

  // Caches every audio file in AudioLibrary
  loadAll: function() {
    let loadedAudioFiles = [];

    Object.values(AudioLibrary).forEach(src => {
      loadedAudioFiles.push(AudioEngine.loadAudio(src));
    })

    // Returns an array of audio elements
    return loadedAudioFiles;
  },

  // Caches the given audio file
  loadAudio: function(src) {
    const audioElement = new Audio(src);
    audioElement.autoplay = false;

    // Returns the audio element
    return audioElement; 
  },

  // Plays audio -- use 'await' to play audio before proceeding
  playAudio: function(audioElement) {
    return new Promise((resolve, reject) => {
      if(!audioElement) {
        reject(new Error("Audio element not found!"));
      }
      audioElement.play();
      audioElement.onended = resolve; // Resolve when audio ends
    });
  }
};