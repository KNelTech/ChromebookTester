import { customAlertModule } from "./customAlertModule.js";

let webcamActive = false;

function webcamAccess(videoElement) {
  if (!videoElement) {
    console.error("Video element not found.");
    return;
  }

  if (webcamActive) {
    stopWebcam(videoElement);
  } else {
    if (
      navigator.mediaDevices &&
      typeof navigator.mediaDevices.getUserMedia === "function"
    ) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
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
}

function stopWebcam(videoElement) {
  const stream = videoElement.srcObject;
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
    videoElement.srcObject = null;
    videoElement.style.display = "none";
    webcamActive = false;
    console.log("Webcam stopped.");
  }
}

function initWebcamModule() {
  const videoElement = document.getElementById("video");
  const webcamTestButton = document.getElementById("webcamTest");

  webcamTestButton.addEventListener("click", () => {
    webcamAccess(videoElement);
  });

  window.addEventListener("beforeunload", () => {
    stopWebcam(videoElement);
  });
}

export { initWebcamModule };
