function getKeySelector(keyCode) {
  return `.key.${keyCode}`;
}

/**
 * Updates the class of the specified element by adding the 'active' class.
 *
 * @param {string} selector - The CSS selector for the element to be updated
 */
function updateElementClass(selector) {
  const element = document.querySelector(selector);
  if (element) {
    element.classList.add("active");
  } else {
    console.error(`Element with selector "${selector}" not found.`);
  }
}

document.addEventListener("keydown", function (e) {
  e.preventDefault();
  const keySelector = getKeySelector(e.code); // Use e.code for consistency and accuracy
  updateElementClass(keySelector);
  console.log(`Key pressed: ${e.key}`);
});

document.addEventListener("mousedown", function (e) {
  const mouseSelector = `.key.Mouse${e.button}`;
  updateElementClass(mouseSelector);
});

document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});

window.addEventListener(
  "wheel",
  function (e) {
    const scrollSelector = e.deltaY > 0 ? ".scrollDown" : ".scrollUp";
    updateElementClass(scrollSelector);
  },
  { passive: false }
);

document.addEventListener("DOMContentLoaded", function () {
  window.addEventListener("resize", debounce(handleResize, 10)); // Debounce the resize event
  handleResize(); // Initial resizing
});

/*
 **  Resizes the keyboard to fit the window.
 */
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

/*
 **  Webcam
 */
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
        console.log("Webcam access granted.");
      })
      .catch(function (error) {
        showAlert({ message: "Error finding webcam. did you allow access?" });
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

/*
 **  Recording
 */
const audioRecord = document.getElementById("audioRecord");
const startRecordingButton = document.getElementById("startRecording");
const stopRecordingButton = document.getElementById("stopRecording");
let mediaRecorder;
let recordedChunks = [];

function setupMediaRecorder(stream) {
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

    replaceAudioElement(recordedUrl);
  });

  mediaRecorder.start();
  console.log("Audio recording in progress...");
}

/**
 * Replaces the source URL of the audio element and sets its display style to block.
 *
 * @param {string} srcUrl - The new source URL for the audio element.
 */
function replaceAudioElement(srcUrl) {
  audioRecord.src = srcUrl;
  audioRecord.style.display = "block";
  console.log("Audio recording finished.");
}

// Asynchronously handles microphone recording by accessing the device's media stream,
// setting up the media recorder, and updating the recording status display.
async function handleMicRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    if (stream) {
      console.log("Microphone access granted.");
      setupMediaRecorder(stream);
      recordingStatus.style.display = "block";
      audioRecord.style.display = "none";
    } else {
      console.error("Failed to get microphone stream.");
    }
  } catch (error) {
    showAlert({ message: "Error finding microphone. did you allow access?" });
    console.error("Error accessing microphone:", error);
  }
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
    recordingStatus.style.display = "none";
  }
}

startRecordingButton.addEventListener("click", handleMicRecording);
stopRecordingButton.addEventListener("click", stopRecording);

// Theme Selector
const themeSelector = document.getElementById("themeSelector");

const themes = [
  { value: "", text: "Default Theme" },
  { value: "basicTheme", text: "Basic Theme" },
];

themes.forEach((theme) => {
  const option = document.createElement("option");
  option.value = theme.value;
  option.textContent = theme.text;
  themeSelector.appendChild(option);
});

function handleThemeChange() {
  const selectedTheme = this.value;
  const htmlElement = document.documentElement;

  themes.forEach((theme) => {
    if (theme.value) {
      htmlElement.classList.remove(theme.value);
    }
  });

  if (selectedTheme) {
    htmlElement.classList.add(selectedTheme);
  }
}
themeSelector.addEventListener("change", handleThemeChange);

console.log(
  "%cHello there!  If you see this message, know that you are awesome!",
  "background: #222; color: #bb55da; font-size: 20px; padding: 8px; border-radius: 15px;"
);

