/**
 * Creates an HTML element that displays battery information
 * @returns {HTMLElement} An HTML element with id "battery-info-container"
 */
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

/**
 * Updates the given container element with information about the given battery
 * @param {BatteryManager} battery - The battery to display information about
 * @param {HTMLElement} containerElement - The element to update
 */
function updateBatteryInfo(battery, containerElement) {
  console.log("Updating battery info:", battery);
  const title = `${battery.charging ? "Charging" : "Not Charging"} - ${(
    battery.level * 100
  ).toFixed(2)}% Available`;
  containerElement.querySelector(".titlebtry").textContent = title;
  const details = getBatteryDetails(battery);
  containerElement.querySelector(".battery-details").innerHTML = details;
}

/**
 * Returns a string describing the battery's charging/discharging time
 * @param {BatteryManager} battery - The battery to get details about
 * @returns {string} A string describing the battery's charging/discharging time
 */
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

/**
 * Formats a time in seconds as a string in the format HH:MM
 * @param {number} seconds - The time in seconds to format
 * @returns {string} A string representation of the time in the format HH:MM
 */
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  return `${hours} hours ${minutes} minutes`;
}

/**
 * Sets up event listeners for the given battery object
 * @param {BatteryManager} battery - The battery to set up event listeners for
 * @param {HTMLElement} containerElement - The element to update when the battery
 *   changes
 */
function setupBatteryEventListeners(battery, containerElement) {
  const events = [
    "chargingchange",
    "levelchange",
    "chargingtimechange",
    "dischargingtimechange",
  ];
  events.forEach((event) => {
    battery.addEventListener(event, () =>
      updateBatteryInfo(battery, containerElement)
    );
  });
}

/**
 * Updates the message displayed in the battery info container
 * @param {HTMLElement} containerElement - The battery info container element
 * @param {"error"|"unsupported"} type - The type of message to display
 * @param {string} message - The message to display
 */
function updateMessage(containerElement, type, message) {
  const titleElement = containerElement.querySelector(".titlebtry");
  const detailsElement = containerElement.querySelector(".battery-details");

  if (type === "error") {
    titleElement.textContent = message;
    detailsElement.textContent = "";
  } else if (type === "unsupported") {
    titleElement.textContent = message;
    detailsElement.textContent = "";
  }
}

/**
 * Handles an error accessing the battery information and displays an error
 * message in the battery info container
 * @param {Error} error - The error that occurred
 * @param {HTMLElement} containerElement - The battery info container element
 */
function handleBatteryError(error, containerElement) {
  console.error("Error accessing battery information:", error);
  updateMessage(
    containerElement,
    "error",
    `Error accessing battery information: ${error.message}`
  );
}

/**
 * Displays a message in the given container element indicating that the
 * Battery API is not supported in the current browser
 * @param {HTMLElement} containerElement - The element to display the message in
 */
function displayUnsupportedMessage(containerElement) {
  updateMessage(containerElement, "unsupported", "Battery API not supported");
}

/**
 * Initializes the battery module by creating the battery info container,
 * checking for Battery API support, and setting up battery monitoring.
 */
function initBatteryModule() {
  const kbLayoutInner = document.getElementById("kbLayoutInner");
  if (!kbLayoutInner) {
    console.error("kbLayoutInner not found");
    return;
  }

  let batteryInfoContainer = document.getElementById("battery-info-container");
  if (!batteryInfoContainer) {
    batteryInfoContainer = createBatteryInfoContainer();
    kbLayoutInner.appendChild(batteryInfoContainer);
  }

  if (navigator.getBattery) {
    console.log("Battery API supported, initializing battery monitoring");

    navigator
      .getBattery()
      .then((battery) => {
        if (!battery) {
          throw new Error("Battery API returned an undefined battery object.");
        }
        updateBatteryInfo(battery, batteryInfoContainer);
        setupBatteryEventListeners(battery, batteryInfoContainer);
      })
      .catch((error) => {
        handleBatteryError(error, batteryInfoContainer);
      });
  } else {
    displayUnsupportedMessage(batteryInfoContainer);
  }
}

export { initBatteryModule };
