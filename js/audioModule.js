let mediaRecorder;
let recordedChunks = [];

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

function replaceAudioElement(srcUrl, audioElement) {
  audioElement.src = srcUrl;
  audioElement.style.display = "block";
  console.log("Audio recording finished.");
}

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
    showAlert({ message: "Error finding microphone. did you allow access?" });
    console.error("Error accessing microphone:", error);
  }
}

function stopRecording(recordingStatusElement) {
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
    recordingStatusElement.style.display = "none";
  }
}

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
