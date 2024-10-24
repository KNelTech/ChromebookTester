import { customAlertModule } from "./customAlertModule.js";

let mediaRecorder;
let recordedChunks = [];

/**
 * Sets up a MediaRecorder to record audio from the user's microphone.
 * @param {MediaStream} stream - The stream containing the audio to record.
 * @param {HTMLAudioElement} audioElement - The audio element to display the recorded audio.
 */
function setupMediaRecorder(stream, audioElement) {
  recordedChunks = [];

  mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.addEventListener("dataavailable", (e) => {
    if (e.data.size > 0) {
      recordedChunks.push(e.data);
    }
  });

  mediaRecorder.addEventListener("stop", () => {
    const recordedBlob = new Blob(recordedChunks, { type: "audio/wav" });
    const recordedUrl = URL.createObjectURL(recordedBlob);

    replaceAudioElement(recordedUrl, audioElement);
  });

  mediaRecorder.start();
  console.log("Audio recording in progress...");
}

/**
 * Replaces the source URL of an audio element with the recorded audio URL.
 *
 * @param {string} srcUrl - The URL of the recorded audio.
 * @param {HTMLAudioElement} audioElement - The audio element to update.
 */
function replaceAudioElement(srcUrl, audioElement) {
  audioElement.src = srcUrl;
  audioElement.style.display = "block";
  console.log("Audio recording finished.");
}

/**
 * Handles microphone recording by requesting access to the user's
 * microphone and setting up a MediaRecorder to record audio.
 *
 * @param {HTMLAudioElement} audioElement - The audio element to display the
 *   recorded audio.
 * @param {HTMLElement} recordingStatusElement - The element to display the
 *   recording status.
 */
async function handleMicRecording(audioElement, recordingStatusElement) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    if (stream) {
      console.log("Microphone access granted.");
      setupMediaRecorder(stream, audioElement);
      recordingStatusElement.style.display = "block";
      audioElement.style.display = "none";
    } else {
      console.error("Failed to get microphone stream.");
    }
  } catch (error) {
    customAlertModule().showAlert({
      title: "Microphone Access",
      message: "Did you allow microphone access?",
      buttonText: "Close",
    });
    console.error("Error accessing microphone:", error);
  }
}

/**
 * Stops the microphone recording by stopping the MediaRecorder and hiding
 * the recording status element.
 *
 * @param {HTMLElement} recordingStatusElement - The element to hide when
 *   stopping the recording.
 */
function stopRecording(recordingStatusElement) {
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
    recordingStatusElement.style.display = "none";
  }
}

/**
 * Initializes the audio module by setting up the audio element, start
 * recording button, and stop recording button.
 */
function initAudioModule() {
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
}

export { initAudioModule };
