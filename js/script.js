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
  e.preventDefault();
  const mouseSelector = ".key" + e.button;
  updateElementClass(mouseSelector, "press", "active");
});

document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});

window.addEventListener(
  "wheel",
  function (e) {
    e.preventDefault();
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
  const video = document.getElementById('video');
  if (!video) {
    console.error("Video element not found.");
    return;
  }

  // Check if getUserMedia method is available
  if (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
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
async function handleMicAccess() {
  try {
    // Check if getUserMedia method is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.log('getUserMedia not supported by this browser.');
      return; // Exit the function if getUserMedia is not supported
    }

    // Request microphone access
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    console.log('Microphone access granted');

    // Use the stream
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(audioContext.destination); // Connecting the audio directly to the speakers for local testing
  } catch (error) {
    console.error('Error accessing the microphone or processing audio', error);
  }
}
document.getElementById('micTest').addEventListener('click', handleMicAccess);