// begin battery
document.addEventListener("DOMContentLoaded", () => {
  // Ensure the kbLayout element exists
  const kbLayout = document.getElementById("kbLayout");
  if (!kbLayout) {
    console.error("kbLayout element not found");
    return;
  }

  // Battery Information
  const batteryInfo = document.createElement("div");
  batteryInfo.id = "battery-info";
  batteryInfo.innerHTML = `
      <div class="batterybx">
          <p class="titlebtry"></p>
          <p class="battery-details"></p>
      </div>
  `;
  kbLayout.appendChild(batteryInfo);

  function toTime(sec) {
    const hours = Math.floor(sec / 3600)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((sec % 3600) / 60)
      .toString()
      .padStart(2, "0");
    return `${hours} hours ${minutes} minutes`;
  }

  function setMessage(battery) {
    const title = `${battery.charging ? "Charging" : "Not Charging"} - ${(
      battery.level * 100
    ).toFixed(2)}% Available`;
    document.querySelector(".batterybx .titlebtry").innerHTML = title;

    let htmltext = "";
    if (battery.charging && battery.chargingTime !== Infinity) {
      htmltext += `<br>Fully charged in: ${toTime(battery.chargingTime)}`;
    }
    if (!battery.charging && battery.dischargingTime !== Infinity) {
      htmltext += `<br>Discharging in: ${toTime(battery.dischargingTime)}`;
    }
    document.querySelector(".batterybx .battery-details").innerHTML = htmltext;
  }

  function updateAllBatteryInfo(battery) {
    setMessage(battery);
  }

  if (navigator.getBattery) {
    navigator
      .getBattery()
      .then((battery) => {
        updateAllBatteryInfo(battery);

        battery.addEventListener("chargingchange", () =>
          updateAllBatteryInfo(battery)
        );
        battery.addEventListener("levelchange", () =>
          updateAllBatteryInfo(battery)
        );
        battery.addEventListener("chargingtimechange", () =>
          updateAllBatteryInfo(battery)
        );
        battery.addEventListener("dischargingtimechange", () =>
          updateAllBatteryInfo(battery)
        );
      })
      .catch((error) => {
        console.error("Error accessing battery information:", error);
        batteryInfo.innerHTML = "<p>Error accessing battery information</p>";
      });
  } else {
    batteryInfo.innerHTML = "<p>Battery API not supported by this browser</p>";
  }
});

