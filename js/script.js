import { webcamAccess, stopWebcam } from "./webcamModule.js";
import { handleMicRecording, stopRecording } from "./audioModule.js";
import { initializeBatteryMonitoring } from "./batteryModule.js";
import { initKeyboardModule } from "./keyboardModule.js";

document.addEventListener("DOMContentLoaded", function () {
  //video
  const videoElement = document.getElementById("video");
  const webcamTestButton = document.getElementById("webcamTest");

  webcamTestButton.addEventListener("click", () => {
    webcamAccess(videoElement);
  });

  window.addEventListener("beforeunload", () => {
    stopWebcam(videoElement);
  });

  //audio

  const audioElement = document.getElementById("audioRecord");
  const startRecordingButton = document.getElementById("startRecording");
  const stopRecordingButton = document.getElementById("stopRecording");
  const recordingStatusElement = document.getElementById("recordingStatus");

  startRecordingButton.addEventListener("click", () => {
    handleMicRecording(audioElement, recordingStatusElement);
  });

  stopRecordingButton.addEventListener("click", () => {
    stopRecording(recordingStatusElement);
  });

  //battery

  initializeBatteryMonitoring();

  //kb

  initKeyboardModule();
});
