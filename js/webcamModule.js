import { customAlertModule } from "./customAlertModule.js";

let webcamActive = false;
let currentStream = null;

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
      })
      .catch((error) => {
        console.error("Error accessing or playing webcam:", error);
        customAlertModule().showAlert({
          title: "Webcam Access",
          message: "Did you allow webcam access?",
          buttonText: "Close",
        });
      });
  } else {
    console.error("getUserMedia not supported by this browser.");
  }
}

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

function initWebcamModule() {
  const videoEl = document.getElementById("video");
  const webcamSelect = document.getElementById("webcamDropdown");

  navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then(() => populateWebcamDropdown(webcamSelect))
    .catch((err) => {
      console.error("Webcam permission denied:", err);
      customAlertModule().showAlert({
        title: "Webcam Permission",
        message: "Please allow webcam access to use this feature.",
        buttonText: "Close",
      });
    });

  webcamSelect.addEventListener("change", () =>
    webcamAccess(videoEl, webcamSelect.value)
  );

  window.addEventListener("beforeunload", () => stopWebcam(videoEl));
}

export { initWebcamModule };
