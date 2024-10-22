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

function updateBatteryInfo(battery, containerElement) {
  console.log("Updating battery info:", battery);
  const title = `${battery.charging ? "Charging" : "Not Charging"} - ${(
    battery.level * 100
  ).toFixed(2)}% Available`;
  containerElement.querySelector(".titlebtry").textContent = title;
  const details = getBatteryDetails(battery);
  containerElement.querySelector(".battery-details").innerHTML = details;
}

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

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  return `${hours} hours ${minutes} minutes`;
}

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

function handleBatteryError(error, containerElement) {
  console.error("Error accessing battery information:", error);
  updateMessage(
    containerElement,
    "error",
    `Error accessing battery information: ${error.message}`
  );
}

function displayUnsupportedMessage(containerElement) {
  updateMessage(containerElement, "unsupported", "Battery API not supported");
}

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
