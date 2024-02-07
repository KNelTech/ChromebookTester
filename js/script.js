/**
 * Returns a selector based on the key position and code.
 *
 * @param {number} keyPos - the position of the key
 * @param {string} keyCode - the code of the key
 * @return {string} selector based on the key position and code
 */
function getKeySelector(keyPos, keyCode) {
  const specialKeys = ['NumpadEnter', 'ShiftRight', 'ControlRight', 'AltRight'];
  return specialKeys.includes(keyPos) ? '.keyPos' + keyPos : '.key' + keyCode;
}

/**
 * Updates the class of the specified element by adding and removing classes.
 *
 * @param {string} selector - The CSS selector for the element to be updated
 * @param {string} addClass - The class to be added to the element
 * @param {string} removeClass - The class to be removed from the element
 */
function updateElementClass(selector, addClass, removeClass) {
  const element = document.querySelector(selector);
  if (element) {
    element.classList.remove(removeClass);
    element.classList.add(addClass);
  }
}

document.addEventListener('keydown', function(e) {
  e.preventDefault();
  const keySelector = getKeySelector(e.code, e.keyCode);
  updateElementClass(keySelector, 'press', 'active');
});

document.addEventListener('mousedown', function(e) {
  e.preventDefault();
  const mouseSelector = '.key' + e.button;
  updateElementClass(mouseSelector, 'press', 'active');
});

document.addEventListener('contextmenu', function(e) {
  e.preventDefault();
});

window.addEventListener('wheel', function(e) {
  e.preventDefault();
  const scrollSelector = e.deltaY > 0 ? '.scrollDown' : '.scrollUp';
  updateElementClass(scrollSelector, 'active', 'press');
}, {passive: false});


document.addEventListener('DOMContentLoaded', function () {
  window.addEventListener('resize', debounce(handleResize, 10)); // Debounce the resize event
  handleResize(); // Initial resizing
});

function handleResize() {
  const keyboardWrapper = document.getElementById('kbContainer');
  const keyboardBody = document.getElementById('kbLayout');

  const myWidth = keyboardBody.clientWidth;
  const windowWidth = document.documentElement.clientWidth;
  const myPercentage = myWidth / windowWidth;

  if (myPercentage > 1) {
    const newPercentage = Math.min(0.95, windowWidth / myWidth);
    scaleKeyboard(keyboardWrapper, newPercentage);
    scaleKeyboard(keyboardBody, newPercentage);
  } else {
    scaleKeyboard(keyboardWrapper, 1); // Reset scaling if not needed
    scaleKeyboard(keyboardBody, 1);
  }
}

function scaleKeyboard(element, percentage) {
  element.style.transform = `scale(${percentage}) translate(-1%, 1%)`;  // Scale and translate the element
}

function debounce(func, delay) {
  let timeoutId;
  return function () {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(func, delay);
  };
}

// Webcam
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');

function webcamAccess() {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(function (stream) {
        video.srcObject = stream;
        video.play();
      })
      .catch(function (error) {
        console.error('Error accessing webcam:', error);
      });
  }

  video.style.display = "block";
  // canvas.style.display = "block";
}

const webcamTest = document.getElementById("webcamTest");
webcamTest.addEventListener("click", function () {
  webcamAccess();
});

// Cleanup webcam when done
window.addEventListener('beforeunload', function () {
  const stream = video.srcObject;
  if (stream) {
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
  }
});