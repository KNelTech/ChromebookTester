import { customAlertModule } from "./customAlertModule.js";

let webcamActive = false;
let currentStream = null;

function webcamAccess(videoElement, selectedDeviceId) {
  if (!videoElement) {
    console.error("Video element not found.");
    return;
  }

  stopWebcam(videoElement);

  if (selectedDeviceId === "none") {
    stopWebcam(videoElement);
    return;
  }

  if (
    navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === "function"
  ) {
    const videoConstraints = { deviceId: { exact: selectedDeviceId } };

    navigator.mediaDevices
      .getUserMedia({ video: videoConstraints })
      .then((stream) => {
        currentStream = stream;
        videoElement.srcObject = stream;
        videoElement.play().catch((playError) => {
          console.error("Error playing video:", playError);
        });
        videoElement.style.display = "block";
        webcamActive = true;
        console.log("Webcam access granted.");
      })
      .catch((error) => {
        console.error("Error accessing webcam:", error);
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
  navigator.mediaDevices
    .enumerateDevices()
    .then((devices) => {
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );

      videoDevices.forEach((device) => {
        const option = document.createElement("option");
        option.value = device.deviceId;
        option.text = device.label
          ? device.label.replace(/\s*\([^)]*\)\s*$/, "").trim()
          : `Camera ${dropdownElement.length - 1}`;
        dropdownElement.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Error enumerating devices:", error);
    });
}

function stopWebcam(videoElement) {
  if (currentStream) {
    currentStream.getTracks().forEach((track) => track.stop());
    videoElement.srcObject = null;
    videoElement.style.display = "none";
    webcamActive = false;
    currentStream = null;
    console.log("Webcam stopped.");
  }
}

function initWebcamModule() {
  const videoElement = document.getElementById("video");
  const webcamTestButton = document.getElementById("webcamTest");
  const webcamDropdown = document.getElementById("webcamDropdown");

  populateWebcamDropdown(webcamDropdown);

  webcamTestButton.addEventListener("click", () => {
    const selectedDeviceId = webcamDropdown.value;
    webcamAccess(videoElement, selectedDeviceId);
  });

  window.addEventListener("beforeunload", () => {
    stopWebcam(videoElement);
  });
}

export { initWebcamModule };
