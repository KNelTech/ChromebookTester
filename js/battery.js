// Listen for the DOMContentLoaded event to ensure the DOM is fully loaded before running the script

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded event fired");

  // Get the element where battery info will be appended
  const kbLayoutInner = document.getElementById("kbLayoutInner");
  if (!kbLayoutInner) {
    console.error("kbLayoutInner not found");
    return;
  }
  // Check if the battery info container already exists in the DOM
  let batteryInfoContainer = document.getElementById("battery-info-container");
  if (!batteryInfoContainer) {
    console.log("Creating battery-info-container");
    batteryInfoContainer = createBatteryInfoContainer(); // Create the container if it doesn't exist
    kbLayoutInner.appendChild(batteryInfoContainer); // Append it to the parent element
  } else {
    console.log("battery-info-container already exists");
  }
  // Check if the browser supports the Battery API
  if (navigator.getBattery) {
    console.log("Initializing battery monitoring");
    initializeBatteryMonitoring();
  } else {
    displayUnsupportedMessage(); // Display a message if the API is not supported
  }
});

// Function to create a new battery info container element
function createBatteryInfoContainer() {
  const element = document.createElement("div");
  element.id = "battery-info-container";
  element.innerHTML = `
    <div id="battery-info">
      <div class="batterybx">
        <p class="titlebtry"></p>
        <p class="battery-details"></p>
        <img class="batteryIcon" src="./img/batteryIcon.png" class="battery-icon">
      </div>
    </div>
  `;

  console.log("Created battery-info-container element:", element);
  return element;
}
// Function to initialize battery monitoring
function initializeBatteryMonitoring() {
  navigator
    .getBattery()
    .then((battery) => {
      updateBatteryInfo(battery); // Update battery info as soon as it's available
      setupBatteryEventListeners(battery); // Setup event listeners for battery status changes
    })
    .catch(handleBatteryError);
}

// Function to update the displayed battery information
function updateBatteryInfo(battery) {
  const title = `${battery.charging ? "Charging" : "Not Charging"} - ${(
    battery.level * 100
  ).toFixed(2)}% Available`;
  document.querySelector(".batterybx .titlebtry").textContent = title;

  const details = getBatteryDetails(battery);
  document.querySelector(".batterybx .battery-details").innerHTML = details;
}

// Function to get detailed information about the battery status
function getBatteryDetails(battery) {
  let details = "";
  if (battery.charging && isFinite(battery.chargingTime)) {
    details += `<br>Fully charged in: ${formatTime(battery.chargingTime)}`;
  }
  if (!battery.charging && isFinite(battery.dischargingTime)) {
    details += `<br>Discharging in: ${formatTime(battery.dischargingTime)}`;
  }
  return details;
}

// Helper function to format time in hours and minutes
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  return `${hours} hours ${minutes} minutes`;
}

// Function to set up event listeners for various battery events
function setupBatteryEventListeners(battery) {
  const events = [
    "chargingchange",
    "levelchange",
    "chargingtimechange",
    "dischargingtimechange",
  ];
  events.forEach((event) => {
    battery.addEventListener(event, () => updateBatteryInfo(battery));
  });
}
// Function to handle errors when accessing battery information
function handleBatteryError(error) {
  console.error("Error accessing battery information:", error);
  document.getElementById("battery-info").innerHTML =
    "<p>Error accessing battery information</p>";
}
// Function to display a message if the Battery API is not supported
function displayUnsupportedMessage() {
  document.getElementById("battery-info").innerHTML =
    "<p>Battery API not supported by this browser</p>";
}
