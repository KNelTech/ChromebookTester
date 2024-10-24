import { customAlertModule } from "./customAlertModule.js";

let webcamActive = false;
let currentStream = null;

/**
 * Request access to the selected webcam and set the video element's source
 * to the selected webcam's stream.
 *
 * @param {HTMLVideoElement} videoElement - The video element to display the
 *   webcam's stream.
 * @param {string} selectedDeviceId - The id of the selected webcam.
 */
function webcamAccess(videoElement, selectedDeviceId) {
  if (!videoElement) {
    console.error("Video element not found.");
    return;
  }

  stopWebcam(videoElement);

  if (selectedDeviceId === "none") return;

  if (navigator.mediaDevices?.getUserMedia) {
    const videoConstraints = { deviceId: { exact: selectedDeviceId } };

    navigator.mediaDevices
      .getUserMedia({ video: videoConstraints })
      .then((stream) => {
        currentStream = stream;
        videoElement.srcObject = stream;
        videoElement.style.display = "block";
        return videoElement.play();
      })
      .then(() => {
        webcamActive = true;
        console.log("Webcam access granted.");
      });
  } else {
    console.error("getUserMedia not supported by this browser.");
  }
}

/**
 * Populate the webcam dropdown with options for the user to select a webcam.
 * @param {HTMLSelectElement} dropdownElement - The element to populate.
 */
function populateWebcamDropdown(dropdownElement) {
  dropdownElement.length = 0;

  const defaultOption = dropdownElement.appendChild(
    document.createElement("option")
  );
  defaultOption.disabled = true;
  defaultOption.selected = true;
  defaultOption.textContent = "Cameras";

  const offOption = dropdownElement.appendChild(
    document.createElement("option")
  );
  offOption.value = "none";
  offOption.textContent = "Off";

  navigator.mediaDevices
    .enumerateDevices()
    .then((devices) => {
      const videoDevices = devices.filter(({ kind }) => kind === "videoinput");

      if (videoDevices.length === 0) {
        console.warn("No video input devices found.");
        const noCameraOption = dropdownElement.appendChild(
          document.createElement("option")
        );
        noCameraOption.disabled = true;
        noCameraOption.textContent = "No cameras found";
        return;
      }

      videoDevices.forEach(({ deviceId, label }, index) => {
        const option = dropdownElement.appendChild(
          document.createElement("option")
        );
        option.value = deviceId;
        option.textContent = label
          ? label.replace(/\s*\([0-9a-f]{4}:[0-9a-f]{4}\)\s*$/i, "").trim()
          : `Camera ${index + 1}`;
      });
    })
    .catch((error) => {
      console.error("Error enumerating devices:", error);
      const errorOption = dropdownElement.appendChild(
        document.createElement("option")
      );
      errorOption.disabled = true;
      errorOption.textContent = "Error accessing cameras";
    });
}

/**
 * Stops the webcam by stopping all tracks of the current stream, resetting
 * the video element, and updating the webcam status.
 *
 * @param {HTMLVideoElement} videoElement - The video element displaying the webcam stream.
 */
function stopWebcam(videoElement) {
  if (currentStream) {
    currentStream.getTracks().forEach((track) => track.stop());
    currentStream = null;
    videoElement.srcObject = null;
    videoElement.style.display = "none";
    webcamActive = false;
    console.log("Webcam stopped.");
  }
}

/**
 * Initializes the webcam module by setting up the video element,
 * requesting webcam access, and populating the webcam dropdown.
 * Also adds event listeners for webcam selection and before unload actions.
 */
function initWebcamModule() {
  const videoEl = document.getElementById("video");
  const webcamSelect = document.getElementById("webcamDropdown");

  navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then(() => populateWebcamDropdown(webcamSelect))
    .catch((err) => {
      if (err.name === "NotFoundError") {
        console.error("No webcam found:", err);
        customAlertModule().showAlert({
          title: "Webcam Not Found",
          message:
            "No webcam device was found on this system. Please connect a webcam and try again.",
          buttonText: "Close",
        });
      } else {
        console.error("Webcam permission denied or other error:", err);
        customAlertModule().showAlert({
          title: "Webcam Permission",
          message: "Please allow webcam access to use this feature.",
          buttonText: "Close",
        });
      }
    });

  webcamSelect.addEventListener("change", () =>
    webcamAccess(videoEl, webcamSelect.value)
  );

  window.addEventListener("beforeunload", () => stopWebcam(videoEl));
}

export { initWebcamModule };
