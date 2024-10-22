import { initWebcamModule } from "./webcamModule.js";
import { initAudioModule } from "./audioModule.js";
import { initBatteryModule } from "./batteryModule.js";
import { initKeyboardModule } from "./keyboardModule.js";
import { initAlertModule } from "./alertModule.js";

document.addEventListener("contextmenu", (event) => event.preventDefault());

document.addEventListener("DOMContentLoaded", function () {
  initKeyboardModule();

  initWebcamModule();

  initAudioModule();

  initBatteryModule();

  initAlertModule();
});
