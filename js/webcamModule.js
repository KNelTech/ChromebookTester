let webcamActive = false; // State is encapsulated within the module

// Function to handle webcam access (we pass in videoElement)
function webcamAccess(videoElement) {
  if (!videoElement) {
    console.error("Video element not found.");
    return;
  }

  if (webcamActive) {
    stopWebcam(videoElement); // Pass video element when stopping
  } else {
    // Check if getUserMedia is supported
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
          videoElement.style.display = "block"; // Show video element if webcam is on
          webcamActive = true;
          console.log("Webcam access granted.");
        })
        .catch((error) => {
          console.error("Error accessing webcam:", error);
        });
    } else {
      console.error("getUserMedia not supported by this browser.");
    }
  }
}

// Function to stop webcam (we pass in videoElement)
function stopWebcam(videoElement) {
  const stream = videoElement.srcObject;
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
    videoElement.srcObject = null;
    videoElement.style.display = "none"; // Hide video element when webcam is off
    webcamActive = false;
    console.log("Webcam stopped.");
  }
}

// Export the functions
export { webcamAccess, stopWebcam };
