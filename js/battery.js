document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded event fired");

  const kbLayoutInner = document.getElementById("kbLayoutInner");
  if (!kbLayoutInner) {
    console.error("kbLayoutInner not found");
    return;
  }

  let batteryInfoContainer = document.getElementById("battery-info-container");
  if (!batteryInfoContainer) {
    console.log("Creating battery-info-container");
    batteryInfoContainer = createBatteryInfoContainer();
    kbLayoutInner.appendChild(batteryInfoContainer);
  } else {
    console.log("battery-info-container already exists");
  }

  if (navigator.getBattery) {
    console.log("Initializing battery monitoring");
    initializeBatteryMonitoring();
  } else {
    displayUnsupportedMessage();
  }
});

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

function initializeBatteryMonitoring() {
  navigator
    .getBattery()
    .then((battery) => {
      updateBatteryInfo(battery); // <-- Add this line to update immediately
      setupBatteryEventListeners(battery);
    })
    .catch(handleBatteryError);
}

function updateBatteryInfo(battery) {
  const title = `${battery.charging ? "Charging" : "Not Charging"} - ${(
    battery.level * 100
  ).toFixed(2)}% Available`;
  document.querySelector(".batterybx .titlebtry").textContent = title;

  const details = getBatteryDetails(battery);
  document.querySelector(".batterybx .battery-details").innerHTML = details;
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

function handleBatteryError(error) {
  console.error("Error accessing battery information:", error);
  document.getElementById("battery-info").innerHTML =
    "<p>Error accessing battery information</p>";
}

function displayUnsupportedMessage() {
  document.getElementById("battery-info").innerHTML =
    "<p>Battery API not supported by this browser</p>";
}
