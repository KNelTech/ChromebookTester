// begin battery

//testing
/*document.addEventListener("DOMContentLoaded", () => {
  // Ensure the kbLayout element exists
  const kbLayout = document.getElementById("kbLayout");
  if (!kbLayout) {
    console.error("kbLayout element not found");
    return;
  }
*/
// Battery Information
document.addEventListener("DOMContentLoaded", () => {
  // Open DOMContentLoaded

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
        // Open getBattery promise
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
        // Catch block for getBattery promise
        console.error("Error accessing battery information:", error);
        batteryInfo.innerHTML = "<p>Error accessing battery information</p>";
      });
  } else {
    // Else block for battery API support
    batteryInfo.innerHTML = "<p>Battery API not supported by this browser</p>";
  }
}); // Close DOMContentLoaded

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
