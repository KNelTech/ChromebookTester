import { initWebcamModule } from "./webcamModule.js";
import { initAudioModule } from "./audioModule.js";
import { initBatteryModule } from "./batteryModule.js";
import { initKeyboardModule } from "./keyboardModule.js";

/**
 * Prevents the default context menu from appearing on right-click
 * and initializes all necessary modules when the DOM content is loaded.
 */
document.addEventListener("contextmenu", (event) => event.preventDefault());

/**
 * Initializes the keyboard, webcam, audio, and battery modules
 * once the DOM content is fully loaded.
 */
document.addEventListener("DOMContentLoaded", function () {
  initKeyboardModule();
  initWebcamModule();
  initAudioModule();
  initBatteryModule();
});