/*
document.addEventListener("DOMContentLoaded", () => {
  // Ensure the kbLayout element exists
  const kbLayout = document.getElementById("kbLayout");
  if (!kbLayout) {
    console.error("kbLayout element not found");
    return;
  }

  // Battery Information
  const batteryInfo = document.createElement("div");
  batteryInfo.id = "battery-info";
  batteryInfo.innerHTML = `
      <p>Battery: <span class="battery-info"></span></p>
  `;
  kbLayout.appendChild(batteryInfo);

  function toTime(sec) {
    const hours = Math.floor(sec / 3600)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((sec % 3600) / 60)
      .toString()
      .padStart(2, "0");
    return `${hours}h ${minutes}m`;
  }

  function updateBattery(battery) {
    const percentage = parseFloat((battery.level * 100).toFixed(2)) + "%";
    const status = battery.charging ? "Charging" : "Battery";
    const fullyCharged =
      battery.charging && battery.chargingTime === Infinity
        ? "Calculating..."
        : battery.chargingTime !== Infinity
        ? toTime(battery.chargingTime)
        : "---";
    const remainingTime =
      !battery.charging && battery.dischargingTime === Infinity
        ? "Calculating..."
        : battery.dischargingTime !== Infinity
        ? toTime(battery.dischargingTime)
        : "---";

    const content = `${status} (${percentage})${
      battery.charging
        ? `, Full in: ${fullyCharged}`
        : `, Remaining: ${remainingTime}`
    }`;
    document.querySelector(".battery-info").textContent = content;
  }

  if (navigator.getBattery) {
    navigator
      .getBattery()
      .then((battery) => {
        updateBattery(battery);

        battery.addEventListener("chargingchange", () =>
          updateBattery(battery)
        );
        battery.addEventListener("levelchange", () => updateBattery(battery));
        battery.addEventListener("chargingtimechange", () =>
          updateBattery(battery)
        );
        battery.addEventListener("dischargingtimechange", () =>
          updateBattery(battery)
        );
      })
      .catch((error) => {
        console.error("Error accessing battery information:", error);
        batteryInfo.innerHTML = "<p>Error accessing battery information</p>";
      });
  } else {
    batteryInfo.innerHTML = "<p>Battery API not supported by this browser</p>";
  }
});

/*
document.addEventListener("DOMContentLoaded", () => {
  // Ensure the kbLayout element exists
  const kbLayout = document.getElementById("kbLayout");
  if (!kbLayout) {
    console.error("kbLayout element not found");
    return;
  }

  // Battery Information
  const batteryInfo = document.createElement("div");
  batteryInfo.id = "battery-info";
  batteryInfo.innerHTML = `
      <p>Battery: <span class="battery-info"></span></p>
  `;
  kbLayout.appendChild(batteryInfo);

  function toTime(sec) {
    const hours = Math.floor(sec / 3600)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((sec % 3600) / 60)
      .toString()
      .padStart(2, "0");
    return `${hours}h ${minutes}m`;
  }

  function updateBattery(battery) {
    const percentage = parseFloat((battery.level * 100).toFixed(2)) + "%";
    const status = battery.charging ? "Charging" : "Battery";
    const fullyCharged =
      battery.charging && battery.chargingTime === Infinity
        ? "Calculating..."
        : battery.chargingTime !== Infinity
        ? toTime(battery.chargingTime)
        : "---";
    const remainingTime =
      !battery.charging && battery.dischargingTime === Infinity
        ? "Calculating..."
        : battery.dischargingTime !== Infinity
        ? toTime(battery.dischargingTime)
        : "---";

    const content = `${status} (${percentage})${
      battery.charging
        ? `, Full in: ${fullyCharged}`
        : `, Remaining: ${remainingTime}`
    }`;
    document.querySelector(".battery-info").textContent = content;
  }

  if (navigator.getBattery) {
    navigator
      .getBattery()
      .then(updateBattery)
      .catch((error) => {
        console.error("Error accessing battery information:", error);
        batteryInfo.innerHTML = "<p>Error accessing battery information</p>";
      });

    navigator.getBattery().then((battery) => {
      battery.addEventListener("chargingchange", () => updateBattery(battery));
      battery.addEventListener("levelchange", () => updateBattery(battery));
    });
  } else {
    batteryInfo.innerHTML = "<p>Battery API not supported by this browser</p>";
  }
}); */
/*
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");

  // Ensure the kbLayout element exists
  const kbLayout = document.getElementById("kbLayout");
  if (!kbLayout) {
    console.error("kbLayout element not found");
    return;
  }

  // Battery Information
  const batteryInfo = document.createElement("div");
  batteryInfo.id = "battery-info";
  batteryInfo.innerHTML = `
      <p>Battery Status: <span class="battery-status"></span></p>
      <p>Battery Level: <span class="battery-level"></span></p>
      <p>Battery Fully Charged In: <span class="battery-fully"></span></p>
      <p>Battery Remaining Time: <span class="battery-remaining"></span></p>
  `;
  kbLayout.appendChild(batteryInfo);

  function toTime(sec) {
    sec = parseInt(sec, 10);

    var hours = Math.floor(sec / 3600),
      minutes = Math.floor((sec - hours * 3600) / 60);

    if (hours < 10) {
      hours = "0" + hours;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }

    return hours + ":" + minutes;
  }

  function readBattery(battery) {
    var percentage = parseFloat((battery.level * 100).toFixed(2)) + "%",
      fully,
      remaining;

    if (battery.charging && battery.chargingTime === Infinity) {
      fully = "Calculating...";
    } else if (battery.chargingTime !== Infinity) {
      fully = toTime(battery.chargingTime);
    } else {
      fully = "---";
    }

    if (!battery.charging && battery.dischargingTime === Infinity) {
      remaining = "Calculating...";
    } else if (battery.dischargingTime !== Infinity) {
      remaining = toTime(battery.dischargingTime);
    } else {
      remaining = "---";
    }

    document.querySelector(".battery-status").textContent = battery.charging
      ? "Adapter"
      : "Battery";
    document.querySelector(".battery-level").textContent = percentage;
    document.querySelector(".battery-fully").textContent = fully;
    document.querySelector(".battery-remaining").textContent = remaining;
  }

  if (navigator.getBattery) {
    navigator
      .getBattery()
      .then((battery) => {
        readBattery(battery);

        battery.addEventListener("chargingchange", () => {
          readBattery(battery);
        });

        battery.addEventListener("levelchange", () => {
          readBattery(battery);
        });

        battery.addEventListener("chargingtimechange", () => {
          readBattery(battery);
        });

        battery.addEventListener("dischargingtimechange", () => {
          readBattery(battery);
        });
      })
      .catch((error) => {
        console.error("Error accessing battery information:", error);
        batteryInfo.innerHTML = "<p>Error accessing battery information</p>";
      });
  } else {
    batteryInfo.innerHTML = "<p>Battery API not supported by this browser</p>";
  }
});
*/
