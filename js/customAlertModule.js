/**
 * Creates a custom alert module for displaying alert messages.
 * @returns {Object} An object containing the showAlert method.
 */
function customAlertModule() {
  const alertContainer = document.getElementById("alertContainer");
  const alertTitle = document.getElementById("alertTitle");
  const alertText = document.getElementById("alertText");
  const alertBtn = document.getElementById("alertBtn");

  /**
   * Displays a custom alert with the specified options.
   * @param {Object} [options={}] - Options for the alert.
   * @param {string} [options.title="Alert"] - The title of the alert.
   * @param {string} [options.message="This is an alert"] - The message of the alert.
   * @param {string} [options.buttonText="Confirm"] - The text for the alert button.
   */
  function showAlert(options = {}) {
    const defaultOptions = {
      title: "Alert",
      message: "This is an alert",
      buttonText: "Confirm",
    };

    const mergedOptions = { ...defaultOptions, ...options };

    alertTitle.innerText = mergedOptions.title;
    alertText.innerText = mergedOptions.message;
    alertBtn.innerText = mergedOptions.buttonText;
    alertContainer.style.display = "block";

    const closeAlert = function closeAlert() {
      alertContainer.style.display = "none";
      alertBtn.removeEventListener("click", closeAlert);
    };

    alertBtn.addEventListener("click", closeAlert);
  }

  return { showAlert };
}

export { customAlertModule };
