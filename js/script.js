/**
 * Returns a selector based on the key position and code.
 *
 * @param {number} keyPos - the position of the key
 * @param {string} keyCode - the code of the key
 * @return {string} selector based on the key position and code
 */
function getKeySelector(keyPos, keyCode) {
  const specialKeys = ["NumpadEnter", "ShiftRight", "ControlRight", "AltRight"];
  return specialKeys.includes(keyPos) ? ".keyPos" + keyPos : ".key" + keyCode;
}

/**
 * Updates the class of the specified element by adding and removing classes.
 *
 * @param {string} selector - The CSS selector for the element to be updated
 * @param {string} addClass - The class to be added to the element
 * @param {string} removeClass - The class to be removed from the element
 */
function updateElementClass(selector, addClass, removeClass) {
  try {
    const element = document.querySelector(selector);
    if (element) {
      element.classList.remove(removeClass);
      element.classList.add(addClass);
    } else {
      console.warn(`Element with selector "${selector}" not found.`);
    }
  } catch (error) {
    console.error("Error updating element class:", error);
  }
}

document.addEventListener("keydown", function (e) {
  e.preventDefault();
  const keySelector = getKeySelector(e.code, e.keyCode);
  updateElementClass(keySelector, "press", "active");
  console.log(`Key pressed: ${e.key}`);
});

document.addEventListener("mousedown", function (e) {
  const mouseSelector = ".key" + e.button;
  updateElementClass(mouseSelector, "press", "active");
});

document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});

window.addEventListener(
  "wheel",
  function (e) {
    const scrollSelector = e.deltaY > 0 ? ".scrollDown" : ".scrollUp";
    updateElementClass(scrollSelector, "active", "press");
  },
  { passive: false }
);

document.addEventListener("DOMContentLoaded", function () {
  window.addEventListener("resize", debounce(handleResize, 10)); // Debounce the resize event
  handleResize(); // Initial resizing
});

function handleResize() {
  try {
    // Get the width of the keyboard container
    const keyboardWrapper = document.getElementById("kbContainer");
    const keyboardBody = document.getElementById("kbLayout");

    if (!keyboardWrapper || !keyboardBody) {
      console.warn("Keyboard elements not found.");
      return;
    }

    // Get the width of the window
    const myWidth = keyboardBody.clientWidth;
    const windowWidth = document.documentElement.clientWidth;

    if (isNaN(myWidth) || isNaN(windowWidth) || windowWidth === 0) {
      console.error("Invalid dimensions.");
      return;
    }

    // Scale the keyboard
    const myPercentage = myWidth / windowWidth;
    if (myPercentage > 1) {
      const newPercentage = Math.min(0.95, (windowWidth / myWidth) * 0.95);
      scaleKeyboard(keyboardWrapper, newPercentage);
    } else {
      scaleKeyboard(keyboardWrapper, 1); // Reset scaling if not needed
    }
  } catch (error) {
    console.error("Error handling resize:", error);
  }
}

function scaleKeyboard(element, percentage) {
  element.style.transform = `scale(${percentage})`; // Scale and translate the element
}

function debounce(func, delay) {
  let timeoutId;
  return function () {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(func, delay);
  };
}

// Webcam
const video = document.getElementById("video");

function webcamAccess() {
  // Ensure the video element exists
  const video = document.getElementById("video");
  if (!video) {
    console.error("Video element not found.");
    return;
  }

  // Check if getUserMedia method is available
  if (
    navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === "function"
  ) {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(function (stream) {
        video.srcObject = stream;
        video.play().catch(function (playError) {
          // Handle potential errors that might occur when trying to play the video
          console.error("Error attempting to play video:", playError);
        });
        video.style.display = "block"; // Only display the video element if access is granted
      })
      .catch(function (error) {
        console.error("Error accessing webcam:", error);
      });
  } else {
    console.error("getUserMedia not supported by this browser.");
  }
}

const webcamTest = document.getElementById("webcamTest");
webcamTest.addEventListener("click", function () {
  webcamAccess();
});

// Cleanup webcam when done
window.addEventListener("beforeunload", function () {
  const stream = video.srcObject;
  if (stream) {
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
  }
});


// Mic Test
let streamTest;
const audioTest = document.getElementById('audioTest');
async function handleMicAccess() {
  try {
    // Check if getUserMedia method is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.log("getUserMedia not supported by this browser.");
      return;
    }

    // Request microphone access
    streamTest = await navigator.mediaDevices.getUserMedia({ audio: true });
    console.log("Microphone access granted");

    audioTest.style.display = "block";
  
    // Use the stream 
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(streamTest);

    source.connect(audioContext.destination);
    audioTest.srcObject = streamTest;

    console.log(streamTest);

  } catch (error) {
    console.error("Error accessing the microphone or processing audio", error);
  }
}
const micTest = document.getElementById("micTest");
micTest.addEventListener("click", handleMicAccess);

const audioTestStop = document.getElementById('micTestStop');
// Stop the stream when the button is clicked
audioTestStop.addEventListener("click", function () {
  streamTest.getTracks().forEach(function (track) {
    track.stop();
    audioTest.style.display = "none";
  });
});


// Recording
let audioRecord = document.getElementById('audioRecord');
const startRecordingButton = document.getElementById('startRecording');
const stopRecordingButton = document.getElementById('stopRecording');
let mediaRecorder;
let recordedChunks = [];

async function handleMicRecording() {
  recordedChunks = [];
    // Check if MediaRecorder is supported
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
          .then((stream) => {
              mediaRecorder = new MediaRecorder(stream);

              // Listen for dataavailable event to collect chunks
              mediaRecorder.addEventListener('dataavailable', (event) => {
                  if (event.data.size > 0) {
                      recordedChunks.push(event.data);
                  }
              });

              // Listen for stop event to create a new audio element with the recorded content
              mediaRecorder.addEventListener('stop', () => {
                  const recordedBlob = new Blob(recordedChunks, { type: 'audio/wav' });
                  const recordedUrl = URL.createObjectURL(recordedBlob);

                  // Create a new audio element for playback
                  const playbackAudioElement = new Audio(recordedUrl);
                  playbackAudioElement.controls = true;

                  // Replace the existing audio element with the new one
                  audioRecord.parentNode.replaceChild(playbackAudioElement, audioRecord);
                  audioRecord = playbackAudioElement; // Update reference to the new audio element
              });

              // Start recording
              mediaRecorder.start();
          })
          .catch((error) => {
              console.error('Error accessing microphone:', error);
          });
  } else {
      console.error('MediaRecorder is not supported in this browser.');
  }

}
startRecordingButton.addEventListener('click', handleMicRecording)

// Handle the stop recording button click
stopRecordingButton.addEventListener('click', () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
    }
});